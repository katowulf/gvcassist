<template>
  <v-chip-group
    column
    active-class="error"
    multiple
    @change="updateSelectedChips($event)"
  >
    <v-chip
      small
      v-for="(chip, index) in chips"
      :key="index"
      :color="chip.color"
      :text-color="chip.textColor"
    >
      {{ chip.label }}
      <v-icon v-if="chip.icon" right :color="chip.color + ' lighten-4'">
        {{ chip.icon }}
      </v-icon>
    </v-chip>
    <v-btn
      icon
      color="error"
      v-if="chips.length > 0"
      @click="remove()"
      :disabled="selectedChips.length === 0"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-chip-group>
</template>

<script lang="ts">
import Vue from "vue";
import { Chip } from "@/libs/Chip";

interface VueData {
  selectedChips: string[];
}

export default Vue.extend({
  name: "ChipList",
  props: {
    // Type casting props is tricky. See this blog post
    // https://frontendsociety.com/using-a-typescript-interfaces-and-types-as-a-prop-type-in-vuejs-508ab3f83480
    chips: { type: Array as () => Chip[], required: true }
  },

  methods: {
    remove() {
      if (this.selectedChips.length > 0) {
        this.$emit("removed", this.selectedChips);
      }
    },

    updateSelectedChips(list: number[]): void {
      this.selectedChips = this.chips
        .filter((c, i) => list.includes(i))
        .map((c: Chip) => c.label);
    }
  },

  data() {
    return { selectedChips: [] } as VueData;
  }
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
