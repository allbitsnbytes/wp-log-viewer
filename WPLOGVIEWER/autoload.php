<?php
/**
 * Autoload Dependencies
 */


if (!defined('WPLV_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Paths to files to include
 */
$paths = [
	'Helper.php',
	'Plugin.php',
	'Router.php',
	'Viewer.php',	
];


// Register Loader
spl_autoload_register(function($paths) use($paths) {
	if (isset($paths) && is_array($paths)) {
		foreach ($paths as $path) {
			include_once WPLV_LIBS . $path;
		}
	}
});