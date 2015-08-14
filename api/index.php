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
use Allbitsnbytes\WPLogViewer\Auth;
use Allbitsnbytes\WPLogViewer\Plugin;
use Allbitsnbytes\WPLogViewer\Router;


/**
 * Load WP Env and authenticate
 */
if (!Plugin::initWP()) {
	header('HTTP/1.0 400 Bad Request');
	die;
}


/**
 * Get Router instance and process requests
 */
$router = Router::get_instance();

if (!is_object($router)) {
	header('HTTP/1.0 403 Forbidden');
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

// Get default settings
$router->get('get-default-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'get_default_settings']);

// Get user settings
$router->get('get-user-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'get_user_settings']);

// Update default settings
$router->post('update-default-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'update_default_settings']);

// Update user settings
$router->post('update-user-settings', ['\Allbitsnbytes\WPLogViewer\Api', 'update_user_settings']);

// Run Router
$router->run();

