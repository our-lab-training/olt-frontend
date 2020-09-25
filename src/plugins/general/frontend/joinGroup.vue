<template>
  <v-card>
    <v-progress-linear
      color="success"
      height="4"
      style="margin: 0;"
      :indeterminate="isCreatePending"
    />
    <v-card-title class="headline">{{entry.name}}?</v-card-title>

    <v-card-text>
      Are you sure you wish to join {{currentGroup.name}}?
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        flat="flat"
        @click="$emit('modalClose')"
      >
        Close
      </v-btn>
      <v-btn
        color="success"
        flat="flat"
        @click="join"
      >
        Join
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  props: ['entry'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapState('users', { users: 'keyedById' }),
    ...mapState('perms', ['isCreatePending']),
  },
  methods: {
    ...mapActions('users', { sgetUser: 'get' }),
    async join() {
      const { user } = this.$store.state.auth;
      const { Perm } = this.$FeathersVuex;
      const joinPerm = new Perm({
        grantee: user._id,
        perm: [this.currentGroup._id, 'enrolled'],
        type: 'users',
      });
      await joinPerm.save();
      // await this.sgetUser(user._id);
      // setTimeout(() => { this.$store.state.auth.user = this.users[user._id]; }, 500);
      this.$emit('modalClose');
    },
  },
  mounted() {
    this.$emit('setWidth', 300);
  },
};
</script>
