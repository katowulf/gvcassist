<template>
  <v-system-bar window dark>
    <v-icon>mdi-account-multiple</v-icon>
    <span>{{ sharedScope.ui.title }}</span>
    <v-spacer></v-spacer>
    <v-btn text to="/"><v-icon left>mdi-home</v-icon></v-btn>
    <v-btn v-if="isHomePage" text to="/about"
      ><v-icon left>mdi-information-outline</v-icon></v-btn
    >
  </v-system-bar>
</template>

<script lang="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";

export default Vue.extend({
  name: "AppBar",
  created() {
    this.$router.afterEach(to => {
      console.log("afterEach", to);
      this.isHomePage = to.name === "Home";
    });
  },
  methods: {
    goToHome() {
      this.$router.push({ path: "/" });
    }
  },
  data: () => ({
    isHomePage: false,
    sharedScope: sharedScope
  })
});
</script>
