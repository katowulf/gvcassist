<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml"
          xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
      shaped
      dense
      :loading="poll.isLoading ? 'warning' : false"
      :color="card.ui.color"
      dark
  >
    <v-card-text>
      <v-list :color="card.ui.color">
        <v-list-group value="true" color="white">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="title font-weight-light">
                {{ card.text }} ({{ poll.totalVotes }} vote{{
                poll.totalVotes === 1 ? "" : "s"
                }})
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="choice in poll.choices" :key="choice.id">
            <v-list-item-icon @click="vote(choice)">
              <v-icon :color="true? 'lime' : 'white'">
                {{
                true
                ? "mdi-check-circle"
                : "mdi-check-circle-outline"
                }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{choice.text}} ({{choice.votes}})</v-list-item-title>
            </v-list-item-content>

            <!--<v-list-item-action>-->
              <!--<v-btn icon @click="deleteChoice(choice.id)">-->
                <!--<v-icon color="green lighten-3">mdi-delete</v-icon>-->
              <!--</v-btn>-->
            <!--</v-list-item-action>-->
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-form v-if="poll.allowAdd" @submit="addChoice">
                <v-text-field v-model="choiceInput" label="Add a choice"></v-text-field>
              </v-form>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card-text>
    <CardActions
        :card="card"
        :isAdmin="isAdmin"
        :isClosed="isClosed"
        :showAvatar="false"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import CardActions from "@/components/room/eventcard/CardActions.vue";

export default Vue.extend({
  name: "EventWidgetPoll",
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { CardActions },
  methods: {
    vote(choice) {
      choice.votes += 1;
      this.poll.totalVotes += 1;
      this.poll.totalPercent = 0;
      this.poll.choices.forEach(c => {
        c.percent = Math.round((c.votes / this.poll.totalVotes)*1000)/10;
        this.poll.totalPercent += c.percent;
      });
    },

    addChoice(event) {
      event.preventDefault();
      if( this.choiceInput ) {
        const num = this.poll.choices.length;
        this.poll.choices.push({
          id: `c${num}`, text: this.choiceInput, votes: 0, percent: 0
        });
        this.choiceInput = "";
      }
      return false;
    }
  },
  data: () => ({
    choiceInput: "",
    poll: {
      totalVotes: 10,
      totalPercent: 100,
      allowAdd: true,
      choices: [
        {id: 'c1', text: 'choice 1', votes: 7, percent: 70},
        {id: 'c2', text: 'choice 2', votes: 1, percent: 10},
        {id: 'c3', text: 'choice 3', votes: 2, percent: 20},
        {id: 'c4', text: 'choice 4', votes: 0, percent: 0}
      ]
    }
  })
});
</script>
