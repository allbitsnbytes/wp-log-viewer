<?php
/**
 * Define Constants
 */
define('WPLOGVIEWER_BASE', str_replace('api', '', dirname(__FILE__)));

// Register autoloader
require_once WPLOGVIEWER_BASE . 'autoload.php';


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Router;


/**
 * Get Router instance and process requests
 */
$router = Router::getInstance();

if (!is_object($router)) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

$router->run();

