<?php
    return array(
        // 开发模式
        'debug' => true,

        // 静态资源标示符
        'static_flag' => array(
            '@LIB@' => '//cdn.demo.com/lib',
            '@COMPONENT@' => '//cdn.demo.com/component',
            '@LAYOUT@' => '@{$domain}@/layout',
            '@www.demo.com@' => '//cdn.demo.com/d',
        ),
    );