(function() {
  var __ = window.__ || {};

  __.u = {
    /**
     * 转化路径，判断环境、替换占位符等等
     * @param  {string} pth 转化前的路径
     * @return {string} 转化前的路径
     */
    path: function(pth) {

      var prefix = '',
        type = '',
        file_type = '';

      if (/^@LIB@\//.test(pth)) { // lib

        prefix = __.s.LIB + '/';
        pth = pth.replace(/^@LIB@\//i, '');
        type = 'lib';

      } else if (/^@COMPONENT@\//.test(pth)) { // component

        prefix = __.s.COMPONENT + '/';
        pth = pth.replace(/^@COMPONENT@\//i, '');
        type = 'component';

      } else { // app

        type = 'app'

      }

      if (/\.less$/.test(pth)) { // less

        file_type = 'less';

      } else { // js

        file_type = 'js';
        if (!/\.js$/.test(pth)) {
          pth += '.js';
        }

      }

      if (!__.s.debug) {

        pth = pth.replace(/\.less$/i, '.css');

        switch(type) {
          case 'lib':
            pth = __.s.LIBMAP[pth] || pth;
            break;

          case 'component':
            pth = __.s.COMPONENTMAP[pth] || pth;
            break;

          case 'app':
            pth = __.s.APPMAP[pth] || pth;
            break;
        }

      }

      pth = prefix + pth;

      if (file_type === 'js' && type === 'app') {
        pth = pth.split('.js');
        pth.pop();
        pth = pth.join('.js');
      }

      return pth;
    }
  };

  window.__ = __;
}());