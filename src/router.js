import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';

import Landing from './views/layouts/Landing.vue';
import login from './views/login.vue';

import Home from './views/layouts/Home.vue';
import dashboard from './views/dashboard.vue';

import Group from './views/layouts/Group.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          name: 'Home',
          component: dashboard,
        },
      ],
    },
    {
      path: '/',
      component: Landing,
      children: [
        {
          path: '/login/',
          name: 'Login',
          component: login,
          meta: { isPublic: true },
        },
        {
          path: '/logout/',
          name: 'Logout',
          component: login,
          meta: { isPublic: true },
        },
      ],
    },
    { path: '*', redirect: '/' },
  ],
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => !!record.meta.isPublic);
  if (to.path === '/logout') {
    // eslint-disable-next-line no-console
    return store.dispatch('auth/logout').catch(console.error).then(() => next({ path: '/login' }));
  }
  if (isPublic && store.state.auth.user) {
    return next({ path: '/' });
  } else if (!isPublic && !store.state.auth.user) {
    return next({
      path: '/login',
      query: to.path === '/' ? {} : { followPath: to.path },
    });
  }
  return next();
});

router.addGroupRoutes = (children) => {
  router.addRoutes([
    {
      path: '/group/:groupRef/',
      component: Group,
      children,
    },
  ]);
};

export default router;
