<template>
  <v-app>
    <AppBar />

    <v-content>
      <Toaster />
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import AppBar from "@/components/AppBar.vue";
import Toaster from "@/components/Toaster.vue";

export default Vue.extend({
  name: "App",

  components: {
    AppBar,
    Toaster
  },

  data: () => ({
    sharedScope: sharedScope
  })
});
</script>

<style>
  body { padding-bottom: 50px; }
</style>