require([
  'home/script/utils',
  '@COMPONENT@/pc.lazyload/lazyload'
], function(utils, lazyload) {

  utils.log('home 加载完毕...');

  lazyload('.img-lazyload');

  utils.log('lazyload 调用完毕...');

});
