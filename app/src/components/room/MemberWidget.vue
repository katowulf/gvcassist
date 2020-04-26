<template>
  <v-dialog v-model="value" @click:outside="$emit('input', false)">
    <v-card>
      <v-card-title>
        Manage members
      </v-card-title>

      <v-card-text>
        <p>{{ room.displayMembershipType() }}</p>

        <EmailList
          v-model="room.data.whitelist"
          @input="$emit('update')"
          label="Whitelisted members"
        />

        <EmailList
          v-model="room.data.blacklist"
          @input="$emit('update')"
          label="Blacklisted members"
        />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('input', false)">
          Done
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Room } from "@/libs/Room";
import EmailList from "@/components/uiwidget/EmailList.vue";

export default Vue.extend({
  name: "MemberWidget",
  components: { EmailList },
  props: {
    value: { type: Boolean, required: true },
    room: { type: Room, required: true }
  }
});
</script>
