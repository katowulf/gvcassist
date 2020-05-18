<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card-actions>
    <UserAvatar v-if="showAvatar" :uid="this.card.creator" :size="24" />

    <small class="datestamp">
      <Datestamp :time="card.timestamp" />
    </small>

    <v-spacer></v-spacer>

    <ReactionChips :card="card" @toggle="toggleReaction" />

    <v-menu
      v-model="showPicker"
      :close-on-content-click="false"
      v-if="card.type !== 'emote'"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" :disabled="isClosed" x-small>
          <v-icon>mdi-emoticon-outline</v-icon>
        </v-btn>
      </template>
      <VEmojiPicker @select="addReaction($event.data)" />
    </v-menu>

    <v-menu offset-y v-if="isAdmin || card.creator === uid">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
      </template>

      <v-list>
        <v-list-item @click="deleteEvent()" color="error">
          <v-list-item-icon>
            <v-icon>mdi-trash-can</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete this event</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card-actions>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import sharedScope from "@/libs/SharedScope";
import UserAvatar from "@/components/uiwidget/UserAvatar.vue";
import Datestamp from "@/components/uiwidget/Datestamp.vue";
import ReactionChips from "@/components/room/eventcard/ReactionChips.vue";
import VEmojiPicker from "v-emoji-picker";

export default Vue.extend({
  name: "CardActions",
  props: {
    card: { type: FeedEvent, required: true },
    showAvatar: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true },
    isAdmin: { type: Boolean, required: true }
  },

  components: { UserAvatar, Datestamp, ReactionChips, VEmojiPicker },

  created() {
    this.sub = this.card.subscribe(() => this.update());
  },

  beforeDestroy() {
    this.sub();
  },

  methods: {
    toggleReaction(emoji) {
      if (!this.isClosed) {
        this.card.toggleReaction(emoji, this.uid as string);
      }
    },

    addReaction(emoji) {
      if (!this.isClosed) {
        this.card.addReaction(emoji, this.uid as string);
      }
      this.showPicker = false;
    },

    deleteEvent() {
      this.card.delete();
    },

    update() {
      // trigger change detection
      this.$set(this, "counter", this.counter + 1);
    }
  },

  data: () => ({
    uid: sharedScope.user.uid as string,
    showPicker: false,
    counter: 0,
    sub: () => {
      /* noop */
    }
  })
});
</script>

<style scoped>
.datestamp {
  opacity: 0.2;
  font-size: 12px;
}

.v-avatar {
  margin-right: 8px;
}

.v-card:hover .datestamp {
  opacity: 0.6;
}
</style>
