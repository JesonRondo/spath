<?php
    return array(
        // 开发模式
        'debugger' => false,

        // 开启缓存
        'cache' => false,

        'cdn_domain' => array(
            'development' => '//cdn.demo.com',
            'production' => '//cdn_online.demo.com',
        ),

        // 静态资源标示符
        'static_flag' => array(
            '@LIB@' => '/lib',
            '@COMPONENT@' => '/component',
            '@www.demo.com@' => '/d',
        ),
    );