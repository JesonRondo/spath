/**
 * @class mSlider
 * @author buji 2013-08-21
 */
;(function($) {
    function mSlider(settings) {
        this.$banner = settings.$banner;        // 最外层容器
        this.$slider = settings.$slider;        // 滑动部分容器
        this.$tipbox = settings.$tipbox;        // 当前索引容器
        this.stepSize = settings.stepSize;      // 变换尺寸
 
        // 触发change事件时的处理函数（主要处理变换规则）
        this.sliderChangeEvent = settings.sliderChangeEvent;
        this.tipChangeEvent = settings.tipChangeEvent;
 
        // 可选部分
        this.$next = settings.$next || null;    // 后一个按钮
        this.$prev = settings.$prev || null;    // 前一个按钮
        this.cur = settings.cur || 0;           // 当前选中索引
        this.count = settings.count || null;    // 轮播项总数
        this.delay = settings.delay || 4000;    // 轮播间隔ms
        this.step = settings.step || 1;         // 跳步
 
        // 内部变量
        this.t = 0; // 计时器timer
    }
 
    // 显示指定索引
    mSlider.prototype.showIndex = function(cur) {
        this.$slider.trigger('change:cur', [cur]);
        this.$tipbox.trigger('change:cur', [Math.ceil(cur / this.step)]);
    };
 
    // 显示后一个
    mSlider.prototype.next = function() {
        var cur, lastFull;
 
        cur = this.cur + this.step;
        lastFull = this.count - this.count % this.step;
 
        if (cur >= this.count) {
            this.cur = 0;
        } else if (cur < this.count && cur >= lastFull) {
            this.cur = lastFull - this.step + this.count % this.step;
        } else {
            this.cur = cur;
        }
 
        this.showIndex(this.cur);
    };
 
    // 显示前一个
    mSlider.prototype.prev = function() {
        var cur, lastFull;
 
        cur = this.cur - this.step;
        lastFull = this.count - this.count % this.step;
 
        if (this.cur >= this.count - this.step && this.count % this.step !== 0) {
            this.cur = lastFull - this.step;
        } else if (cur < 0) {
            this.cur = this.count - this.step;
        } else {
            this.cur = cur;
        }
 
        this.showIndex(this.cur);
    };
 
    // 初始化
    mSlider.prototype.init = function() {
        var self = this;
 
        // count未指定，则取$slider的ms_item类个数
        self.count = self.count || self.$slider.find('.ms_item').length;
        // select firest one
        self.$tipbox.find('.ms_item').eq(0).addClass('c');
 
        // event init
        // next & prev btn event
        if (self.$next) {
            self.$next.on('click', function() {
                self.next();
            });
        }
        if (self.$prev) {
            self.$prev.on('click', function() {
                self.prev();
            });
        }
        // cur change event
        self.$slider.on('change:cur', self.sliderChangeEvent);
        self.$tipbox.on('change:cur', self.tipChangeEvent);
        // outer & enter event
        self.$banner
            .on('mouseenter', function() {
                clearInterval(self.t);
            })
            .on('mouseleave', function() {
                self.run();
            });
        // tip enter evnet
        self.$tipbox.on('mouseenter', '.ms_item', function() {
            var cur, lastFull;
 
            self.cur = self.$tipbox.find('.ms_item').index($(this)) * self.step;
            lastFull = self.count - self.count % self.step;
 
            if (self.cur >= lastFull) {
                self.cur = lastFull - self.step + self.count % self.step;
            }
 
            self.showIndex(self.cur);
        });
        // end event init
    };
 
    // 轮播开始
    mSlider.prototype.run = function() {
        var self = this;
        clearInterval(self.t);
        self.t = setInterval(function() {
            self.next();
        }, self.delay);
    };
 
    MOGU.mSlider = function(option) {
        var banner = new mSlider(option);
        banner.init();
        banner.run();
 
        return banner;
    };
}(jQuery));
 
 
/**
 * @desc banner
 * @buji
 * @time 2013-10-23
 */
MOGU.Ushop.Banner = (function() {
    var startBanner = function() {
        var $slider = $('#spli_banner_slider');
        var banner_settings = {
            $banner: $('#spli_banner'),
            $slider: $slider,
            $tipbox: $('#spli_banner_tip'),
            $next: $('#spli_banner_arrow_right'),
            $prev: $('#spli_banner_arrow_left'),
 
            stepSize: $slider.find('.ms_item').eq(0).width(),
 
            sliderChangeEvent: function(e, cur) {
                if (!!window.ActiveXObject) { // IE
                    banner.$slider.stop().animate({
                        left: -banner.stepSize * cur
                    }, 500);
                } else {
                    banner.$slider.css('left', -banner.stepSize * cur);
                }
            },
            tipChangeEvent: function(e, cur) {
                banner.$tipbox.find('.c').removeClass('c');
                banner.$tipbox.find('.ms_item').eq(cur).addClass('c');
            }
        };
 
        var banner = new MOGU.mSlider(banner_settings);
        banner.init();
        banner.run();
 
        // arrow hide
        $('#spli_banner')
            .on('mouseenter', function() {
                $(this).find('.spli_banner_arrow').show();
            })
            .on('mouseleave', function() {
                $(this).find('.spli_banner_arrow').hide();
            });
    };
 
    // private
    var initialize = function() {
        startBanner();
    };
 
    // public
    return {
        init: function() {
            initialize();
        }
    };
}());