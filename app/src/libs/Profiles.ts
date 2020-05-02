import { toaster } from "@/libs/Toaster";
import { Auth } from "@/libs/Auth";
import DB from "@/libs/DB";

const colors = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  /*"blue", */ "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "blue-grey",
  "grey",
  "shades"
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

export interface UserProfile {
  displayName: string;
  photoURL?: string;
  initials: string;
  color: string;
  $id: string;
}

class ProfileCache {
  private users: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
  }

  public async load(
    uids: string[],
    callback?: (UserProfile) => void
  ): Promise<any> {
    return Promise.all(
      uids.map(uid => this.find(uid).then(p => callback && callback(p)))
    );
  }

  public async find(uid: string): Promise<UserProfile | null> {
    if (this.users.has(uid)) {
      // console.log("user exists in cache", uid, this.users.get(uid)); //debug
      return this.users.get(uid) || null;
    }

    try {
      if (!Auth.getSharedScope().isSignedIn) {
        throw new Error("Must be signed in to fetch user profiles");
      }
      // console.log("trying", DB.doc(["publicProfiles", uid]).path); //debug
      const snap = await DB.profile(uid).get();
      if (snap.exists) {
        const profile = {
          $id: uid,
          ...snap.data(),
          color: getRandomColor()
        } as UserProfile;
        this.users.set(uid, profile);
        // console.log("user fetched from db", uid, profile); //debug
        return profile;
      } else {
        console.log(`profile ${uid} did not exist in db`); //debug
      }
    } catch (e) {
      toaster.handleError(`Profiles::find(${uid})`, e);
    }
    return null;
  }
}
export const Profiles = new ProfileCache();
export default Profiles;
