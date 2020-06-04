<template
  xmlns:v-clipboard="http://www.w3.org/1999/xhtml"
  xmlns:v-slot="http://www.w3.org/1999/XSL/Transform"
>
  <v-card
    dense
    :loading="isLoading ? 'warning' : false"
    :color="card.ui.color"
    dark
  >
    <v-card-text>
      <v-list :color="card.ui.color">
        <v-list-group value="true" color="white">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="title font-weight-light">
                {{ poll.title }} ({{ totalVotes }} vote{{
                  totalVotes === 1 ? "" : "s"
                }})
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-title
              :class="noVotesLeft ? 'success' : 'yellow--text'"
            >
              I have placed {{ myVotes.length }} of
              {{ poll.votesPerMember }} votes.
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-for="choice in choices" :key="choice.id">
            <v-list-item-icon
              @click="isClosed || poll.closed || toggleVote(choice)"
            >
              <v-icon
                :color="
                  hasMyVote(choice.id)
                    ? 'green darken-4'
                    : noVotesLeft
                    ? 'cyan lighten-3'
                    : 'white'
                "
              >
                {{
                  hasMyVote(choice.id)
                    ? "mdi-check-circle"
                    : "mdi-check-circle-outline"
                }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content style="position:relative">
              <div
                class="poll-background primary"
                :style="'width:' + choice.percent + '%; z-index:100'"
              ></div>
              <v-list-item-title style="z-index:200">
                {{ choice.title }} ({{ choice.percent }}%,
                {{ choice.voteCount }} votes)
              </v-list-item-title>
            </v-list-item-content>

            <!--<v-list-item-action>-->
            <!--<v-btn icon @click="deleteChoice(choice.id)">-->
            <!--<v-icon color="green lighten-3">mdi-delete</v-icon>-->
            <!--</v-btn>-->
            <!--</v-list-item-action>-->
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-form v-if="isAdmin || poll.allowWriteIns" @submit="addChoice">
                <v-text-field
                  :disabled="isClosed"
                  v-model="choiceInput"
                  label="Add a choice"
                ></v-text-field>
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
import DB from "@/libs/DB";
import firebase from "@/libs/firebase-init";
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import SharedScope from "@/libs/SharedScope";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

type Subscription = () => void;
interface Choice {
  id: string;
  title: string;
  votes: string[];
  voteCount: number;
  percent: number;
}

function getPercent(total: number, entry: number) {
  return total === 0 ? 0 : Math.round((entry / total) * 1000) / 10;
}

export default Vue.extend({
  name: "EventWidgetPoll",
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { CardActions },

  created() {
    this.subs.push(
      ...[
        DB.poll(this.card.roomId, this.card.id).onSnapshot(snap =>
          this.syncPoll(snap)
        ),
        DB.choices(this.card.roomId, this.card.id)
          .orderBy("created")
          .onSnapshot(snap => this.syncChoices(snap)),
        DB.votes(this.card.roomId, this.card.id, this.uid).onSnapshot(snap =>
          this.syncVotes(snap)
        )
      ]
    );
  },

  beforeDestroy() {
    this.subs.forEach(fn => fn());
  },

  methods: {
    hasMyVote(choiceId: string) {
      return this.myVotes.includes(choiceId);
    },

    syncPoll(change: DocumentSnapshot<DocumentData>) {
      this.$set(this, "poll", change.data());
      this.$set(this, "isLoading", false);
      this.updateVotesLeft();
    },

    syncChoices(change: QuerySnapshot<DocumentData>) {
      this.totalVotes = change.docs.reduce(
        (acc, curr) => acc + curr.data().votes.length,
        0
      );
      const choices = change.docs.map(
        (docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const data = docSnap.data();
          console.log(docSnap.id, data, this.totalVotes);
          return {
            id: docSnap.id,
            ...data,
            voteCount: data.votes.length,
            percent: getPercent(this.totalVotes, data.votes.length)
          };
        }
      );
      console.log("new choices", choices);
      this.$set(this, "choices", choices);
    },

    syncVotes(change: DocumentSnapshot<DocumentData>) {
      this.$set(this, "myVotes", change.data()?.votes || []);
      this.updateVotesLeft();
    },

    updateVotesLeft() {
      this.$set(
        this,
        "noVotesLeft",
        this.myVotes.length >= this.poll.votesPerMember
      );
    },

    toggleVote(choice) {
      if (this.hasMyVote(choice.id)) {
        console.log("removing my vote", choice.id); //debug
        DB.util.mapUnionRemove(
          DB.votes(this.card.roomId, this.card.id, this.uid),
          "votes",
          choice.id
        );
      } else if (this.noVotesLeft) {
        console.log("I have no votes left. Ignoring vote.");
      } else {
        console.log("adding my vote", choice.id); //debug
        DB.util.mapUnionAdd(
          DB.votes(this.card.roomId, this.card.id, this.uid),
          "votes",
          choice.id
        );
      }
    },

    addChoice(event) {
      event.preventDefault();
      if (this.choiceInput) {
        DB.choices(this.card.roomId, this.card.id).add({
          title: this.choiceInput,
          votes: [],
          creator: this.uid,
          created: DB.util.timestamp()
        });
        this.choiceInput = "";
      }
    }
  },

  data: () => ({
    choiceInput: "",
    isLoading: true,
    subs: [] as Subscription[],
    uid: SharedScope.user.uid as string,
    poll: {
      title: "Loading...",
      allowWriteIns: false,
      votesPerMember: 1,
      closed: false
    },
    totalVotes: 0,
    choices: [] as Choice[],
    myVotes: [] as string[],
    noVotesLeft: true
  })
});
</script>

<style scoped>
div.poll-background {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  opacity: 0.25;
  min-width: 2px;
}
</style>
