import Auth from "@/libs/Auth";

export default {
  redirect: null,
  user: Auth.getSharedScope(),
  debug: {}
};
