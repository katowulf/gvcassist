<template>
  <v-avatar :color="color" v-on:click="signOut()">
    <img v-if="user.photoURL"
        :src="user.photoURL"
        :alt="user.displayName"
    />
    <span v-if="!user.photoURL" class="white--text headline">{{user.initials || "?"}}</span>
  </v-avatar>
</template>

<script language="ts">
  import Vue from "vue";
  import Toaster from "@/libs/Toaster";
  import {Auth} from "@/libs/Auth";
  import Profiles from "@/libs/Profiles";

  const colors = [
    "red", "pink", "purple", "deep-purple", "indigo", /*"blue", */"light-blue", "cyan", "teal",
    "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "brown",
    "blue-grey", "grey", "shades"
  ];

  function getRandomColor() {
    return colors[Math.floor(Math.random()*colors.length)];
  }

  export default Vue.extend({
    name: "UserAvatar",

    props: ['uid'],

    methods: {
      signOut: function() {
        Auth.signOut().then(() => Toaster.info("You have been signed out."));
      }
    },

    data: () => ({
      color: getRandomColor(),
      user: Profiles.find(this.uid)
    })
  });

</script>