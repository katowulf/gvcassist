<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container id="room-container">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card flat>
          <v-toolbar>
            <v-btn icon><v-icon>mdi-help</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-link</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-poll-box</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-timer-outline</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list>
                <v-list-item @click="ui.showMemberManager = true">
                  <v-list-item-title>Manage Members</v-list-item-title>
                </v-list-item>
                <v-list-item v-if="!room.data.closed" @click="closeRoom()">
                  <v-list-item-title>Close Room</v-list-item-title>
                </v-list-item>
                <v-list-item v-if="room.data.closed" @click="openRoom()">
                  <v-list-item-title>Open Room</v-list-item-title>
                </v-list-item>

              </v-list>
            </v-menu>
          </v-toolbar>
        </v-card>

        <v-dialog
            v-model="ui.showMemberManager"
            width="500"
        >
          <v-card>
            <v-card-title>
              Manage members
            </v-card-title>

            <v-card-text>
              <p>{{this.room.displayMembershipType()}}</p>

              <EmailList
                  v-model="room.data.whitelist"
                  @input="saveMemberChanges()"
                  label="Whitelisted members"
              />

              <EmailList
                  v-model="room.data.blacklist"
                  @input="saveMemberChanges()"
                  label="Blacklisted members"
              />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="saveMemberChanges(); ui.showMemberManager = false">
                Done
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card flat>
          <v-toolbar>
            <v-btn icon><v-icon>mdi-help</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-link</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-thumb-up</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-timer-sand-full</v-icon></v-btn>
            <v-spacer></v-spacer>

            <v-menu v-model="ui.showPicker" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"><v-icon>mdi-emoticon-outline</v-icon></v-btn>
              </template>
              <VEmojiPicker @select="selectEmoji" />
            </v-menu>

          </v-toolbar>
        </v-card>

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
import VEmojiPicker from 'v-emoji-picker';
import EmailList from "@/components/EmailList.vue";
import DB from "@/libs/DB";

interface VueData {
  id: string | null;
  room: Room | null;
  feed: Feed | null;
  ui: {
    showPicker: boolean;
    showMemberManager: boolean;
  }
  updates: { lastUpdate: number };
  unsubscribe: () => void;
}

export default Vue.extend({
  name: "Room",

  components: {
    VEmojiPicker, EmailList
  },

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

  beforeDestroy() {
    this.unsubscribe();
  },

  methods: {
    serverUpdate(source: string) {
      if (source === "Room" && this.room)
        sharedScope.ui.title = this.room.data.name;

      // Trigger change detection. This is a bit of hacky way to do things,
      // But .vue files have some limits here. One can only modify direct descendants
      // of the data: { ... } object or change detection fails. The recommended approach
      // is to directly assign new values there. There's really no good way to use classes
      // and nested objects here, which is pretty much by design. See
      // https://github.com/vuejs/vue/issues/2371
      //
      // So we're faced with only working in primitives or with working a bit outside the
      // best practices according to Vue. It's pretty apparent at this point in the coding
      // lifecycle that Typescript is already not well supported (thus the `as VueData` to
      // make the linter happy with `data` content). So we might as well go all in and use
      // a few classes where encapsulation and division of logic feels like a solid choice.
      Vue.set(this.updates, "lastUpdate", Date.now());
    },

    closeRoom() {
      console.log("close room");
    },

    openRoom() {
      console.log("open room");
    },

    saveMemberChanges() {
      console.log("save member changes");
      DB.doc(['rooms', this.id]).set({
        whitelist: this.room.data.whitelist, blacklist: this.room.data.blacklist
      }, {merge: true});
    },

    selectEmoji(emoji: any) {
      console.log('selectEmoji', emoji.data);
      this.ui.showPicker = false;
    }
  },

  data: () =>
    ({
      id: null,
      room: null,
      feed: null,
      isLoaded: false,
      ui: {
        showPicker: false,
        showMemberManager: true // debug
      },
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

<style scoped>
  #room-container {
    margin-top: 0;
    padding-top: 0;
  }
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
