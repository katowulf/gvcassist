// Get the config data from the "Firebase SDK snippet" in your web app settings here:
// https://console.firebase.google.com/project/_/settings/general

const config = {
  production: {
    apiKey: "api-key",
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "sender-id",
    appId: "app-id",
    measurementId: "G-measurement-id"
  },
  staging: {
    apiKey: "api-key",
    authDomain: "project-id-staging.firebaseapp.com",
    databaseURL: "https://project-id-staging.firebaseio.com",
    projectId: "project-id-staging",
    storageBucket: "project-id-staging.appspot.com",
    messagingSenderId: "sender-id",
    appId: "app-id",
    measurementId: "G-measurement-id"
  }
};

/**
 * If you enabled Google Analytics for your Firebase project, set this to true and it will
 * collect anonymous usage stats on your app. If you disabled Analytics, then set this to false.
 */
export const isAnalyticsEnabled = true;

/**
 * This will default to 'development' until you deploy to Hosting, at which time it becomes 'production'
 */
export const devMode = process.env.NODE_ENV;

export const firebaseConfig =
  devMode === "production" ? config.production : config.staging;

export default firebaseConfig;
