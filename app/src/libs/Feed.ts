import DB from "@/libs/DB";
import { burnedTheToast } from "@/libs/Toaster";

import firebase from "@/libs/firebase-init";
import QuerySnapshot = firebase.firestore.QuerySnapshot;

export enum EventType {
  emote = "emote",
  poll = "poll",
  link = "link",
  question = "question",
  wait = "wait",
  admin = "admin",
  thumbsup = "thumbsup"
}

export interface EventCard {
  color: string;
  class: string | null;
  text: string;
  hasIcon: boolean;
  icon: string | null;
  action: () => void;
}

export interface EventReaction {
  icon: string;
  uid: string;
}

export interface Event {
  id: string;
  timestamp: Date;
  type: EventType;
  creator: string;
  reactions: EventReaction[];
}

type ChangeHandler = (type: string) => void;

export class Feed {
  private readonly listeners: ChangeHandler[] = [];
  private readonly events: Event[] = [];
  private readonly reactions: Event[] = [];
  private readonly sub: () => void;
  public readonly loaded: Promise<boolean>;
  constructor(private id: string) {
    const query = DB.collection(["rooms", this.id, "feed"])
      .orderBy("created")
      .limitToLast(250);

    this.loaded = new Promise((resolve, reject) => {
      query
        .get()
        .then(ss => resolve(ss.docs.length > 0))
        .catch(reject);
    });

    this.sub = query.onSnapshot(snap => {
      this.serverUpdated(snap);
    }, burnedTheToast("Feed::constructor"));
  }

  getEvents() {
    return this.events;
  }

  getReactions() {
    return this.reactions;
  }

  add(event: Event) {
    //todo
    //todo
    //todo
    //todo
    this.events.push(event);
  }

  subscribe(handler: ChangeHandler) {
    this.listeners.push(handler);
    return () => {
      this.listeners.splice(this.listeners.indexOf(handler), 1);
    };
  }

  private serverUpdated(snap: QuerySnapshot) {
    console.log("Feed updated", this.id);
    snap.docChanges().forEach(change => {
      console.log("change", change.type);
      if (change.type === "added") {
        this.add({ id: change.doc.id, ...change.doc.data() } as Event);
        console.log("added: ", change.doc.id, change.doc.data());
      }
      if (change.type === "modified") {
        console.log("modified: ", change.doc.id, change.doc.data());
      }
      if (change.type === "removed") {
        console.log("removed: ", change.doc.id, change.doc.data());
      }
    });
    this.notify();
  }

  private notify() {
    this.listeners.forEach(fn => fn("Room"));
  }

  destroy() {
    this.sub();
    this.events.length = 0;
    this.reactions.length = 0;
    this.listeners.length = 0;
  }
}
