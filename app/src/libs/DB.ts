import firebase from "@/libs/firebase-init";
import DocumentReference = firebase.firestore.DocumentReference;
import CollectionReference = firebase.firestore.CollectionReference;
import DocumentData = firebase.firestore.DocumentData;
import Query = firebase.firestore.Query;
import {findOrCreate} from "@/libs/Util";

// todo: This should be a Vue mixin and possibly integrate with Vuex
// todo: and/or use VueFire :D; didn't want to use the lib
// todo: for my first project since it bypasses learning the nuances.

const BASE = "apps/gvcassistant";

class Path {
  public readonly isDoc: boolean;
  public readonly baseDoc: DocumentReference;
  public readonly pathString: string;
  public readonly name: string;

  constructor(parts: string | string[]) {
    const bits = [BASE]
      .concat(parts)
      .map(p => p.split("/"))
      .flat();
    console.log('Path', bits.join('/')); //debug
    this.isDoc = bits.length % 2 === 0;
    const path = (this.isDoc ? bits : bits.slice(0, -1)).join("/");
    this.baseDoc = firebase.firestore().doc(path);
    this.pathString = bits.join("/");
    this.name = bits[bits.length - 1];
  }

  doc(): DocumentReference {
    if (!this.isDoc) {
      throw new Error(
        "Path must have an even number of parts to reference a Document"
      );
    }
    return this.baseDoc;
  }

  coll(): CollectionReference {
    if (this.isDoc) {
      throw new Error(
        "Path must have an odd number of parts to reference a Collection"
      );
    }
    return this.baseDoc.collection(this.name);
  }

  toString() {
    return this.pathString;
  }
}

interface TestOutcome {
  exists: boolean;
  allowed: boolean;
  path: string;
}

class Database {
  db: firebase.firestore.Firestore;
  constructor() {
    this.db = firebase.firestore();
  }

  async checkAccess(parts: string | string[]): Promise<TestOutcome> {
    const path = new Path(parts);
    // I can read feed if it does not exist (so I can tell the difference between denied and not found)
    // I can read feed if it exists and I meet one of the following:
    //  - I'm the owner
    //  - I'm in the whitelist
    //  - My email matches the domain specified
    //  - Room is open to anyone with the link

    const outcome = {
      exists: true,
      allowed: false,
      path: path.toString()
    } as TestOutcome;
    try {
      const snap: DocumentData = path.doc().get();
      outcome.exists = snap.exists; // only condition where exists can be false
      outcome.allowed = true; // if I got here without an error, I have access
    } catch (e) {
      outcome.exists = true;
      outcome.allowed = false;
      console.log("access failure", e); //debug
    }
    return outcome;
  }

  add(path: string | string[], data: object): Promise<DocumentReference> {
    return new Path(path).coll().add(data);
  }

  doc(parts: string | string[]): DocumentReference {
    return new Path(parts).doc();
  }

  collection(parts: string | string[]): CollectionReference {
    return new Path(parts).coll();
  }

  id(): string {
    return this.db.collection("foo").doc().id;
  }

  timestamp(timestamp?: Date) {
    if( timestamp ) {
      return firebase.firestore.Timestamp.fromDate(timestamp);
    }
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async mapUnionAdd(parts: string[]|string, key: string, value: any) {
    const data = {};
    data[key] = firebase.firestore.FieldValue.arrayUnion(value);
    return this.doc(parts).update(data);
  }

  trxn(handler: (txrn) => Promise<any>) {
    return this.db.runTransaction(handler);
  }

  async mapUnionRemove(parts: string[]|string, key: string, value: any) {
    const data = {};
    data[key] = firebase.firestore.FieldValue.arrayRemove(value);
    return this.doc(parts).update(data);
  }
}

function defaultCompareFunction(a: DocumentData, b: DocumentData) {
  return a.id.localeCompare(b.id);
}

export type CompareFunction = (a: object, b: object) => number;
export type MergeQueryObserver = (docs: DocumentData[]) => void;
export type MergeErrorObserver = (
  e: Error | string | object,
  queryPosition: number
) => void;

export class MergeQuery {
  private observers: Set<{ fn: MergeQueryObserver; err: MergeErrorObserver }>;
  private compareFunction = defaultCompareFunction;
  private docs: DocumentData[][] = [[], []];
  private queryCancelers: Function[] = [];

  constructor(...queries: Query[]) {
    this.observers = new Set();
    queries.forEach((query, position) => {
      this.queryCancelers.push(
        query.onSnapshot(
          snap => {
            this.updateDocs(snap.docs, position);
          },
          e => this.err(e, position)
        )
      );
    });
  }

  setCompareFunction(compareFx: CompareFunction): void {
    this.compareFunction = compareFx;
  }

  /**
   * Listen for updates to the merged data. Receives the entire array after each update.
   *
   * @param observer receives an array of data objects sorted using compareFunction.
   * @return an unsubscribe function
   */
  subscribe(
    observer: MergeQueryObserver,
    errorObserver?: MergeErrorObserver
  ): () => void {
    const obs = {
      fn: observer,
      err:
        errorObserver ||
        (() => {
          /* do nothing */
        })
    };
    this.observers.add(obs);
    return () => {
      this.observers.delete(obs);
    };
  }

  destroy() {
    this.queryCancelers.forEach(fn => fn());
    this.queryCancelers.length = 0;
    this.docs.length = 0;
    this.observers.clear();
  }

  private err(e: Error | object, pos: number) {
    this.observers.forEach(obs => {
      if (obs.err) obs.err(e, pos);
    });
  }

  private updateDocs(docs: DocumentData[], position: number) {
    this.docs[position] = docs.map(dd => ({ $id: dd.id, ...dd.data() }));
    const sortedData = [...new Set(this.docs.flat())].sort(
      this.compareFunction
    );
    this.observers.forEach(obs => obs.fn(sortedData));
  }
}

export const DB = new Database();
export default DB;
