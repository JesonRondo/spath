define(function() {
    // 倒计时类
    var Countdown = function($timer, startTime, format) {
      this.$timer = $timer;
      this.startTime = startTime;
      this.timer = 0;
      this.format = format || '%d天%h小时%i分%s秒';
   
      // start timer
      var self = this;
      this.timer = setInterval(function() {
        if (self.startTime < 0) {
          clearInterval(self.timer);
          return;
        }
        self.$timer.html(self.formatTime(self.startTime--, self.format));
      }, 1000);
    };
     
    Countdown.prototype.formatTime = function(timestamp, format) {
      var day, hour, minute, second;
   
      day = timestamp / (60 * 60 * 24) >>> 0;
      hour = (timestamp / (60 * 60) >>> 0) - day * 24;
      minute = (timestamp / 60 >>> 0) - (day * 24 + hour) * 60;
      second = timestamp - ((day * 24 + hour) * 60 + minute) * 60;
   
      return format
        .replace(/%d/img, day)
        .replace(/%h/img, hour)
        .replace(/%i/img, minute)
        .replace(/%s/img, second);
    };

    return Countdown;
});