<template>
  <v-container fluid>
    <nav-bar/>
    <router-view/>
  </v-container>
</template>

<script>

import navBar from '../partials/nav-bar.vue';

export default {
  components: {
    navBar,
  },
  async beforeMount() {
    const exclude = ['auth', 'issues'];
    await Promise.all(Object.keys(this.$store.state)
      .filter(s => exclude.indexOf(s) === -1)
      .map(s => this.$store.dispatch(`${s}/find`)));
  },
};
</script>
