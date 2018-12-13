import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import feathersVuex from 'feathers-vuex';
import feathersClient from '@/feathers-client';
import { kebabCase, forIn } from 'lodash';

const { service } = feathersVuex(feathersClient, { idField: '_id' });

export default (async () => {
  const requireModule = require.context('.', true, /\/frontend\/index\.js$/);
  const plugins = {};
  const routes = [];

  await Promise.all(requireModule.keys().map(async (fileName) => {
    const dir = fileName.replace(/\/frontend\/index\.js$/, '');
    let config = null;
    try {
      // eslint-disable-next-line
      config = requireModule(fileName).default;
      config.ref = config.ref || dir;
      config.entries = [];
      plugins[config.ref] = config;

      const setupRoute = (route, ref) => {
        route.ref = route.ref || ref;
        if (route.entry) config.entries.push(route);
        if (!route.component) return;
        route._component = Vue.component(
          kebabCase(`${config.ref}-${ref}`),
          typeof route.component === 'string' ?
            () => import(`${dir}/${route.component}.vue`) :
            route.component,
        );
        const path = (route.path || '').replace('{groupId}', ':groupRef');
        if (path) {
          routes.push({
            path,
            name: route.name,
            component: route._component,
            meta: { route, ...route.meta, path: route.path },
          });
        }
      };

      // forIn(config.entries || {}, setupRoute);
      forIn(config.routes || [], setupRoute);
      forIn(config.store || {}, (v, i) => service(i, v)(store));
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      if (config && config.ref && plugins[config.ref]) delete plugins[config.ref];
    }
  }));

  const plugin = {
    plugins,
    install() {
      Object.defineProperty(Vue.prototype, '$plugins', {
        get() { return plugins; },
      });
    },
  };

  Vue.use(plugin);

  router.addGroupRoutes(routes);
  window.router = router;

  return plugins;
})();
