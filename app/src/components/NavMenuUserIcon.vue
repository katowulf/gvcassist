<template>
  <div>
    <v-avatar v-if="!user.isSignedIn" color="grey" v-on:click="signIn()">
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar>

    <UserAvatar v-if="user.isSignedIn" :uid="user.uid" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import UserAvatar from "@/components/UserAvatar.vue";

export default Vue.extend({
  name: "UserIcon",

  components: {
    UserAvatar
  },

  methods: {
    signIn: function() {
      this.$router.push("/login");
    }
  },

  data: () => ({
    user: sharedScope.user
  })
});
</script>
