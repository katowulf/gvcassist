<template>
  <v-container>
    <v-bottom-navigation fixed horizontal>
      <v-btn text to="/privacy" color="deep-purple accent-4">
        <span>Privacy</span>
        <v-icon>mdi-shield-account</v-icon>
      </v-btn>

      <v-btn text to="/terms" color="deep-purple accent-4">
        <span>Terms</span>
        <v-icon>mdi-police-badge</v-icon>
      </v-btn>

      <v-btn text to="/feedback" color="deep-purple accent-4">
        <span>Feedback</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "Footer",
  data: () => ({})
};
</script>
