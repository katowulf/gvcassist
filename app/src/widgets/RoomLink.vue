<template>
  <router-link class="roomLink" :to="`/room/${room.$id}`">
    <v-icon small color="primary">mdi-account-multiple</v-icon
    >{{ room.description || room.$id }}
  </router-link>
</template>

<script lang="ts">
export default {
  name: "UserAvatar",
  props: ["room"],
  data: () => ({})
};
</script>

<style scoped>
a.roomLink {
  text-decoration: none;
  display: inline-block;
  margin-right: 10px;
}

a.roomLink i {
  margin-right: 4px;
}
</style>
