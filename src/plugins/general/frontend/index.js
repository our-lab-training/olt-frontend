/*
import Vue from 'vue';
import { mapValues } from 'lodash';
import plugin from '../plugin.json';
import pluginAdmin from './pluginAdmin.vue';
import leaveGroup from './leaveGroup.vue';
import joinGroup from './joinGroup.vue';

Vue.component('general-plugin-admin', pluginAdmin);
Vue.component('general-join-group', joinGroup);
Vue.component('general-leave-group', leaveGroup);

const entryComps = {
  pluginAdmin,
  leaveGroup,
  joinGroup,
};

plugin.entries = mapValues(plugin.entries, (entry, i) => {
  entry.modalComponent = entryComps[i];
  return entry;
});
*/

import plugin from '../plugin.json';

export default plugin;
