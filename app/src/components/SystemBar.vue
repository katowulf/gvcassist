<template>
  <v-system-bar window dark color="primary">
    <v-icon>mdi-account-multiple</v-icon>
    <span>{{ sharedScope.ui.title }}</span>
    <v-spacer></v-spacer>
    <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
    <v-btn v-if="!isRoomView" icon to="/about">
      <v-icon>mdi-information-outline</v-icon>
    </v-btn>
    <NavMenuUserIcon :size="24" />
  </v-system-bar>
</template>

<script lang="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import NavMenuUserIcon from "@/components/NavMenuUserIcon.vue";

export default Vue.extend({
  name: "AppBar",
  components: { NavMenuUserIcon },
  created() {
    this.$router.afterEach(to => {
      this.isRoomView = to.name === "Room";
    });
  },
  data: () => ({
    isRoomView: false,
    sharedScope: sharedScope
  })
});
</script>
