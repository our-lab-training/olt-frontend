// eslint-disable-next-line
import '@babel/polyfill';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import shortkey from 'vue-shortkey';
import vueMoment from 'vue-moment';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './plugins/load-plugins';
import './plugins/helpers';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ion-/];
Vue.use(shortkey);
Vue.use(vueMoment);
Vue.use(VueCompositionApi);

// Auth first before loading the app
store
  .dispatch('auth/authenticate')
  .catch(() => {
    Object.keys(store._mutations).forEach((key) => {
      if (key.indexOf('/clearAll') !== -1) store.commit(key);
    });
    store.commit('auth/logout');
  })
  .then(() => {
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  });
