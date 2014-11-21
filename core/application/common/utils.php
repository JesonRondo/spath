<?php

class Utils {

    // dump
    static public function dump($params) {
        echo '<pre>';
        var_dump($params);
        echo '</pre>';
    }

    // 加载静态资源
    static public function require_static($path) {
        if (preg_match('/.less$/', $path)
        && in_array($path, Resource::$lesses) === false) {
            Resource::$lesses[] = $path;
        }

        if (preg_match('/.js$/', $path)
        && in_array($path, Resource::$scripts) === false) {
            Resource::$scripts[] = $path;
        }
    }

    static public function replace_placeholder($tag, $sources, $type, $mixed, $extra = '') {
        $mixed = str_replace(
            $tag,
            Utils::generator_static($sources, $type) . $extra,
            $mixed
        );

        return $mixed;
    }

    static public function generator_static($sources, $type) {
        switch ($type) {
            case 'css':
                $tpl = '<link rel="stylesheet/css" href="$1">';
                break;

            case 'less':
                $tpl = '<link rel="stylesheet/less" href="$1">';
                break;

            case 'script':
                $tpl = '<script src="$1"></script>';
                break;

            default:
                return '';
        }

        $config = require APPPATH . '../../config/global.php';

        $refers = '';
        foreach ($sources as $i => $source) {
            // 添加资源路径
            if (strpos($source, '@') !== 0) {
                if (strpos($source, '/') !== 0) {
                    $source = '@' . T::$domain . '@' . T::$uri . '/' . $source;
                }
            }

            $refers .= preg_replace('/(\S+)/i', $tpl, $source);
        }

        return $refers;
    }

    static public function replace_staticflag($mixed) {
        $config = require APPPATH . '../../config/global.php';
        $flags = $config['static_flag'];

        foreach ($flags as $key => $value) {
            $mixed = str_replace($key, $value, $mixed);
        }

        return $mixed;
    }
}

// public
function dump($params) {
    Utils::dump($params);
}

function require_static($path) {
    Utils::require_static($path);   
}
