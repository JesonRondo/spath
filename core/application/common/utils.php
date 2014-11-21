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

    // 生产静态资源引用
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
        }

        if (empty($tpl))
            return '';

        $refers = '';
        foreach ($sources as $i => $source) {
            $refers .= preg_replace('/(\S+)/i', $tpl, $source);
        }

        return $refers;
    }
}

// public
function dump($params) {
    Utils::dump($params);
}

function require_static($path) {
    Utils::require_static($path);   
}
