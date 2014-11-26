<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>蘑菇街 - 我的剁手街！</title>
  {require_static file="@LIB@/reset/reset-pc.less"}
  {require_static file="@LIB@/require/require-2.1.15.js"}
  {require_static file="layout/default/script/require.config.js"}
  {require_static file="@LIB@/jquery/jquery-1.11.1.js"}
  <!--[ CSS PLACEHOLDER ]-->
</head>
<body>
  {require_static file="layout/default/style/index.less"}

  {include file="layout/default/module/header.tpl"}
  {include file="layout/default/module/sidebar.tpl"}

  <div id="entries">
    {block "main"}{/block}
  </div>

  {include file="layout/default/module/footer.tpl"}
  <script>
    var __ = __ || {};
    __.s = {};
    __.s = {
      LIB: '{$source_CDNPATH}{$source_LIB}',
      COMPONENT: '{$source_CDNPATH}{$source_COMPONENT}',
      APP: '{$source_CDNPATH}{$source_APP}',
      CDNPATH: '{$source_CDNPATH}',
      LIBMAP: {$source_LIBMAP},
      COMPONENTMAP: {$source_COMPONENTMAP},
      APPMAP: {$source_APPMAP}
    };
  </script>
  <!--[ SCRIPT PLACEHOLDER ]-->
</body>
</html>