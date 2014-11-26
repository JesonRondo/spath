(function($) {
    $.fn.ktip = function(msg, options) {
        var settings = $.extend({
            direction: "down",      // 小箭头位于tip的位置
            theme    : "default",   // tips主题
            atX      : 0,           // 位于目标的位置的x坐标，若为负，则与原点相对的位置为起始位置 偏差1px
            atY      : 0,           // 位于目标的位置的y坐标，若为负，则与原点相对的位置为起始位置 偏差1px
            tipWidth : 0,           // tip宽度，可定制，小于等于0为不设宽度
            stick    : 0,           // tip保持毫秒速
            offset   : 15,          // 小箭头的偏移量
            triangle : true,        // 是否需要trangle
            closeBtn : true,        // 是否需要close btn
            hover    : false,       // hover模式，鼠标移走tip消失
            callback : null,        // 加载完后的回调函数
            zIndex   : null,        // z轴
            closeCallback: null     // 关闭后的回调函数 arg: $cntbox
        }, options);
        
        var $target = $(this);
        var $tipbox = null;
        // int
        var atWidth = $target.width() + parseInt($target.css("paddingLeft")) + parseInt($target.css("paddingRight"));
        var atHeight = $target.height() + parseInt($target.css("paddingTop")) + parseInt($target.css("paddingBottom"));
        
        var directionHandler = {
            "top"   : "ktip-tipbox-up",
            "left"  : "ktip-tipbox-left",
            "down"  : "ktip-tipbox-down",
            "right" : "ktip-tipbox-right"
        };
        var directionOffsetHandler = {
            "top"   : "left",
            "left"  : "top",
            "down"  : "left",
            "right" : "top"
        };
        
        // 参数校验
        var validateArgs = function() {
            if (msg === undefined) {
                return false;
            }
            return true;
        };
        
        var adjustKtip = function() {
            var xleft = $target.offset().left;
            var xtop = $target.offset().top;

            var atX, atY;
            
            settings.atX >= 0 ? (atX = settings.atX) : (atX = atWidth + settings.atX + 1);
            settings.atY >= 0 ? (atY = settings.atY) : (atY = atHeight + settings.atY);

            var adjustOffsetHandler = {
                "top"   : function(){
                    xleft = xleft - parseInt(settings.offset, 10) + atX;
                    xtop = xtop + 6 + atY;
                },
                "left"  : function(){
                    xleft = xleft + 6 + atX;
                    xtop = xtop - parseInt(settings.offset, 10) + atY;
                },
                "down"  : function(){
                    xleft = xleft - parseInt(settings.offset, 10) + atX;
                    xtop = xtop - parseInt($tipbox.height(), 10) - 10 - 6 + atY;
                }, 
                "right" : function(){
                    xleft = xleft - parseInt($tipbox.width(), 10) - 31 - 6 + atX;
                    xtop = xtop - parseInt(settings.offset, 10) + atY;
                    
                }
            };
            adjustOffsetHandler[settings.direction]();
            $tipbox.css("left", xleft).css("top", xtop);
        }
        
        var closeTip = function() {
            if (settings.closeCallback !== null) {
                try {
                    settings.closeCallback($target);
                } catch (e) {
                
                }
            }
        
            $tipbox.remove();
        };
        
        var randerTip = function(){
            if (!validateArgs()){
                return false;
            }

            $tipbox = $("<div>").addClass("ktip-tipbox").addClass(settings.theme);
            var $cntbox = $("<div>").addClass("cntBox");
            var $triangle = $("<div>").addClass("ktip-tipbox-direction").addClass(directionHandler[settings.direction]).css(directionOffsetHandler[settings.direction], settings.offset);
            $triangle.append("<em>◆</em><span>◆</span>");
            $cntbox.append(msg);
            $tipbox.append($cntbox).append($triangle);
            
            if (settings.tipWidth > 0) {
                $tipbox.css("width", settings.tipWidth);
            }
            
            if (!settings.triangle) {
                $triangle.hide();
            }
            
            if (settings.zIndex) {
                $tipbox.css("z-index", settings.zIndex);
            }
            
            if (settings.closeBtn) {
                var closebtn = $("<a>").addClass("close-ico").html("×");
                closebtn.click(function() {
                    closeTip();
                });
                $tipbox.append(closebtn);
            }
            
            if (settings.hover) {
                $target.bind("mouseleave", function() {
                    closeTip();
                });
            }
            
            if (settings.stick > 0) {
                setTimeout(closeTip, settings.stick);
            }
            
            $("body").append($tipbox);
            adjustKtip();
            $tipbox.show();
            
            if (settings.callback !== null) {
                try {
                    settings.callback($cntbox);
                } catch (e) {
                
                }
            }
        };
        
        return this.each(function() {
            randerTip();
        });
    };
}(jQuery));