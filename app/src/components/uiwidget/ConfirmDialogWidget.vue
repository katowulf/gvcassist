<!--
    Shows a modal dialog that has an optional cancel and an action button. If the action button
    is triggered, will emit a "confirm" action. Otherwise, the dialog is dismissed silently (canceled)
-->
<template>
  <v-dialog
    v-model="value"
    :persistent="isPersistent"
    @click:outside="isPersistent || $emit('input', false)"
  >
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

  computed: {
    // For some reason, updates to the persistent property in the parent
    // aren't getting transferred into this child component. So if the
    // dialog is opened with persistent == false and then reopened with
    // persistent == true, the persistent flag stays false. But a computed
    // property seems to solve it.
    isPersistent() {
      return this.persistent;
    }
  },

  props: {
    // This is a boolean that tells whether the dialog is visible. Changing it to true in the parent
    // will make the dialog appear if hidden. It's automatically updated here when the dialog is
    // dismissed.
    value: { type: Boolean, required: true },

    // This is the header of the dialog
    title: { type: String, required: true },

    // An optional body message for the dialog.
    message: { type: String, required: false },

    // This is the text that appears in the action button.
    action: { type: String, required: true },

    // Set the color of the action button. Defaults to red.
    buttonColor: { type: String, default: "error" },

    // If false, the cancel button will not appear. Generally, this would be
    // used with persistent=true to create a modal that must be acknowledged.
    showCancel: { type: Boolean, default: true },

    // If true, one cannot click outside the modal to close it. One has to select
    // either the cancel or the action button to make the modal go away.
    persistent: { type: Boolean, default: false }
  }
});
</script>
