<?php defined('SYSPATH') or die('No direct script access.');

/**
 * @项目路由分发
 */
class Controller_Router extends Controller {

    public function action_index()
    {
        $viewPath = $_SERVER['PATH_INFO'];
        $arr = explode('/', $viewPath);
        $viewFile = end($arr);

        T::display($viewPath . '/' . $viewFile);
    }

} // End
