<?php
function smarty_function_require_static($params, $template) {
    if (isset($params['file'])) {
        if (isset($params['debug']) && $params['debug'] === "true") {
            Utils::require_static($params['file'], true);
        } else {
            Utils::require_static($params['file']);
        }
    }
}
