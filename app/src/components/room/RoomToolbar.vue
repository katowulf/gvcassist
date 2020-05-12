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
          :class="buildCollapseCss(btn.collapse)"
          icon
        >
          <v-icon>{{ btn.icon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ btn.tip }}</span>
    </v-tooltip>

    <!--
      ☃☃☃☃☃☃☃ Quick emojis ☃☃☃☃☃☃☃
      Quick emojis also appear in the emoji menu, so they do not get
      shown in the dropdown when collapsed (they are already in a dropdown)
      todo: make this show the most frequently used list instead
    -->
    <v-btn
      v-for="btn in emoteButtons"
      :key="btn.emote"
      :disabled="room.data.closed"
      :class="buildCollapseCss(btn.collapse, false, 'emoji')"
      @click="clicked(btn.type, btn.emote)"
      icon
    >
      {{ btn.emote }}
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

    <!-- ☃☃☃☃☃☃☃ DROPDOWN LIST ☃☃☃☃☃☃☃ -->
    <RoomToolbarDropdown
      :isAdmin="isAdmin"
      :room="room"
      :collapsibleButtons="collapsibleButtons"
      @action="toolbarAction"
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
import MemberWidget from "@/components/room/MemberWidget.vue";
import DeleteConfirmWidget from "@/components/uiwidget/DeleteConfirmWidget.vue";
import InputDialogWidget from "@/components/uiwidget/InputDialogWidget.vue";
import toaster from "@/libs/Toaster";
import Util from "@/libs/Util";
import {
  MenuItems,
  EmoteItems,
  ButtonProps
} from "@/libs/RoomToolbarMenuItems";
import RoomToolbarDropdown from "@/components/room/RoomToolbarDropdown.vue";

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
  buttons: ButtonProps[];
  emoteButtons: ButtonProps[];
  collapsibleButtons: ButtonProps[];
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
    MemberWidget,
    DeleteConfirmWidget,
    InputDialogWidget,
    RoomToolbarDropdown
  },

  methods: {
    clicked(type: EventType, event: any) {
      switch (type) {
        case EventType.question:
          return this.showInput("Post question", "What's your question?", q => {
            if (q) this.feed.add(EventType.question, q);
          });
        case EventType.link:
          return this.showInput("Share link", "Enter a valid URL", u =>
            this.createLink(u)
          );
        case EventType.emote:
          return this.createEmote(event);
        case EventType.todo:
          return this.showInput(
            "Create a todo list",
            "Name of todo list",
            title => {
              this.feed.add(EventType.todo, title || null);
            }
          );
        // case EventType.poll:
        // case EventType.wait:
        // case EventType.afk:
        default:
          console.log("I don't know how to process this yet", type, event);
      }
    },

    createLink(url) {
      // todo this could be in the form validation and provide more immediate feedback
      if (!Util.isValidUrl(url)) {
        toaster.error("Invalid URL: " + url);
      } else {
        this.feed.add(EventType.link, url);
      }
    },

    createEmote(emoji) {
      console.log("createEmote", emoji);
      this.feed.addReaction(emoji);
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

    toolbarAction(event) {
      switch (event.type) {
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
          this.clicked(event.type, event.data);
      }
    },

    buildCollapseCss(
      collapsible: boolean,
      isDropdown = false,
      additionalCss = ""
    ) {
      let s = "";
      if (collapsible) {
        s = isDropdown ? "hidden-sm-and-up" : "hidden-xs-only";
      }
      return s && additionalCss ? s + " " + additionalCss : s || additionalCss;
    },

    setClosed(b: boolean) {
      console.log("setClosed", b);
      DB.room(this.room.id).update({ closed: b });
    },

    saveMemberChanges() {
      console.log("save member changes");
      DB.room(this.room.id).update({
        whitelist: this.room.data.whitelist,
        blacklist: this.room.data.blacklist
      });
    },

    exportNotes() {
      console.log("I don't know how to export notes yet :(");
    },

    deleteRoom() {
      DB.room(this.room.id).delete();
      this.$router.push({ name: "Home" });
    }
  },

  data() {
    const allButtons = this.isAdmin
      ? MenuItems
      : MenuItems.filter(b => !b.admin);
    const buttons = allButtons.filter(b => !b.menuOnly);
    const emoteButtons = this.isAdmin ? [] : EmoteItems;
    const collapsibleButtons = allButtons.filter(b => b.collapse || b.menuOnly);
    return {
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
      buttons: buttons,
      emoteButtons: emoteButtons,
      collapsibleButtons: collapsibleButtons
    } as VueData;
  }
});
</script>

<style scoped>
.roomToolbar .theme--light.v-card {
  color: rgb(0, 0, 0);
}

.roomToolbar button.emoji {
  font-size: 18px;
  color: rgb(0, 0, 0);
}
</style>
