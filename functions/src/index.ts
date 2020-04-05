import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import Firestore = admin.firestore.Firestore;
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import Query = admin.firestore.Query;
import {EventContext} from "firebase-functions";

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

exports.roomDeleted = functions.firestore.document('apps/gvcassistant/rooms/{roomId}')
  .onDelete((doc: DocumentSnapshot, context: EventContext) => {
    const roomId = context.params.roomId;
    const path = `app/gvcassistant/rooms/${roomId}/feed`;
    console.log(path);
    return deleteCollection(admin.firestore(), path, 100)
  });

function deleteCollection(db: Firestore, collectionPath: string, batchSize: number) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve, reject);
  });
}

function deleteQueryBatch(db: Firestore, query: Query, resolve: () => void, reject: () => void) {
  query.get()
  .then((snapshot) => {
    // When there are no documents left, we are done
    if (snapshot.size === 0) {
      return 0;
    }

    // Delete documents in a batch
    let batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit().then(() => {
      return snapshot.size;
    });
  }).then((numDeleted) => {
    if (numDeleted === 0) {
      resolve();
      return;
    }

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve, reject);
    });
  })
  .catch(reject);
}