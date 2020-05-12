# gvcassist
Video conference companion; encourage interaction with distributed teams

## Setup

### Set up Firebase project

Visit console.firebase.google.com and create a project. Enable Analytics during project creation.

Navigate to [Database](https://console.firebase.google.com/project/_/database) and click `Create Database` to initialize Firestore.

Navigate to [Authentication sign-in methods](https://console.firebase.google.com/project/gvcassistant-staging/authentication/providers) and enable the Google authentication provider. You need to set up a support email address, but all the other default settings are fine.

### Set up Firebase environment

```
# Install the CLI
npm install -g firebase-tools

# Authenticate to the CLI
firebase login

# select your staging project id
firebase use <your-project-id>
```

### Set up Functions

We need to create an admin auth token and 
[store it in Functions config](https://firebase.google.com/docs/functions/config-env). 
The token is used by Functions to run 
[recursive deletes](https://firebase.google.com/docs/firestore/solutions/delete-collections)).

```
firebase login:ci
firebase functions:config:set fb.token="<PUT THE TOKEN HERE>"
```

### Set up the web app

The web app is built using Firebase and Vue and deployed to Firebase Hosting.
See [app/README](app/README.md) for setup instructions.

### Database

Modify security rules by editing `firestore.rules`

## Deploying the project

```
# build the app
cd app/
npm install
npm run build

# build the server code
cd ../functions
npm run build

# deploy everything
cd ../
firebase deploy --project <your-staging-or-production-project>

# deploy only the website (make sure you read app/README.md first)
firebase deploy --only hosting

# deploy only database rules
firebase deploy --only firestore

# deploy only functions triggers
cd functions/
npm install
firebase deploy --only functions
```

Visit <your project id>.web.app to see it running.

## Before you go into production

The following steps will configure solid tools for disaster recovery, monitoring, and metrics.
   * Consider upgrading to a paid plan
   * [Enable Firestore backups](https://firebase.google.com/docs/firestore/manage-data/export-import)
   * [Enable Firestore BigQuery imports](https://cloud.google.com/bigquery/docs/loading-data-cloud-firestore)
   * [Set up Analytics BigQuery exports](https://support.google.com/firebase/answer/6318765?hl=en)
