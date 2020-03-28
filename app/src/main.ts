import Vue from "vue";
import App from "./App.vue";
import vuetify from './plugins/vuetify';

// initialize routing
import router from "./router";

// initialize third party libs and utils
import "./libs/font-awesome";

Vue.config.productionTip = false;

// configure and mount Vue
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
