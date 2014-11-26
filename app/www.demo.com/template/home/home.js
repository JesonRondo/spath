require([
  'home/script/utils',
  '@COMPONENT@/pc.lazyload/lazyload'
], function(utils, lazyload) {

  utils.log('home 加载完毕...');

  lazyload('.img-lazyload');

  utils.log('lazyload 调用完毕...');

  require([
    __.u.path('home/script/async')
  ], function(info) {
    utils.log(info + ' 加载完毕...');
  });

  require([
    __.u.path('@COMPONENT@/com.timer/timer')
  ], function(Countdown) {
    utils.log('@COMPONENT@/com.timer/timer' + ' 加载完毕...');
    new Countdown($('#J_timer'), 123122, '%dday %hhours %iminutes %ssecounds');
  });

});
