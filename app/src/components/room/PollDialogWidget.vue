<template>
  <v-form
    @submit="createPoll"
    name="pollForm"
    method="POST"
    :value="isValid"
    ref="pollForm"
  >
    <v-dialog
      v-model="value"
      scrollable
      :fullscreen="$vuetify.breakpoint.xsOnly"
      @click:outside="$emit('input', false)"
    >
      <v-card>
        <v-card-title>
          Create a new poll
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Name of poll"
            type="text"
            v-model="poll.title"
            maxlength="150"
            counter
            required
            :rules="rules.title"
          ></v-text-field>

          <v-text-field
            label="Votes per participant"
            v-model="poll.votesPerMember"
            type="number"
            :rules="rules.votesPerMember"
          />

          <v-switch
            v-model="poll.allowWriteIns"
            label="Allow participants to write in choices"
          ></v-switch>

          <v-textarea
            label="Choices (optional)"
            hint="Enter one per line. You can add these later, but you cannot delete them."
            v-model.trim="poll.choiceLabels"
          ></v-textarea>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="accent" text @click="$emit('input', false)">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" @click="createPoll">
            Create now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Room } from "@/libs/Room";

interface CommitEvent {
  title: string;
  allowWriteIns: true;
  votesPerMember: number;
  choiceLabels: string[];
}

export default Vue.extend({
  name: "PollDialogWidget",
  props: {
    value: { type: Boolean, required: true },
    room: { type: Room, required: true }
  },
  methods: {
    createPoll(event) {
      event.preventDefault();

      // Verify the data is valid
      // This ugly bit of code is a result of really strange behavior in Vuetify's form validation
      // https://stackoverflow.com/questions/52109471/typescript-in-vue-property-validate-does-not-exist-on-type-vue-element
      this.isValid = (this.$refs.pollForm as Vue & {
        validate: () => boolean;
      }).validate();
      //this.isValid = this.$refs.pollForm.validate();
      if (!this.isValid) {
        return false;
      }

      // Close the dialog
      this.$emit("input", false);

      // Tell the toolbar to create the poll
      this.$emit(
        "confirm",
        {
          title: this.poll.title,
          allowWriteIns: this.poll.allowWriteIns,
          votesPerMember: this.poll.votesPerMember,
          choiceLabels: this.poll.choiceLabels
            .split("\n")
            .map(s => s.trim())
            .filter(s => !!s)
        } as CommitEvent
      );

      // Reset the form for next usage
      Object.assign(this.poll, {
        title: "",
        votesPerMember: 1,
        allowWriteIns: true
      });
    }
  },
  data: () => ({
    isValid: false,
    poll: {
      title: "",
      votesPerMember: 1,
      allowWriteIns: true,
      choiceLabels: ""
    },
    rules: {
      title: [v => (v && v.length > 0) || "You have to name your poll"],
      votesPerMember: [
        v =>
          (/^[0-9]+$/.test(v) && v > 0) ||
          "Please enter a number greater than zero"
      ]
    }
  })
});
</script>
