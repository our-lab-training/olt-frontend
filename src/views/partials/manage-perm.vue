<template>
  <div>
    <report-error :error="err"/>
    <v-autocomplete
      :items="items"
      v-model="grantees"
      multiple chips
      deletable-chips
      :loading="loading"
      :disabled="disabled || loading"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';
import reportError from './report-error.vue';

export default {
  components: {
    reportError,
  },
  props: {
    perm: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      grantees: [],
      err: null,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('users', { findUsers: 'find' }),
    ...mapGetters('roles', { findRoles: 'find' }),
    ...mapGetters('perms', { findPerms: 'find' }),
    ...mapState('perms', ['isCreatePending', 'isRemovePending']),
    loading() { return this.isCreatePending || this.isRemovePending; },
    items() {
      const items = [
        ...this.findUsers({
          query: {
            'perms.groups': this.currentGroup ? this.currentGroup._id : { $exists: true },
          },
        }).data.map(user => ({
          text: `User: ${user.name} (${user.username})`,
          value: JSON.stringify({
            type: 'users',
            grantee: user._id,
            perm: this.perm,
          }),
        })),
        ...this.findRoles({
          query: {
            groupId: this.currentGroup ? this.currentGroup._id : 'noRoles',
          },
        }).data.map(role => ({
          text: `Role: ${role.name}`,
          value: JSON.stringify({
            type: 'roles',
            grantee: role._id,
            perm: this.perm,
          }),
        })),
      ];
      return sortBy(items, 'text');
    },
  },
  methods: {
    findPerm(value) {
      const query = JSON.parse(value);
      delete query.perm;
      const [perm] = this.findPerms({ query }).data.filter(p => isEqual(p.perm, this.perm));
      return perm;
    },
    getGrants() {
      const grantees = this.items.reduce((a, item) => {
        if (this.findPerm(item.value)) a.push(item.value);
        return a;
      }, []);
      return grantees;
    },
    setGrants() { if (!this.loading) this.grantees = this.getGrants(); },
  },
  mounted() { this.setGrants(); },
  watch: {
    items() { this.setGrants(); },
    loading() { this.setGrants(); },
    grantees() {
      if (this.loading || this.disabled) return;
      this.err = null;
      const currGrants = this.getGrants();
      const adds = this.grantees.filter(g => currGrants.indexOf(g) === -1);
      const removes = currGrants.filter(g => this.grantees.indexOf(g) === -1);
      if (!adds.length && !removes.length) return;
      try {
        Promise.all(adds.map(add => this.$store.dispatch('perms/create', JSON.parse(add))));
        Promise.all(removes.map((remove) => {
          const perm = this.findPerm(remove);
          if (perm) return this.$store.dispatch('perms/remove', perm._id);
          return null;
        }));
      } catch (err) {
        console.error(err);
        this.err = err;
      }
    },
  },
};
</script>
