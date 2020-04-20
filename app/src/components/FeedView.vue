<template>
  <v-container>
    <v-card width="100%" flat v-if="feed.getEvents().length === 0">
      <v-card-text>
        <h2 class="text-center font-weight-light">{{idleText}}</h2>
        <v-img width="100%" :src="require('../assets/'+idleImg)" />
        <p class="text-center"><small class="grey--text">Image provided royalty free by <a href="https://cliply.co/tag/gray-roundness-collection/" target="_blank">Cliply.co</a></small></p>
      </v-card-text>
    </v-card>
    <v-card shaped dense v-for="event in feed.getEvents()" :key="event.id">
      <v-card-text>{{ event }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Feed } from "@/libs/Feed";
import IdleManager from "@/libs/IdleManager";

export default Vue.extend({
  name: "FeedView",

  props: {
    feed: { type: Feed, required: true }
  },

  data: () => ({
    idleImg: IdleManager.image(),
    idleText: IdleManager.text()
  })
});
</script>

<style scoped>
  .reallybig {
    width: 80%;
    height: 80%;
  }
</style>
