import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
// import QuerySnapshot = admin.firestore.QuerySnapshot;
import {Change, EventContext} from "firebase-functions";
const tools = require("firebase-tools");

admin.initializeApp();
const db = admin.firestore().doc('apps/gvcassistant');

function makeInitials(displayName?: string, email?: string) : string|null {
  if( !displayName && !email ) { return null; }
  const parts = (displayName||email||"").split(/\s/);
  return parts.reduce((p, c) => p += c.substr(0,1), "");
}

function buildDomain(email: string|undefined) : string|null {
  if( !email ) { return null; }
  return email.replace(/^.*\@/, '');
}

exports.storeUserProfile = functions.auth.user().onCreate(async (user) => {
  const domain = buildDomain(user.email);
  const a1 = admin.auth().setCustomUserClaims(user.uid, {domain: domain});

  const p1 = db.collection('publicProfiles').doc(user.uid).set({
    displayName: user.displayName, photoURL: user.photoURL, active: true,
    initials: makeInitials(user.displayName, user.email)
  });

  const p2 = db.collection('privateProfiles').doc(user.uid).set({
    providerId: user.providerData[0].providerId, email: user.email, domain: domain,
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp()
  });

  await Promise.all([a1, p1, p2]);
});

exports.markProfileDeleted = functions.auth.user().onDelete((user) => {
  const p1 = db.collection('publicProfiles').doc(user.uid).update({active: false});
  const p2 = db.collection('privateProfiles').doc(user.uid).update({
    updated: admin.firestore.FieldValue.serverTimestamp()
  });

  return Promise.all([p1, p2]);
});

// Incrementing the vote server side helps prevent gaming the system. User can only write
// to their own votes/{uid} array, which can be validated with security rules, unlike
// this, which would require some sort of iteration over a collection. We could move these
// to some sort of object/array on the poll/ objects, but this seems easier to work with and
// a function trigger a reasonable tradeoff to avoid transactions and code complexity.
//
// Note that for large scale rooms (e.g. thousands of people in a single gvc room)
// we would need to upgrade this to a sharded counter. Assumption here is that we
// won't receive a sustained QPS for voting in a GVC room and if so that room can
// just be slow; not a supported use case for now.
//
// Additionally, this assumes one user will not manage to change more than 100 votes
// at a time, given that batch() only handles <= 100 modifications. That's not an issue
// with the current setup, but could be if we added some sort of batching on the client
// side.
exports.userVoteCreated = functions.firestore
  .document('apps/gvcassistant/rooms/{roomId}/feed/{eventId}/polls/{pollId}/votes/{userId}')
  .onCreate(async (snap: DocumentSnapshot, context: EventContext) => {
    const addedVotes = snap.data()?.votes || [];

    await updateVotes(
      context.params.roomId, context.params.eventId,
      context.params.pollId, context.params.userId,
      addedVotes, []);
  });

exports.userVoteModified = functions.firestore
  .document('apps/gvcassistant/rooms/{roomId}/feed/{eventId}/polls/{pollId}/votes/{userId}')
  .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
    const newVotes = change.after.data()?.votes || [];
    const oldVotes = change.before.data()?.votes || [];
    const unchanged = new Set(newVotes.filter((s:string) => oldVotes.includes(s)));

    const added = newVotes.filter((choiceId:string) => !unchanged.has(choiceId));
    const removed = oldVotes.filter((choiceId:string) => !unchanged.has(choiceId));

    await updateVotes(
      context.params.roomId, context.params.eventId,
      context.params.pollId, context.params.userId,
      added, removed);
  });

exports.roomDeleted = functions.runWith({timeoutSeconds: 540, memory: '2GB'})
.firestore.document('apps/gvcassistant/rooms/{roomId}')
.onDelete(async (doc: DocumentSnapshot, context: EventContext) => {
  const roomId = context.params.roomId;
  const path = `app/gvcassistant/rooms/${roomId}/feed`;
  await Promise.all([
    deleteCollection(path, functions.config().fb.token),
    tools.firestore.delete(`apps/gvcassistant/retentionMap/${roomId}`)
  ]);
});

// Decided this wasn't needed. They will get purged when the room expires anyway.
// No need to create a lot of extra functions invocations (will cascade during room deletion).
/**
exports.eventDeleted = functions.runWith({timeoutSeconds: 540, memory: '2GB'})
  .firestore.document('apps/gvcassistant/rooms/{roomId}/feed/{eventId}')
  .onDelete(async (doc: DocumentSnapshot, context: EventContext) => {
    const roomId = context.params.roomId;
    const eventId = context.params.eventId;
    await Promise.all([
      deleteCollection(`app/gvcassistant/rooms/${roomId}/feed/${eventId}/polls`, functions.config().fb.token),
      deleteCollection(`app/gvcassistant/rooms/${roomId}/feed/${eventId}/todos`, functions.config().fb.token)
    ]);
  });
**/

// Prod only since we can't test this without a billing account.
// exports.monitorRetention = functions.pubsub.schedule('every 4 hours').onRun(context => {
//   admin.firestore().collection("apps/gvcassistant/retentionMap").where("expires", "<", new Date())
//     .get().then((snap: QuerySnapshot) => {
//       console.log("Purging", snap.docs.length, "expired rooms");
//       const batch = admin.firestore().batch();
//       snap.forEach(doc => {
//         batch.delete(doc.ref);
//       });
//       return batch.commit();
//     });
// });

async function deleteCollection(collectionPath: string, cliToken: string) {
  console.log("Deleting collection recursively:", collectionPath);
  await tools.firestore.delete(collectionPath, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: cliToken
  });
}

async function updateVotes(roomId: string, eventId: string, pollId: string, uid: string, added: string[], removed: []) {
  const choicePath = `apps/gvcassistant/rooms/${roomId}/feed/${eventId}/polls/${pollId}/choices/`;
  const batch = admin.firestore().batch();
  added.forEach((choiceId:string) => {
    const doc = admin.firestore().doc(choicePath + choiceId);
    batch.update(doc, {votes: admin.firestore.FieldValue.arrayUnion(uid)});
    console.log(`Added vote from uid ${uid} to choice ${choicePath}${choiceId}`);
  });

  removed.forEach((choiceId:string) => {
    const doc = admin.firestore().doc(choicePath + choiceId);
    batch.update(doc, {votes: admin.firestore.FieldValue.arrayRemove(uid)});
    console.log(`Removed vote from uid ${uid} to choice ${choicePath}${choiceId}`);
  });

  await batch.commit();
}