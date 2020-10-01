import Vue from 'vue';
import Vuex from 'vuex';
// import VuexPersist from 'vuex-persist';
import auth from './store/store.auth';

import { FeathersVuex } from './feathers-client';

/* const vuexPersist = new VuexPersist({
  key: 'olt-frontend',
  storage: localStorage,
}); */

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
  // The path where the service modules live
  './store/services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/,
);
const servicePlugins = requireModule
  .keys()
  .map((modulePath) => requireModule(modulePath).default);

export default new Vuex.Store({

  // LOOK AT https://github.com/feathersjs-ecosystem/feathers-chat-vuex/blob/master/src/store/services/users.js
  // vs https://github.com/feathersjs-ecosystem/feathers-chat-vuex-0.7/blob/master/src/store/index.js
  plugins: [
    ...servicePlugins, auth,
  ],

  state: {

  },
  mutations: {

  },
  actions: {

  },
});
