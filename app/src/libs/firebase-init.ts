/**
 * You don't need to include this lib directly. It's used by other Firebase libs.
 */

import * as firebase from "firebase/app";

// You have to create this config file, which should return the "Firebase SDK snippet" from
// your web app settings.
import firebaseConfig from "@/firebase-config";

// Add the Firebase services that you want to use
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp(firebaseConfig);
firebase.analytics();
window.firebase = firebase; //debug make it available on window for tinkering

export default firebase;
