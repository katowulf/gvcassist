<template>
  <div id="global-toaster">
    <!-- meh, the number of properties here is a bit clunky, maybe revise ToasterMessage.action and learn more
           about programmatic creation of components in Vue -->
    <v-alert
      v-for="(alert, index) in alerts"
      :key="index"
      :type="alert.type"
      :text="alert.props.isText"
      :border="alert.props.borderLocation"
      :elevation="alert.props.elevation"
      :colored-border="alert.props.hasColoredBorder"
      :color="alert.props.color"
      transition="expand-transition"
      dense
    >
      <v-row no-gutters align="center">
        <v-col class="grow">
          {{ alert.message }}
        </v-col>
        <v-col class="shrink">
          <v-btn
            v-if="alert.props.buttonText"
            small
            :color="alert.props.buttonColor"
            v-on:click="alert.activate()"
            outlined
            >{{ alert.props.buttonText }}</v-btn
          >
          <v-icon v-if="alert.props.iconText" v-on:click="alert.activate()">
            {{ alert.props.iconText }}
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

<!--
  ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
  So for some reason, scoped CSS
  can't override .v-icon's font
  size, so we can't make this scoped;
  need to be extra careful of global
  scoping bugs.
  ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
-->
<style>
div#global-toaster {
  padding: 10px 25px;
}

div#global-toaster .v-alert {
  margin-bottom: 5px;
}

@media screen and (max-width: 599px) {
  div#global-toaster {
    padding: 5px 10px;
  }

  div#global-toaster .v-alert {
    padding: 1px 8px;
    margin-bottom: 4px;
    font-size: 12px;
  }

  div#global-toaster .v-alert .v-icon {
    font-size: 12px;
    margin-right: 5px;
  }

  div#global-toaster .v-alert .v-btn {
    font-size: 12px;
    padding: 2px;
    height: 24px;
  }
}
</style>
