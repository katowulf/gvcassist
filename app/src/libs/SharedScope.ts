import Vue from "vue";
import { Auth, SharedAuthScope } from "@/libs/Auth";
import fbconf from "@/firebase-config.ts";
import { toaster, Toaster } from "@/libs/Toaster";

/**
 * A debugging helper. This can be called from
 * the JS console as window.GvcAssistantDebugger
 * to test things.
 */
class GvcAssistantDebugger {
  public isEnabled = false;

  constructor(private toaster: Toaster) {}

  show() {
    this.isEnabled = true;
  }
  hide() {
    this.isEnabled = false;
  }
  makeToast() {
    this.toaster.error("It's likely an error that you can see this message.");
    this.toaster.warning("Warning: You've been warned!");
    this.toaster.info("I thought you might want to know this info.");
    this.toaster.success(
      "This was a triumph! I'm making a note here, HUGE SUCCESS."
    );
    this.toaster.note("One final note: this is the last piece of toast.");
  }
}

/**
 * A simple shared scope mechanism. It's a replacement for a good set of
 * cached services and is a bit hacky. But it helps us learn some Vue by
 * learning how state and sharing works. Vuex would be a more standardized
 * solution for this sort of thing.
 */
interface SharedScope {
  user: SharedAuthScope;
  debug: GvcAssistantDebugger;
  room: null | { id: string; isAdmin: boolean; data: any };
  projectId: string;
  ui: {
    setTitle: (newTitle: string) => void;
    redirect: any;
    title: string;
  };
}

declare global {
  interface Window {
    GvcAssistantDebugger: GvcAssistantDebugger;
  }
}

window.GvcAssistantDebugger = new GvcAssistantDebugger(toaster);

// Do some vue magic to trigger change detection by making our ui props
// Into a Vue and then calling a Vue method. This will prevent the title
// from not updating after we load things from the database.
// This is a hack and likely better to use Vuex for this kind of stuff.
// In fact, this whole sharedScope should likely be a Vuex instance.
const ui = new Vue({
  methods: {
    setTitle(title: string) {
      this.title = title;
    }
  },
  data: {
    redirect: null,
    title: ""
  }
});

const sharedScope = {
  user: Auth.getSharedScope(),
  ui: ui,
  projectId: fbconf.projectId,
  debug: window.GvcAssistantDebugger,
  room: null
};

export default sharedScope as SharedScope;
