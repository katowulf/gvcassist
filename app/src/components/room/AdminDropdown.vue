<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
    </template>
    <v-list>
      <!-- ☃☃☃☃☃☃☃ Manage whitelist/blacklist ☃☃☃☃☃☃☃ -->
      <v-list-item @click="$emit('action', 'members')">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Manage members</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- ☃☃☃☃☃☃☃ Export meeting notes ☃☃☃☃☃☃☃ -->
      <v-list-item @click="$emit('action', 'notes')">
        <v-list-item-icon>
          <v-icon>mdi-file-export</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Export notes</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- ☃☃☃☃☃☃☃ Close/open/delete room ☃☃☃☃☃☃☃ -->
      <v-list-item v-if="!room.data.closed" @click="$emit('action', 'close')">
        <v-list-item-icon>
          <v-icon>mdi-lock</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Close room</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="room.data.closed" @click="$emit('action', 'open')">
        <v-list-item-icon>
          <v-icon>mdi-lock-open-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Reopen room</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        @click="$emit('action', 'delete')"
        :disabled="!room.data.closed"
        :class="room.data.closed ? 'error--text' : ''"
      >
        <v-list-item-icon>
          <v-icon :color="room.data.closed ? 'error' : 'grey'">
            mdi-delete
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Delete Room</v-list-item-title>
          <v-list-item-subtitle v-if="!room.data.closed" class="grey--text">
            Room must be closed before it can be deleted. This is permanent.
          </v-list-item-subtitle>
          <v-list-item-subtitle
            v-if="room.data.closed"
            :class="room.data.closed ? 'error--text' : ''"
          >
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
</template>

<script lang="ts">
import Vue from "vue";
import { Room } from "@/libs/Room";

export default Vue.extend({
  name: "AdminDropdown",
  props: {
    room: { type: Room, required: true }
  }
});
</script>
