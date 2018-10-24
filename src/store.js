import Vue from 'vue';
import Vuex from 'vuex';
import feathersVuex from 'feathers-vuex';
import feathersClient from './feathers-client';

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' });

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({

  plugins: [
    service('groups', { paginate: true }),
    service('perms'),
    service('users', {
      paginate: true,
      replaceItems: true,
      getters: {
        hasPerm: (state, getters) => (permission, exact = false) => {
          const user = getters.current;
          let perm = permission;
          if (typeof permission === 'string') perm = permission.split('.');
          return user.perms.all.some((p) => {
            if (exact && p.length !== perm.length) return false;
            for (let i = 0; i < Math.min(p.length, perm.length); i += 1) {
              if (!exact && p[i] === '*') return true;
              if ((exact || perm[i] !== '*') && perm[i] !== p[i]) return false;
            }
            return true;
          });
        },
      },
    }),
    auth({ userService: 'users' }),
  ],

  state: {

  },
  mutations: {

  },
  actions: {

  },
});
