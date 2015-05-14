<?php 
	
namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;
use Allbitsnbytes\WPLogViewer\Helper;


/**
 * Handle authentication
 * @since 0.1.0
 */
class Auth {
	
	use IsSingleton;
	
	/**
	 * Check if user credentials are valid
	 * @param string $username Username
	 * @param string $password Password
	 * @return boolean Whether login credentials are valid
	 * @since 0.1.0
	 */
	public function isValidLogin($username, $password) {
		global $wpdb;
		
		
	}
	
	
	/**
	 * Check if a valid session is in use
	 * @return boolean Whether session is valid
	 * @since 0.1.0
	 */
	public function isValidSession() {
		global $wpdb;
	}
	
	
	/**
	 * Create a session for an authenticated user
	 * @param string $username The user to create session for
	 * @return void
	 * @since 0.1.0
	 */
	public function createUserSession($username) {
		global $wpdb;
	}
	
	
	/**
	 * Remove session for an authenticated user
	 * @param string $username The user to remove session for
	 * @return void
	 * @since 0.1.0
	 */
	public function clearUserSession($username) {
		global $wpdb;
	}
	
	
	/**
	 * Create a session for an api user
	 * @param string $apikey The api key to create session for
	 * @return void
	 * @since 0.1.0
	 */
	public function createAPISession($apikey) {
		global $wpdb;
	}
	
	
	/**
	 * Remove an api session
	 * @param string apikey The apikey to remove session for
	 * @return void
	 * @since 0.1.0
	 */
	public function clearAPISession($apikey) {
		global $wpdb;
	}
}