<template>
<v-toolbar>
  <v-toolbar-side-icon></v-toolbar-side-icon>
  <v-toolbar-title>Access</v-toolbar-title>
    <v-btn flat>{{user.firstName}} {{user.lastname}}</v-btn>
  <v-spacer></v-spacer>
</v-toolbar>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    account() {

    },
  },
};
</script>
