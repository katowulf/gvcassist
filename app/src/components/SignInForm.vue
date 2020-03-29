<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Please sign in!</v-toolbar-title>
            <v-spacer/>
          </v-toolbar>
          <v-card-text>
            <p>
              To create or join rooms, you need to be signed in. We use secure third party
              authentication and respect your privacy.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary">Sign in with Google</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    source: String,
  },
}
</script>