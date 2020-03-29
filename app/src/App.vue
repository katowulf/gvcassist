<template>
  <v-app>
    <AppBar />

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "@/components/AppBar.vue";
import sharedScope from "@/libs/SharedScope";

export default Vue.extend({
  name: "App",

  components: {
    AppBar
  },

  data: () => ({
    sharedScope: sharedScope
  })
});
</script>
