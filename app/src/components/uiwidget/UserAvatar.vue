<template>
  <v-avatar :color="user ? user.color : ''" :size="size" v-on:click="signOut()">
    <img
      v-if="user && user.photoURL"
      :src="user.photoURL"
      :alt="user.displayName"
    />
    <span v-if="user && !user.photoURL" class="white--text headline">
      {{ user.initials || "?" }}
    </span>
  </v-avatar>
</template>

<script language="ts">
import Vue from "vue";
import Toaster from "@/libs/Toaster";
import { Auth } from "@/libs/Auth";
import Profiles from "@/libs/Profiles";

export default Vue.extend({
  name: "UserAvatar",

  props: {
    uid: { type: String, required: true },
    size: { type: Number, default: 32 }
  },

  // Loading the user object inside of created() ensures that it exists before the
  // page renders. Using computed and data broke when the user wasn't ready and didn't
  // correct after it did load. It's probably reasonable to do this with route guards too,
  // but this isn't a route. It's a drop in component. So this felt more elegant.
  async created() {
    this.user = await Profiles.find(this.uid);
  },

  methods: {
    signOut() {
      Auth.signOut().then(() => Toaster.info("You have been signed out."));
    }
  },

  data: () => ({
    user: null
  })
});
</script>
