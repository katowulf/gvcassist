<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container id="room-container">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-alert v-if="room.data.closed" color="warning">
          <h3>This room is closed.</h3>
        </v-alert>

        <v-card v-if="ui.isLoading" loading="cyan">
          <v-card-title>Loading...</v-card-title>
        </v-card>

        <RoomToolbar :room="room" :feed="feed" :isAdmin="true" />
        <RoomToolbar :room="room" :feed="feed" />

        <FeedVue :feed="feed" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import sharedScope from "@/libs/SharedScope";
import { Feed } from "@/libs/Feed";
import { Room } from "@/libs/Room";
import RoomToolbar from "@/components/RoomToolbar.vue";
import FeedVue from "@/components/Feed.vue";

interface VueData {
  id: string;
  room?: Room;
  feed?: Feed;
  ui: {
    isLoading: boolean;
    showPicker: boolean;
    showMemberManager: boolean;
  };
  updates: { lastUpdate: number };
}

export default Vue.extend({
  name: "Room",

  components: {
    RoomToolbar,
    FeedVue
  },

  created() {
    console.log("room!", this.$route.params.roomId);
    this.id = this.$route.params.roomId;
    this.room = new Room(this.id);
    this.feed = new Feed(this.id);
    Promise.all([this.room.loaded, this.feed.loaded]).then(
      () => (this.ui.isLoading = false)
    );
  },

  beforeDestroy() {
    this.room?.destroy();
    this.feed?.destroy();
  },

  methods: {
    serverUpdate(source: string) {
      if (source === "Room" && this.room)
        sharedScope.ui.setTitle(this.room.data.name);
    }
  },

  data: () =>
    ({
      id: "",
      room: undefined,
      feed: undefined,
      ui: {
        isLoading: true,
        showPicker: false,
        showMemberManager: false
      },
      updates: { lastUpdate: 0 }
    } as VueData)
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
