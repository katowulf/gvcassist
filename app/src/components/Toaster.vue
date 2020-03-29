<template>
  <div class="global-toaster">
      <!-- meh, this is a bit clunky, maybe revise ToasterMessage.action and learn more
           about programmatic creation of components in Vue -->
      <v-alert v-for="(alert,index) in alerts" :key="index"
               :type="alert.type" :text="alert.props.isText" :border="alert.props.borderLocation"
               :elevation="alert.props.elevation" :colored-border="alert.props.hasColoredBorder"
               :color="alert.props.color"
               transition="expand-transition"
               dense>
        <v-row no-gutters align="center">
          <v-col class="grow">
            {{alert.message}}
          </v-col>
          <v-col class="shrink">
            <v-btn v-if="alert.props.buttonText" small
                   :color="alert.props.buttonColor"
                   v-on:click="alert.activate()"
                   outlined>{{ alert.props.buttonText }}</v-btn>
            <v-icon v-if="alert.props.iconText"
                    v-on:click="alert.activate()">
              {{alert.props.iconText}}
            </v-icon>
          </v-col>
        </v-row>
      </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import toaster from "@/libs/Toaster";

export default Vue.extend({
  name: "Toaster",
  data: () => ({ alerts: toaster.getMessages() })
});
</script>

<style scoped>
  div.global-toaster {
    padding: 10px 25px;
  }

  div.global-toaster .v-alert {
    margin-bottom: 5px;
  }

  @media screen and (max-width: 990px) {
    div.global-toaster {
      padding: 5px;
    }
  }
</style>