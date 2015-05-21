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
 *
 * @since 0.1.0
 */
class Auth {
	
	use IsSingleton;
	
	/**
	 * Transient prefix
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	const DB_PREFIX = '_wplv_';
	
	/**
	 * Prefix to use for session cookie
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	const COOKIE_PREFIX = '_wplv_sess';
	
	/**
	 * Length of generated keys
	 *
	 * @since 0.1.0
	 *
	 * @var int
	 */
	const KEY_LENGTH = 40;
	
	/**
	 * Cookie token length
	 *
	 * @since 0.1.0
	 *
	 * @var int
	 */
	const COOKIE_TOKEN_LENGTH = 25;
	
	/**
	 * Authenticate code
	 * 
	 * Authentication will check for cookie token and session key, then use session key to check for api key
	 *
	 * @since 0.1.0
	 *
	 * @var int
	 */
	const AUTHENTICATED = 3;

	/**
	 * Verification code
	 * 
	 * Check if cookie token is set and if session key was provided
	 *
	 * @since 0.1.0
	 *
	 * @var int
	 */
	const VERIFIED = 2;
	
	/**
	 * Skip authentication code
	 * 
	 * Allow request through
	 *
	 * @since 0.1.0
	 *
	 * @var int
	 */
	const SKIP = 1;
	
	/**
	 * Check if user credentials are valid
	 *
	 * @since 0.1.0
	 *
	 * @param string $username Username
	 * @param string $password Password
	 * @return boolean Whether login credentials are valid
	 */
	public function is_valid_login($username, $password) {
		global $wpdb;
		
		// TODO
	}
	

	/**
	 * Create a session for an authenticated user
	 *
	 * @since 0.1.0
	 *
	 * @param string $username The user to create session for
	 * @return void
	 */
	public function create_user_session($username) {
		global $wpdb;
		
		// TODO
	}
	
	
	/**
	 * Remove session for an authenticated user
	 *
	 * @since 0.1.0
	 *
	 * @param string $username The user to remove session for
	 * @return void
	 */
	public function clear_user_session($username) {
		global $wpdb;
		
		// TODO
	}


	/**
	 * Check if a valid session is in use
	 *
	 * @since 0.1.0
	 *
	 * @param string $cookie_token Token used to save session cookie
	 * @param string $session_key The session key for the current user session
	 * @return boolean Whether session is valid
	 */
	public function is_valid_api_session($cookie_token, $session_key) {
		global $wpdb;

		if (isset($_COOKIE[self::COOKIE_PREFIX . $cookie_token]) && $_COOKIE[self::COOKIE_PREFIX . $cookie_token] == $session_key) {
			$sql = 'select option_id from ' . $wpdb->options . ' where option_name=%s';
			$count = $wpdb->get_var($wpdb->prepare($sql, self::DB_PREFIX . $session_key));

			return intval($count) > 0 ? true : false; 
		}

		return false;
	}


	/**
	 * Create a session for an api user
	 *
	 * @since 0.1.0
	 *
	 * @param int $user_id The user id to create a session for
	 * @return boolean Whether API session was successfully created
	 */
	public function create_api_session($user_id) {
		global $wpdb;

		$api_key = $this->get_api_key($user_id);
		$created = false;

		if (!empty($api_key)) {
			$cookie_token = \wp_generate_password(self::COOKIE_TOKEN_LENGTH, true);
			$session_key = \wp_generate_password(self::KEY_LENGTH, true, true);
			$created = $wpdb->replace($wpdb->options, [
				'option_name'	=> self::DB_PREFIX . $session_key,
				'option_value'	=> $api_key,
			]);

			if ($created !== false) {
				setcookie(self::COOKIE_PREFIX . $cookie_token, $session_key, (time() + (30 * DAY_IN_SECONDS)), '/', $_SERVER['SERVER_NAME'], false, true);
			}
		}

		return $created;
	}
	
	
	/**
	 * Destroy an api session
	 *
	 * @since 0.1.0
	 *
	 * @return boolean Whether API session for logged in user was successfully cleared
	 */
	public function clear_api_session() {
		global $wpdb;

		$cleared = false;
		$cookie_token = $this->get_cookie_token();
		$session_key = $this->get_session_key();

		if (!empty($session_key)) {
			$deleted = $wpdb->delete($wpdb->options, [
				'option_name'	=> self::DB_PREFIX . $session_key,
			]);

			$cleared = intval($deleted) > 0 ? true : false;
		}
		
		setcookie(self::COOKIE_PREFIX . $cookie_token, null, -1);

		return $cleared;
	}


	/**
	 * Get api session information for currently logged in user
	 *
	 * @since 0.1.0
	 *
	 * @return array The session information
	 */
	public function get_api_session() {
		global $wpdb;
		
		$user_id = \get_current_user_id();
		$info = [
			'api_key'		=> $this->get_api_key($user_id),
			'session_key'	=> $this->get_session_key(),
			'cookie_token'	=> $this->get_cookie_token(),
			'valid'			=> false,
		];
		
		if (!empty($info['cookie_token']) && !empty($info['session_key'])) {
			$info['valid'] = true;
		}

		return $info;
	}


	/**
	 * Get session key from cookie
	 * 
	 * If no session key is found an empty string will be returned
	 *
	 * @since 0.1.0
	 *
	 * @return string The session key if one is found
	 */
	public function get_session_key() {
		$cookie_token = $this->get_cookie_token();

		return isset($_COOKIE[self::COOKIE_PREFIX . $cookie_token]) ? $_COOKIE[self::COOKIE_PREFIX . $cookie_token] : '';
	}
	
	
	/**
	 * Get cookie key token
	 *
	 * If no cookie token is found an empty string will be returned
	 *
	 * @since 0.1.0
	 *
	 * @return string The token used with the cookie prefix to create the key for the logged in user
	 */
	public function get_cookie_token() {
		foreach ($_COOKIE as $key => $value) {
			if (strpos($key, self::COOKIE_PREFIX, 0) === 0)	{
				return substr($key, strlen(self::COOKIE_PREFIX));
			}
		}
		
		return '';
	}


	/**
	 * Get user api key
	 *
	 * If user doesn't have an api key, generate a new one 
	 *
	 * @since 0.1.0
	 *
	 * @param int $user_id The user id of the user to get api key for
	 * @return string API key for logged in user
	 */
	public function get_api_key($user_id) {
		global $wpdb;

		if (is_int($user_id) && $user_id > 0) {		
			$sql = 'select meta_value from ' . $wpdb->usermeta . ' where meta_key="wplv_api_key" and user_id=%d';
			$api_key = $wpdb->get_var($wpdb->prepare($sql, $user_id));

			if (empty($api_key)) {
				$api_key = \wp_generate_password(self::KEY_LENGTH, true, true);

				$wpdb->insert($wpdb->usermeta, [
					'user_id'		=> $user_id,
					'meta_key'		=> 'wplv_api_key',
					'meta_value'	=> $api_key,
				]);
			}

			return $api_key;
		}

		return '';
	}
}