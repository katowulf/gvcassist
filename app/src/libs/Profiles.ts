import { toaster } from "@/libs/Toaster";
import { Auth } from "@/libs/Auth";
import DB from "@/libs/DB";

export interface UserProfile {
  displayName: string;
  photoURL?: string;
  initials: string;
}

class ProfileCache {
  private users: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
  }

  public async find(uid: string): Promise<UserProfile | null> {
    if (this.users.has(uid)) {
      console.log("user exists in cache", uid, this.users.get(uid)); //debug
      return this.users.get(uid) || null;
    }

    try {
      if( !Auth.getSharedScope().isSignedIn ) {
        throw new Error("Must be signed in to fetch user profiles");
      }
      console.log('trying', DB.doc(['publicProfiles', uid]).path); //debug
      const snap = await DB.doc(['publicProfiles', uid]).get();
      if (snap.exists) {
        const profile = snap.data() as UserProfile;
        this.users.set(uid, profile);
        console.log("user fetched from db", uid, profile); //debug
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
