<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card-actions>
    <UserAvatar v-if="showAvatar" :uid="this.card.creator" :size="24" />

    <small class="datestamp">
      <Datestamp :time="card.timestamp" />
    </small>

    <v-spacer></v-spacer>

    <v-chip-group
      column
      multiple
      :value="selectedReactions"
      active-class="success"
    >
      <v-chip
        v-for="emoji in reactions"
        :key="emoji"
        @click="toggleReaction($event, emoji)"
        :dark="card.ui.dark"
        outlined
      >
        {{ emoji }}
        {{ reactionCounts.get(emoji) > 1 ? reactionCounts.get(emoji) : "" }}
      </v-chip>
    </v-chip-group>
  </v-card-actions>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import sharedScope from "@/libs/SharedScope";
import UserAvatar from "@/widgets/UserAvatar.vue";
import Datestamp from "@/widgets/Datestamp.vue";

interface VueData {
  sharedScope: any;
  reactions: string[];
  reactionCounts: Map<string, number>;
  selectedReactions: number[];
}

export default Vue.extend({
  name: "EventWidgetActions",
  props: {
    card: { type: FeedEvent, required: true },
    showAvatar: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },

  components: { UserAvatar, Datestamp },

  created() {
    this.card.subscribe(() => this.update());
    this.update();
  },

  methods: {
    toggleReaction(event, emoji) {
      if (!this.isClosed) {
        this.card.toggleReaction(emoji, this.sharedScope.user.uid);
      }
    },

    update() {
      console.log("update occurred"); //debug
      const myId = this.sharedScope.user.uid as string;
      const uids = this.card.reactions.uids;
      this.reactions = [];
      this.reactionCounts = new Map([...uids.keys()].map(k => [k, 0]));
      this.selectedReactions = [];
      let i = 0;
      uids.forEach((uids: Set<string>, emoji: string) => {
        this.reactions.push(emoji);
        if (uids.has(myId)) {
          this.selectedReactions.push(i);
        }
        this.reactionCounts.set(emoji, uids.size);
        i += 1;
      });
      this.$set(this, "reactions", this.reactions);
    }
  },

  data: () =>
    ({
      sharedScope: sharedScope,
      reactions: [],
      reactionCounts: new Map(),
      selectedReactions: []
    } as VueData)
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
