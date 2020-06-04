<template
  xmlns:v-clipboard="http://www.w3.org/1999/xhtml"
  xmlns:v-slot="http://www.w3.org/1999/XSL/Transform"
>
  <v-card dense :color="card.ui.color" dark>
    <v-card-text>
      <v-list :color="card.ui.color">
        <v-list-group value="true" color="white">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="title font-weight-light">
                {{
                  card.text ||
                    "Waiting for " + (amIReady ? "others" : "me") + "..."
                }}
                ({{ readyCount }} ready)
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-content>
              <v-btn v-if="!amIReady" @click="markMeReady" color="primary">
                Mark me ready
              </v-btn>
              <v-btn v-if="amIReady" color="success" outlined disabled>
                I'm ready!
              </v-btn>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-for="user in [...users]" :key="user.$id">
            <v-list-item-icon>
              <UserAvatar :uid="user.$id"></UserAvatar>
            </v-list-item-icon>
            <v-list-item-content>
              {{ user.displayName }} is ready
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card-text>
    <CardActions
      :card="card"
      :isAdmin="isAdmin"
      :isClosed="isClosed"
      :showAvatar="false"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import CardActions from "@/components/room/eventcard/CardActions.vue";
import sharedScope from "@/libs/SharedScope";
import UserAvatar from "@/components/uiwidget/UserAvatar.vue";
import { Profiles, UserProfile } from "@/libs/Profiles";
import DB from "@/libs/DB";

import firebase from "@/libs/firebase-init";
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export default Vue.extend({
  name: "EventWidgetWait",
  components: { UserAvatar, CardActions },
  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },

  created() {
    DB.wait(
      this.card.roomId,
      this.card.id
    ).onSnapshot((snapshot: DocumentSnapshot<DocumentData>) =>
      this.updateAcks(snapshot.data()?.acks || [])
    );
  },

  methods: {
    markMeReady() {
      DB.util.mapUnionAdd(
        DB.wait(this.card.roomId, this.card.id),
        "acks",
        this.myUid
      );
      this.amIReady = true;
    },

    updateAcks(userIds) {
      this.users.length = 0;
      userIds.forEach(uid => {
        const placeholder = {
          displayName: "Loading...",
          initials: "?",
          color: "gray",
          $id: uid
        } as UserProfile;
        this.users.push(placeholder);

        Profiles.find(uid).then(user => {
          if (user !== null) {
            Object.assign(placeholder, user);
            this.$set(this, "users", this.users);
          }
        });
      });
      this.$set(this, "amIReady", userIds.includes(this.myUid));
      this.$set(this, "readyCount", userIds.length);
    }
  },

  data: () => ({
    readyCount: 0,
    users: [] as UserProfile[],
    myUid: sharedScope.user.uid as string,
    amIReady: false
  })
});
</script>
