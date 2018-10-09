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
};
</script>
