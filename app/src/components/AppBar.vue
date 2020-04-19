<template>
  <v-app-bar app color="primary" dark>
    <v-icon left>mdi-account-multiple</v-icon>
    <v-toolbar-title>
      {{ sharedScope.ui.title }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn text to="/">
      <v-icon left>mdi-home</v-icon>
      Home
    </v-btn>
    <v-btn text to="/about">
      <v-icon left>mdi-information-outline</v-icon>
      About
    </v-btn>

    <NavMenuUserIcon />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import NavMenuUserIcon from "@/widgets/NavMenuUserIcon.vue";
import sharedScope from "@/libs/SharedScope";

export default Vue.extend({
  name: "AppBar",

  components: { NavMenuUserIcon },

  data: () => ({
    sharedScope: sharedScope
  })
});
</script>
