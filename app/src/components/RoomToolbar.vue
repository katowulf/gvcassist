<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-toolbar elevation="2">

    <!-- ☃☃☃☃☃☃☃ Menu buttons ☃☃☃☃☃☃☃ -->
    <v-tooltip bottom v-for="(btn,index) in buttons" :key="index">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" :disabled="room.data.closed" :color="btn.color" @click="clicked(btn.type, $event)" icon>
          <v-icon>{{btn.icon}}</v-icon>
        </v-btn>
      </template>
      <span>{{btn.tip}}</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <!-- ☃☃☃☃☃☃☃ Pick an emoji ☃☃☃☃☃☃☃ -->
    <v-menu v-model="ui.showPicker" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" :disabled="room.data.closed">
          <v-icon>mdi-emoticon-outline</v-icon>
        </v-btn>
      </template>
      <VEmojiPicker @select="createEmote" />
    </v-menu>

    <!-- ☃☃☃☃☃☃☃ ADMIN DROPDOWN LIST ☃☃☃☃☃☃☃ -->
    <AdminDropdown
        v-if="isAdmin"
        :room="room"
        @action="adminAction"
    />

    <MemberWidget
      v-model="ui.showMemberManager"
      :room="room"
      @input="ui.showMemberManager = $event"
      @update="saveMemberChanges()"
      />

    <DeleteConfirmWidget
      v-model="ui.showDelete"
      title="Really delete this room?"
      message="Did you remember to export all your notes first?"
      action="Yes, Delete forever"
      @confirm="deleteRoom()"
      />
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";

import {EventType, Feed, ColorMap} from "@/libs/Feed";
import { Room } from "@/libs/Room";
import VEmojiPicker from "v-emoji-picker";
import DB from "@/libs/DB";
import AdminDropdown from "@/widgets/AdminDropdown.vue";
import MemberWidget from "@/widgets/MemberWidget.vue";
import DeleteConfirmWidget from "@/widgets/DeleteConfirmWidget.vue";

const MenuItems = [
  // Ask a question
  {type: EventType.question, icon: "mdi-help", tip: "Ask a question", admin: false, color: ColorMap.get(EventType.question)},

  // Share a link
  {type: EventType.link, icon: "mdi-link", tip: "Add a link", admin: false, color: ColorMap.get(EventType.link)},

  // Create a poll (admin only)
  {type: EventType.poll, icon: "mdi-poll-box", tip: "Create a poll", admin: true, color: ColorMap.get(EventType.poll)},

  // Wait for everyone (admin only)
  {type: EventType.wait, icon: "mdi-timer-outline", tip: "Wait for ack from everyone", admin: true, color: ColorMap.get(EventType.wait)},

  // Thumbsup
  {type: EventType.thumbsup, icon: "mdi-thumb-up", tip: "Agree and +1 the discussion", admin: false, color: ColorMap.get(EventType.thumbsup)},

  // AFK
  {type: EventType.afk, icon: "mdi-timer-sand-full", tip: "Agree and +1 the discussion", admin: false, color: ColorMap.get(EventType.afk)}
];

console.log('Menuitems', MenuItems);

export default Vue.extend({
  name: "Room",

  props: {
    room: { type: Room, required: true },
    feed: { type: Feed, required: true },
    isAdmin: { type: Boolean, default: false }
  },

  components: {
    VEmojiPicker,
    AdminDropdown,
    MemberWidget,
    DeleteConfirmWidget
  },

  created() {
    this.buttons = this.isAdmin? MenuItems : MenuItems.filter(m => !m.admin);
  },

  methods: {
    clicked(type: EventType, event: any) {
      switch(type) {
        case EventType.question: return this.createQuestion();
        case EventType.link: return this.createLink();
        case EventType.emote: return this.createEmote(event);
        default:
          console.log("I don't know how to process this yet", type, event);
      }
    },

    createQuestion() {
      const q = window.prompt("What's the question?");
      if( q ) {
        this.feed.add(EventType.question, q);
      }
    },

    createLink() {
      const url = window.prompt("Enter the URL");
      if( url ) {
        this.feed.add(EventType.link, url);
      }
    },

    createEmote(emoji) {
      this.feed.add(EventType.emote, emoji.data);
      this.ui.showPicker = false;
    },

    adminAction(event) {
      console.log('adminaction', event);
      switch(event) {
        case 'members':
          this.ui.showMemberManager = true;
          break;
        case 'notes':
          this.exportNotes();
          break;
        case 'close':
          this.setClosed(true);
          break;
        case 'open':
          this.setClosed(false);
          break;
        case 'delete':
          this.ui.showDelete = true;
          break;
        default:
          throw new Error("Unknown admin action: " + event);
      }
    },

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

    exportNotes() {
      console.log("I don't know how to export notes yet :(");
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
      showMemberManager: false,
      buttons: []
    }
  })
});
</script>

<style scoped></style>
