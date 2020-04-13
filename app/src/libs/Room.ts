import DB from "@/libs/DB";
import { burnedTheToast } from "@/libs/Toaster";

export interface RoomProps {
  closed: boolean;
  description: string;
  owners: string[];
  name: string;
}

export class Room {
  private readonly sub: () => void;
  public data: RoomProps;
  constructor(
    private id: string,
    private changeNotifier: (source: string) => void
  ) {
    this.data = {
      closed: false,
      description: "",
      owners: [],
      name: "Loading..."
    };
    this.sub = DB.doc(["rooms", this.id]).onSnapshot(
      snap => this.serverUpdated(snap),
      burnedTheToast("Room::constructor")
    );
  }

  private serverUpdated(snap: any) {
    // todo import Firestore types
    console.log("Room updated", this.id); //debug
    this.data = snap.data() as RoomProps;
    this.data.name = this.data.description || "Room " + this.id;
    this.changeNotifier("Room");
  }

  getId() {
    return this.id;
  }
  unsubscribe() {
    this.sub();
  }
}
