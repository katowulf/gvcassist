import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import {EventContext} from "firebase-functions";
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

exports.roomDeleted = functions.runWith({timeoutSeconds: 540, memory: '2GB'})
  .firestore.document('apps/gvcassistant/rooms/{roomId}')
  .onDelete(async (doc: DocumentSnapshot, context: EventContext) => {
    const roomId = context.params.roomId;
    const path = `app/gvcassistant/rooms/${roomId}/feed`;
    console.log("Room deleted; purging subcollections", path);
    await deleteCollection(path, functions.config().fb.token)
  });

async function deleteCollection(collectionPath: string, cliToken: string) {
  tools.firestore.delete(collectionPath, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: cliToken
  });
}