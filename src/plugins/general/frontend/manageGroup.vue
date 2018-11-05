<template>
  <v-card>
    <v-progress-linear
      indeterminate
      color="primary"
      height="2"
      id="pluginAdminLoading"
      v-if="isPatchPending || isUpdatePending"
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
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Name *" required v-model="currentClone.name" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Type *"
                :items="['private', 'public', 'global', 'template']"
                v-model="currentClone.type"
              />
            </v-flex>
            <v-flex xs3>
              <v-select
                label="Icon"
                :items="icons"
                v-model="currentClone.icon"
              >
                <template slot="item" slot-scope="data">
                  <v-icon>{{data.item}}</v-icon>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-icon>{{data.item}}</v-icon>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-textarea label="Description" v-model="currentClone.desc"></v-textarea>
            </v-flex>
          </v-layout>
          <small>*indicates required field</small>
        </v-container>
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
                    :readonly="plugin.global"
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
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { find, filter, reduce } from 'lodash';
import icons from '@/views/partials/groups/icons.json';

export default {
  props: ['entry'],
  data() {
    return {
      plugins: [],
      tab: 0,
      icons,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapState('groups', ['isPatchPending', 'isUpdatePending']),
    currentClone() {
      const { Group } = this.$FeathersVuex;
      return (new Group(this.currentGroup)).clone();
    },
  },
  mounted() {
    this.plugins = [
      ...(this.currentGroup.plugins || []),
      // add globals
      ...reduce(this.$plugins, (a, p) => [...a, ...(p.global ? [p.ref] : [])], []),
    ];
  },
  methods: {
    getIcon(plugin) {
      if (plugin.icon) return plugin.icon;
      const { icon } = find(plugin.entries, entry => entry.icon);
      return icon || 'dashboard';
    },
    pluginsChange() {
      this.currentGroup.plugins = filter(this.plugins, p => !this.$plugins[p].global) || [];
      this.currentGroup.save();
    },
    async saveSettings() {
      this.currentClone.commit();
      await this.currentGroup.save();
      this.$emit('modalClose');
    },
    async closeAndClear() {
      this.currentClone.reset();
      this.$emit('modalClose');
    },
  },
};
</script>

<style scoped>

#pluginAdminLoading {
  margin: 0;
}

</style>
