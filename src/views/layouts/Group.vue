<template>
  <v-container fluid>
    <nav-bar/>
    <router-view @modalClose="modalClose()" :entry="$route.meta.route"/>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import router from '@/router';
import store from '@/store';
import { find } from 'lodash';
import navBar from '../partials/nav-bar.vue';

const loadGroupRoute = async (to, from, next) => {
  // get groupId from slug/group
  const { groupRef } = to.params;
  const groups = (await store.dispatch('groups/find', {
    query: {
      $or: [
        ...(/^[0-9a-f]{24}$/.test(groupRef) ? [{ _id: groupRef }] : []),
        { slugs: groupRef },
      ],
    },
  }));
  if (groups.length !== 1) return next('/');
  const group = groups[0];
  to.params.groupId = group._id;
  store.commit('groups/setCurrent', group._id);
  // check if user should see this route for this group
  if (!to.meta.route) return next();
  const { route } = to.meta;
  const isEnrolled = store.state.auth.user.perms.groups.indexOf(group._id) !== -1;
  if ((
    route.onlyGroupOfTypes &&
    route.onlyGroupOfTypes.indexOf(group.type) === -1
  ) ||
  (
    typeof route.ifEnrolledIs === 'boolean' &&
    route.ifEnrolledIs !== isEnrolled
  ) ||
  (
    route.visiblePerms &&
    !find(route.visiblePerms, perm => store.dispatch('users/hasPerm', perm.replace('{groupId}', group._id)))
  ) ||
  (
    route.invisiblePerms &&
    find(route.invisiblePerms, perm => store.dispatch('users/hasPerm', perm.replace('{groupId}', group._id)))
  )) return next('/');
  return next();
};

export default {
  components: {
    navBar,
  },
  computed: {
    ...mapGetters('groups', ['current']),
  },
  methods: {
    modalClose() {
      router.push(`/group/${this.current.slugs[0] || this.current._id}/`);
    },
  },
  async beforeMount() {
    const exclude = ['auth', 'issues'];
    await Promise.all(Object.keys(this.$store.state)
      .filter(s => exclude.indexOf(s) === -1)
      .map(s => this.$store.dispatch(`${s}/find`)));
  },
  beforeRouteEnter: loadGroupRoute,
  beforeRouteUpdate: loadGroupRoute,
  beforeRouteLeave: (to, from, next) => { store.commit('groups/clearCurrent'); next(); },
};
</script>
