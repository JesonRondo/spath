require([
  'home/script/utils',
  '@COMPONENT@/pc.lazyload/lazyload'
], function(utils, lazyload) {

  utils.log('home 加载完毕...');

  lazyload('.img-lazyload');

  utils.log('lazyload 调用完毕...');

  require([__.s.APPMAP['home/script/async']], function(info) {
    utils.log(info + ' 加载完毕...');
  });

});
