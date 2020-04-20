import DB from "@/libs/DB";
import { burnedTheToast } from "@/libs/Toaster";
import sharedScope from "@/libs/SharedScope";
import firebase from "@/libs/firebase-init";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;
import DocumentChange = firebase.firestore.DocumentChange;

export enum EventType {
  emote = "emote",
  poll = "poll",
  link = "link",
  question = "question",
  wait = "wait",
  admin = "admin",
  thumbsup = "thumbsup",
  afk = "afk"
}

export const ColorMap = new Map([
  [EventType.emote, "normal"],
  [EventType.poll, "cyan"],
  [EventType.link, "accent"],
  [EventType.question, "primary"],
  [EventType.wait, "purple"],
  [EventType.admin, "error"],
  [EventType.thumbsup, "success"],
  [EventType.afk, "grey"]
]);

class EventCard {
  public readonly color: string;
  public readonly cssClass: string | null;
  public readonly text: string | null;
  public readonly emoji: string | null;
  public readonly action: () => void;

  constructor(private readonly event: Event, action?: () => void) {
    this.color = ColorMap.get(event.type) || "normal";
    this.cssClass = null;
    this.text = event.text || null;
    this.emoji = event.type === EventType.emote? event.text || null : null;
    this.action = action || function() { /* do nothing */ };
  }
}

export interface EventReaction {
  emoji: string;
  uids: string[];
}

export interface Event {
  id: string;
  timestamp: Date;
  type: EventType;
  creator: string;
  text?: string;
  reactions: EventReaction[]
}

export class FeedEvent {
  public readonly id: string;
  public readonly card: EventCard;
  private isNew = false;
  private isDirty = false;
  constructor(public readonly roomId: string, public readonly event: Event) {
    this.id = event.id;
    this.card = new EventCard(event);
  }

  hasChanges() { return this.isDirty || this.isNew; }
  setNew() { this.isNew = true; }
  setChanged() { this.isDirty = true; }
  setText(text: string) { this.event.text = text; }

  saved() {
    this.isDirty = false;
    this.isNew = false;
  }

  getReactions(): EventReaction[] {
    return [];
  }

  addReaction(reaction: EventReaction) {
    this.event.reactions.push(reaction);
  }

  toFirestore() {
    return {
      timestamp: this.isNew? DB.timestamp() : DB.timestamp(this.event.timestamp),
      type: this.event.type,
      creator: this.event.creator,
      text: this.event.text,
      reactions: this.event.reactions
    };
  }

  static create(roomId: string, type: EventType, creator: string) {
    const event = new FeedEvent(roomId, {
      type: type, creator: creator, timestamp: new Date(), id: DB.id(), reactions: []
    });
    event.setNew();
    return event;
  }

  static fromSnapshot(roomId: string, snap: QueryDocumentSnapshot): FeedEvent {
    const event = {id: snap.id, ...snap.data()} as Event;
    return new FeedEvent(roomId, event);
  }
}

class EventConverter {
  constructor(private readonly roomId: string) {}

  toFirestore(event: FeedEvent): DocumentData {
    return event.toFirestore();
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): FeedEvent {
    return FeedEvent.fromSnapshot(this.roomId, snapshot);
  }
}

type ChangeHandler = (type: string) => void;

export class Feed {
  private readonly listeners: ChangeHandler[] = [];
  private readonly events: FeedEvent[] = [];
  private readonly sub: () => void;
  public readonly loaded: Promise<boolean>;
  constructor(private id: string) {
    const conv = new EventConverter(id);

    const query = DB.collection(`rooms/${this.id}/feed`)
      .orderBy("timestamp")
      .limitToLast(250)
      .withConverter(conv);

    this.sub = query.onSnapshot(snap => {
      this.serverUpdated(snap);
    }, burnedTheToast("Feed::constructor"));

    this.loaded = new Promise((resolve, reject) => {
      query.get()
          .then(ss => resolve(ss.docs.length > 0))
          .catch(reject);
    });
  }

  getEvents() {
    return this.events;
  }

  getReactions(): EventReaction[] {
    return [];
  }

  add(type: EventType, text?: string) {
    if( !sharedScope.user.isSignedIn ) {
      throw new Error("Must be authenticated");
    }
    const event = FeedEvent.create(this.id, type, sharedScope.user.uid as string);
    if( text ) event.setText(text);
    DB.collection(`rooms/${this.id}/feed`).add(event.toFirestore());
  }

  subscribe(handler: ChangeHandler) {
    this.listeners.push(handler);
    return () => {
      this.listeners.splice(this.listeners.indexOf(handler), 1);
    };
  }

  private serverUpdated(snap: QuerySnapshot<FeedEvent>) {
    console.log("Feed updated", this.id, snap.docs.length);
    snap.docChanges().forEach((change: DocumentChange<FeedEvent>) => {
      console.log("change", change.type, change.doc.id);
      if (change.type === "added") {
        this.events.unshift(change.doc.data());
        console.log("added: ", change.doc.id, change.doc.data());
      }
      else if (change.type === "modified") {
        const feedEvent = this.events.find(e => e.id === change.doc.id);
        if( feedEvent ) {
          Object.assign(feedEvent.event, change.doc.data().event);
        }
        console.log("modified: ", change.doc.id, change.doc.data());
      }
      else if (change.type === "removed") {
        const pos = this.events.findIndex(e => e.id === change.doc.id);
        this.events.splice(pos, 1);
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
    this.listeners.length = 0;
  }
}
