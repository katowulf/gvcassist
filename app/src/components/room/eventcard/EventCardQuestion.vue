<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <v-card class="FeedEvent" dense :color="card.ui.color" dark>
    <v-card-text>
      <v-icon left small>
        {{ card.ui.icon }}
      </v-icon>
      <span class="font-weight-light">{{ card.text }}</span>
    </v-card-text>

    <CardActions
      :card="card"
      :isAdmin="isAdmin"
      :isClosed="isClosed"
      :showAvatar="true"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import CardActions from "@/components/room/eventcard/CardActions.vue";

export default Vue.extend({
  name: "EventWidgetQuestion",
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { CardActions }
});
</script>
