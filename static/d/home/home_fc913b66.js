// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function() {
    

    var doT = {
        version: '1.0.1',
        templateSettings: {
            evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode:      /\{\{!([\s\S]+?)\}\}/g,
            use:         /\{\{#([\s\S]+?)\}\}/g,
            useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            defineParams:/^\s*([\w$]+):([\s\S]+)/,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname:    'it',
            strip:      true,
            append:     true,
            selfcontained: false
        },
        template: undefined, //fn, compile template
        compile:  undefined  //fn, for express
    }, global;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = doT;
    } else if (typeof define === 'function' && define.amd) {
        define('@LIB@/doT/doT-1.0.1',[],function(){return doT;});
    } else {
        global = (function(){ return this || (0,eval)('this'); }());
        global.doT = doT;
    }

    function encodeHTMLSource() {
        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
            matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
        return function() {
            return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
        };
    }
    String.prototype.encodeHTML = encodeHTMLSource();

    var startend = {
        append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" },
        split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"}
    }, skip = /$^/;

    function resolveDefs(c, block, def) {
        return ((typeof block === 'string') ? block : block.toString())
        .replace(c.define || skip, function(m, code, assign, value) {
            if (code.indexOf('def.') === 0) {
                code = code.substring(4);
            }
            if (!(code in def)) {
                if (assign === ':') {
                    if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
                        def[code] = {arg: param, text: v};
                    });
                    if (!(code in def)) def[code]= value;
                } else {
                    new Function("def", "def['"+code+"']=" + value)(def);
                }
            }
            return '';
        })
        .replace(c.use || skip, function(m, code) {
            if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
                if (def[d] && def[d].arg && param) {
                    var rw = (d+":"+param).replace(/'|\\/g, '_');
                    def.__exp = def.__exp || {};
                    def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
                    return s + "def.__exp['"+rw+"']";
                }
            });
            var v = new Function("def", "return " + code)(def);
            return v ? resolveDefs(c, v, def) : v;
        });
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
    }

    doT.template = function(tmpl, c, def) {
        c = c || doT.templateSettings;
        var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
            str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
                    .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
            .replace(/'|\\/g, '\\$&')
            .replace(c.interpolate || skip, function(m, code) {
                return cse.start + unescape(code) + cse.end;
            })
            .replace(c.encode || skip, function(m, code) {
                needhtmlencode = true;
                return cse.start + unescape(code) + cse.endencode;
            })
            .replace(c.conditional || skip, function(m, elsecase, code) {
                return elsecase ?
                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
            })
            .replace(c.iterate || skip, function(m, iterate, vname, iname) {
                if (!iterate) return "';} } out+='";
                sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
                return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
                    +vname+"=arr"+sid+"["+indv+"+=1];out+='";
            })
            .replace(c.evaluate || skip, function(m, code) {
                return "';" + unescape(code) + "out+='";
            })
            + "';return out;")
            .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
            .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
            .replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

        if (needhtmlencode && c.selfcontained) {
            str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
        }
        try {
            return new Function(c.varname, str);
        } catch (e) {
            if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
            throw e;
        }
    };

    doT.compile = function(tmpl, def) {
        return doT.template(tmpl, null, def);
    };
}());
define('home/script/utils',[
  '@LIB@/doT/doT-1.0.1'
], function(doT) {
  var term, str_termlog, tpl_termlog;

  term = document.getElementById('J_term');
  str_termlog = document.getElementById('tpl_termlog');

  tpl_termlog = doT.template(str_termlog.innerHTML);

  var log = function(msg) {
    term.innerHTML += tpl_termlog({
      msg: msg
    });
  };

  log('utils 加载完毕...');

  return {
    log: log
  };
});

/**
 * @filename  jquery.img-lazyload.js
 * @desc      lazyload image
 * @author    longzhou (buji)
 * @blog      http://vicbeta.com
 * @email     pancnlz@gmail.com
 * @create    2013-11-04
 * @update    2013-11-25
 * @version   1.0.0
 * @reference http://blog.csdn.net/huli870715/article/details/8126519
 */
define('@COMPONENT@/pc.lazyload/lazyload',[],function() {
  var LazyLoad_Settings = {
    cls: 'img-lazyload',
    dsrc: 'd-src'
  };

  // Lazyload class
  function Lazyload($els, callback) {
    // 唯一标示
    this.stamp = +new Date + Math.random() >>> 0;

    // 用来存放需要懒加载的图片和模块
    this.imgArr = [];

    // lazyload 的元素
    this.$els = $els;

    // 图片加载完成的回调函数
    this.callback = callback && typeof callback === 'function' ? callback : null;

    // init
    this._filterItems();
  };

  /**
   * 获取目标节点距离页面顶部高度
   * @param {HTML Element} el
   */
  Lazyload.prototype._getTargetY = function(el) {
    var tp = el.offsetTop;

    if (el.offsetParent) {
      el = el.offsetParent;
      do {
        tp += el.offsetTop;
        el = el.offsetParent;
      } while(el);
    }
    return tp;
  };

  /**
   * @desc 处理需要懒加载的图片 
   */
  Lazyload.prototype._filterImgs = function() {
    var $imgs, dsrc, callback = this.callback,
      hasCallback = callback ? true : false;

    dsrc = LazyLoad_Settings.dsrc;
    $imgs = this.$els.filter('img').filter('[' + dsrc + ']');

    $imgs.each($.proxy(function(i, el) {
      var $this = $(el),
        data_src = $this.attr(dsrc);

      if (!data_src) {
        return;
      }

      $this.css('opacity', 0);

      el.onload = function() {
        $(this).animate({
          'opacity': 1
        }, 300, function() {
          if (hasCallback) {
            callback($this);
          }
        });
      };
      this.imgArr.push(el);

      // 先计算出每个图片距离页面顶部的高度，避免在事件事件处理函数中进行大量重复计算
      $this.targetY = this._getTargetY($this[0]);
    }, this));
  };

  /**
   * @desc 处理需要懒加载的图片和模块入口
   */
  Lazyload.prototype._filterItems = function() {
    this._filterImgs();
  };

  /**
   * @desc 检查需要懒加载的节点是否进入可视区域
   * @param {jQuery Object} el
   */
  Lazyload.prototype._checkBounding = function($el) {
    var scrollY, seeY, targetY;

    // 页面滚动条高度
    scrollY = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
    // 浏览器可视区域高度
    seeY = window.innerHeight || document.documentElement.clientHeight;

    if ($el.targetY) {
      targetY = $el.targetY;
    } else {
      targetY = this._getTargetY($el[0]);
    }

    // 当目标节点进入可使区域
    if (Math.abs(targetY - scrollY) < seeY) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @desc lazyload 调用
   * @param {string} query 选择器
   * @param {function} callback 加载完毕回调参数
   */
  return function(query, callback) {
    var lz = new Lazyload($(query), callback);

    $(window)
      .on('scroll.lz' + lz.stamp + ' resize.lz' + lz.stamp, function() {
        var i, len, el;

        // 全部加载完时，解绑事件
        if (lz.imgArr.length <= 0) {
          $(window).off('scroll.lz' + lz.stamp);
          $(window).off('resize.lz' + lz.stamp);
        }

        for (i = 0, len = lz.imgArr.length; i < len;) {
          if (lz.imgArr[i]) {
            el = lz.imgArr[i];

            var $img = $(el);
            if (lz._checkBounding($img)) {
              $img.attr('src', $img.attr(LazyLoad_Settings.dsrc))
                .attr(LazyLoad_Settings.dsrc, '');
              lz.imgArr.splice(i, 1);
              len--;
            } else {
              i++;
            }
          }
        }
      })
      .trigger('scroll.lz' + lz.stamp);
  };

  // 默认调用
  // $(document).ready(function() {
  //     MOGU.lazyload('.' + LazyLoad_Settings.cls);
  // });
});
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

define("home/home", function(){});

