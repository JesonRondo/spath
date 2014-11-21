<?php

// 模版相关
class T {
    static private $smarty;

    static public function init() {
        T::$smarty = new Smarty();

        $domain = $_SERVER['SERVER_NAME'];
        $appConfig = include(APPPATH . '../../config/app.php');

        if (!isset($appConfig[$domain])) {
            echo '没有这个项目哦～';
            exit;
        }

        $config = $appConfig[$domain];

        T::$smarty->setTemplateDir(PROJPATH. $config['template'] . '/');
        T::$smarty->setCompileDir(PROJPATH . $config['template_c'] . '/');
        T::$smarty->setConfigDir(PROJPATH . $config['configs'] . '/');
        T::$smarty->setCacheDir(PROJPATH . $config['cache'] . '/');

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

        $response = str_replace(
            '<!--[ CSS PLACEHOLDER ]-->',
            Utils::generator_static(Resource::$lesses, 'less'),
            $response
        );

        $response = str_replace(
            '<!--[ SCRIPT PLACEHOLDER ]-->',
            Utils::generator_static(Resource::$scripts, 'script'),
            $response
        );

        echo $response;
        exit;
    }
}