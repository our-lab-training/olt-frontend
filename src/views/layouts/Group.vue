<template>
  <v-container fluid>
    <nav-bar/>
    <router-view/>
  </v-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import navBar from '../partials/nav-bar.vue';

export default {
  components: {
    navBar,
  },
  methods: {
    ...mapActions('groups', { sgetGroup: 'get' }),
    ...mapMutations('groups', ['setCurrent']),
  },
  async mounted() {
    const { groupId } = this.$route.params;
    await this.sgetGroup(groupId);
    this.setCurrent(groupId);
  },
  async updated() {
    const { groupId } = this.$route.params;
    await this.sgetGroup(groupId);
    this.setCurrent(groupId);
  },
};
</script>
