<template>
  <form
    v-on:submit.prevent="createRoom"
    name="createForm"
    method="POST"
    value="createForm.isValid"
    ref="createForm"
  >
    <v-dialog
      v-model="showForm.visible"
      scrollable
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Create a room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Room description*"
                  v-model="createForm.description"
                  maxlength="50"
                  counter
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <h3>Who can access the room?</h3>
                <v-radio-group v-model="createForm.access" row>
                  <v-radio
                    color="error"
                    label="Anyone with link"
                    value="link"
                  ></v-radio>
                  <v-radio
                    color="primary"
                    label="Email domain"
                    value="domain"
                  ></v-radio>
                  <v-radio
                    color="success"
                    label="Invite only"
                    value="whitelist"
                  ></v-radio>
                </v-radio-group>
                <v-text-field
                  v-if="createForm.access === 'domain'"
                  label="Your domain (required)"
                  prepend-inner-icon="mdi-at"
                  v-model="createForm.domain"
                  v-model.trim="createForm.domain"
                  :rules="createForm.rules.domain"
                ></v-text-field>
                <v-textarea
                  v-if="createForm.access === 'whitelist'"
                  label="Emails to invite"
                  v-model.trim="createForm.whitelistUnformatted"
                  rows="3"
                  @change="parseEmails"
                  @paste="pastedEmails"
                ></v-textarea>
                <small v-if="createForm.access === 'whitelist'">
                  {{
                    this.createForm.whitelist.length
                      ? this.createForm.whitelist.length + " invitees"
                      : "You can add these later"
                  }}
                </small>
              </v-col>
              <v-col cols="12">
                <h3>How long should we retain the data?</h3>
                <!--
                    Okay so this. Why not just v-model.number="retentionLength"?
                    Well, v-model.number and v-group-radio don't seem to get along
                    and one has to click the radio twice before it takes effect. So
                    this is the workaround.
                -->
                <v-radio-group value="90" @change="inputChangedRetention" row>
                  <v-radio label="1 day" value="1"></v-radio>
                  <v-radio label="1 week" value="7"></v-radio>
                  <v-radio label="90 days" value="90"></v-radio>
                </v-radio-group>
                <small>You can delete the room manually at any time.</small>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showForm.visible = false"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="createRoom">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </form>
</template>

<script language="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import { burnedTheToast, toaster } from "@/libs/Toaster";
import DB from "@/libs/DB";

const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/gi;

function parseEmails(s) {
  // clean up the email addresses
  const emailList = [...(s || "").matchAll(EMAIL_REGEX)].map(a => a[0]);
  // make the list unique by converting to a set temporarily
  return [...new Set([...emailList])];
}

function joinEmails(list) {
  const spacer = ", ";
  return list.join(spacer) + spacer;
}

export default Vue.extend({
  name: "RoomCreateForm",

  props: ["showForm"],

  created() {
    this.createForm.domain = this.shared.user.emailDomain;
  },

  methods: {
    createRoom(event) {
      event.preventDefault();
      event.stopPropagation();
      this.showFrom.visible = false;

      this.createForm.isValid = this.$refs.createForm.validate();
      if (!this.createForm.isValid) {
        return false;
      }

      const form = this.createForm;

      const domain =
        form.access === "domain" && form.domain ? form.domain : null;
      const whitelist = form.access === "whitelist" ? [...form.whitelist] : [];

      const data = {
        owners: [this.shared.user.uid],
        access: this.createForm.access,
        description: this.createForm.description || null,
        domain: domain,
        whitelist: whitelist,
        retentionLength: 90,
        closed: false,
        created: DB.timestamp()
      };
      console.log("createRoom", data);

      DB.add(["rooms"], data)
        .then(() => toaster.success("Room created"))
        .catch(burnedTheToast("RoomCreateForm::createRoom"));
    },

    inputChangedRetention(v) {
      this.createForm.retentionLength = parseInt(v);
    },

    parseEmails() {
      const emails = parseEmails(this.createForm.whitelistUnformatted || "");
      console.log("parseEmails", emails, this.createForm.whitelistUnformatted); //debug
      this.createForm.whitelist = emails;
      this.createForm.whitelistUnformatted = joinEmails(emails);
    },

    /**
     * When pasting emails, we want to quickly remove dups and clean up the formatting.
     * Trying to use window.getSelection() and to insert the reformatted text back into
     * the correct point in the UI didn't work with Vuetify (breaks the UI). So I settled
     * for this compromise; let the browser do the paste logic, wait one tick,
     * then immediately reformat the text field. It creates a flash of the unformatted text,
     * but it's usually too short to see.
     *
     * I'm not sure exactly why this works as is, since it _should_ need to trigger
     * change detection with something like `this.set(this.createForm, "whitelist", emails)`;
     * indeed, when I set the values directly in the setTimeout() it failed to update the
     * UI. But calling a different method in setTimeout() seems to work okay? So be it. Perhaps
     * calling any function in the methods map triggers the change detection, too. Would
     * be interesting to learn more about that some day and update this.
     */
    pastedEmails(/*event*/) {
      console.log("pastedEmails", this.createForm.whitelistUnformatted); //debug
      setTimeout(() => this.parseEmails());
      return true;
    }
  },

  data: () => ({
    createForm: {
      isValid: true,
      access: "domain",
      description: null,
      domain: null,
      whitelist: [],
      whitelistUnformatted: null,
      retentionLength: 90,
      rules: {
        domain: [
          v =>
            !v ||
            /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/.test(
              v
            ) ||
            "Please enter a valid domain name"
        ],
        retentionLength: [
          v => /$[0-9]+$/.test(v) || "Please enter a valid integer"
        ]
      }
    },
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

  .hero .col.shrink {
    flex-basis: auto;
  }
}
</style>
