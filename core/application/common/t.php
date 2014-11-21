<?php

// 模版相关
class T {
    static private $smarty;
    static public $appConfig;
    static public $uri;
    static public $domain;

    static public function init() {
        T::$smarty = new Smarty();

        T::$domain = $_SERVER['SERVER_NAME'];

        T::$uri = $_SERVER['PATH_INFO'];
        T::$appConfig = require APPPATH . '../../config/app.php';
        $config = require APPPATH . '../../config/global.php';

        if (!isset(T::$appConfig[T::$domain])) {
            echo '没有这个项目哦～';
            exit;
        }

        T::$appConfig = T::$appConfig[T::$domain];

        T::$smarty->setTemplateDir(PROJPATH. T::$appConfig['template'] . '/');
        T::$smarty->setCompileDir(PROJPATH . T::$appConfig['template_c'] . '/');
        T::$smarty->setConfigDir(PROJPATH . T::$appConfig['configs'] . '/');
        T::$smarty->setCacheDir(PROJPATH . T::$appConfig['cache'] . '/');

        if ($config['debug'] === true) {
            T::$smarty->force_compile = true;
            T::$smarty->caching = false;
        } else {
            T::$smarty->force_compile = false;
            T::$smarty->caching = true;
        }
    }

    static public function assign($k, $v) {
        T::$smarty->assign($k, $v);
    }

    static public function display($view) {
        if (strpos($view, '/') === 0) {
            $view = substr($view, 1);
        }

        $response = T::$smarty->fetch($view . '.tpl');

        $response = Utils::replace_placeholder(
            '<!--[ CSS PLACEHOLDER ]-->',
            Resource::$lesses,
            'less',
            $response,
            '<script src="@LIB@/less/less-1.7.3.js"></script>
            <script>
                less["logLevel"] = 1;
                less["env"] = "development";
                window.overrideLess();
            </script>'
        );

        $response = Utils::replace_placeholder(
            '<!--[ SCRIPT PLACEHOLDER ]-->',
            Resource::$scripts,
            'script',
            $response
        );

        $response = Utils::replace_staticflag($response);

        echo $response;
        exit;
    }
}