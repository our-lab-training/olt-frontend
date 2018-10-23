// eslint-disable-next-line
import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './plugins/load-plugins';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ion-/];

// Auth first before loading the app
store.dispatch('auth/authenticate').catch(console.error).then(() => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
});
