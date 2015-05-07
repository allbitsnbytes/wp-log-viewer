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
use Allbitsnbytes\WPLogViewer\Api;
use Allbitsnbytes\WPLogViewer\Router;


/**
 * Get Router instance and process requests
 */
$router = Router::getInstance();

if (!is_object($router)) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Register routes
 */

// Get log file details
$router->get('get-log', ['API', 'get_log_details']);

// Check if log file has been modified
$router->get('log-changed', ['API', 'check_if_log_modified']);

// Check if log file exists
$router->get('log-exists', ['API', 'check_if_log_exists']);

// Check if debugging is enabled
$router->get('debug-enabled', ['API', 'check_if_debug_enabled']);

// Get log entries
$router->get('get-entries', ['API', 'get_log_entries']);

// Get log entries if log file was modified
$router->get('get-entries-if-modified', ['API', 'get_log_entries_if_modified']);

// Clear log file
$router->get('clear-log', ['API', 'clear_log']);

// Login user
$route->get('login', ['API', 'login_user'], false);

// Logout user
$route->get('logout', ['API', 'logout_user']);

// Run Router
$router->run();

