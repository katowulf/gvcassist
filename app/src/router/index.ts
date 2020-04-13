import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import sharedScope from "../libs/SharedScope";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/debug",
    name: "Debug",
    component: () => import("@/views/Debug.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/room/:roomId",
    name: "Room",
    component: () => import("@/views/Room.vue"),
    beforeEnter: async (to: any, from: any, next: Function) => {
      const isSignedIn = await sharedScope.user.readyState;
      if( !isSignedIn ) {
        sharedScope.ui.redirect = {name: "Room", params: to.params};
        next({name: "Login"});
      }
      else {
        next();
      }
    }
  },
  { path: "*", component: () => import("@/views/NotFound.vue") }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
