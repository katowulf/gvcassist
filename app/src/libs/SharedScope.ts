import Auth from "@/libs/Auth";
import fbconf from "@/firebase-config.ts";

export default {
  redirect: null,
  user: Auth.getSharedScope(),
  debug: {
    project: fbconf.projectId
  }
};
