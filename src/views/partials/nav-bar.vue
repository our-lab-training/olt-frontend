<template>
  <div>
    <v-toolbar
      app
      :clipped-left="!drawer"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline" v-text="title"></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu :nudge-width="100" open-on-hover bottom offset-y>

        <v-toolbar-title slot="activator">
          <span class="subheading" v-text="user.profile.displayname"></span>
          <v-icon>expand_more</v-icon>
        </v-toolbar-title>

        <v-list>
          <v-list-tile @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>

      </v-menu>

    </v-toolbar>

    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
</style>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'nav-bar',
  data() {
    return {
      drawer: false,
      clipped: false,
      items: [{
        icon: 'home',
        title: 'Home',
      }],
      title: 'Access',
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user || { profile: {} };
    },
  },
  methods: {
    ...mapActions('auth', { logoutUser: 'logout' }),
    async logout() {
      await this.logoutUser();
      this.$router.push({ path: '/login' });
      // TODO Clear stores
    },
  },
};
</script>
