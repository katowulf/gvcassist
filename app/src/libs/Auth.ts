import "@/libs/firebase-init";
import * as firebase from "firebase/app";
import {toaster} from "@/libs/Toaster";

/**
 * The shared scope intended to be used by SharedScope to provide views with a simple snapshot of
 * auth state, without a lot of boilerplate.
 */
interface SharedAuthScope {
  isSignedIn: boolean;
  uid: string | null;

  // This is the raw User object returned by onAuthStateChanged.
  data: firebase.User | null;

  // This is true after a successful login, if
  // firebase.auth.UserCredential.additionalUserInfo.isNewUser is true.
  // It indicates that this is the first time this account
  // has logged into the system.
  isNewUser: boolean;

  // False until onAuthStateChanged() has been invoked at least once
  // Since this is when we know if user login exists
  initialized: boolean;
}

class AuthHelper {
  private readonly auth: firebase.auth.Auth;
  private readonly scope: SharedAuthScope;
  private additionalUserInfo?: firebase.auth.AdditionalUserInfo;
  constructor() {
    this.auth = firebase.auth();
    this.scope = { isSignedIn: false, uid: null, data: null, isNewUser: false, initialized: false };

    this.auth.onAuthStateChanged(user => {
      this.scope.initialized = true;
      if (user == null) {
        this.scope.isSignedIn = false;
        this.scope.uid = null;
        this.scope.data = null;
        this.scope.isNewUser = false;
        delete this.additionalUserInfo;
      } else {
        // we can only detect new users by looking at
        this.scope.isSignedIn = true;
        this.scope.uid = user.uid;
        this.scope.data = user;
        this.scope.isNewUser = this.additionalUserInfo?.isNewUser || false;
      }
      console.log('onAuthStateChanged', this.scope); //debug
    });
  }

  getSharedScope() : SharedAuthScope {
    return this.scope;
  }

  async signIn(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await firebase.auth().signInWithPopup(provider);
      if (result.additionalUserInfo) {
        this.additionalUserInfo = result.additionalUserInfo;
      }
      return result;
    }
    catch(e) {
      toaster.handleError("AuthHelper::signIn", e);
      throw e;
    }
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }
}

export const Auth = new AuthHelper();
export default Auth;
