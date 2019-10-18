<template>
  <div>

    <v-toolbar scroll-off-screen app v-if="$vuetify.breakpoint.xsOnly">
      <v-toolbar-side-icon @click.stop="mini=false; drawer=!drawer">
        <v-icon>fal fa-bars</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-title><img
        :class="`olt-logo ${$vuetify.dark ? 'dark' : ''}`"
        alt="" :src="logo"
      > {{title}}</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer
      persistent
      :value="$vuetify.breakpoint.smAndUp || drawer"
      @input="drawer = $event"
      enable-resize-watcher
      :app="true || !($vuetify.breakpoint.smOnly && !mini)"
      :stateless="!$vuetify.breakpoint.xsOnly || mini"
      :temporary="$vuetify.breakpoint.xsOnly && drawer"
      :absolute="($vuetify.breakpoint.xsOnly || (false && $vuetify.breakpoint.smOnly && !mini))"
      :mini-variant="mini && !$vuetify.breakpoint.xsOnly"
      :fixed="$vuetify.breakpoint.smAndUp"
    >

      <v-toolbar flat v-if="!$vuetify.breakpoint.xsOnly">
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-tooltip right>
                <v-btn
                  flat
                  icon
                  @click.stop="
                    if (!$vuetify.breakpoint.xsOnly) mini=!mini;
                    else drawer = !drawer;
                  "
                  slot="activator"
                >
                  <v-icon>fal fa-bars</v-icon>
                </v-btn>
                <span>{{mini ? 'Open' : 'Close'}} Menu</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="title">
                <img
                  :class="`olt-logo ${$vuetify.dark ? 'dark' : ''}`"
                  alt="" :src="logo"
                > {{title}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider/>

      <v-list>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-tooltip right>
                <v-icon slot="activator">fal fa-user-circle</v-icon>
                <span>{{user.name}}</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{user.name}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/logout">
            <v-list-tile-action>
              <v-tooltip right>
                <v-icon slot="activator">fal fa-sign-out</v-icon>
                <span>Logout</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Logout
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <profile/>

        </v-list-group>

        <v-divider/>

        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
          :value="$router.currentRoute.path === item.link"
          :color="$router.currentRoute.path === item.link ? 'primary' : 'default'"
        >
          <v-list-tile-action>
            <v-tooltip right>
              <v-icon v-html="item.icon" slot="activator"/>
              <span>{{item.name}}</span>
            </v-tooltip>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider/>

        <v-list-group
          v-for="(group) in groups"
          :key="`nav-${group._id}`"
          :value="activeGroup === group"
        >
          <v-list-tile
            slot="activator"
            :color="activeGroup === group ? 'primary' : 'default'"
          >
            <v-list-tile-action>
              <v-tooltip right>
                <group-logo
                  :color="activeGroup === group ? 'primary' : 'default'"
                  :greyscale="activeGroup !== group"
                  :group="group"
                  slot="activator"
                />
                <span>{{group.name}}</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{group.name}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-for="(entry, eref) in groupEntries[group._id].filter(e => !e.secondary)"
            :key="`nav-${group._id}-${eref}`"
            :to="entry.link"
            :value="entry.link === $route.path"
          >
            <v-list-tile-action>
              <v-tooltip right>
                <v-icon v-html="entry.icon" slot="activator"/>
                <span>{{entry.name}}</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-title>{{entry.name}}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>

v-btn {
  margin: 0;
}

</style>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { find } from 'lodash';
import store from '@/store';
import groupEntries from '@/lib/groupEntries';
import groupLogo from './groups/logo.vue';
import profile from './profile.vue';

export default {
  components: {
    groupLogo,
    profile,
  },
  name: 'nav-bar',
  data() {
    return {
      drawer: false,
      clipped: false,
      items: [{
        icon: 'fal fa-home',
        name: 'Home',
        link: '/',
      }],
      mini: true,
      right: null,
      title: 'Our Lab Training',
      logo: `${process.env.BASE_URL}img/icons/icon-192x192.png`,
    };
  },
  computed: {
    ...mapState('groups', ['isRemovePending', 'isCreatePending', 'isFindPending', 'isPatchPending']),
    ...mapGetters('users', { hasPerm: 'hasPerm', currentUser: 'current' }),
    ...mapGetters('groups', { findGroup: 'find' }),
    user() {
      return (this.currentUser._id === this.$store.state.auth.payload.userId ?
        this.currentUser : this.$store.state.auth.user) || { profile: {} };
    },
    groups() {
      const { user } = this;
      // force recompute on state change
      if (
        this.isFindPending ||
        this.isRemovePending ||
        this.isCreatePending ||
        this.isPatchPending
      ) Math.random();

      return this.findGroup({ query: { _id: { $in: user.perms.groups } } }).data;
    },
    groupEntries: groupEntries({ globalPlugins: false }),
    activeGroup() {
      return find(
        this.groups,
        group => this.$route.params.groupId === group._id,
      );
    },
  },
  methods: {
    ...mapActions('auth', { logoutUser: 'logout' }),
    ...mapActions('groups', { sFindGroups: 'find' }),
    async logout() {
      Object.keys(store._mutations).forEach((key) => {
        if (key.indexOf('/clearAll') !== -1) store.commit(key);
      });
      await this.logoutUser();
      this.$router.push({ path: '/login' });
    },
  },
  mounted() {
    this.sFindGroups(); // load all groups from server
  },
};
</script>

<style scoped>
.olt-logo {
  height: 1.7em;
  margin-right: 0.5em;
  vertical-align: bottom;
}

.title {
  overflow: visible;
}

.title .olt-logo {
  height: 1.4em;
  vertical-align: sub;
}

.olt-logo.dark {
  height: 1.2em;
  background-color: white;
  border-radius: 50%;
  padding: 0.1em;
}
</style>


<style>
.v-navigation-drawer--mini-variant .v-list__group__header__append-icon {
    display: none;
}

.v-navigation-drawer .v-list {
  padding: 0;
}

</style>

