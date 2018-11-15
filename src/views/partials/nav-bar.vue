<template>
  <div>

    <v-toolbar scroll-off-screen app v-if="$vuetify.breakpoint.xsOnly">
      <v-toolbar-side-icon @click.stop="mini=false; drawer=!drawer">
        <v-icon>menu</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-title>{{title}}</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer
      persistent
      :value="$vuetify.breakpoint.smAndUp || drawer"
      enable-resize-watcher
      :app="!($vuetify.breakpoint.smOnly && !mini)"
      :stateless="!$vuetify.breakpoint.xsOnly || mini"
      :temporary="$vuetify.breakpoint.xsOnly"
      :absolute="$vuetify.breakpoint.xsOnly || ($vuetify.breakpoint.smOnly && !mini)"
      :mini-variant.sync="mini"
    >

      <v-toolbar flat v-if="!$vuetify.breakpoint.xsOnly">
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-tooltip right>
                <v-btn
                  flat
                  icon
                  @click.stop="mini=!mini"
                  slot="activator"
                >
                  <v-icon>menu</v-icon>
                </v-btn>
                <span>{{mini ? 'Open' : 'Close'}} Menu</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="title">
                {{title}}
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn flat icon @click.stop="mini=!mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider/>

      <v-list>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-tooltip right>
                <v-icon slot="activator">account_circle</v-icon>
                <span>{{user.profile.displayname}}</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{user.profile.displayname}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/logout">
            <v-list-tile-action>
              <v-tooltip right>
                <v-icon slot="activator">meeting_room</v-icon>
                <span>Logout</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Logout
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

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
            v-for="(entry, eref) in groupEntries[group._id]"
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
import groupEntries from '@/lib/groupEntries';
import groupLogo from './groups/logo.vue';

export default {
  components: {
    groupLogo,
  },
  name: 'nav-bar',
  data() {
    return {
      drawer: false,
      clipped: false,
      items: [{
        icon: 'home',
        name: 'Home',
        link: '/',
      }],
      mini: true,
      right: null,
      title: 'Access',
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
      await this.logoutUser();
      this.$router.push({ path: '/login' });
      // TODO Clear stores
    },
  },
  mounted() {
    this.sFindGroups(); // load all groups from server
  },
};
</script>

<style>
.v-navigation-drawer--mini-variant .v-list__group__header__append-icon {
    display: none;
}

.v-navigation-drawer .v-list {
  padding: 0;
}
</style>

