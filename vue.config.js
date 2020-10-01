module.exports = {
  transpileDependencies: ['feathers-vuex'],
  configureWebpack: {
    devtool: 'source-map',
  },
  pwa: {
    name: 'Our Lab Training',
  },
  devServer: {
    disableHostCheck: true,
    watchOptions: {
      poll: true,
    },
  },
  productionSourceMap: false,
};
