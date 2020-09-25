<template>
  <v-card>
    <v-progress-linear
      color="error"
      height="4"
      style="margin: 0;"
      :indeterminate="isRemovePending"
    />
    <v-card-title class="headline">{{entry.name}}?</v-card-title>

    <v-card-text>
      Are you sure you wish to leave {{this.currentGroup.name}}?
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
        color="error"
        flat="flat"
        @click="leave"
      >
        Leave
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { find } from 'lodash';

export default {
  props: ['entry'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('users', { currentUser: 'current' }),
    ...mapState('users', { users: 'keyedById' }),
    ...mapState('perms', ['isRemovePending']),
  },
  methods: {
    ...mapActions('perms', { removePerm: 'remove' }),
    ...mapActions('users', { sgetUser: 'get' }),
    async leave() {
      const user = this.currentUser._id === this.$store.state.auth.payload.userId
        ? this.currentUser : this.$store.state.auth.user;
      const gid = this.currentGroup._id;
      const perm = find(user.perms.userperms, (p) => p.perm[0] === gid && p.perm[1] === 'enrolled');
      await this.removePerm(perm._id);
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
