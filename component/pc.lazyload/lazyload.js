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
var MOGU = MOGU || {};

(function(MOGU, $, document, window) {
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
    MOGU.lazyload = function(query, callback) {
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
    $(document).ready(function() {
        MOGU.lazyload('.' + LazyLoad_Settings.cls);
    });
}(MOGU, jQuery, document, window));