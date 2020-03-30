<template>
  <div class="home">
    <SignInForm v-if="!user.isSignedIn" />

    <HomePageContent />
  </div>
</template>

<script>
// @ is an alias to /src

import SignInForm from "@/components/SignInForm.vue";
import sharedScope from "@/libs/SharedScope";
import HomePageContent from "@/components/HomePageContent.vue";

export default {
  name: "Home",
  components: {
    SignInForm, HomePageContent
  },
  data: () => ({
    user: sharedScope.user
  })
};
</script>

