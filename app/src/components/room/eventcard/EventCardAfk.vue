<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <v-card shaped dense :color="isAway? 'grey' : 'white'" :dark="isAway">
    <v-card-text>
      <v-icon left>{{isAway? 'mdi-pause-circle' : 'mdi-play-circle-outline'}}</v-icon> <span>{{ message }}</span></v-card-text>
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
import Profiles, {UserProfile} from "@/libs/Profiles";

export default Vue.extend({
  name: "EventWidgetAfk",
  created() {
    this.card.subscribe(() => this.update());
    this.update();
  },
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },
  components: { CardActions },
  methods: {
    update() {
      Profiles.find(this.card.creator)
        .then((profile: UserProfile|null) => {
          this.isAway = this.card.text === 'away';
          let message = profile?.displayName || "<unknown user>";
          message += this.isAway? " stepped away..." : " was away but returned.";
          this.$set(this, 'message', message);
        });
    }
  },
  data: () => ({
    isAway: true,
    message: "Loading...",
    sub: () => { /* do nothing */ }
  })
});
</script>
