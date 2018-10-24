import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import feathersVuex from 'feathers-vuex';
import feathersClient from '@/feathers-client';
import { kebabCase, forIn } from 'lodash';

const { service } = feathersVuex(feathersClient, { idField: '_id' });

export default (async () => {
  const requireModule = require.context('.', true, /plugin\.json$/);
  const plugins = {};
  const routes = [];

  await Promise.all(requireModule.keys().map(async (fileName) => {
    const dir = fileName.replace(/\/plugin\.json$/, '');
    let config = null;
    try {
      // eslint-disable-next-line
      config = (await import(`${dir}/frontend/index.js`)).default;
      config.ref = config.ref || dir;
      plugins[config.ref] = config;

      const setupRoute = (entry, ref) => {
        if (!entry.component) return;
        entry._component = Vue.component(
          kebabCase(`${config.ref}-${ref}`),
          () => import(`${dir}/${entry.component}.vue`),
        );
        const path = (entry.path || entry.link || '').replace('{groupId}', ':groupId');
        if (path) {
          routes.push({
            path,
            component: entry._component,
          });
        }
      };

      forIn(config.entries || {}, setupRoute);
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
