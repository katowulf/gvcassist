<template>
  <v-dialog v-model="value" @click:outside="$emit('input', false)">
    <v-card>
      <!-- This empty title is necessary for spacing or the modal layer overlaps :( -->
      <v-card-title></v-card-title>

      <v-card-text>
        <v-text-field
          :label="inputLabel"
          v-model="inputValue"
          filled
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="
            $emit('input', false);
            $emit('confirm', inputValue);
          "
        >
          {{ actionLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputDialogWidget",
  props: {
    value: { type: Boolean, required: true },
    inputLabel: { type: String, required: true },
    actionLabel: { type: String, required: true }
  },
  watch: {
    value() {
      this.inputValue = "";
    }
  },
  data: () => ({
    inputValue: ""
  })
});
</script>
