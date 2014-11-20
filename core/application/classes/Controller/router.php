<?php defined('SYSPATH') or die('No direct script access.');

/**
 * @项目路由分发
 */
class Controller_Router extends Controller {

    public function action_index()
    {

        $domain = $_SERVER['SERVER_NAME'];
        $appConfig = include(APPPATH . 'config/app.php');

        if (!isset($appConfig[$domain])) {
            echo '没有这个项目哦～';
            exit;
        }

        $viewPath = $_SERVER['PATH_INFO'];
        $arr = explode('/', $viewPath);
        $viewFile = end($arr);

        $view = View::factory(
            PROJPATH . $appConfig[$domain]['path'] . $viewPath . '/' . $viewFile
        );

        $regTempate = '/^\<\!\-\-\[ TEMPLATE ([A-Za-z0-9\_\/]+) \]\-\-\>/i';

        preg_match($regTempate, $view, $matches);

        if (isset($matches[1])) {
            $view = preg_replace($regTempate, '', $view);
            $template = View::factory(
                PROJPATH . $appConfig[$domain]['template'] . '/' . $matches[1] . '/'.  $matches[1]
            );

            $template->body = $view;
            $view = $template;
        }

        $this->response->body($view);
    }

} // End
