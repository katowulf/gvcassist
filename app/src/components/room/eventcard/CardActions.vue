<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card-actions>
    <UserAvatar v-if="showAvatar" :uid="this.card.creator" :size="24" />

    <small class="datestamp">
      <Datestamp :time="card.timestamp" />
    </small>

    <v-spacer></v-spacer>

    <ReactionChips :card="card" @toggle="toggleReaction" />
  </v-card-actions>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import sharedScope from "@/libs/SharedScope";
import UserAvatar from "@/components/uiwidget/UserAvatar.vue";
import Datestamp from "@/components/uiwidget/Datestamp.vue";
import ReactionChips from "@/components/room/eventcard/ReactionChips.vue";

export default Vue.extend({
  name: "EventWidgetActions",
  props: {
    card: { type: FeedEvent, required: true },
    showAvatar: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },

  components: { UserAvatar, Datestamp, ReactionChips },

  created() {
    // this.card.subscribe(() => this.update());
    // this.update();
  },

  methods: {
    toggleReaction(emoji) {
      if (!this.isClosed) {
        this.card.toggleReaction(emoji, this.sharedScope.user.uid);
      }
    }

    // update() {
    //   console.log("update occurred"); //debug
    //   // trigger change detection
    //   this.$set(this.card, "reactions", this.card.reactions);
    // }
  },

  data: () => ({ sharedScope: sharedScope })
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
