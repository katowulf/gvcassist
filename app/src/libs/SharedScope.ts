import {Auth, SharedAuthScope} from "@/libs/Auth";
import fbconf from "@/firebase-config.ts";
import toaster from "@/libs/Toaster";

type GvcAssistantDebugger = any;

interface SharedScope {
  user: SharedAuthScope;
  debug: {project: string};
  debugger: GvcAssistantDebugger;
  ui: {
    redirect: any;
    title: null;
  };
}

declare global {
  interface Window {
    GvcAssistantDebugger: any;
  }
}
window.GvcAssistantDebugger = {
  // This can't be assigned in Toaster.ts because, for some reason, sharedScope
  // is shown as undefined if imported there. But toaster is fine when imported here.
  // A mystery to solve another time I guess. :(
  makeToast: function() {
    toaster.error("It's likely an error that you can see this message.");
    toaster.warning("Warning: You've been warned!");
    toaster.info("I thought you might want to know this info.");
    toaster.success("This was a triumph! I'm making a note here, HUGE SUCCESS.");
    toaster.note("One final note: this is the last piece of toast.");
  }
};

const sharedScope = {
  user: Auth.getSharedScope(),
  ui: {
    redirect: null,
    title: null
  },
  debug: {
    project: fbconf.projectId
  },
  debugger: window.GvcAssistantDebugger
};

export default sharedScope as SharedScope;
