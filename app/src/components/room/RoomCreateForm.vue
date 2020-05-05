<template>
  <v-form
    @submit="createRoom"
    name="createForm"
    method="POST"
    :value="createForm.isValid"
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
                <EmailList
                  v-if="createForm.access === 'whitelist'"
                  v-model="createForm.whitelist"
                  label="Emails to invite"
                />
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
          <v-btn color="accent" text @click="showForm.visible = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" @click="createRoom">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script language="ts">
import Vue from "vue";
import sharedScope from "@/libs/SharedScope";
import { burnedTheToast, toaster } from "@/libs/Toaster";
import DB from "@/libs/DB";
import EmailList from "@/components/uiwidget/EmailList.vue";

export default Vue.extend({
  name: "RoomCreateForm",

  props: ["showForm"],

  components: { EmailList },

  created() {
    this.createForm.domain = this.shared.user.emailDomain;
  },

  methods: {
    createRoom(event) {
      event.preventDefault();
      event.stopPropagation();
      this.showForm.visible = false;

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
        blacklist: [],
        retentionLength: 90,
        closed: false,
        created: DB.util.timestamp()
      };
      console.log("createRoom", data);

      DB.rooms()
        .add(data)
        .then(() => toaster.success("Room created"))
        .catch(burnedTheToast("RoomCreateForm::createRoom"));
    },

    inputChangedRetention(v) {
      this.createForm.retentionLength = parseInt(v);
    }
  },

  data: () => ({
    createForm: {
      isValid: true,
      access: "domain",
      description: null,
      domain: null,
      whitelist: [],
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
