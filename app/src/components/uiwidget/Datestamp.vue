<template>
  <span>{{ humanTime }}</span>
</template>

<script lang="ts">
import Vue from "vue";
import moment = require("moment");
export default Vue.extend({
  name: "Datestamp",
  props: { time: { type: Date, required: true } },

  created() {
    this.update();
  },

  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout);
  },

  methods: {
    wait() {
      this.timeout = setTimeout(() => this.update(), 30000);
    },
    update() {
      // Force a refresh so our timestamp updates on a regular interval.
      // We can't do this as a computed property unfortunately because it's
      // cached and will only be triggered when the evaluated properties are altered.
      // So setInterval() and manually trigger change detection FTW!
      this.setTime();
      this.wait();
    },
    setTime() {
      this.$set(this, "humanTime", moment(this.time).fromNow());
    }
  },

  data: () => ({ humanTime: "", timeout: 0 })
});
</script>
