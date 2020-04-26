<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <v-btn
    x-small
    text
    dense
    :color="copyButtonColor"
    v-clipboard:copy="value"
    v-clipboard:success="onCopy"
    v-clipboard:error="onError"
  >
    <v-icon x-small>{{ copyButtonIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import toaster from "@/libs/Toaster";

export default Vue.extend({
  name: "CopyWidget",
  props: { value: { type: String, required: true } },

  methods: {
    onCopy: function(e) {
      console.log("Copied:", e.text);
      this.copyButtonIcon = "mdi-check-bold";
      this.copyButtonColor = "green darken-4";
      setTimeout(() => this.resetButton(), 1000);
    },
    onError: function(e) {
      toaster.error(e);
    },
    resetButton() {
      this.copyButtonIcon = "mdi-content-copy";
      this.copyButtonColor = "";
    }
  },

  data: () => ({
    copyButtonIcon: "mdi-content-copy",
    copyButtonColor: ""
  })
});
</script>
