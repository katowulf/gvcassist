<template>
  <v-dialog v-model="value" :persistent="isPersistent" @click:outside="isPersistent || $emit('input', false)">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>

      <v-card-text v-if="message">
        <p>{{ message }}</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if="showCancel" outlined @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn :color="buttonColor" @click="$emit('confirm')">
          {{ action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmDialogWidget",

  // props: { persistent: { type: Boolean, default: false } },

  // created() { console.log('confirmdialog', this.persistent); }, //debug

  computed: {
    // For some reason, updates to the persistent property in the parent
    // aren't getting transferred into this child component. So if the
    // dialog is opened with persistent == false and then reopened with
    // persistent == true, the persistent flag stays false. But a computed
    // property seems to solve it.
    isPersistent() { return this.persistent }
  },

  props: {
    value: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, required: false },
    action: { type: String, required: true },
    buttonColor: { type: String, default: "error" },
    showCancel: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false }
  }
});
</script>
