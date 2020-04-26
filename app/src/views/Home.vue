<template>
  <v-container class="hero" fluid>
    <v-row justify="center">
      <v-col md="7" lg="6" xl="5">
        <SignInForm v-if="user.initialized && !user.isSignedIn" />
        <RoomPicker v-if="user.initialized && user.isSignedIn" />
        <LoadingCard v-if="!user.initialized" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <HomePageContent />
      </v-col>
    </v-row>

    <Footer />
  </v-container>
</template>

<script>
// @ is an alias to /src

import SignInForm from "@/components/SignInForm.vue";
import sharedScope from "@/libs/SharedScope";
import HomePageContent from "@/components/HomePageContent.vue";
import RoomPicker from "@/components/room/RoomPicker.vue";
import LoadingCard from "@/components/LoadingCard.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Home",
  components: {
    SignInForm,
    HomePageContent,
    RoomPicker,
    LoadingCard,
    Footer
  },

  created() {
    sharedScope.ui.title = "GVC Assistant: Pick a room";
  },

  data: () => ({
    user: sharedScope.user
  })
};
</script>

<!-- CSS not scoped because the v-card components are contained in the embedded components. -->
<style>
.hero .v-card {
  min-height: 210px;
}

.hero .loading {
  line-height: 200px;
  text-align: center;
}
</style>
