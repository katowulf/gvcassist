import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./plugins/vue-clipboard.ts";

// initialize routing
import router from "./router";

Vue.config.productionTip = false;

// configure and mount Vue
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
