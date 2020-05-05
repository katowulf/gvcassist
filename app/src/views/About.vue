<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col md="6" lg="5">
          <v-img
            :src="require('../assets/logo.jpg')"
            contain
            height="200"
          />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col md="6" lg="5">
          <h2 class="headline font-weight-bold mb-3">
            Who made this?
          </h2>

          <p class="subheading font-weight-regular">
            <a href="https://katowulf.com">Kato Richardson</a>
            created this using
            <a href="https://firebase.google.com">Firebase</a>
            and
            <a href="">Vue.js</a>
            .
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col md="6" lg="5">
          <h2 class="headline font-weight-bold mb-3">
            But why?
          </h2>

          <p>
            Mostly to learn some new frameworks and tools. But partially because
            large, distributed meetings are annoying and its hard to get
            participation from big groups. A few people tend to dominate while
            others hesitate to interrupt the workflow. It seemed like technology
            should be able to help with that.
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col md="6" lg="5">
          <h2 class="headline font-weight-bold mb-3">
            May I have the code?
          </h2>

          <p>
            Yep, it's on GitHub
            <a href="https://github.com/katowulf/gvcassist">here</a>
            . If it saves you energy and money, please consider a small donation
            to Vue or Vuetify.
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col md="6" lg="5">
          <h2 class="headline font-weight-bold mb-3">Credits</h2>
          <p>
            A variety of tools went into creating this. Highlights include
            <a href="https://vuetifyjs.com/">Vuetify</a>
            , Google Material
            <a href="https://material.io/">design</a>
            and
            <a href="https://materialdesignicons.com/">icons</a>
            , and
            <a href="https://www.jetbrains.com/webstorm/">Intellij WebStorm</a>
            .
          </p>

          <p>
            The excellent MDN docs helped me figure out how to
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event"
            >
              intercept paste events
            </a>
            . This allows calendar invite attendees to just be pasted directly
            into the whitelist.
          </p>

          <p>
            Cliply provided
            <a href="https://cliply.co/clip/rocket-icon/">
              some excellent royalty free gifs
            </a>
            to fill our empty spaces.
          </p>

          <h3>
            Some really creative people deserve credit for providing ideas and
            bug workarounds as well:
          </h3>

          <p>
            Rie on StackOverflow provided
            <a href="https://stackoverflow.com/questions/60288285">
              clues about same-height columns in Vuetify grids
            </a>
            that eventually led to using
            <code>fill-height</code>
            ,
            <code>d-flex</code>
            and
            <code>align-stretch</code>
            . Adding
            <code>flex-wrap: wrap;</code>
            from the docs made it responsive for mobile.
          </p>

          <p>
            Oskar Kosowski mentioned a working solution to run
            <code>--fix</code>
            when Vue spits out dozens of liter errors (mostly created by the CLI
            it's linting)
            <a href="https://stackoverflow.com/questions/54758813/">here</a>
            .
          </p>

          <p>
            Nicolas Vitaterna suggested creating shims-vuetify.d.ts
            <a
              href="https://github.com/vuetifyjs/vue-cli-plugins/issues/43#issuecomment-578161783"
            >
              here
            </a>
            and it fixed a lot of TypeScript woes.
          </p>

          <p>
            shefali163 suggested line-height to center my loading spinner in the
            hero card
            <a
              href="https://www.geeksforgeeks.org/how-to-vertically-center-text-with-css/"
            >
              here
            </a>
          </p>

          <p>
            Bijou Trouvaille helped resolve UnsupportedClassVersionError on Mac
            when installing the Firebase Emulator
            <a href="https://github.com/firebase/quickstart-nodejs/issues/68">
              here
            </a>
          </p>

          <p>
            Mitchell Garcia explained how to type cast Vue props in
            <a
              href="https://frontendsociety.com/using-a-typescript-interfaces-and-types-as-a-prop-type-in-vuejs-508ab3f83480"
            >
              This excellent blog post.
            </a>
          </p>

          <p>
            To Rie, Oskar, Nicolas, shefali163, and many others behind the
            scenes, thanks for letting me stand on your shoulders! ♥
          </p>
        </v-col>
      </v-row>
    </v-container>

    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Footer from "@/components/Footer.vue";

export default Vue.extend({
  name: "About",

  components: { Footer },

  data: () => ({})
});
</script>
