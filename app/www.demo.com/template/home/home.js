require([
  'home/script/utils',
  __.s.COMPONENT + '/pc.lazyload/lazyload.js'
], function(utils, lazyload) {

  utils.log('home 加载完毕...');

  lazyload('.img-lazyload');

  utils.log('lazyload 调用完毕...');

});
