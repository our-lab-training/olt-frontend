<template>
  <v-container fluid>
    <nav-bar/>
    <router-view/>
  </v-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import router from '@/router';
import navBar from '../partials/nav-bar.vue';

export default {
  components: {
    navBar,
  },
  methods: {
    ...mapActions('groups', { sfindGroup: 'find' }),
    ...mapMutations('groups', ['setCurrent']),
    async setGroup() {
      const { groupId } = this.$route.params;
      const groups = (await this.sfindGroup({
        query: {
          $or: [
            ...(/^[0-9a-f]{24}$/.test(groupId) ? [{ _id: groupId }] : []),
            { slugs: groupId },
          ],
        },
      })).data;
      if (groups.length !== 1) return router.push('/');
      return this.setCurrent(groups[0]._id);
    },
  },
  mounted() {
    this.setGroup();
  },
  updated() {
    this.setGroup();
  },
};
</script>
