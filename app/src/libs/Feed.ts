import DB from "@/libs/DB";
import toaster, { burnedTheToast } from "@/libs/Toaster";
import sharedScope from "@/libs/SharedScope";
import firebase from "@/libs/firebase-init";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;
import DocumentChange = firebase.firestore.DocumentChange;
import Profiles, { UserProfile } from "@/libs/Profiles";
import { arrayRemove } from "@/libs/Util";
import Query = firebase.firestore.Query;
import moment = require("moment");

export enum EventType {
  emote = "emote",
  poll = "poll",
  link = "link",
  question = "question",
  wait = "wait",
  admin = "admin",
  afk = "afk",
  todo = "todo"
}

export const ColorMap = new Map([
  [EventType.emote, ""],
  [EventType.poll, "cyan"],
  [EventType.link, "accent"],
  [EventType.todo, "success"],
  [EventType.question, "primary"],
  [EventType.wait, "purple"],
  [EventType.admin, "error"],
  [EventType.afk, "grey"]
]);

export const IconMap = new Map([
  [EventType.emote, null],
  [EventType.poll, "mdi-poll-box"],
  [EventType.link, "mdi-link"],
  [EventType.todo, "mdi-clipboard-check"],
  [EventType.question, "mdi-help"],
  [EventType.wait, "mdi-timer-outline"],
  [EventType.admin, "mdi-hazard-lights"],
  [EventType.afk, "mdi-timer-sand-full"]
]);

interface EventCardUi {
  readonly color: string;
  readonly cssClass: string | null;
  readonly icon: string | null;
  readonly dark: boolean;
}

// A map keyed by the emoji and containing a set of uids that clicked it.
export class ReactionMap {
  public readonly uids: Map<string, Set<string>> = new Map();
  public readonly profiles: Map<string, Set<UserProfile>> = new Map();

  constructor(list?: { string: string[] }) {
    if (list) {
      Object.keys(list).forEach(emoji => this.addEmoji(emoji, ...list[emoji]));
    }
  }

  addEmoji(emoji, ...uids: string[]) {
    // skip empty emojis (deleted on the server)
    if (uids.length === 0) {
      return;
    }

    if (!this.uids.has(emoji)) {
      this.uids.set(emoji, new Set());
    }
    const list = this.uids.get(emoji);
    uids.forEach(u => list?.add(u));
    if (!this.profiles.has(emoji)) this.profiles.set(emoji, new Set());
    Profiles.load(uids, p => this.setProfile(emoji, p));
  }

  private setProfile(emoji, Profile) {
    this.profiles.get(emoji)?.add(Profile);
  }

  toFirestore() {
    const reactionMap = {};
    this.uids.forEach((uids, emoji) => (reactionMap[emoji] = [...uids]));
    return reactionMap;
  }
}

export type FeedEventListener = (FeedEvent) => void;

export class FeedEvent {
  public text: string | null;
  public showActionBar = false;
  public type: EventType;
  public readonly creator: string;
  public reactions: ReactionMap;
  public ui: EventCardUi;
  public timestamp: Date;
  public isNew = false;
  private listeners: FeedEventListener[] = [];

  constructor(
    public readonly roomId: string,
    public readonly id: string,
    event: ServerData
  ) {
    this.creator = event.creator;
    this.type = event.type;
    this.text = event.text || null;
    this.timestamp = event.timestamp;
    this.reactions = new ReactionMap(event.reactions);
    this.showActionBar = [
      EventType.question,
      EventType.link,
      EventType.wait
    ].includes(event.type);

    const color = ColorMap.get(event.type) as string;
    this.ui = {
      color: color,
      icon: IconMap.get(event.type) as string,
      cssClass: `EventCard ${event.type}`,
      dark: !!color
    };
  }

  serverUpdate(event: FeedEvent) {
    this.text = event.text || null;
    this.reactions = event.reactions;
    this.notify();
  }

  toggleReaction(emoji, uid) {
    if (this.reactions.uids.get(emoji)?.has(uid)) {
      this.removeReaction(emoji, uid).then(() => this.deleteEventIfEmpty());
    } else {
      this.addReaction(emoji, uid);
    }
  }

  addReaction(emoji: string, uid: string): Promise<any> {
    if (this.reactions.uids.get(emoji)?.has(uid)) return Promise.resolve();
    return DB.util.mapUnionAdd(this.getDoc(), `reactions.${emoji}`, uid).catch(e =>
      toaster.handleError(`FeedEvent::addReaction(${emoji}, ${uid})`, e)
    );
  }

  removeReaction(emoji: string, uid: string) {
    if (!this.reactions.uids.get(emoji)?.has(uid)) return Promise.resolve();
    return DB.util.mapUnionRemove(this.getDoc(), `reactions.${emoji}`, uid).catch(e =>
      toaster.handleError(`FeedEvent::addReaction(${emoji}, ${uid})`, e)
    );
  }

  setText(text: string) {
    this.text = text;
  }
  setNew(b: boolean) {
    this.isNew = b;
  }

  subscribe(handler: ChangeHandler) {
    this.listeners.push(handler);
  }

  unsubscribe(handler: ChangeHandler) {
    arrayRemove(this.listeners, handler);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  private getDoc() {
    return DB.event(this.roomId, this.id);
  }

  private deleteEventIfEmpty() {
    // If an Emote event has no reactions, it's essentially deleted. So delete it.
    // However, we need to deal with concurrents here, so we'll use a transaciton and do a lot of checking
    // to make sure nobody snuck in a reaction.
    if (this.type === "emote" && this.reactions.uids.size === 0) {
      DB.util.trxn(trxn => {
        const doc = this.getDoc();
        return trxn.get(doc).then(snap => {
          const reactions = snap.exists ? snap.data().reactions : {};
          if (
            !snap.exists ||
            Object.keys(reactions).find(emoji => reactions[emoji].length > 0)
          ) {
            throw new Error("Not ready to be deleted.");
          }
          trxn.delete(doc);
        });
      }).catch(() => {
        /*ignore*/
      });
    }
  }

  toFirestore(): object {
    return {
      timestamp: DB.util.timestamp(this.isNew? undefined : this.timestamp),
      type: this.type,
      creator: this.creator,
      text: this.text,
      reactions: this.reactions.toFirestore()
    };
  }

  static create(roomId: string, type: EventType, creator: string) {
    const data = {
      type: type,
      creator: creator,
      timestamp: new Date(),
      reactions: {}
    } as ServerData;
    const event = new FeedEvent(roomId, DB.util.id(), data);
    event.setNew(true);
    return event;
  }

  static fromSnapshot(
    roomId: string,
    snap: QueryDocumentSnapshot<DocumentData>
  ): FeedEvent {
    const data = snap.data();
    const event = {
      ...data,
      timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
    } as ServerData;
    return new FeedEvent(roomId, snap.id, event);
  }
}

interface ServerData {
  timestamp: Date;
  type: EventType;
  creator: string;
  text?: string;
  reactions: { string: string[] };
}

class EventConverter {
  constructor(private readonly roomId: string) {}

  toFirestore(event: FeedEvent): DocumentData {
    return event.toFirestore();
  }

  fromFirestore(snap: QueryDocumentSnapshot): FeedEvent {
    return FeedEvent.fromSnapshot(this.roomId, snap);
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

    const query = DB.feed(this.id)
      .orderBy("timestamp")
      .limitToLast(2000)
      .withConverter(conv);

    this.sub = query.onSnapshot(snap => {
      this.serverUpdated(snap);
    }, burnedTheToast("Feed::constructor"));

    this.loaded = new Promise((resolve, reject) => {
      query
        .get()
        .then(ss => resolve(ss.docs.length > 0))
        .catch(reject);
    });
  }

  getEvents(): FeedEvent[] {
    return this.events;
  }

  add(type: EventType, text?: string) {
    if (!sharedScope.user.isSignedIn) {
      throw new Error("Must be authenticated");
    }
    const event = FeedEvent.create(
      this.id,
      type,
      sharedScope.user.uid as string
    );
    if (EventType.emote === type) {
      event.reactions.addEmoji(text as string, sharedScope.user.uid as string);
    } else if (text) event.setText(text);
    DB.feed(this.id)
      .add(event.toFirestore())
      .then(() => event.setNew(false));
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
      } else if (change.type === "modified") {
        const feedEvent = this.events.find(e => e.id === change.doc.id);
        if (feedEvent) {
          feedEvent.serverUpdate(change.doc.data());
        }
        console.log("modified: ", change.doc.id, change.doc.data());
      } else if (change.type === "removed") {
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
