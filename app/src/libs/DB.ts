
import firebase from "@/libs/firebase-init";
import DocumentReference = firebase.firestore.DocumentReference;
import CollectionReference = firebase.firestore.CollectionReference;
import DocumentData = firebase.firestore.DocumentData;

const BASE = 'apps/gvcassistant';

class Path {
  public readonly isDoc: boolean;
  public readonly baseDoc: DocumentReference;
  public readonly pathString: string;
  public readonly name: string;

  constructor(parts: string|string[]) {
    const bits = [BASE].concat(parts).map(p => p.split('/')).flat();
    this.isDoc = bits.length % 2 === 0;
    const path = (this.isDoc? bits : bits.slice(0, -1)).join("/");
    this.baseDoc = firebase.firestore().doc(path);
    this.pathString = bits.join("/");
    this.name = bits[bits.length-1];
  }

  doc() : DocumentReference  {
    if( !this.isDoc ) {
      throw new Error("Path must have an even number of parts to reference a Document");
    }
    return this.baseDoc;
  }

  coll() : CollectionReference {
    if( this.isDoc ) {
      throw new Error("Path must have an odd number of parts to reference a Collection");
    }
    return this.baseDoc.collection(this.name);
  }

  toString() { return this.pathString; }
}

interface TestOutcome {
  exists: boolean, allowed: boolean, path: string
}

class Database {
  db: any;
  constructor() {
    this.db = firebase.firestore();
  }

  async checkAccess(parts: string|string[]) : Promise<TestOutcome> {
    const path = new Path(parts);
    // I can read feed if it does not exist (so I can tell the difference between denied and not found)
    // I can read feed if it exists and I meet one of the following:
    //  - I'm the owner
    //  - I'm in the whitelist
    //  - My email matches the domain specified
    //  - Room is open to anyone with the link

    const outcome =  {exists: true, allowed: false, path: path.toString() } as TestOutcome;
    try {
      const snap : DocumentData = path.doc().get();
      outcome.exists = snap.exists; // only condition where exists can be false
      outcome.allowed = true; // if I got here without an error, I have access
    }
    catch(e) {
      outcome.exists = true;
      outcome.allowed = false;
      console.log('access failure', e); //debug
    }
    return outcome;
  }

  add(path: string|string[], data: object) : Promise<DocumentReference> {
    return new Path(path).coll().add(data);
  }

  doc(parts: string|string[]) : DocumentReference {
    return new Path(parts).doc();
  }

  collection(parts: string|string[]) : CollectionReference {
    return new Path(parts).coll();
  }

  timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}

export default new Database();
