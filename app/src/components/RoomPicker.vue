<template>
  <form v-on:submit.prevent="submit" name="roomForm" method="POST" ref="form">
    <v-card color="blue lighten-5">
      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col class="grow">
              <!--<v-text-field solo flat style="border-radius: 0" />-->
              <v-text-field
                solo
                label="Enter a room id"
                name="roomId"
                style="border-radius: 0"
                required
                :rules="roomIdRules"
                v-model.trim="roomId"
              />
            </v-col>
            <v-col class="shrink">
              <v-btn @click="joinRoom" tile large color="primary" height="48px">
                Join Room
                <v-icon>mdi-arrow-right-bold</v-icon>
              </v-btn>
            </v-col>
            <v-spacer class="shrink"></v-spacer>
            <v-col class="shrink">
              <v-btn
                @click="showCreateForm.visible = true"
                tile
                small
                color="success"
                height="48px"
              >
                Create Room
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h3>Room invites</h3>
              <p>Nobody noticed me ^_^</p>
            </v-col>
            <v-col>
              <h3>Rooms I own</h3>
              <p>I don't have any; I should be more outgoing.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <RoomCreateForm :showForm="showCreateForm" />
  </form>
</template>

<script language="ts">
import Vue from "vue";
import RoomCreateForm from "@/components/RoomCreateForm.vue";
import sharedScope from "@/libs/SharedScope";
// import {burnedTheToast} from "@/libs/Toaster";
// import DB from "@/libs/DB";

export default Vue.extend({
  name: "RoomPicker",

  async created() {
    // DB.collection('rooms')
    //   .where("owners", "array-contains", this.shared.user.uid)
    //   .onSnapshot(snapshot => {
    //     snapshot.docChanges().forEach(function(change) {
    //       if (change.type === "added") {
    //         console.log("Room added: ", change.doc.data());
    //       }
    //       if (change.type === "modified") {
    //         console.log("Room modified: ", change.doc.data());
    //       }
    //       if (change.type === "removed") {
    //         console.log("Room removed: ", change.doc.data());
    //       }
    //     });
    //   }, burnedTheToast("RoomPicker::created"));
  },

  components: { RoomCreateForm },

  methods: {
    /**
     * Do browsers treat single input fields special and break submit behaviors? Maybe.
     * https://forum.vuejs.org/t/preventing-onsubmit/2763/2
     */

    joinRoom() {
      this.$refs.form.validate();
      if (this.roomId) {
        console.log("goToRoom", this.roomId);
      }
      return false;
    }
  },

  data: () => ({
    valid: true,
    roomId: "",
    roomIdRules: [
      v => !!v || "Room id is required",
      v =>
        /^[\w_ -]+$/.test(v) ||
        "Alphanumeric only: A-Za-z0-9-_ and space (sorry non-English peeps, in has to work in a URL)"
    ],
    myRooms: [],
    recentRooms: [],

    // We use an object here instead of a simple boolean because Vue throws a warning if you
    // modify a prop provided by a parent inside a component. So we have to add some convolution
    // to suppress the warning.
    //
    // Alternative is to use an integer here, and inside the child component, have a watch method
    // that monitors changes to the value and updates the visibility (quite convoluted). A boolean
    // won't work here with watch in the client because it never changes after it's set to true
    // since the child component can't set it back to false. So sadface.
    showCreateForm: { visible: false },

    shared: sharedScope
  })
});
</script>

<style scoped>
.spacer.shrink {
  padding: 10px;
}

@media screen and (max-width: 599px) {
  .hero .row {
    /*flex-wrap: wrap;*/
  }

  .hero .col {
    flex-basis: auto;
  }
}
</style>
