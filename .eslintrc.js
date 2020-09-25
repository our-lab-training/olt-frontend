module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'template-curly-spacing': 'off',
    indent: 'off',
    'max-len': 'off',
    'vue/no-unused-vars': 'warn',
    'import/no-cycle': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
