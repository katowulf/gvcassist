<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-header>
            {{room.name || `Loading ${id} ...`}}
          </v-card-header>
          <v-card-text>
            {{room}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import toaster, {burnedTheToast} from "@/libs/Toaster";
import DB from "@/libs/DB";
import {UserProfile} from "@/libs/Profiles";
import sharedScope from "@/libs/SharedScope";

enum EventType { emote="emote", poll="poll", link="link" }

interface Event {
  timestamp: Date;
  type: EventType;
  users: UserProfile[];
}

interface RoomData {
  id: string|null;
  room: any;
  unsubscribe: () => void;
}

export default Vue.extend({
  name: "Room",

  created() {
    console.log("room!", this.$route.params.roomId);
    this.id = this.$route.params.roomId;
    this.unsubscribe = DB.doc(["rooms", this.id])
      .onSnapshot(snap => this.serverUpdated(snap), burnedTheToast("Room.sync"));
  },

  methods: {
    serverUpdated(snap: any) {
      console.log('serverUpdated', this.id); //debug
      const roomData = snap.data();
      roomData.name = roomData.description || "Room " + this.id;
      sharedScope.ui.title = roomData.name;
      this.room = roomData; //this.$set('room', roomData);
    }
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  data: () => ({
    id: null,
    room: null,
    unsubscribe: () => { /* do nothing */ }
  } as RoomData)
});
</script>

<style scoped></style>
