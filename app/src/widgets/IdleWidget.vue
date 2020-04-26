<template>
  <v-card width="100%" class="IdleCard">
    <v-card-text>
      <h2 class="text-center font-weight-light">{{ idleText }}</h2>
      <!--
        This interesting construct is the only way to use dynamic src tags. Otherwise,
        even when specifying a valid path, they don't work. In fact, the concatenation
        of the directory here is absolutely necessary, as is the require.
        Read more here:
      -->
      <v-img width="100%" :src="require('../assets/' + idleImg)" />
      <p class="text-center">
        <small class="grey--text">
          Image provided royalty free by
          <a
            href="https://cliply.co/tag/gray-roundness-collection/"
            target="_blank"
          >
            Cliply.co
          </a>
        </small>
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import IdleManager from "../libs/IdleManager";

export default Vue.extend({
  name: "IdleWidget",
  data: () => ({
    idleImg: IdleManager.image(),
    idleText: IdleManager.text()
  })
});
</script>

<style scoped>
.IdleCard {
  opacity: 0.4;
}
</style>
