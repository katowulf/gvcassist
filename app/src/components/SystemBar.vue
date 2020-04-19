<template>
  <v-system-bar window dark color="primary">
    <v-icon>mdi-account-multiple</v-icon>
    <span>{{ sharedScope.ui.title }}</span>
    <v-spacer></v-spacer>
    <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
    <v-btn v-if="!isRoomView" icon to="/about">
      <v-icon>mdi-information-outline</v-icon>
    </v-btn>
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
      this.isRoomView = to.name === "Room";
    });
  },
  methods: {
    goToHome() {
      this.$router.push({ path: "/" });
    }
  },
  data: () => ({
    isRoomView: false,
    sharedScope: sharedScope
  })
});
</script>
