<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid id="room-container">
    <v-row>
      <v-col cols="12">
        <v-alert v-if="room.data.closed" color="warning">
          <h3>This room is closed.</h3>
        </v-alert>

        <v-card v-if="ui.isLoading" loading="cyan">
          <v-card-title>Loading...</v-card-title>
        </v-card>

        <RoomToolbar
          v-if="!ui.isLoading"
          :room="room"
          :feed="feed"
          :isAdmin="isAdmin"
        />

        <FeedView
          v-if="!ui.isLoading"
          :feed="feed"
          :isAdmin="isAdmin"
          :isClosed="room.data.closed"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import sharedScope from "@/libs/SharedScope";
import { Feed } from "@/libs/Feed";
import { Room } from "@/libs/Room";
import RoomToolbar from "@/components/room/RoomToolbar.vue";
import FeedView from "@/components/room/FeedView.vue";

interface VueData {
  id: string;
  room: Room;
  feed: Feed;
  isAdmin: boolean;
  ui: {
    isLoading: boolean;
    showPicker: boolean;
    showMemberManager: boolean;
  };
  updates: number;
}

export default Vue.extend({
  name: "Room",

  components: {
    RoomToolbar,
    FeedView
  },

  created() {
    this.room.subscribe(() => this.serverUpdate("Room"));
    this.feed.subscribe(() => this.serverUpdate("Feed"));
    Promise.all([this.room.loaded, this.feed.loaded]).then(() => {
      this.ui.isLoading = false;
    });
  },

  beforeDestroy() {
    this.room?.destroy();
    this.feed?.destroy();
  },

  methods: {
    serverUpdate(source: string) {
      if (source === "Room" && this.room) {
        sharedScope.ui.setTitle(this.room.data.name);
        this.$set(
          this,
          "isAdmin",
          this.room.data.owners.includes(sharedScope.user.uid as string)
        );
      }
      // trigger change detection, set admin flag
      this.$set(this, "updates", this.updates + 1);
      console.log("serverUpdate", source, this.isAdmin); //debug
    }
  },

  data() {
    const id = this.$route.params.roomId;
    return {
      id: id,
      room: new Room(id),
      feed: new Feed(id),
      isAdmin: false,
      ui: {
        isLoading: true,
        showPicker: false,
        showMemberManager: false
      },
      updates: 0
    } as VueData;
  }
});
</script>

<style scoped>
#room-container {
  margin-top: 0;
  padding-top: 0;
}
#room-container .v-toolbar,
#room-container .v-card {
  margin-bottom: 5px;
}

#room-container .v-btn {
  margin-right: 5px;
}

#room-container .v-btn .v-icon {
  height: 32px;
  font-size: 32px;
  width: 32px;
}
</style>
