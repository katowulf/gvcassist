import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function makeInitials(displayName?: string) : string|null {
  if( !displayName ) return null;
  const parts = displayName.split(/\s/);
  return parts.reduce((p, c) => p += c.substr(0,1), "");
}

function buildDomain(email: string|undefined) : string|null {
  if( !email ) { return null; }
  return email.replace(/^.*\@/, '');
}

exports.storeUserProfile = functions.auth.user().onCreate((user) => {
  const p1 = db.collection('publicProfiles').doc(user.uid).set({
    displayName: user.displayName, photoURL: user.photoURL, active: true,
    initials: makeInitials(user.displayName)
  });

  const p2 = db.collection('privateProfiles').doc(user.uid).set({
    providerId: user.providerData[0].providerId, email: user.email, domain: buildDomain(user.email),
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp()
  });

  return Promise.all([p1, p2]);
});

exports.markProfileDeleted = functions.auth.user().onDelete((user) => {
  const p1 = db.collection('publicProfiles').doc(user.uid).update({active: false});
  const p2 = db.collection('privateProfiles').doc(user.uid).update({
    updated: admin.firestore.FieldValue.serverTimestamp()
  });

  return Promise.all([p1, p2]);
});