<template>
  <v-card color="blue lighten-5">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Please sign in!</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <p>
        To create or join rooms, you need to be signed in. We use secure third
        party authentication and respect your privacy.
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" v-on:click="signIn">Sign in with Google</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";
import Auth from "@/libs/Auth";
import SharedScope from "@/libs/SharedScope";
import toaster from "@/libs/Toaster";

export default Vue.extend({
  props: {
    source: String
  },

  data: () => ({
    sharedScope: SharedScope
  }),

  methods: {
    signIn() {
      Auth.signIn()
        .then(result => {
          console.log(
            "authenticated [",
            result.user.uid,
            "] ",
            result.user.displayName
          );
          if (SharedScope.redirect) {
            const redirect = SharedScope.redirect;
            SharedScope.redirect = null;
            this.$router.push(redirect);
          }
        })
        .catch(error => {
          console.error(error);
          toaster.error(error.message);
        });
    }
  }
});
</script>
