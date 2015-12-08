<?php

/**
 * API DISABLED - USING WP AJAX FOR NOW
 */
header('HTTP/1.0 403 Forbidden');
die;






/**
 * Define Constants
 */
define('WPLOGVIEWER_BASE', str_replace('api', '', dirname(__FILE__)));


// Register autoloader
require_once WPLOGVIEWER_BASE . 'autoload.php';


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Auth;
use Allbitsnbytes\WPLogViewer\Plugin;
use Allbitsnbytes\WPLogViewer\Router;


/**
 * Get Router instance and process requests
 */
$router = Router::get_instance();

if (!is_object($router)) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Set path to wordpress core files
 */
$headers = $router->get_request_headers();

define('WPLV_WP_CORE_PATH', isset($headers['wplv-path']) ? trim($headers['wplv-path']) : '');

if (!is_safe_wp_core_path(WPLV_WP_CORE_PATH)) {
	header('HTTP/1.0 400 Bad Request');
	die;
}


/**
 * Load WP Env and authenticate
 */
if (!Plugin::initWP()) {
	header('HTTP/1.0 500 Internal Server Error');
	die;
}


/**
 * Register routes
 */

// Get log file details
$router->get('get-log', ['\Allbitsnbytes\WPLogViewer\Api', 'get_log_details']);

// Check if log file has been modified
$router->get('log-changed', ['\Allbitsnbytes\WPLogViewer\Api', 'check_if_log_modified']);

// Check if log file exists
$router->get('log-exists', ['\Allbitsnbytes\WPLogViewer\Api', 'check_if_log_exists']);

// Check if debugging is enabled
$router->get('debug-enabled', ['\Allbitsnbytes\WPLogViewer\Api', 'check_if_debug_enabled']);

// Get log entries
$router->get('get-entries', ['\Allbitsnbytes\WPLogViewer\Api', 'get_log_entries']);

// Get log entries if log file was modified
$router->get('get-entries-if-modified', ['\Allbitsnbytes\WPLogViewer\Api', 'get_log_entries_if_modified']);

// Clear log file
$router->get('clear-log', ['\Allbitsnbytes\WPLogViewer\Api', 'clear_log']);

// Login user
$router->get('login', ['\Allbitsnbytes\WPLogViewer\Api', 'login_user'], Auth::SKIP);

// Logout user
$router->get('logout', ['\Allbitsnbytes\WPLogViewer\Api', 'logout_user']);

// Get global settings
$router->get('get-global-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'get_global_settings']);

// Get user settings
$router->get('get-user-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'get_user_settings']);

// Update global settings
$router->post('update-global-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'update_global_settings']);

// Update user settings
$router->post('update-user-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'update_user_settings']);

// Run Router
$router->run();


/**
 * Check if path is safe for wp core.  This only check to see if the path meets specified criteria.  NOT if the path is actually to the wp core files
 *
 * 1. Path cannot be from server root
 * 2. Path only allowed one level above document root
 *
 * @since 0.12.4
 *
 * @param string $path The path to check
 * @return boolean
 */
function is_safe_wp_core_path($path) {
	return substr($path, 0, 1) == '/' || preg_match('@[. ]{2,}/[. ]{2,}/.*@i', $path) > 0 ? false : true;
}