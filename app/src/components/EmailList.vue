<template>
  <div>
    <h3>{{label}}</h3>
    <ChipList
        :chips="chips"
        @removed="removeEmail($event)"
      />

    <v-text-field
        :label="'Add ' + label"
        error-count="5"
        :messages="messages.normal"
        :success-messages="messages.success"
        :error-messages="messages.error"
        v-model.trim="unformatted"
        solo dense
        append-icon="mdi-email-plus"
        @change="parseEmails"
        @click="parseEmails"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ChipList from "@/components/ChipList.vue";
import {Chip} from "@/libs/Chip";

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
  if( pos > -1 ) list.splice(pos, 1);
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
  private timeout = -1;
  public normal = [];
  public error = [];
  public success = [];

  build(added, dups) {
    this.normal = [];
    this.error = [];
    this.success = [];
    if( !added.length && !dups.length) {
      this.error.push("No valid email addresses.");
    }
    if( added.length ) this.success.push(`Added ${added.length} emails.`);
    if( dups.length ) this.normal.push("Duplicates: " + joinEmails(dups));
  }

  enqueue(vue) {
    if( this.timeout ) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.normal = [];
      this.success = [];
      this.error = [];
      vue.$set(vue.messages, this);
    }, 5000);
  }
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
    value() { this.updateChips(); }
  },

  created() { this.updateChips(); },

  methods: {
    removeEmail(emails) {
      emails.forEach(e => arrayRemove(this.value, e));
      this.$emit('input', this.value);
    },

    updateChips() {
      const {added, removed} = diffList(this.value, this.chips.map(c => c.label));
      console.log('updateChips', this.value, added, removed); //debug
      added.forEach(label => this.chips.push(new Chip(label)));
      removed.forEach(label => arrayRemove(this.chips, this.chips.find(c => c.label === label)));
    },

    parseEmails() {
      if( !this.unformatted ) return;
      const {dups, added} = diffList(parseEmails(this.unformatted), this.value);
      if( added.length > 0 ) {
        this.value.push(...added);
        this.$emit('input', this.value);
      }
      this.messages.build(added, dups);
      this.messages.enqueue(this);
      this.unformatted = "";
    },

    // /**
    //  * When pasting emails, we want to quickly remove dups and clean up the formatting.
    //  * Trying to use window.getSelection() and to insert the reformatted text back into
    //  * the correct point in the UI didn't work with Vuetify (breaks the UI). So I settled
    //  * for this compromise; let the browser do the paste logic, wait one tick,
    //  * then immediately reformat the text field. It creates a flash of the unformatted text,
    //  * but it's usually too short to see.
    //  *
    //  * I'm not sure exactly why this works as is, since it _should_ need to trigger
    //  * change detection with something like `this.set(this.createForm, "whitelist", emails)`;
    //  * indeed, when I set the values directly in the setTimeout() it failed to update the
    //  * UI. But calling a different method in setTimeout() seems to work okay? So be it. Perhaps
    //  * calling any function in the `methods` map triggers the change detection, too. Would
    //  * be interesting to learn more about that some day and update this.
    //  */
    // pastedEmails(/*event*/) {
    //   // console.log("pastedEmails", this.unformattedList);
    //   setTimeout(() => this.parseEmails());
    //   return true;
    // }
  },

  data: () => ({
    unformatted: "",
    chips: [],
    timeout: null,
    messages: new MessageBuilder()
  })
});

</script>


