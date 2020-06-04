<template>
  <v-container>
    <h2>Debug Bar</h2>
    <v-switch
      v-model="sharedScope.debug.isEnabled"
      :label="toggleMessage"
    ></v-switch>

    <h2>Firebase Config</h2>
    <pre>{{ firebaseConfig }}</pre>

    <h2>Authenticated user</h2>
    <pre>
      {{ sharedScope.user }}
    </pre>

    <h2>misc</h2>
    <p>process.env.NODE_ENV: {{ devMode }}</p>
    <p>
      $vuetify.breakpoint: height: {{ $vuetify.breakpoint.height }} width:
      {{ $vuetify.breakpoint.width }} name: {{ this.$vuetify.breakpoint.name }}
    </p>
  </v-container>
</template>

<script lang="ts">
import sharedScope from "@/libs/SharedScope";
import { devMode, firebaseConfig } from "@/firebase-config.ts";

export default {
  name: "Debug",

  computed: {
    toggleMessage() {
      return (
        "Show the debug bar? (" +
        (sharedScope.debug.isEnabled ? "On" : "Off") +
        ")"
      );
    }
  },

  data: () => ({
    devMode: devMode,
    firebaseConfig: firebaseConfig,
    sharedScope: sharedScope
  })
};
</script>
