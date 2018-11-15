<template>
  <v-card>
    <v-progress-linear
      color="primary"
      height="4"
      style="margin: 0;"
      :indeterminate="isPatchPending || isUpdatePending"
    />
    <v-card-title class="headline">Manage {{currentGroup.name}}</v-card-title>

    <v-tabs v-model="tab">
      <v-tab key="settings">
        <v-icon style="padding-right: 0.5em;">build</v-icon>
        Settings
      </v-tab>
      <v-tab key="plugins">
        <v-icon style="padding-right: 0.5em;">extension</v-icon>
        Plugins
      </v-tab>
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
                    flat
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

    </v-tabs-items>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        flat="flat"
        @click="closeAndClear()"
      >
        Close
      </v-btn>
      <v-btn
        v-if="tab===0"
        flat="flat"
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
import { find, filter, reduce, forIn } from 'lodash';
import groupSettings from '@/views/partials/groups/settings.vue';

export default {
  components: {
    groupSettings,
  },
  props: ['entry'],
  data() {
    return {
      plugins: [],
      tab: 0,
      error: {},
      settingsCopy: {},
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
      const { icon } = find(plugin.entries, entry => entry.icon);
      return icon || 'dashboard';
    },
    pluginsChange() {
      const plugins = filter(this.plugins, p => !this.$plugins[p].global) || [];
      this.patchGroup({ plugins });
    },
    async saveSettings() {
      if (this.isPatchPending || this.isUpdatePending) return;
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
