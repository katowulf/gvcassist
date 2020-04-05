<template>
  <div>
    <h2>sharedScope</h2>
    <pre>{{ sharedScope }}</pre>

    <h2>firebaseConfig</h2>
    <pre>{{ firebaseConfig }}</pre>

    <h2>misc</h2>
    <p>process.env.NODE_ENV: {{ devMode }}</p>
    <p>
      $vuetify.breakpoint: height: {{ $vuetify.breakpoint.height }} width:
      {{ $vuetify.breakpoint.width }} name: {{ this.$vuetify.breakpoint.name }}
    </p>
    <p>User auth token: {{ sharedScope.user.token }}</p>
  </div>
</template>

<script lang="ts">
import sharedScope from "@/libs/SharedScope";
import { devMode, firebaseConfig } from "@/firebase-config.ts";

export default {
  name: "HomePageContent",

  data: () => ({
    devMode: devMode,
    firebaseConfig: firebaseConfig,
    sharedScope: sharedScope
  })
};
</script>
