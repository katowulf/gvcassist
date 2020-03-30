<template>
  <div>
    <h1>Room {{ roomId }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import toaster from "@/libs/Toaster";

export default Vue.extend({
  name: "Room",

  computed: {
    roomId() {
      return this.$route.params.roomId;
    }
  },

  methods: {
    click: (type: string) => {
      switch(type) {
        case 'error':
          toaster.error(type);
          break;
        case 'warning':
          toaster.warning(type);
          break;
        case 'info':
          toaster.info(type);
          break;
        case 'success':
          toaster.success(type);
          break;
        case 'note':
          toaster.note(type);
          break;
        default:
          console.error('oops');
      }
    }
  },

  data: () => ({})
});
</script>

<style scoped></style>
