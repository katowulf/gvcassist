<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <v-card shaped dense :color="card.ui.color" dark>
    <v-card-text>Todo: {{ card.text }}</v-card-text>
    <CardActions
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
import CardActions from "@/components/room/eventcard/CardActions.vue";

export default Vue.extend({
  name: "EventWidgetTodo",
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { CardActions }
});
</script>
