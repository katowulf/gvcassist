<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <v-card shaped dense :color="isClosed ? '' : card.ui.color" dark>
    <v-card-text>AFK: {{ card.text }}</v-card-text>
    <EventWidgetActions
      :card="card"
      :isAdmin="isAdmin"
      :isClosed="isClosed"
      :showAvatar="false"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import EventWidgetActions from "@/components/room/EventWidgetActions.vue";

export default Vue.extend({
  name: "EventWidgetAfk",
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { EventWidgetActions }
});
</script>
