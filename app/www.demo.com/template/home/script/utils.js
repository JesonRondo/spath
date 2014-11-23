define([
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
