import Vue from 'vue';
import Router from 'vue-router';

import landing from './views/Landing.vue';
import Login from './components/LoginCard.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: landing,
      children: [
        {
          path: '',
          name: 'Login',
          component: Login,
        },
      ],
    },
    {
      path: '/dashboard/',
      name: 'Dashboard',
      component: Home,
    },
  ],
});
