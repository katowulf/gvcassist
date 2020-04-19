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
import ChipList from "@/components/ChipList.vue";
import { Chip } from "@/libs/Chip";

const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/gi;

function parseEmails(s) {
  // clean up the email addresses
  const emailList = [...(s || "").matchAll(EMAIL_REGEX)].map(a => a[0]);
  // make the list unique by converting to a set temporarily
  return [...new Set([...emailList])];
}

function joinEmails(list) {
  const spacer = ", ";
  return list.join(spacer);
}

const arrayRemove = function(list, val) {
  const pos = list.indexOf(val);
  if (pos > -1) list.splice(pos, 1);
  return pos > -1;
};

const diffList = function(newList, oldList) {
  // we could reduce this by one iteration by only iterating
  // newList once and storing added and dups at the same time
  return {
    dups: newList.filter(e => oldList.includes(e)),
    added: newList.filter(e => !oldList.includes(e)),
    removed: oldList.filter(e => !newList.includes(e))
  };
};

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
    if (dups.length) this.normal.push("Duplicates: " + joinEmails(dups));
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

export default Vue.extend({
  name: "EmailList",

  components: { ChipList },

  props: {
    label: { type: String, required: true },
    value: { type: Array, required: true },
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
      emails.forEach(e => arrayRemove(this.value, e));
      this.$emit("input", this.value);
    },

    updateChips() {
      const { added, removed } = diffList(
        this.value,
        this.chips.map(c => c.label)
      );
      console.log("updateChips", this.value, added, removed); //debug
      added.forEach(label => this.chips.push(new Chip(label)));
      removed.forEach(label =>
        arrayRemove(
          this.chips,
          this.chips.find((c: Chip) => c.label === label)
        )
      );
    },

    parseEmails() {
      if (!this.unformatted) return;
      const { dups, added } = diffList(
        parseEmails(this.unformatted),
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
