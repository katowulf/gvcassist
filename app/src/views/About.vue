<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" offset="3">
        <h1 class="display-2 mb-3">
          Who made this?
        </h1>

        <p class="subheading font-weight-regular">
          <a href="https://katowulf.com">Kato Richardson</a> created this using
          <a href="https://firebase.google.com">Firebase</a> and <a href="">Vue.js</a>.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" offset="3">
        <h2 class="headline font-weight-bold mb-3">
          But why?
        </h2>

        <p>
          Mostly to learn some new frameworks and tools. But partially because large, distributed
          meetings are annoying and its hard to get participation from big groups. A few
          people tend to dominate while others hesitate to interrupt the workflow. It
          seemed like technology should be able to help with that.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" offset="3">
        <h2 class="headline font-weight-bold mb-3">
          May I have the code?
        </h2>

        <p>Yep, it's on GitHub <a href="https://github.com/katowulf/gvcassist">here</a></p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" offset="3">
        <h2 class="headline font-weight-bold mb-3">Credits</h2>
        <p>A variety of tools went into creating this. Highlights include
          <a href="https://vuetifyjs.com/">Vuetify</a>,
          Google Material <a href="https://material.io/">design</a> and
          <a href="https://materialdesignicons.com/">icons</a>,
          and <a href="https://www.jetbrains.com/webstorm/">Intellij WebStorm</a>.
        </p>

        <p>Some really creative people deserve credit for providing ideas and bug workarounds
          as well:</p>

        <p>Rie on StackOverflow for
        <a href="https://stackoverflow.com/questions/60288285">clues about same-height columns in Vuetify grids</a>
        that eventually led to <code>fill-height</code> and <code>align-stretch</code>.</p>

        <p>
          To Rie and many others behind the scenes, thanks for letting me stand on
          your shoulders! ♥
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'About',

  data: () => ({
    //
  }),
});
</script>
