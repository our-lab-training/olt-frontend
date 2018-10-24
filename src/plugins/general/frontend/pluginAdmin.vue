<template>
  <v-card>
    <v-progress-linear
      indeterminate
      color="primary"
      height="2"
      id="pluginAdminLoading"
      v-if="isPatchPending || isUpdatePending"
    />
    <v-card-title class="headline">{{entry.name}} for {{currentGroup.name}}</v-card-title>

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

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        flat="flat"
        @click="$emit('close')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { find, filter, reduce } from 'lodash';

export default {
  props: ['entry'],
  data() {
    return {
      plugins: [],
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapState('groups', ['isPatchPending', 'isUpdatePending']),
  },
  mounted() {
    this.plugins = [
      ...this.currentGroup.plugins,
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
  },
};
</script>

<style scoped>

#pluginAdminLoading {
  margin: 0;
}

</style>
