<template>
  <v-card>
        <v-card-title class="headline" v-text="entry.name"></v-card-title>

        <v-list>
          <v-list-tile avatar v-for="(plugin, ref) in plugins" :key="ref" @click="log(plugin)">

            <v-list-tile-avatar>
              <v-icon v-text="getIcon(plugin)"></v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title >{{plugin.name || ref}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-layout row wrap>
                <v-flex style="margin-right: 1em;">
                  <v-btn flat icon :to="plugin.settingsLink" v-if="plugin.settingsLink">
                    <v-icon>settings</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex>
                  <v-switch v-model="plugin.enabled" :disabled="plugin.global"/>
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
import { find, mapValues, filter } from 'lodash';

export default {
  props: ['entry'],
  data() {
    const plugins = filter(this.$plugins, () => true);
    return {
      plugins: mapValues(plugins, plugin => ({
        ...plugin,
        enabled: true,
      })),
    };
  },
  methods: {
    getIcon(plugin) {
      if (plugin.icon) return plugin.icon;
      const { icon } = find(plugin.entries, entry => entry.icon);
      return icon || 'dashboard';
    },
    log(plugin) {
      console.log(plugin.enabled);
    },
  },
};
</script>

<style scoped>

</style>
