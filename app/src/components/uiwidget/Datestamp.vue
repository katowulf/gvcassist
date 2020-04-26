<template>
  <span>{{ ts }}</span>
</template>

<script lang="ts">
import Vue from "vue";
import moment = require("moment");
export default Vue.extend({
  name: "Datestamp",
  props: { time: { type: Date, required: true } },
  computed: {
    ts() {
      console.log("ts()", this.time); //debug
      return moment(this.time).fromNow();
    }
  }
});
</script>
