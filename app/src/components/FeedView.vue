<template>
  <v-container :class="isClosed? 'FeedView closed' : 'FeedView'">
    <!-- ☃☃☃☃☃☃☃ Some fun idle content for empty rooms ☃☃☃☃☃☃☃ -->
    <IdleWidget v-if="events.length === 0" />

    <!-- ☃☃☃☃☃☃☃ The reactions panel! ☃☃☃☃☃☃☃ -->
    <!-- TODO -->
    <!-- TODO -->
    <!-- TODO -->

    <!-- ☃☃☃☃☃☃☃ The feed! ☃☃☃☃☃☃☃ -->
    <div v-for="event in events" :key="event.id">
      <EventWidgetAdmin v-if="event.type === 'admin'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetAfk v-if="event.type === 'afk'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetEmote v-if="event.type === 'emote'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetLink v-if="event.type === 'link'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetPoll v-if="event.type === 'poll'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetQuestion v-if="event.type === 'question'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetTodo v-if="event.type === 'todo'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
      <EventWidgetWait v-if="event.type === 'wait'" :card="event" :isAdmin="isAdmin" :isClosed="isClosed"/>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Feed } from "@/libs/Feed";
import IdleWidget from "@/widgets/IdleWidget.vue";
import EventWidgetLink from "@/widgets/EventWidgetLink.vue";
import EventWidgetQuestion from "@/widgets/EventWidgetQuestion.vue";
import EventWidgetAdmin from "@/widgets/EventWidgetAdmin.vue";
import EventWidgetAfk from "@/widgets/EventWidgetAfk.vue";
import EventWidgetEmote from "@/widgets/EventWidgetEmote.vue";
import EventWidgetPoll from "@/widgets/EventWidgetPoll.vue";
import EventWidgetTodo from "@/widgets/EventWidgetTodo.vue";
import EventWidgetWait from "@/widgets/EventWidgetWait.vue";

export default Vue.extend({
  name: "FeedView",

  components: {IdleWidget, EventWidgetAdmin, EventWidgetAfk, EventWidgetEmote, EventWidgetLink,
      EventWidgetPoll, EventWidgetQuestion, EventWidgetTodo, EventWidgetWait},

  props: {
    feed: { type: Feed, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },

  computed: {
    events() { return this.feed.getEvents() }
  },

  data: () => ({})
});
</script>

<style>
  .FeedView .v-card {
    margin-bottom: 5px;
  }

  .FeedView.closed .v-card {
    opacity: .6;
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