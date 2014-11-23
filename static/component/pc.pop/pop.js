/**
 * @filename jquery.vpop.js
 * @dese     jquery plugin replace system notice
 *           - include functions:
 *               $.alert();
 *               $.confirm();
 *               $.fn.confirm();
 * @author   longzhou (buji)
 * @blog     http://vicbeta.com
 * @email    pancnlz@gmail.com
 * @create   2013-10-28
 * @update   2013-10-28
 * @version  1.0.0
 */
(function($) {
    var App = {};

    /**
     * @desc 工具集
     */
    App.Util = {
        /**
         * @desc Mask覆盖层
         */
        mask: function() {
            var $mask = $('#vp_mk');

            if ($mask.length <= 0) {
                $mask = $([
                    '<div class="vp_mk" id="vp_mk"></div>'
                ].join('')).css({
                    'opacity': .6
                });

                $('body').append($mask);
            }
        },
        /**
         * @desc 显示弹框
         * @type {string} type 弹框类型
         * @params {object} params 弹框参数
         */
        show: function(type, params) {
            var $vp_wrap = $('#vp_wrap'),
                $box, getDom, t;

            if ($vp_wrap.length <= 0) {
                $vp_wrap = $([
                    '<div class="vp_wrap" id="vp_wrap">',
                        '<h5 class="vp_t"></h5>',
                        '<a href="javascript:;" class="vp_close">×</a>',
                        '<div class="v_pop_box"></div>',
                    '</div>'
                ].join(''));

                $('body').append($vp_wrap);

                // mask event
                $('#vp_mk')
                    .off('click')
                    .on('click', function() {
                        clearTimeout(t);
                        $vp_wrap.addClass('vp_shake');
                        t = setTimeout(function() {
                            $vp_wrap.removeClass('vp_shake');
                        }, 500);
                    });
            }

            $vp_wrap.find('.vp_t').html(params.title);

            getDom = {
                alert: function() {
                    $box = $('.vp_alert');

                    if ($box.length <= 0) {
                        $box = $([
                            '<div class="vp_alert vp_inner">',
                                '<p class="vp_cnt"></p>',
                                '<a href="javascript:;" class="vp_btn vp_ok">确定</a>',
                            '</div>'
                        ].join(''));
                    }

                    $box.show()
                        .find('.vp_cnt')
                        .html(params.content);

                    return $box;
                },
                confirm: function() {
                    $box = $('.vp_confirm');

                    if ($box.length <= 0) {
                        $box = $([
                            '<div class="vp_confirm vp_inner">',
                                '<p class="vp_cnt"></p>',
                                '<a href="javascript:;" class="vp_btn vp_ok">确定</a>',
                                '<a href="javascript:;" class="vp_btn vp_cancel">取消</a>',
                            '</div>'
                        ].join(''));
                    }

                    $box.show()
                        .find('.vp_cnt')
                        .html(params.content);

                    return $box;
                }
            };

            $vp_wrap.find('.v_pop_box').append(getDom[type]());

            // show
            $vp_wrap
                .css({
                    'display': 'block',
                    'opacity': 0
                })
                .css({
                    'margin-left': -$vp_wrap.width() / 2 - 1,
                    'margin-top': -$vp_wrap.height() / 2 - 1,
                    'opacity': 1
                });
            $('#vp_mk').show();
        },
        /**
         * @desc 关闭弹框
         * @param {book} ret 返回值
         * @param {function} callback 回调函数
         */
        close: function(ret, callback) {
            // hide
            $('#vp_mk').hide();
            $('#vp_wrap').find('.vp_inner').hide();
            $('#vp_wrap').hide();

            if (callback !== undefined && typeof callback === 'function') {
                callback(ret);
            }
        },
        /**
         * @desc 防抖执行
         * @param {function} func 调用函数
         * @param {int} wait 间隔ms
         */
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;

                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };

                var callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);
            };
        }
    };

    /**
     * @desc alert
     * @param {string} str - display string
     * @param {object} options - 定制参数
     */
    $.alert = function(str, options) {
        var render,

            settings = $.extend({
                title: '提示',
                content: str
            }, options),

            bindEvent = function() {
                $('#vp_wrap')
                    .off('click')
                    .on('click', '.vp_ok, .vp_close', function() {
                        App.Util.close();
                    });
            };

        // render
        (function() {
            App.Util.mask();
            App.Util.show('alert', settings);

            bindEvent();
        }());
    };

    /**
     * @desc confirm
     * @param {string} str - display string
     * @param {function} callback - 回调函数，参数为返回值
     * @param {object} options - 定制参数
     */
    $.confirm = function(str, callback, options) {
        var render,

            settings = $.extend({
                title: '提示',
                content: str
            }, options),

            bindEvent = function() {
                $('#vp_wrap')
                    .off('click')
                    .on('click', '.vp_close, .vp_cancel', function() {
                        App.Util.close(false, callback);
                    })
                    .on('click', '.vp_ok', function() {
                        App.Util.close(true, callback);
                    });
            };

        // render
        (function() {
            App.Util.mask();
            App.Util.show('confirm', settings);

            bindEvent();
        }());
    };

    /**
     * @desc confirm pop
     * @param {string} str - display string
     * @param {function} callback - 回调函数，参数为返回值
     */
    $.fn.confirm = function(str, callback) {
        var $this = $(this),

            resizeEvent = function($dom) {
                var debounceFunc = App.Util.debounce(function() {
                    if ($dom.filter(':visible').length > 0) {
                        showTip();
                    }
                }, 50);

                $(window)
                    .on('resize', debounceFunc)
                    .on('scroll', debounceFunc);
            },

            getDom = function() {
                var $dom = $('#vp_tip');

                if ($dom.length <= 0) {
                    $dom = $([
                        '<div class="vp_tip" id="vp_tip">',
                            '<p class="vp_tip_cnt"></p>',
                            '<a href="javascript:;" class="vp_min_btn vp_min_ok">确定</a>',
                            '<a href="javascript:;" class="vp_min_btn vp_min_cancel">取消</a>',
                        '</div>'
                    ].join(''));
                    
                    resizeEvent($dom);
                }

                $dom.find('.vp_tip_cnt').html(str);
                $dom.removeClass('vp_tip_min')
                    .removeClass('vp_tip_max')
                    .css('opacity', 0)
                    .show();

                return $dom;
            },

            bindEvent = function() {
                $('#vp_tip')
                    .off('click')
                    .on('click', '.vp_min_ok', function() {
                        close(true, callback);
                    })
                    .on('click', '.vp_min_cancel', function() {
                        close(false, callback);
                    });
            },

            /**
             * @desc 关闭弹框
             * @param {book} ret 返回值
             * @param {function} callback 回调函数
             */
            close = function(ret, callback) {
                $('#vp_tip').hide();

                if (callback !== undefined && typeof callback === 'function') {
                    callback(ret);
                }
            },

            showTip = function() {
                var $dom = $('#vp_tip'),
                    thisOffset = $this.offset(),
                    domWidth = $dom.width();

                if (domWidth < 120) {
                    $dom.addClass('vp_tip_min');
                }

                if (domWidth > 240) {
                    $dom.addClass('vp_tip_max');
                }

                $dom.css({
                    top: thisOffset.top - $dom.outerHeight(),
                    left: thisOffset.left - ($this.outerWidth() + $dom.outerWidth()) / 2,
                    opacity: 1
                });
            },

            render = function() {
                $('body').append(getDom());

                showTip();
                bindEvent();
            };

        return this.each(function() {
            render();
        });
    };
}(jQuery));