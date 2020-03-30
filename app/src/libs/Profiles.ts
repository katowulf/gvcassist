import * as firebase from "firebase/app";
import {toaster} from "@/libs/Toaster";

export interface UserProfile {
  displayName: string,
  photoURL?: string,
  initials: string
}

class ProfileCache {
  private users: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
  }

  public async find(uid: string) : Promise<UserProfile | null> {
    if( this.users.has(uid) ) {
      console.log("user exists in cache", uid, this.users.get(uid)); //debug
      return this.users.get(uid) || null;
    }

    try {
      const snap = await firebase.firestore().collection('publicProfiles').doc(uid).get();
      if (snap.exists) {
        const profile = snap.data() as UserProfile;
        this.users.set(uid, profile);
        console.log("user fetched from db", uid, profile); //debug
        return profile;
      }
    }
    catch(e) {
      toaster.handleError(`Profiles::find(${uid})`, e);
    }
    return null;
  }
}
export const Profiles = new ProfileCache();
export default Profiles;