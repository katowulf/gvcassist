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
  domain: string|null;
  whitelist: string[];
  blacklist: string[];
}

const defaultData = () => ({
  closed: false,
  description: "",
  owners: [],
  name: "Loading...",
  access: AccessType.whitelist,
  domain: null,
  whitelist: [],
  blacklist: []
});
export class Room {
  private readonly sub: () => void;
  public data: RoomProps;
  constructor(
    private id: string,
    private changeNotifier: (source: string) => void
  ) {
    this.data = defaultData();
    this.sub = DB.doc(["rooms", this.id]).onSnapshot(
      snap => this.serverUpdated(snap),
      burnedTheToast("Room::constructor")
    );
  }

  private serverUpdated(snap: any) {
    // todo import Firestore types
    console.log("Room updated", this.id); //debug
    this.data = Object.assign(defaultData(), snap.data()) as RoomProps;
    this.data.name = this.data.description || "Room " + this.id;
    this.changeNotifier("Room");
  }

  displayMembershipType(): string {
    switch(this.data.access) {
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

  unsubscribe(): void {
    this.sub();
  }
}
