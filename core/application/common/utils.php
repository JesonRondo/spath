<?php

class Utils {

    // dump
    static public function dump($params) {
        echo '<pre>';
        var_dump($params);
        echo '</pre>';
    }

    /**
     * 加载静态资源
     * @param  string  $path  文件路径
     * @param  boolean $debug 是否为调试模块
     */
    static public function require_static($path, $debug = false) {
        if (!T::$config['debugger'] && $debug === true) {
            return; // 跳过调试模块
        }

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
                $tpl = '<link rel="stylesheet" href="$1">';
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

        if (T::$config['debugger']) {
            $refers = '';
            foreach ($sources as $i => $source) {
                // 添加资源路径
                if (strpos($source, '@') !== 0) {
                    if (strpos($source, '/') !== 0) {
                        $source = '@' . T::$domain . '@' . '/' . $source;
                    }
                }

                $refers .= preg_replace('/(\S+)/i', $tpl, $source) . '
  ';
            }
        } else { // 合并请求链接
            $lib_hash = json_decode(T::$str_lib, true);
            $component_hash = json_decode(T::$str_component, true);
            $page_hash = json_decode(T::$str_page, true);

            foreach ($sources as $i => $source) {
                // 添加资源路径
                $source = preg_replace('/\.less$/i', '.css', $source);

                $lib_perfix = '@LIB@/';
                $component_perfix = '@COMPONENT@/';

                if (strpos($source, $lib_perfix) === 0) {
                    $source = substr($source, strlen($lib_perfix));
                    if (isset($lib_hash[$source])) {
                        $source = $lib_hash[$source];
                        $source = $lib_perfix . $source;
                    }
                } else if (strpos($source, $component_perfix) === 0) {
                    $source = substr($source, strlen($component_perfix));
                    if (isset($component_hash[$source])) {
                        $source = $component_hash[$source];
                        $source = $component_perfix . $source;
                    }
                } else {
                    if (isset($page_hash[$source])) {
                        $source = $page_hash[$source];
                        $source = '@' . T::$domain . '@' . '/' . $source;
                    }
                }

                // if (strpos($source, '@') !== 0) {
                //     if (strpos($source, '/') !== 0) {
                //         $source = '@' . T::$domain . '@' . '/' . $source;
                //     }
                // }
                $refers[] = $source;
            }

            $refers = T::$config['cdn_domain']['production'] .'/_' . implode(',', $refers);
            $refers = preg_replace('/(\S+)/i', $tpl, $refers);
        }

        return $refers;
    }

    static public function replace_staticflag($mixed) {
        $flags = T::$config['static_flag'];

        if (T::$config['debugger']) {
            $cdn_domain = T::$config['cdn_domain']['development'];
        } else {
            $cdn_domain = '';
        }

        foreach ($flags as $key => $value) {
            $mixed = str_replace($key, $cdn_domain. $value, $mixed);
            $mixed = str_replace('{$domain}', T::$domain, $mixed);
        }

        return $mixed;
    }

    // 压缩html
    static public function higrid_compress_html($higrid_uncompress_html_source) { 
        $chunks = preg_split('/(<pre.*?\/pre>)/ms', $higrid_uncompress_html_source, -1, PREG_SPLIT_DELIM_CAPTURE);
        $higrid_uncompress_html_source = ''; // 修改压缩html : 清除换行符,清除制表符,去掉注释标记 
        foreach ($chunks as $c) {
            if (strpos( $c, '<pre' ) !== 0) {
                // remove new lines & tabs
                $c = preg_replace( '/[\\n\\r\\t]+/', ' ', $c );
                // remove extra whitespace
                $c = preg_replace( '/\\s{2,}/', ' ', $c );
                // remove inter-tag whitespace
                $c = preg_replace( '/>\\s</', '><', $c );
                // remove CSS & JS comments
                $c = preg_replace( '/\\/\\*.*?\\*\\//i', '', $c );
            }
            $higrid_uncompress_html_source .= $c;
        }
        return $higrid_uncompress_html_source;
    } 
}

// public
function dump($params) {
    Utils::dump($params);
}

function require_static($path) {
    Utils::require_static($path);   
}
