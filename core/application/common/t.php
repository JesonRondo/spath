<?php

// 模版相关
class T {
    static private $smarty;
    static public $config;
    static public $appConfig;
    static public $uri;
    static public $domain;


    static public $str_lib;
    static public $str_component;
    static public $str_page;

    static public function init() {
        T::$smarty = new Smarty();

        T::$domain = $_SERVER['SERVER_NAME'];

        T::$uri = $_SERVER['PATH_INFO'];
        T::$appConfig = require APPPATH . '../../config/app.php';
        T::$config = require APPPATH . '../../config/global.php';

        if (!isset(T::$appConfig[T::$domain])) {
            echo '没有这个项目哦～';
            exit;
        }

        T::$appConfig = T::$appConfig[T::$domain];

        T::$smarty->setTemplateDir(PROJPATH. T::$appConfig['template'] . '/');
        T::$smarty->setCompileDir(PROJPATH . T::$appConfig['template_c'] . '/');
        T::$smarty->setConfigDir(PROJPATH . T::$appConfig['configs'] . '/');
        T::$smarty->setCacheDir(PROJPATH . T::$appConfig['cache'] . '/');

        T::$str_lib = file_get_contents(PROJPATH . T::$appConfig['configs'] . '/base/lib.json');
        T::$str_component = file_get_contents(PROJPATH . T::$appConfig['configs'] . '/base/component.json');
        T::$str_page = file_get_contents(PROJPATH . T::$appConfig['configs'] . '/static.json');

        if (T::$config['debugger']) {
            $cdn_domain = T::$config['cdn_domain']['development'];
        } else {
            $cdn_domain = T::$config['cdn_domain']['production'];
        }

        if (T::$config['cache']) {
            T::$smarty->force_compile = false;
            T::$smarty->caching = true;
        } else {
            T::$smarty->force_compile = true;
            T::$smarty->caching = false;
        }

        // 读取模拟数据
        $viewPath = $_SERVER['PATH_INFO'];
        $dataFile = PROJPATH. T::$appConfig['template'] . $viewPath . '/data.php';

        if (file_exists($dataFile)) {
            $data = require $dataFile;

            foreach ($data as $key => $value) {
                T::$smarty->assign($key, $value);
            }
        }

        // 静态资源变量
        T::assign(array(
            'source_debugger' => T::$config['debugger'] ? 'true': 'false',
            'source_CDNPATH' => $cdn_domain,
            'source_LIB' => T::$config['static_flag']['@LIB@'],
            'source_LIBMAP' => T::$str_lib,
            'source_COMPONENT' => T::$config['static_flag']['@COMPONENT@'],
            'source_COMPONENTMAP' => T::$str_component,
            'source_APP' => T::$config['static_flag']['@' . T::$domain . '@'],
            'source_APPMAP' => T::$str_page
        ));
    }

    static public function assign($k, $v = null) {
        if ($v === null) {
            foreach ($k as $key => $value) {
                T::$smarty->assign($key, $value);
            }
        } else {
            T::$smarty->assign($k, $v);
        }
    }

    static public function display($view) {
        if (strpos($view, '/') === 0) {
            $view = substr($view, 1);
        }

        $response = T::$smarty->fetch($view . '.tpl');

        if (T::$config['debugger']) {
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
        } else {
            $response = Utils::replace_placeholder(
                '<!--[ CSS PLACEHOLDER ]-->',
                Resource::$lesses,
                'css',
                $response
            );
        }

        $response = Utils::replace_placeholder(
            '<!--[ SCRIPT PLACEHOLDER ]-->',
            Resource::$scripts,
            'script',
            $response
        );

        $response = Utils::replace_staticflag($response);

        echo T::$config['debugger'] ?
            $response :
            Utils::higrid_compress_html($response);
        exit;
    }
}