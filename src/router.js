import Vue from 'vue';
import Router from 'vue-router';

import PreAuthHome from './views/preAuth/home.vue';
import PostAuthHome from './views/postAuth/dashboard.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: PreAuthHome,
      children: [
      ],
    },
    {
      path: '/dashboard/',
      name: 'Dashboard',
      component: PostAuthHome,
      children: [
      ],
    },
  ],
});
