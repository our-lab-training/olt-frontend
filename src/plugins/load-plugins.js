import Vue from 'vue';
import { kebabCase, forIn } from 'lodash';

export default (async () => {
  const requireModule = require.context('.', true, /plugin\.json$/);
  const plugins = {};

  await Promise.all(requireModule.keys().map(async (fileName) => {
    const dir = fileName.replace(/\/plugin\.json$/, '');
    let config = null;
    try {
      // eslint-disable-next-line
      config = (await import(`${dir}/frontend/index.js`)).default;
      config.ref = config.ref || dir;
      plugins[config.ref] = config;
      forIn(config.entries, (entry, ref) => {
        if (entry.component) {
          Vue.component(
            kebabCase(`${config.ref}-${ref}`),
            () => import(`${dir}/${entry.component}.vue`),
          );
        }
      });
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

  return plugins;
})();
