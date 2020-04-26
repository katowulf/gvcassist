<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-toolbar elevation="2" class="roomToolbar">
    <!-- ☃☃☃☃☃☃☃ Menu buttons ☃☃☃☃☃☃☃ -->
    <v-tooltip bottom v-for="(btn, index) in buttons" :key="index">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :disabled="room.data.closed"
          :color="btn.color"
          @click="clicked(btn.type, $event)"
          icon
        >
          <v-icon>{{ btn.icon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ btn.tip }}</span>
    </v-tooltip>

    <!-- ☃☃☃☃☃☃☃ Quick emojis ☃☃☃☃☃☃☃ -->
    <v-btn
      v-for="btn in emoteButtons"
      :key="btn.icon"
      :disabled="room.data.closed"
      :color="btn.color"
      @click="clicked(btn.type, btn.emote)"
      icon
    >
      <v-icon>{{ btn.icon }}</v-icon>
    </v-btn>

    <v-spacer></v-spacer>

    <!-- ☃☃☃☃☃☃☃ Pick an emoji ☃☃☃☃☃☃☃ -->
    <v-menu v-model="ui.showPicker" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" :disabled="room.data.closed">
          <v-icon>mdi-emoticon-outline</v-icon>
        </v-btn>
      </template>
      <VEmojiPicker @select="createEmote($event.data)" />
    </v-menu>

    <!-- ☃☃☃☃☃☃☃ ADMIN DROPDOWN LIST ☃☃☃☃☃☃☃ -->
    <AdminDropdown v-if="isAdmin" :room="room" @action="adminAction" />

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

    <InputDialogWidget
      v-model="ui.input.show"
      :actionLabel="ui.input.actionLabel"
      :inputLabel="ui.input.inputLabel"
      @input="ui.input.show = $event"
      @confirm="ui.input.confirm($event)"
    />
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";

import { EventType, Feed } from "@/libs/Feed";
import { Room } from "@/libs/Room";
import VEmojiPicker from "v-emoji-picker";
import DB from "@/libs/DB";
import AdminDropdown from "@/widgets/AdminDropdown.vue";
import MemberWidget from "@/widgets/MemberWidget.vue";
import DeleteConfirmWidget from "@/widgets/DeleteConfirmWidget.vue";
import InputDialogWidget from "@/widgets/InputDialogWidget.vue";
import toaster from "@/libs/Toaster";
import Util from "@/libs/Util";
import { MenuItems, EmoteItems } from "@/libs/RoomToolbarMenuItems";

type Button = {
  type: EventType;
  icon: string;
  tip: string;
  admin: boolean;
  color: string;
};
type EmoteButton = {
  type: EventType;
  icon: string;
  emote: string;
  color: string;
};

interface VueData {
  ui: {
    input: {
      show: boolean;
      actionLabel: string;
      inputLabel: string;
      confirm: () => void;
    };
    showDelete: boolean;
    isLoading: boolean;
    showPicker: boolean;
    showMemberManager: boolean;
  };
  buttons: Button[];
  emoteButtons: EmoteButton[];
}

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
    DeleteConfirmWidget,
    InputDialogWidget
  },

  created() {
    if (this.isAdmin) {
      // show admin buttons too
      this.buttons = MenuItems.slice(0);
      this.emoteButtons = [];
    }
  },

  methods: {
    clicked(type: EventType, event: any) {
      switch (type) {
        case EventType.question:
          return this.showInput("Post question", "What's your question?", q =>
            this.createQuestion(q)
          );
        case EventType.link:
          return this.showInput("Share link", "Enter a valid URL", u =>
            this.createLink(u)
          );
        case EventType.emote:
          return this.createEmote(event);
        // todo
        // todo
        // todo
        // todo
        // case EventType.poll:
        // case EventType.wait:
        // case EventType.afk:
        default:
          console.log("I don't know how to process this yet", type, event);
      }
    },

    createQuestion(q) {
      if (q) this.feed.add(EventType.question, q);
    },

    createLink(url) {
      if (!Util.isValidUrl(url)) {
        toaster.error("Invalid URL: " + url);
      } else {
        this.feed.add(EventType.link, url);
      }
    },

    createEmote(emoji) {
      console.log("createEmote", emoji);
      this.feed.add(EventType.emote, emoji);
      this.ui.showPicker = false;
    },

    showInput(
      actionLabel: string,
      inputLabel: string,
      handler: (event: any) => void
    ) {
      this.$set(this.ui.input, "actionLabel", actionLabel);
      this.$set(this.ui.input, "inputLabel", inputLabel);
      this.$set(this.ui.input, "confirm", handler);
      this.$set(this.ui.input, "show", true);
    },

    adminAction(event) {
      console.log("adminaction", event);
      switch (event) {
        case "close":
          return this.setClosed(true);
        case "notes":
          return this.exportNotes();
        case "open":
          return this.setClosed(false);
        case "delete":
          this.ui.showDelete = true;
          return;
        case "members":
          this.ui.showMemberManager = true;
          return;
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

  data: () =>
    ({
      ui: {
        input: {
          show: false,
          actionLabel: "-not set-",
          inputLabel: "-not set-",
          confirm: () => {
            /* */
          }
        },
        showDelete: false,
        isLoading: true,
        showPicker: false,
        showMemberManager: false
      },
      buttons: MenuItems.filter(m => !m.admin), // exclude admin by default
      emoteButtons: EmoteItems
    } as VueData)
});
</script>

<style scoped>
.roomToolbar .theme--light.v-card {
  color: rgb(0, 0, 0);
}
</style>
