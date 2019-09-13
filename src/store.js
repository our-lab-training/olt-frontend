import Vue from 'vue';
import Vuex from 'vuex';
// import VuexPersist from 'vuex-persist';
import feathersVuex from 'feathers-vuex';
import { assign } from 'lodash';
import feathersClient from './feathers-client';

/* const vuexPersist = new VuexPersist({
  key: 'olt-frontend',
  storage: localStorage,
}); */

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id', customMerge: assign });

Vue.use(Vuex);
Vue.use(FeathersVuex);

const node2reg = node => new RegExp(node.replace(/\//g, '\\/').replace(/\*/g, '.*'));

const hasPerm = (state, permission, exact = false) => {
  const { user } = state.auth;
  let perm = permission;
  if (typeof permission === 'string') perm = permission.split('.');
  return user.perms.all.some((p) => {
    if (exact && p.length !== perm.length) return false;
    for (let i = 0; i < Math.min(p.length, perm.length); i += 1) {
      if (!exact && p[i] === '*') return true;
      if (p[i] === '*' || p[i].indexOf('*') === -1 || !node2reg(p[i]).test(perm[i])) {
        if ((exact || perm[i] !== '*') && perm[i] !== p[i]) return false;
      }
    }
    return true;
  });
};

export default new Vuex.Store({

  plugins: [
    service('groups', { paginate: true }),
    service('perms'),
    service('roles'),
    service('issues'),
    service('events'),
    service('notify-templates', {
      instanceDefaults: {
        groupId: '',
        subject: '',
        text: '',
        short: '',
        to: '',
        cc: '',
        bcc: '',
        sendToUsers: true,
        groupUsers: false,
        sendOn: 'instant',
        sendOnHour: 8,
        sendOnDay: [],
      },
    }),
    service('users', {
      paginate: true,
      replaceItems: true,
      getters: {
        hasPerm: (state, getters, rootState) =>
          (perm, exact = false) => hasPerm(rootState, perm, exact),
      },
      actions: {
        hasPerm: ({ rootState }, perm) => hasPerm(rootState, perm, false),
        hasPermExact: ({ rootState }, perm) => hasPerm(rootState, perm, true),
      },
    }),
    auth({ userService: 'users' }),
    // vuexPersist.plugin,
  ],

  state: {

  },
  mutations: {

  },
  actions: {

  },
});
