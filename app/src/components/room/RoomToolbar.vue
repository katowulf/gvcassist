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

    <ConfirmDialogWidget
      v-model="ui.confirm.show"
      :title="ui.confirm.title"
      :message="ui.confirm.message"
      :action="ui.confirm.action"
      @input="ui.confirm.show = !!$event"
      @confirm="ui.confirm.handler($event)"
      :showCancel="ui.confirm.showCancel"
      :persistent="ui.confirm.persistent"
    />

    <InputDialogWidget
      v-model="ui.input.show"
      :actionLabel="ui.input.actionLabel"
      :inputLabel="ui.input.inputLabel"
      @input="ui.input.show = !!$event"
      @confirm="ui.input.confirm($event)"
    />
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";

import {EventType, Feed, FeedEvent} from "@/libs/Feed";
import { Room } from "@/libs/Room";
import VEmojiPicker from "v-emoji-picker";
import DB from "@/libs/DB";
import MemberWidget from "@/components/room/MemberWidget.vue";
import ConfirmDialogWidget from "@/components/uiwidget/ConfirmDialogWidget.vue";
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
    confirm: {
      show: boolean,
      title: string,
      message: string,
      action: string,
      confirm: () => void,
      color: string,
      showCancel: boolean,
      persistent: boolean
    };
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
    isAdmin: { type: Boolean, required: true }
  },

  components: {
    VEmojiPicker,
    MemberWidget,
    ConfirmDialogWidget,
    InputDialogWidget,
    RoomToolbarDropdown
  },

  created() {
    console.log('created'); //debug
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
        case EventType.poll:
          return this.createPoll(); //todo
        // case EventType.wait:
        case EventType.afk:
          return this.createAfk();
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
      this.$set(this.ui, 'input', {
        actionLabel: actionLabel,
        inputLabel: inputLabel,
        confirm: handler,
        show: true
      });
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
          return this.showDeleteDialog();
        case "members":
          this.ui.showMemberManager = true;
          return;
        default:
          this.clicked(event.type, event.data);
      }
    },

    showDeleteDialog() {
      this.$set(this.ui, 'confirm', {
        show: true,
        title: "Really delete this room?",
        message: "Did you remember to export all your notes first?",
        action: "Yes, Delete forever",
        handler: () => this.deleteRoom(),
        color: "error",
        showCancel: true,
        persistent: false
      });
    },

    createPoll() {
      this.feed.add(EventType.poll, "Poll");
    },

    createAfk() {
      this.feed.add(EventType.afk, 'away').then((event: FeedEvent) => {
        return this.$set(this.ui, 'confirm', {
          show: true,
          title: "You are currently away",
          message: "",
          action: "Mark me back!",
          handler: () => {
            event.setText('returned');
            event.save();
            this.$set(this.ui.confirm, 'show', false);
          },
          color: "primary",
          showCancel: false,
          persistent: true
        });
      });
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
    console.log('data', this.isAdmin, allButtons); //debug
    return {
      ui: {
        input: {
          show: false,
          actionLabel: "-not set-",
          inputLabel: "-not set-",
          color: "error",
          confirm: () => {
            /* */
          }
        },
        confirm: {
          show: false,
          title: "",
          message: "",
          action: "",
          confirm: () => { /* */ },
          color: "",
          showCancel: true,
          persistent: false
        },
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
