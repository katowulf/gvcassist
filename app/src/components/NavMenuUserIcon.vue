<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-avatar
      v-if="!user.isSignedIn"
      color="grey"
      :size="size"
      v-on:click="signIn()"
    >
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar>

    <UserAvatar
      v-if="user.isSignedIn"
      :uid="user.uid"
      :size="size"
      @click="signOut()"
    />
  </div>

  <!--
  <v-menu offset-y v-model="menuIsVisible">
    <template v-slot:activator="{ on: menu }">
      <UserAvatar v-on="{...menu}" :uid="user.uid" :size="size" />
    </template>
    <v-list>
      <v-list-item @click="$emit('action')">
        <v-list-item-icon>
          <v-icon>mdi-check</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Button title</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
  -->
</template>

<script lang="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import UserAvatar from "@/components/uiwidget/UserAvatar.vue";
import Auth from "@/libs/Auth";
import toaster from "@/libs/Toaster";

export default Vue.extend({
  name: "UserIcon",

  props: {
    size: { type: Number, default: 32 }
  },

  components: {
    UserAvatar
  },

  methods: {
    signIn: function() {
      sharedScope.ui.redirect = this.$route.path;
      this.$router.push("/login");
    },

    signOut() {
      sharedScope.ui.redirect = this.$route.path;
      Auth.signOut().then(() => {
        toaster.info("You have been signed out.");
        this.$router.push("/");
      });
    }
  },

  data: () => ({
    user: sharedScope.user,
    menuIsVisible: false
  })
});
</script>
