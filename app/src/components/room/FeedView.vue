<template>
  <v-container fluid :class="isClosed ? 'FeedView closed' : 'FeedView'">
    <!-- ☃☃☃☃☃☃☃ Some fun idle content for empty rooms ☃☃☃☃☃☃☃ -->
    <IdleWidget v-if="events.length === 0" />

    <!-- ☃☃☃☃☃☃☃ The feed! ☃☃☃☃☃☃☃ -->
    <div v-for="event in events" :key="event.id" :class="event.ui.cssClass">
      <EventWidgetAdmin
        v-if="event.type === 'admin'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetAfk
        v-if="event.type === 'afk'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetEmote
        v-if="event.type === 'emote'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetLink
        v-if="event.type === 'link'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetPoll
        v-if="event.type === 'poll'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetQuestion
        v-if="event.type === 'question'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetTodo
        v-if="event.type === 'todo'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
      <EventWidgetWait
        v-if="event.type === 'wait'"
        :card="event"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Feed } from "@/libs/Feed";
import IdleWidget from "@/components/uiwidget/IdleWidget.vue";
import EventWidgetLink from "@/components/room/eventcard/EventCardLink.vue";
import EventWidgetQuestion from "@/components/room/eventcard/EventCardQuestion.vue";
import EventWidgetAdmin from "@/components/room/eventcard/EventCardAdmin.vue";
import EventWidgetAfk from "@/components/room/eventcard/EventCardAfk.vue";
import EventWidgetEmote from "@/components/room/eventcard/EventCardEmote.vue";
import EventWidgetPoll from "@/components/room/eventcard/EventCardPoll.vue";
import EventWidgetTodo from "@/components/room/eventcard/EventCardTodo.vue";
import EventWidgetWait from "@/components/room/eventcard/EventCardWait.vue";

export default Vue.extend({
  name: "FeedView",

  components: {
    IdleWidget,
    EventWidgetAdmin,
    EventWidgetAfk,
    EventWidgetEmote,
    EventWidgetLink,
    EventWidgetPoll,
    EventWidgetQuestion,
    EventWidgetTodo,
    EventWidgetWait
  },

  props: {
    feed: { type: Feed, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },

  computed: {
    events() {
      return this.feed.getEvents();
    }
  },

  data: () => ({})
});
</script>

<style>
.FeedView .v-card {
  margin-bottom: 5px;
}

.FeedView.closed .v-card {
  opacity: 0.6;
}

.FeedView .v-card .v-list-item {
  min-height: 24px;
}

.FeedView .EventCard .v-card__title,
.FeedView .EventCard .v-card__text {
  padding: 8px 14px 2px;
}

.FeedView .EventCard .v-card__actions {
  padding: 2px 14px 4px;
}
</style>
