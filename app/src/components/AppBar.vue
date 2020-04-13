<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />
    </div>

    <v-spacer></v-spacer>

    <v-btn text to="/"><v-icon left>mdi-home</v-icon> Home</v-btn>
    <v-btn text to="/about"><v-icon left>mdi-information-outline</v-icon> About</v-btn>

    <NavMenuUserIcon />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import NavMenuUserIcon from "@/widgets/NavMenuUserIcon.vue";

export default Vue.extend({
  name: "AppBar",

  components: { NavMenuUserIcon },

  data: () => ({})
});
</script>
