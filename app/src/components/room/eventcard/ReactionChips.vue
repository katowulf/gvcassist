<template>
  <v-chip-group
    column
    multiple
    :value="selectedReactions"
    active-class="success"
  >
    <v-chip
      v-for="emoji in reactions"
      :key="emoji"
      @click="toggleReaction(emoji)"
      :dark="card.ui.dark"
      outlined
      :large="card.type === 'emote'"
    >
      {{ emoji }}
      {{ reactionCounts.get(emoji) > 1 ? reactionCounts.get(emoji) : "" }}
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import sharedScope from "@/libs/SharedScope";

interface VueData {
  reactions: string[];
  reactionCounts: Map<string, number>;
  selectedReactions: number[];
  sub: () => void;
}

export default Vue.extend({
  name: "ReactionChips",
  props: {
    card: { type: FeedEvent, required: true }
  },

  created() {
    this.sub = this.card.subscribe(() => this.update());
    this.update();
  },

  beforeDestroy() {
    this.sub();
  },

  methods: {
    toggleReaction(emoji) {
      this.$emit("toggle", emoji);
    },

    update() {
      const myId = sharedScope.user.uid as string;
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
    }
  },

  data: () =>
    ({
      reactions: [],
      reactionCounts: new Map(),
      selectedReactions: [],
      sub: () => {
        /*noop*/
      }
    } as VueData)
});
</script>

<style scoped>
.v-chip {
  border-style: none;
  background: none;
  margin: 0 2px;
}
.v-chip.v-size--x-small {
  padding: 7px 4px 5px 7px;
}
.v-chip.v-chip--active {
  border-style: solid;
}
</style>
