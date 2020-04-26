<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <v-card elevation="1" :color="card.ui.color" dark class="EventCard">
    <v-card-title>
      <v-btn
        text
        small
        :href="card.text"
        target="_blank"
        class="font-weight-light text-none"
      >
        <v-icon left>
          {{ card.ui.icon }}
        </v-icon>
        {{ card.text }}
      </v-btn>
      <v-spacer></v-spacer>
      <CopyWidget v-model="card.text" />
    </v-card-title>

    <EventWidgetActions
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
import EventWidgetActions from "@/components/room/EventWidgetActions.vue";
import CopyWidget from "@/components/uiwidget/CopyWidget.vue";

export default Vue.extend({
  name: "EventWidgetLink",
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { EventWidgetActions, CopyWidget }
});
</script>
