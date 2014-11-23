/**
 * @desc    toast
 * @version 1.0
 * @author  LongZhou
 * @email   pancnlz@gmail.com
 * @blog    vicbeta.com
 */
$.toast = function(msg) {
    // option
    var stay = 3000;        // ms
    var height = 24;        // toast height
    var border_width = 1;   // toast border width
    var padding_width = 10; // toast padding width

    var getDom = function(msg) {
        var $dom = '<div class="toast_box">\
                        <p>' + msg + '</p>\
                    </div>';
        return $dom;
    };

    var rander = function() {
        // if exist toast
        if ($('.toast_box').length !== 0) {
            return;
        }

        var $dom = $(getDom(msg));
        $('body').append($dom);

        // calc param
        var width = $('.toast_box').width();
        var margin_left = -(width + (border_width + padding_width) * 2) / 2;

        // init style
        $dom.find('p').css({
            'width': width
        });
        $dom.css({
            'margin-left'   : margin_left / 2,
            'margin-top'    : -(height / 2),
            'padding'       : 0,
            'opacity'       : 0,
            'width'         : 0,
            'height'        : 0
        });

        $dom.animate({
            'margin-left'   : margin_left,
            'margin-top'    : -height,
            'padding-left'  : padding_width,
            'padding-right' : padding_width,
            'opacity'       : 1,
            'width'         : width,
            'height'        : height
        }, 'normal');

        // close
        var timer = setTimeout(function() {
            $dom.animate({
                'margin-left'   : margin_left / 2,
                'margin-top'    : -(height / 2),
                'padding'       : 0,
                'opacity'       : 0,
                'width'         : 0,
                'height'        : 0
            }, 'fast', function() {
                $dom.remove();
            });
        }, stay);
    }();
};