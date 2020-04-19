<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col md="5" lg="4" xl="3">
        <h1 align="center">So what is this thing?</h1>
        <p align="center">
          GVC Assistant is a simple companion tool for large distributed teams
          designed to encourage interaction and simplify participation during
          meetings.
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col sm="12" md="12" lg="10" xl="8" class="d-flex align-stretch">
        <v-card outlined>
          <v-card-title>Interactivity without noise</v-card-title>
          <v-card-text>
            <p>
              <strong>React, give high fives, and plus-one ideas</strong>
              in large group meetings without disruption.
            </p>
            <p>
              <strong>Ask questions and share links</strong>
              without interrupting presentations. Questions and links can be
              pinned, upvoted, and even discussed asynchronously.
            </p>
            <p>
              <strong>Designed for mobile</strong>
              or to be placed in a slim side window on your desktop.
            </p>
          </v-card-text>
        </v-card>
        <!--</v-col>-->
        <!--<v-col sm="12" md="4" class="d-flex align-stretch">-->
        <v-card outlined>
          <v-card-title>Productivity widgets</v-card-title>
          <v-card-text>
            <p>
              <strong>Create polls and idea lists.</strong>
              Upvote, react, and see responses in realtime.
            </p>
            <p>
              <strong>Track action items and shared links.</strong>
              . They are automatically collected and emailed to task owners and
              moderators.
            </p>
            <p>
              <strong>
                Pause the meeting while participants complete a task.
              </strong>
              Continue when everyone marks themselves ready or the time limit is
              reached.
            </p>
          </v-card-text>
        </v-card>
        <!--</v-col>-->
        <!--<v-col sm="12" md="4" class="d-flex align-stretch">-->
        <v-card outlined>
          <v-card-title>Security and moderation</v-card-title>
          <v-card-text>
            <p>
              <strong>Secure access to rooms</strong>
              by email domain or specific emails. Whitelist or ban any
              participant quickly. Set data retention policies.
            </p>
            <p>
              <strong>Aggregate unanswered questions</strong>
              for Q&A sessions or follow-up discussions.
            </p>
            <p>
              <strong>Quick post-meeting feedback</strong>
              provides reports on presentation quality and meeting productivity.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "HomePageContent"
};
</script>

<style scoped>
.d-flex .v-card {
  margin: 25px;
  padding: 25px;
}

@media screen and (max-width: 960px) {
  .d-flex {
    flex-wrap: wrap;
  }
  .d-flex .v-card {
    margin: 10px;
    padding: 10px;
  }
}
</style>
