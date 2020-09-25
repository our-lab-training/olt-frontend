import Vue from 'vue';
// import { kebabCase, forIn } from 'lodash';

const helpers = {
  parseErr(err, errorObj) {
    if (!err.errors) {
      errorObj.errorMsg = err.message;
      return;
    }
    Object.keys(err.errors).forEach((key) => {
      const keys = key.split('.');
      let end = keys.pop();
      while (!Number.isNaN(Number(end))) end = keys.pop();
      if (!end) return;
      errorObj[end] = typeof err.errors[key] === 'string'
          ? err.message
          : err.errors[key].message;
    });
  },
};

export default (() => {
  const plugin = {
    helpers,
    install() {
      Object.defineProperty(Vue.prototype, '$helpers', {
        get() { return helpers; },
      });
    },
  };
  Vue.use(plugin);
  return helpers;
})();
