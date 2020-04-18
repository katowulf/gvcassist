<template>
  <v-chip-group column active-class="error" multiple @change="updateSelectedChips($event)">
    <v-chip
        small
        v-for="(chip, index) in chips"
        :key="index"
        :color="chip.color"
        :text-color="chip.textColor"
    >
      {{chip.label}}
      <v-icon v-if="chip.icon" right :color="chip.color + ' lighten-4'">{{chip.icon}}</v-icon>
    </v-chip>
    <v-btn icon v-if="chips.length > 0" @click="remove()">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-chip-group>
</template>

<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    name: 'ChipList',
    props: {
      chips: { type: Array, required: true }
    },

    methods: {
      remove() {
        if( this.selectedChips.length > 0 ) {
          this.$emit("removed", this.selectedChips);
        }
      },

      updateSelectedChips(list) {
        this.selectedChips = this.chips.filter((c, i) => list.includes(i)).map(c => c.label);
      }
    },

    data() { return {selectedChips: []} }
  });
</script>

<style scoped>
  div.chips {
    margin: 4px 0;
  }

  div.chips .v-chip {
    margin-right: 3px;
  }
</style>