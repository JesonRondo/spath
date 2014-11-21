<?php
function smarty_function_require_static($params, $template) {
    if (isset($params['file'])) {
        Utils::require_static($params['file']);
    }
}
