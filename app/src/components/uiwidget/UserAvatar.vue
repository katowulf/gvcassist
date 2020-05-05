<template>
  <v-avatar
    :color="user ? user.color : 'grey'"
    :size="size"
    :icon="!user"
    v-on:click="$emit('click', user)"
  >
    <img
      v-if="user && user.photoURL"
      :src="user.photoURL"
      :alt="user.displayName"
    />
    <span v-if="user && !user.photoURL" class="white--text headline">
      {{ user.initials || "?" }}
    </span>
    <v-icon dark v-if="!user">mdi-account-circle</v-icon>
  </v-avatar>
</template>

<script language="ts">
import Vue from "vue";
import Profiles from "@/libs/Profiles";

export default Vue.extend({
  name: "UserAvatar",

  props: {
    uid: { type: String, required: true },
    size: { type: Number, default: 32 }
  },

  // Loading the user object inside of created() ensures that it exists before the
  // page renders. Using computed and data broke when the user wasn't ready and didn't
  // correct after it did load; even if using async/await patterns oddly. It's probably
  // reasonable to do this with route guards too, but this isn't a route. It's a drop
  // in component.
  async created() {
    this.user = await Profiles.find(this.uid);
    this.$set(this.user, "$id", this.user.$id);
  },

  data: () => ({
    user: null
  })
});
</script>
