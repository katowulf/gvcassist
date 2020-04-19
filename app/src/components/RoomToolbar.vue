<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-toolbar elevation="2">

    <!-- ☃☃☃☃☃☃☃ Ask a question ☃☃☃☃☃☃☃ -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" color="primary" icon>
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </template>
      <span>Ask a question</span>
    </v-tooltip>

    <!-- ☃☃☃☃☃☃☃ Share a link ☃☃☃☃☃☃☃ -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" color="accent" icon>
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </template>
      <span>Share a link</span>
    </v-tooltip>

    <!-- ☃☃☃☃☃☃☃ Create a poll (admin only) ☃☃☃☃☃☃☃ -->
    <v-tooltip v-if="isAdmin" bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" color="cyan" icon>
          <v-icon>mdi-poll-box</v-icon>
        </v-btn>
      </template>
      <span>Create a poll</span>
    </v-tooltip>

    <!-- ☃☃☃☃☃☃☃ Wait for everyone (admin only) ☃☃☃☃☃☃☃ -->
    <v-tooltip v-if="isAdmin" bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" color="purple" icon>
          <v-icon>mdi-timer-outline</v-icon>
        </v-btn>
      </template>
      <span>Wait for everyone to ack</span>
    </v-tooltip>

    <!-- ☃☃☃☃☃☃☃ Thumbsup ☃☃☃☃☃☃☃ -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" color="success" icon>
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
      </template>
      <span>Agree and +1</span>
    </v-tooltip>

    <!-- ☃☃☃☃☃☃☃ AFK ☃☃☃☃☃☃☃ -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" icon>
          <v-icon>mdi-timer-sand-full</v-icon>
        </v-btn>
      </template>
      <span>Away from keyboard</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <!-- ☃☃☃☃☃☃☃ Pick an emoji ☃☃☃☃☃☃☃ -->
    <v-menu v-model="ui.showPicker" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" :disabled="room.data.closed">
          <v-icon>mdi-emoticon-outline</v-icon>
        </v-btn>
      </template>
      <VEmojiPicker @select="selectEmoji" />
    </v-menu>

    <!-- ☃☃☃☃☃☃☃ ADMIN ONLY MENU ☃☃☃☃☃☃☃ -->
    <v-menu v-if="isAdmin" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
      </template>
      <v-list>

        <!-- ☃☃☃☃☃☃☃ Manage whitelist/blacklist ☃☃☃☃☃☃☃ -->
        <v-list-item @click="ui.showMemberManager = true">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage members</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- ☃☃☃☃☃☃☃ Export meeting notes ☃☃☃☃☃☃☃ -->
        <v-list-item @click="exportNotes()">
          <v-list-item-icon>
            <v-icon>mdi-file-export</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Export notes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- ☃☃☃☃☃☃☃ Close/open/delete room ☃☃☃☃☃☃☃ -->
        <v-list-item v-if="!room.data.closed" @click="setClosed(true)">
          <v-list-item-icon>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Close room</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="room.data.closed" @click="setClosed(false)">
          <v-list-item-icon>
            <v-icon>mdi-lock-open-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Reopen room</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click="ui.showDelete = true"
          :disabled="!room.data.closed"
          :class="room.data.closed ? 'error--text' : ''"
        >
          <v-list-item-icon>
            <v-icon :color="room.data.closed? 'error' : 'grey'">mdi-delete</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Delete Room</v-list-item-title>
            <v-list-item-subtitle v-if="!room.data.closed" class="grey--text">
              Room must be closed before it can be deleted. This is permanent.
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="room.data.closed" :class="room.data.closed? 'error--text' : ''">
              This is permanent.
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="room.data.retentionLength > 0"
              class="primary--text"
            >
              This room automatically deletes after
              {{ room.data.retentionLength }} days.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="ui.showMemberManager">
      <v-card>
        <v-card-title>
          Manage members
        </v-card-title>

        <v-card-text>
          <p>{{ this.room.displayMembershipType() }}</p>

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
          <v-btn color="primary" @click="ui.showMemberManager = false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="ui.showDelete">
      <v-card>
        <v-card-title>
          Really delete this room?
        </v-card-title>

        <v-card-text>
          <p>Did you remember to export all your notes first?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn outlined @click="ui.showDelete = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteRoom()">
            Yes, Delete forever
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";

import { Feed } from "@/libs/Feed";
import { Room } from "@/libs/Room";
import VEmojiPicker from "v-emoji-picker";
import EmailList from "@/components/EmailList.vue";
import DB from "@/libs/DB";

export default Vue.extend({
  name: "Room",

  props: {
    room: { type: Room, required: true },
    feed: { type: Feed, required: true },
    isAdmin: { type: Boolean, default: false }
  },

  components: {
    VEmojiPicker,
    EmailList
  },

  methods: {
    setClosed(b: boolean) {
      console.log("setClosed", b);
      DB.doc(["rooms", this.room.id]).update({ closed: b });
    },

    saveMemberChanges() {
      console.log("save member changes");
      DB.doc(["rooms", this.room.id]).update({
        whitelist: this.room.data.whitelist,
        blacklist: this.room.data.blacklist
      });
    },

    selectEmoji(emoji: any) {
      console.log("selectEmoji", emoji.data);
      this.ui.showPicker = false;
    },

    deleteRoom() {
      DB.doc(["rooms", this.room.id]).delete();
      this.$router.push({ path: "/" });
    }
  },

  data: () => ({
    ui: {
      showDelete: false,
      isLoading: true,
      showPicker: false,
      showMemberManager: false
    }
  })
});
</script>

<style scoped></style>
