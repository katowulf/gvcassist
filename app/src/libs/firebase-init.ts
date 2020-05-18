/**
 * You don't need to include this lib directly. It's used by other libs.
 */

import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

// You have to create this config file by copying firebase-config-template
import { firebaseConfig, isAnalyticsEnabled, devMode } from "@/firebase-config";

firebase.initializeApp(firebaseConfig);
if (isAnalyticsEnabled) firebase.analytics();
if (devMode) window.firebase = firebase; //debug make it available on window for testing

export default firebase;
