<template>
  <div>
    <h3>{{ label }}</h3>
    <ChipList :chips="chips" @removed="removeEmail($event)" />

    <v-text-field
      :label="'Add ' + label"
      error-count="5"
      :messages="messages.normal"
      :success-messages="messages.success"
      :error-messages="messages.error"
      v-model.trim="unformatted"
      solo
      dense
      prepend-icon="mdi-email-plus"
      @change="parseEmails"
      @click="parseEmails"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ChipList from "@/components/uiwidget/ChipList.vue";
import { Chip } from "@/libs/Chip";
import Util from "@/libs/Util";

class MessageBuilder {
  private timeout = 0;
  public normal: string[] = [];
  public error: string[] = [];
  public success: string[] = [];

  build(added, dups) {
    this.normal = [];
    this.error = [];
    this.success = [];
    if (!added.length && !dups.length) {
      this.error.push("No valid email addresses.");
    }
    if (added.length) this.success.push(`Added ${added.length} emails.`);
    if (dups.length) this.normal.push("Duplicates: " + dups.join(", "));
  }

  enqueue(vue) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.normal = [];
      this.success = [];
      this.error = [];
      vue.$set(vue.messages, this);
    }, 5000);
  }
}

interface VueData {
  unformatted: string;
  chips: Chip[];
  messages: MessageBuilder;
}

type Values = string[];

export default Vue.extend({
  name: "EmailList",

  components: { ChipList },

  props: {
    label: { type: String, required: true },
    // Type casting props is tricky. See this blog post
    // https://frontendsociety.com/using-a-typescript-interfaces-and-types-as-a-prop-type-in-vuejs-508ab3f83480
    value: { type: Array as () => string[], required: true },
    color: { type: String, default: "indigo" }
  },

  watch: {
    value() {
      this.updateChips();
    }
  },

  created() {
    this.updateChips();
  },

  methods: {
    removeEmail(emails) {
      Util.arrayRemove(this.value, ...emails);
      this.$emit("input", this.value);
    },

    updateChips() {
      const { added, removed } = Util.diffLists<string>(
        this.value,
        this.chips.map(c => c.label)
      );
      added.forEach(label => this.chips.push(new Chip(label)));
      const removedChips = this.chips.filter((c: Chip) =>
        removed.includes(c.label)
      );
      Util.arrayRemove(this.chips, ...removedChips);
    },

    parseEmails() {
      if (!this.unformatted) return;
      const { dups, added } = Util.diffLists<string>(
        Util.parseEmails(this.unformatted),
        this.value
      );
      if (added.length > 0) {
        this.value.push(...added);
        this.$emit("input", this.value);
      }
      this.messages.build(added, dups);
      this.messages.enqueue(this);
      this.unformatted = "";
    }
  },

  data: () =>
    ({
      unformatted: "",
      chips: [],
      messages: new MessageBuilder()
    } as VueData)
});
</script>
