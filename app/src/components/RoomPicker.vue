<template>
  <form v-on:submit.prevent="submit" method="POST" ref="form">
    <v-card color="blue lighten-5">
      <v-card-text>
        <v-container fluid>
          <v-row no-gutters>
            <v-col class="grow">
              <!--<v-text-field solo flat style="border-radius: 0" />-->
              <v-text-field solo label="Enter a room id" style="border-radius: 0"
                  required :rules="roomIdRules" v-model.trim="roomId" />
            </v-col>
            <v-col class="shrink">
              <v-btn @click="join" tile large color="primary" height="48px">
                Join Room
                <v-icon>mdi-arrow-right-bold</v-icon>
              </v-btn>
            </v-col>
            <v-spacer class="shrink"></v-spacer>
            <v-col class="shrink">
              <v-btn @click="create" tile small color="success" height="48px">
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
  </form>
</template>

<script language="ts">
  import Vue from "vue";

  export default Vue.extend({
    name: "RoomPicker",

    async created() {
      console.log('created');
    },

    methods: {
      /**
       * Do browsers treat single input fields special and break submit behaviors? Maybe.
       * https://forum.vuejs.org/t/preventing-onsubmit/2763/2
       */

      join() {
        this.$refs.form.validate();
        if( this.roomId ) {
          console.log('goToRoom', this.roomId);
        }
        return false;
      },

      create() {
        //
      }
    },

    data: () => ({
      valid: true,
      roomId: "",
      roomIdRules: [
        v => !!v || "Room id is required",
        v => /^[\w_ -]+$/.test(v) || "Alphanumeric only: A-Za-z0-9-_ and space (sorry non-English peeps, in has to work in a URL)"
      ],
      myRooms: [],
      recentRooms: []
    })
  });

</script>

<style scoped>
  .spacer.shrink {
    padding: 10px;

  }
</style>
