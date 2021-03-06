import "@/libs/firebase-init";
import * as firebase from "firebase/app";
import { toaster } from "@/libs/Toaster";

/**
 * The shared scope intended to be used by SharedScope to provide views with a simple snapshot of
 * auth state, without a lot of boilerplate.
 */
export interface SharedAuthScope {
  isSignedIn: boolean;
  uid: string | null;
  token: string | null;
  email: string | null;
  emailDomain: string | null;

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

  // Resolves when initialized is updated to true
  // Returns value of isSignedIn
  readyState: Promise<boolean>;
}

class AuthHelper {
  public readonly readyState: Promise<boolean>;
  private readonly auth: firebase.auth.Auth;
  private readonly scope: SharedAuthScope;
  private additionalUserInfo?: firebase.auth.AdditionalUserInfo;
  private resolver: any;

  constructor() {
    this.auth = firebase.auth();
    this.readyState = new Promise((res /*, rej*/) => {
      this.resolver = res;
    });

    this.scope = {
      isSignedIn: false,
      uid: null,
      data: null,
      isNewUser: false,
      initialized: false,
      email: null,
      emailDomain: null,
      token: null,
      readyState: this.readyState
    };

    this.auth.onAuthStateChanged(user => {
      if (user == null) {
        Object.assign(this.scope, {
          isSignedIn: false,
          uid: null,
          data: null,
          isNewUser: false,
          email: null,
          emailDomain: null,
          token: null
        });
        delete this.additionalUserInfo;
      } else {
        Object.assign(this.scope, {
          isSignedIn: true,
          uid: user.uid,
          token: null,
          email: user.email,
          emailDomain: AuthHelper.getEmailDomain(user),
          // we can only detect new users by looking at the sign in results object
          // that data isn't available here, so preserve it when updating auth state
          isNewUser: this.additionalUserInfo?.isNewUser || false
        });
        user.getIdToken().then(tok => (this.scope.token = tok));
      }
      if (!this.scope.initialized) {
        this.scope.initialized = true;
        this.resolver(this.scope.isSignedIn);
      }
      console.log("onAuthStateChanged", this.scope);
    });
  }

  getSharedScope(): SharedAuthScope {
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
    } catch (e) {
      toaster.handleError("AuthHelper::signIn", e);
      throw e;
    }
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }

  private static getEmailDomain(user: firebase.User): string | null {
    if (!user || !user.email) return null;
    return user.email.replace(/^.*@/, "");
  }
}

export const Auth = new AuthHelper();
export default Auth;
