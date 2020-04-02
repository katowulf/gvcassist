<template>
  <v-card color="blue lighten-5" class="loading">
    <v-card-text class="loading">
      <v-progress-circular
        :size="70"
        :width="7"
        color="indigo lighten-4"
        indeterminate
      ></v-progress-circular>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: "LoadingCard",
  data: () => ({})
};
</script>
