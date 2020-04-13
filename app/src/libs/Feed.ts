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
  admin = "admin"
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
  timestamp: Date;
  type: EventType;
  creator: string;
  reactions: EventReaction[];
}

export class Feed {
  public readonly events: Event[] = [];
  public readonly reactions: Event[] = [];
  private readonly sub: () => void;
  constructor(
    private id: string,
    private changeNotifier: (source: string) => void
  ) {
    this.sub = DB.collection(["rooms", this.id, "feed"])
      .orderBy("created")
      .limitToLast(250)
      .onSnapshot(
        snap => this.serverUpdated(snap),
        burnedTheToast("Feed::constructor")
      );
  }

  add(event: Event) {
    //todo
    //todo
    //todo
    //todo
    this.events.push(event);
  }

  private serverUpdated(snap: QuerySnapshot) {
    console.log("Feed updated", this.id);
    snap.docChanges().forEach(change => {
      console.log("change", change.type);
      if (change.type === "added") {
        this.events.push(change.doc.data() as Event);
        console.log("added: ", change.doc.data());
      }
      if (change.type === "modified") {
        console.log("modified: ", change.doc.data());
      }
      if (change.type === "removed") {
        console.log("removed: ", change.doc.data());
      }
    });
    this.changeNotifier("Feed");
  }

  unsubscribe() {
    this.sub();
  }
}
