<template>
  <v-card>
    <v-progress-linear
      color="primary"
      height="4"
      style="margin: 0;"
      :indeterminate="isPatchPending || isUpdatePending"
    />
    <v-card-title class="headline">
      Manage {{currentGroup.name}}
      <v-spacer/>
      <v-btn text icon @click="closeAndClear()">
        <v-icon>far fa-times</v-icon>
      </v-btn>
    </v-card-title>

    <v-tabs v-model="tab" :show-arrows="$vuetify.breakpoint.smAndDown">
      <v-tab key="settings">
        <v-icon style="padding-right: 0.5em;">fas fa-wrench</v-icon>
        Settings
      </v-tab>
      <v-tab key="plugins">
        <v-icon style="padding-right: 0.5em;">fas fa-plug</v-icon>
        Plugins
      </v-tab>
      <v-tab key="users">
        <v-icon style="padding-right: 0.5em;">fas fa-users</v-icon>
        Users
      </v-tab>
      <v-tab key="roles">
        <v-icon style="padding-right: 0.5em;">fas fa-user-tag</v-icon>
        Roles
      </v-tab>
      <v-tab key="events">
        <v-icon style="padding-right: 0.5em;">fas fa-flag</v-icon>
        Events
      </v-tab>
      <!-- <v-tab key="perms">
        <v-icon style="padding-right: 0.5em;">fas fa-key</v-icon>
        Perms
      </v-tab> -->
    </v-tabs>

    <v-divider xs12></v-divider>

    <v-tabs-items v-model="tab">
      <v-tab-item key="settings">
        <group-settings v-model="settingsCopy" :err="error" />
      </v-tab-item>

      <v-tab-item key="plugins">
        <v-list>
          <v-list-tile avatar v-for="(plugin, ref) in this.$plugins" :key="ref">

            <v-list-tile-avatar>
              <v-icon v-text="getIcon(plugin)"></v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title >{{plugin.name || ref}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-layout row wrap>
                <v-flex style="margin-right: 1em;">
                  <v-btn
                    text
                    icon
                    :to="plugin.settingsLink.replace('{groupId}', currentGroup._id)"
                    v-if="plugin.settingsLink"
                  >
                    <v-icon>settings</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex>
                  <v-switch
                    :value="plugin.ref"
                    :readonly="plugin.global || isPatchPending"
                    v-model="plugins"
                    @change="pluginsChange"
                  />
                </v-flex>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-tab-item>

      <v-tab-item key="users">
        <v-layout row wrap>
          <v-flex xs6 sm3>
            <manage-list type="users" :current.sync="manCurr"/>
          </v-flex>
          <v-flex xs6 sm9>
            <manage-edit type="users" :current.sync="manCurr"/>
          </v-flex>
        </v-layout>
      </v-tab-item>

      <v-tab-item key="roles">
        <v-layout row wrap>
          <v-flex xs6 sm3>
            <manage-list type="roles" :current.sync="manCurr"/>
          </v-flex>
          <v-flex xs6 sm9>
            <manage-edit type="roles" :current.sync="manCurr"/>
          </v-flex>
        </v-layout>
      </v-tab-item>

      <v-tab-item key="events">
        <v-layout row wrap>
          <v-flex xs6 sm3>
            <manage-list type="events" :current.sync="manCurr"/>
          </v-flex>
          <v-flex xs6 sm9>
            <manage-event :current.sync="manCurr"/>
          </v-flex>
        </v-layout>
      </v-tab-item>

      <!-- <v-tab-item key="perms">
        <v-layout row wrap>
          <v-flex xs6 sm3>
            <manage-list type="perms" :current.sync="manCurr"/>
          </v-flex>
          <v-flex expand>
            <manage-edit type="perms" :current.sync="manCurr"/>
          </v-flex>
        </v-layout>
      </v-tab-item> -->

    </v-tabs-items>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        text
        @click="closeAndClear()"
      >
        Close
      </v-btn>
      <v-btn
        v-if="tab===0"
        text
        @click.stop="saveSettings()"
        :disabled="isPatchPending || isUpdatePending"
        :loading="isPatchPending || isUpdatePending"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import {
 find, filter, reduce, forIn,
} from 'lodash';
import groupSettings from '@/views/partials/groups/settings.vue';
import manageList from './manage/list.vue';
import manageEdit from './manage/edit.vue';
import manageEvent from './manage/event.vue';

export default {
  components: {
    groupSettings,
    manageList,
    manageEdit,
    manageEvent,
  },
  props: ['entry'],
  data() {
    return {
      plugins: [],
      tab: 0,
      error: null,
      settingsCopy: {},
      manCurr: null,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapState('groups', ['isPatchPending', 'isUpdatePending']),
  },
  mounted() {
    this.plugins = [
      ...(this.currentGroup.plugins || []),
      // add globals
      ...reduce(this.$plugins, (a, p) => [...a, ...(p.global ? [p.ref] : [])], []),
    ];
    this.settingsCopy = {
      name: this.currentGroup.name,
      type: this.currentGroup.type,
      desc: this.currentGroup.desc,
      icon: this.currentGroup.icon,
      logo: this.currentGroup.logo,
    };
  },
  methods: {
    ...mapActions('groups', ['patch']),
    async patchGroup(props) {
      await this.patch([this.currentGroup._id, props]);
      forIn(props, (v, i) => { this.currentGroup[i] = v; });
    },
    getIcon(plugin) {
      if (plugin.icon) return plugin.icon;
      const { icon } = find(plugin.entries, (entry) => entry.icon);
      return icon || 'dashboard';
    },
    pluginsChange() {
      const plugins = filter(this.plugins, (p) => !this.$plugins[p].global) || [];
      this.patchGroup({ plugins });
    },
    async saveSettings() {
      if (this.isPatchPending || this.isUpdatePending) return;
      this.error = null;
      try {
        await this.patchGroup(this.settingsCopy);
        this.$emit('modalClose');
      } catch (err) {
        this.error = err;
      }
    },
    async closeAndClear() {
      this.$emit('modalClose');
    },
  },
};
</script>
