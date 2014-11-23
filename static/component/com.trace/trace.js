/**
 * @filename  f2e-trace.js
 * @desc      f2e 错误上报
 * @author    longzhou (buji)
 * @blog      http://vicbeta.com
 * @email     pancnlz@gmail.com
 * @create    2013-11-13
 * @update    2013-11-13
 * @version   1.0.0
 */
var __Trace = {
    _interface: '/mtalk/log/jserrorlog?log=',

    beacon: function(log) {
        var i = new Image();
        i.src = this._interface + encodeURIComponent(log);
    },

    log: function(info) {
        var msgs = [], p;

        for (p in info) {
            if (info.hasOwnProperty(p)) msgs.push(p + ': ' + info[p]);
        }
        this.beacon(msgs.join(' | '));
    }
};

window.onerror = function(msg, url, line) {
    __Trace.log({msg: msg, url: url, line: line, type: 'f2e-error', _t: +new Date});
};