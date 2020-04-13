<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-text>
            {{ room.getId() }}

            {{ room.data }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import sharedScope from "@/libs/SharedScope";
import { Feed } from "@/libs/Feed";
import { Room } from "@/libs/Room";

interface VueData {
  id: string | null;
  room: Room | null;
  feed: Feed | null;
  updates: { lastUpdate: number };
  unsubscribe: () => void;
}

export default Vue.extend({
  name: "Room",

  created() {
    console.log("room!", this.$route.params.roomId);
    this.id = this.$route.params.roomId;
    this.room = new Room(this.id, (source: string) =>
      this.serverUpdate(source)
    );
    this.feed = new Feed(this.id, (source: string) =>
      this.serverUpdate(source)
    );
  },

  methods: {
    serverUpdate(source: string) {
      // Trigger change detection. This is a bit of hacky way to do things,
      // But .vue files have some limits here. One can only modify direct descendants
      // of the data: { ... } object or change detection fails. The recommended approach
      // is to directly assign new values there. There's really no good way to use classes
      // and nested objects here, which is pretty much by design. See
      // https://github.com/vuejs/vue/issues/2371
      //
      // So we're faced with only working in primitives or with working a bit outside the
      // best practices according to Vue. It's pretty apparent at this point in the coding
      // lifecycle that Typescript is already not well supported (see all the interfaces to
      // make the linter happy with data: { ... }). So we might as well go all in and use
      // a few classes where encapsulation and division of logic feels like a solid choice.
      if (source === "Room" && this.room)
        sharedScope.ui.title = this.room.data.name;
      Vue.set(this.updates, "lastUpdate", Date.now());
    }
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  data: () =>
    ({
      id: null,
      room: {},
      feed: null,
      updates: { lastUpdate: 0 },

      // This can't be in methods because those don't seem to exist in beforeDestroy. But
      // data values are. So yay?
      unsubscribe() {
        if (this.room)
          this.room.unsubscribe();
        if (this.feed)
          this.feed.unsubscribe();
      }
    } as VueData)
});
</script>

<style scoped></style>
