<template>
  <v-app>
    <AppBar v-if="!$vuetify.breakpoint.xsOnly" />
    <SystemBar v-if="$vuetify.breakpoint.xsOnly" />

    <v-content>
      <Toaster />
      <router-view />
    </v-content>

    <v-footer fixed class="debug" v-if="showDebug">
      <p class="font-weight-light caption">
        $vuetify.breakpoint: height={{ $vuetify.breakpoint.height }} width={{
          $vuetify.breakpoint.width
        }}
        name={{ $vuetify.breakpoint.name }}; uid: {{ sharedScope.user.uid }},
        debug: {{ sharedScope.debug }};
      </p>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import AppBar from "@/components/AppBar.vue";
import Toaster from "@/components/Toaster.vue";
import SystemBar from "@/components/SystemBar.vue";

export default Vue.extend({
  name: "App",

  components: {
    AppBar,
    Toaster,
    SystemBar
  },

  created() {
    this.sharedScope.debugger.enableDebugging = (b: boolean) =>
      (this.showDebug = b);
  },

  data: () => ({
    sharedScope: sharedScope,
    showDebug: false
  })
});
</script>

<style>
body {
  padding-bottom: 50px;
}

.v-footer.debug {
  z-index: 400;
}
</style>
