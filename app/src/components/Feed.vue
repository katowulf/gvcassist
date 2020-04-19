<template>
  <v-container>
    <v-card shaped dense v-for="event in feed.getEvents()" :key="event.id">
      <v-card-text>{{ event }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Feed } from "@/libs/Feed";

export default Vue.extend({
  name: "Feed",

  props: {
    feed: { type: Feed, required: true }
  }
});
</script>
