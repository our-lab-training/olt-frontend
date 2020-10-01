<template>
    <v-dialog v-model="dialog" max-width="500px" style="display:block;">
      <v-list-tile slot="activator" @click="Math.random()">
        <v-list-tile-action>
          <v-tooltip right>
            <v-icon slot="activator">fal fa-address-card</v-icon>
            <span>Profile</span>
          </v-tooltip>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Profile
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <report-error :error="err"/>
          <span class="success--text" v-if="success">
            Your profile has been successfully updated.
          </span>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="First Name"
                  disabled
                  v-model="user.profile.firstname"
                />
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Last Name"
                  disabled
                  v-model="user.profile.lastname"
                />
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Userame"
                  disabled
                  v-model="user.username"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Display Name"
                  v-model="user.profile.displayname"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Email"
                  disabled
                  v-model="user.email"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            :disabled="isPatchPending"
            @click.native="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            text
            :loading="isPatchPending"
            :disabled="isPatchPending"
            @click.native="save()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import reportError from './report-error.vue';

export default {
  components: {
    reportError,
  },
  data() {
    return {
      dialog: false,
      user: { profile: {} },
      err: null,
      success: false,
    };
  },
  computed: {
    ...mapState('users', ['isPatchPending']),
    ...mapGetters('users', { getUser: 'get', currentUser: 'current' }),
  },
  methods: {
    loadUser() {
      const user = this.getUser(this.$store.state.auth.user._id);
      if (user) this.user = user.clone();
    },
    async save() {
      if (this.isPatchPending) return;
      this.err = null;
      this.success = false;
      try {
        await this.user.save();
        this.success = true;
      } catch (err) {
        console.error(err);
        this.err = err;
      }
    },
  },
  mounted() { this.loadUser(); },
  watch: {
    currentUser() { this.loadUser(); },
    // eslint-disable-next-line func-names
    '$store.state.auth.user': function () { this.loadUser(); },
  },
};
</script>
