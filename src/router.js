import Vue from 'vue';
import Router from 'vue-router';

import landing from './views/Landing.vue';
import Login from './components/LoginCard.vue';

import Home from './views/Home.vue';
import Dashboard from './components/postAuth/Dashboard.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: landing,
      children: [
        {
          path: '/',
          name: 'Login',
          component: Login,
        },
      ],
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/dashboard/',
          name: 'Dashboard',
          component: Dashboard,
        },
      ],
    },
  ],
});
