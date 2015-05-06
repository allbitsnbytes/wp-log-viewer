<?php 
	
namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Helper;
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;


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
		// TODO
	}
	
	
	/**
	 * Check if a valid session is in use
	 * @return boolean Whether session is valid
	 * @since 0.1.0
	 */
	public function isValidSession() {
		// TODO
	}
	
	
	/**
	 * Create a session for an authenticated user
	 * @param string $username The user to create session for
	 * @return void
	 * @since 0.1.0
	 */
	public function createUserSession($username) {
		// TODO
	}
	
	
	/**
	 * Create a session for an api user
	 * @param string $apikey The api key to create session for
	 * @return void
	 * @since 0.1.0
	 */
	public function createAPISession($apikey) {
		// TODO
	}
}