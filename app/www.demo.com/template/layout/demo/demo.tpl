<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>蘑菇街 - 我的剁手街！</title>
  {require_static file="@LIB@/reset/reset-pc.less"}
  {require_static file="@LIB@/require/require-2.1.15.js"}
  {require_static file="layout/demo/script/require.config.js"}
  {require_static file="@LIB@/jquery/jquery-1.11.1.js"}
  {require_static file="@COMPONENT@/com.base/base.js"}
  <!--[ CSS PLACEHOLDER ]-->
</head>
<body>
  {require_static file="layout/demo/style/index.less"}

  {include file="layout/demo/module/header.tpl"}
  {include file="layout/demo/module/sidebar.tpl"}

  <div id="entries">
    {block "main"}{/block}
  </div>

  {include file="layout/demo/module/footer.tpl"}
  <script>
    var __ = __ || {};
    __.s = {};
    __.s = {
      debug: {$source_debugger},
      CDNPATH: '{$source_CDNPATH}',
      LIB: '{$source_CDNPATH}{$source_LIB}',
      LIBMAP: {$source_LIBMAP},
      COMPONENT: '{$source_CDNPATH}{$source_COMPONENT}',
      COMPONENTMAP: {$source_COMPONENTMAP},
      APP: '{$source_CDNPATH}{$source_APP}',
      APPMAP: {$source_APPMAP}
    };
  </script>
  <!--[ SCRIPT PLACEHOLDER ]-->
</body>
</html>