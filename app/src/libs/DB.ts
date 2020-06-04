import firebase from "@/libs/firebase-init";
import DocumentReference = firebase.firestore.DocumentReference;
import CollectionReference = firebase.firestore.CollectionReference;
import WriteBatch = firebase.firestore.WriteBatch;

// This should be a Vue mixin and possibly integrate with Vuex
// and/or use VueFire :D; didn't want to use the lib
// for my first project since it bypasses learning the nuances.
// And it's been a great learning experience to do this the hard way
// but I wouldn't choose this for productivity.

const BASE = "apps/gvcassistant";

/**
 * Abstraction to database paths to simplify refactoring and upgrades down the line.
 */
const DBPaths = {
  profile: (uid: string) => `${BASE}/publicProfiles/${uid}`,
  privateProfile: (uid: string) => `${BASE}/privateProfiles/${uid}`,
  rooms: () => `${BASE}/rooms`,
  room: (roomId: string) => DBPaths.rooms() + `/${roomId}`,
  feed: (roomId: string) => DBPaths.room(roomId) + `/feed`,
  event: (roomId: string, eventId: string) =>
    DBPaths.feed(roomId) + `/${eventId}`,
  todos: (roomId: string, eventId: string) =>
    DBPaths.event(roomId, eventId) + `/todos`,
  todo: (roomId: string, eventId: string, todoId: string) =>
    DBPaths.todos(roomId, eventId) + `/${todoId}`,
  // there is only one poll per event
  poll: (roomId: string, eventId: string) =>
    DBPaths.event(roomId, eventId) + `/polls/poll`,
  choices: (roomId: string, eventId: string) =>
    DBPaths.poll(roomId, eventId) + `/choices`,
  votes: (roomId: string, eventId: string, uid: string) =>
    DBPaths.poll(roomId, eventId) + `/votes/${uid}`
};

class Database {
  db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  doc(path: string): DocumentReference {
    return this.db.doc(path);
  }

  collection(path: string): CollectionReference {
    return this.db.collection(path);
  }

  id(): string {
    return this.collection("foo").doc().id;
  }

  timestamp(timestamp?: Date) {
    if (timestamp) {
      return firebase.firestore.Timestamp.fromDate(timestamp);
    }
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async mapUnionAdd(doc: DocumentReference, key: string, value: any) {
    const data = {};
    data[key] = firebase.firestore.FieldValue.arrayUnion(value);
    return doc.set(data, { merge: true });
  }

  async mapUnionUpdate(doc: DocumentReference, key: string, value: any) {
    const data = {};
    data[key] = firebase.firestore.FieldValue.arrayUnion(value);
    return doc.update(data);
  }

  async mapUnionRemove(doc: DocumentReference, key: string, value: any) {
    const data = {};
    data[key] = firebase.firestore.FieldValue.arrayRemove(value);
    return doc.update(data);
  }

  trxn(handler: (txrn) => Promise<any>): Promise<any> {
    return this.db.runTransaction(handler);
  }

  batch(): WriteBatch {
    return this.db.batch();
  }
}

const DB = new Database();

export default {
  profile: (uid: string) => DB.doc(DBPaths.profile(uid)),
  privateProfile: (uid: string) => DB.doc(DBPaths.profile(uid)),
  rooms: () => DB.collection(DBPaths.rooms()),
  room: (roomId: string) => DB.doc(DBPaths.room(roomId)),
  feed: (roomId: string) => DB.collection(DBPaths.feed(roomId)),
  event: (roomId: string, eventId: string) =>
    DB.doc(DBPaths.event(roomId, eventId)),
  todos: (roomId: string, eventId: string) =>
    DB.collection(DBPaths.todos(roomId, eventId)),
  todo: (roomId: string, eventId: string, todoId: string) =>
    DB.doc(DBPaths.todo(roomId, eventId, todoId)),
  poll: (roomId: string, eventId: string) =>
    DB.doc(DBPaths.poll(roomId, eventId)),
  choices: (roomId: string, eventId: string) =>
    DB.collection(DBPaths.choices(roomId, eventId)),
  votes: (roomId: string, eventId: string, uid: string) =>
    DB.doc(DBPaths.votes(roomId, eventId, uid)),
  path: DBPaths,
  util: DB
};
