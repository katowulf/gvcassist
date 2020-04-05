<template>
  <v-card color="blue lighten-5">
    <v-card-text>
      <v-container>
        <v-form v-on:submit.prevent="joinRoom" :value="formIsValid" ref="roomForm" name="roomForm" method="POST">
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
            <p>
              <RoomLink v-for="room in recentRooms" :key="room.id" :room="room" />
            </p>
          </v-col>
          <v-col>
            <h3>Rooms I own</h3>
            <p>
              <RoomLink v-for="room in myRooms" :key="room.id" :room="room" />
            </p>
          </v-col>
        </v-row>
        </v-form>
        <RoomCreateForm :showForm="showCreateForm" />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script language="ts">
import Vue from "vue";
import RoomCreateForm from "@/components/RoomCreateForm.vue";
import sharedScope from "@/libs/SharedScope";
import { burnedTheToast } from "@/libs/Toaster";
import { MergeQuery, DB } from "@/libs/DB";
import RoomLink from "@/widgets/RoomLink.vue";

export default Vue.extend({
  name: "RoomPicker",

  created() {
    const myRoomsQuery = DB.collection("rooms")
        .where("owners", "array-contains", this.shared.user.uid)
        .where("closed", "==", false)
        .orderBy("created")
        .limitToLast(20);

    myRoomsQuery.onSnapshot(snap => {
      console.log('my rooms snapshot', snap.docs.length); //debug
      this.myRooms = snap.docs.map(ds => ({"$id": ds.id, ...ds.data()}));
    }, burnedTheToast("RoomPicker::created(ownership query)"));

    const myWhitelistQuery = DB.collection("rooms")
      .where("whitelist", "array-contains", this.shared.user.data.email)
      .where("closed", "==", false)
      .orderBy("created")
      .limitToLast(20);

    myWhitelistQuery.onSnapshot(snap => {
      console.log("my whitelist snapshot", snap.docs.length); //debug
      this.recentRooms = snap.docs.map(ds => ({"$id": ds.id, ...ds.data()}));
    }, burnedTheToast("RoomPicker.created(whitelist query)"));

    // this.merger = new MergeQuery(myWhitelistQuery);
    // // descending order by creation date
    // this.merger.setCompareFunction((a, b) => b.created - a.created);
    // this.merger.subscribe(docs => this.recentRooms = docs, burnedTheToast("RoomPicker::created(mergequery)"));
  },

  beforeDestroy() {
    // this.merger.destroy();
  },

  components: { RoomCreateForm, RoomLink },

  methods: {
    /**
     * Do browsers treat single input fields special and break submit behaviors? Maybe.
     * https://forum.vuejs.org/t/preventing-onsubmit/2763/2
     */

    joinRoom(event) {
      event.preventDefault();
      event.stopPropagation();
      this.formIsValid = this.$refs.roomForm.validate();
      if( this.formIsValid ) {
        this.$router.push({ name: 'Room', params: { roomId: this.roomId } });
      }
      return false;
    }
  },

  data: () => ({
    formIsValid: true,
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

    shared: sharedScope,

    merger: null
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
