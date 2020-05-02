import DB from "@/libs/DB";
import { burnedTheToast } from "@/libs/Toaster";

export enum AccessType {
  link = "link",
  domain = "domain",
  whitelist = "whitelist"
}

export interface RoomProps {
  closed: boolean;
  description: string;
  owners: string[];
  name: string;
  access: AccessType;
  domain: string | null;
  whitelist: string[];
  blacklist: string[];
  retentionLength: number;
}

const defaultData = () => ({
  closed: false,
  description: "",
  owners: [],
  name: "Loading...",
  access: AccessType.whitelist,
  domain: null,
  whitelist: [],
  blacklist: [],
  retentionLength: 90
});

type ChangeHandler = (Room) => void;

export class Room {
  private readonly listeners: ChangeHandler[] = [];
  private readonly sub: () => void;
  public data: RoomProps;
  public readonly loaded: Promise<boolean>;
  constructor(public readonly id: string) {
    this.data = defaultData();
    const doc = DB.room(this.id);
    this.sub = doc.onSnapshot(
      snap => this.serverUpdated(snap),
      burnedTheToast("Room::constructor")
    );
    this.loaded = doc.get().then(ss => ss.exists);
  }

  subscribe(handler: ChangeHandler) {
    this.listeners.push(handler);
    return () => {
      this.listeners.splice(this.listeners.indexOf(handler), 1);
    };
  }

  private serverUpdated(snap: any) {
    // todo import Firestore types
    console.log("Room updated", this.id); //debug
    this.data = Object.assign(defaultData(), snap.data()) as RoomProps;
    this.data.name = this.data.description || "Room " + this.id;
    this.notify();
  }

  displayMembershipType(): string {
    switch (this.data.access) {
      case AccessType.link:
        return "This room can be accessed by anybody with the link, unless their email is in the blacklist.";
      case AccessType.domain:
        return `This room can be accessed by email belonging to the domain ${this.data.domain}, or emails in the whitelist, but not emails in the blacklist.`;
      case AccessType.whitelist:
        return `This room can only be access by emails in the whitelist.`;
      default:
        throw new Error("Invalid access type: " + this.data.access);
    }
  }

  getId(): string {
    return this.id;
  }

  private notify() {
    this.listeners.forEach(fn => fn(this));
  }

  destroy(): void {
    this.sub();
    this.listeners.length = 0;
  }
}
