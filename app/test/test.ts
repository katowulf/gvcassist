/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />

import * as firebase from "@firebase/testing";
const seed = require("./seed.json") as SeedData;
const moment = require("moment");

/*
 * ============
 *    Setup
 * ============
 */
const port = require("../../firebase.json").emulators.firestore.port;
const projectId = "gvcassistant-staging";
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;
const fs = require("fs");
const rules = fs.readFileSync("../firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth: object) {
  return firebase
    .initializeTestApp({ projectId, auth })
    .firestore();
}

interface SeedData { [key: string]: {[key: string]: any} }

function readySeedData() {
  for(const row of Object.values(seed)) {
    for(const [key, data] of Object.entries(row)) {
      if (key in ['created', 'updated'] && Array.isArray(data[key])) {
        (<any>data)[key] = moment().add(...data[key]).valueOf();
      }
    }
  }
}

async function resetData() {
  await firebase.clearFirestoreData({ projectId });
  const db = firebase.initializeAdminApp({projectId}).firestore();
  const promises = Object.entries(seed).map(entry => db.doc(entry[0]).set(entry[1]));
  await Promise.all(promises);
}

/*
 * ============
 *  Test Cases
 * ============
 *
 * So far, the test cases here only cover things I had trouble implementing in rules.
 * Not comprehensive tests and shouldn't be relied on for regression testing.
 * TODO: implement regression testing
 */
before(async () => {
  readySeedData();
  await firebase.loadFirestoreRules({ projectId, rules });
});

beforeEach(resetData);

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

@suite
class MyApp {
  @test
  async "can get rooms I own"() {
    const db = authedApp({uid: "katowulf", email: "kato@foo.com"});
    const doc = db.doc("apps/gvcassistant/rooms/room1");
    await firebase.assertSucceeds(doc.get());
  }

  @test
  async "can read rooms that do not exist"() {
    const db = authedApp({uid: "katowulf", email: "kato@foo.com"});
    const doc = db.doc("apps/gvcassistant/rooms/DOES_NOT_EXIST");
    await firebase.assertSucceeds(doc.get());
  }

  @test
  async "can't get rooms I don't have access to"() {
    const db = authedApp({uid: "katowulf", email: "kato@foo.com"});
    const doc = db.doc("apps/gvcassistant/rooms/private");
    await firebase.assertFails(doc.get().then(s => console.log(s.exists, s.data())));
  }

  @test
  async "can queryrooms which have me in the whitelist"() {
    const db = authedApp({uid: "katowulf", email: "kato@foo.com"});
    const query = db.collection("apps/gvcassistant/rooms")
        .where("whitelist", "array-contains", "kato@foo.com")
        .where("closed", "==", false)
        .orderBy("created")
        .limitToLast(2);
    await firebase.assertSucceeds(query.get());
  }

  @test
  async "can query rooms matching my domain"() {
    const db = authedApp({uid: "katowulf", email: "kato@foo.com"});
    const query = db.collection("apps/gvcassistant/rooms")
    .where("access", "==", "domain")
    .where("domain", "==", "foo.com")
    .where("closed", "==", false)
    .orderBy("created")
    .limitToLast(2);
    await firebase.assertSucceeds(query.get());
  }

}
