<?php 
	
namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Auth;
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;
use Allbitsnbytes\WPLogViewer\Helper;


/**
 * Plugin class
 *
 * @since 0.1.0
 */
class Plugin {
	
	use IsSingleton;
	
	/**
	 * Initialize plugin
	 *
	 * @since 0.1.0
	 */
	public function init() {
		add_action('admin_enqueue_scripts', [$this, 'load_css_and_js']);
		add_action('admin_menu', [$this, 'add_navigation']);
		add_action('wp_login',  [$this, 'create_session'], 10, 2);
		add_action('wp_logout', [$this, 'clear_session']);
	}
	
	
	/**
	 * Create user session when user logins
	 *
	 * This session is use to authenticate user api requests
	 *
	 * @since 0.1.0
	 *
	 * @param string $user_login The login for the user
	 * @param object $user User object
	 */
	public function create_session($user_login, $user) {
		$auth = Auth::get_instance();
		
		$auth->create_api_session();
	}
	
	
	/**
	 * Destroy session
	 *
	 * @since 0.1.0
	 */
	public function clear_session() {
		$auth = Auth::get_instance();
		
		$auth->clear_api_session();
	}


	/**
	 * Enqueue css and js files
	 *
	 * @since 0.1.0
	 */
	public function load_css_and_js() {
		$auth = Auth::get_instance();
		$localized = [
			'api' 			=> WPLOGVIEWER_URL . 'api/',
			'debugEnabled' 	=> WP_DEBUG,
			'api_key'		=> '',
			'session_key'	=> '',
		];
		
		// Stylesheet files
		wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.min.css');

		// Javascript files
		wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.min.js', false, false, true);

		// Localize some variables
		$session_info = $auth->get_api_session();
		
		// If session is not valid, create one
		if ($session_info['valid'] === true) {
			$localized['api_key']		= $session_info['api_key']; 
			$localized['session_key']	= $session_info['session_key'];
		}

		wp_localize_script('wplogviewer-js', 'WPLOGVIEWER', $localized);
	}


	/**
	 * Add navigation entry
	 *
	 * @since 0.1.0
	 */
	public function add_navigation() {
		add_management_page('Wordpress Log Viewer', 'Log Viewer', 'manage_options', 'wp-log-viewer', [$this, 'get_view']);
	}


	/**
	 * Get main view
	 *
	 * @since 0.1.0
	 */
	public function get_view() {
		echo '
			<div id="wp-log-viewer" class="wrap">
			</div>
		';
	}


	/**
	 * Load some worpdress functionality
	 *
	 * @since 0.1.0
	 *
	 * @return boolean Whether WP functionality was loaded or not
	 */
	public static function initWP() {
		define('ABSPATH', $_SERVER['DOCUMENT_ROOT'].'/');
		define('WPINC', '/wp-includes');

		$loaded = false;
		$config_path = ABSPATH . '/wp-config.php';
		
		// Check if required files found
		if (file_exists($config_path) && file_exists(ABSPATH . '/wp-includes')) {
			$fp = @fopen($config_path, 'r');

			if ($fp) {
				$sep = '$|$';

				// loop, parse and define wp-config constants
    			while (($line = @fgets($fp)) !== false) {
					$parsed_line = preg_replace("/^define\([ '\"]+(\w+)[ '\"]+, (.*)\);/i", "$1".$sep."$2", $line);
					
					if ($line !== $parsed_line) {
						$info = explode($sep, $parsed_line);

						if (is_array($info) && count($info) == 2 && !defined($info[0])) {
							define($info[0], trim(trim(str_replace(["'", '"'], '', $info[1]))));
						}
					}
    			}

				@fclose($fp);

				// Define additional constants if missing
				if (!defined('WP_DEBUG')) {
					define('WP_DEBUG', false);
				}

				if (defined('DB_NAME') && defined('DB_USER') && defined('DB_PASSWORD') && defined('DB_HOST')) {								
					$includes = [
						'load.php',
						'cache.php',
						'capabilities.php',
						'class-wp-error.php',
						'default-constants.php',
						'formatting.php',
						'functions.php',
						'l10n.php',
						'pluggable.php',
						'plugin.php',
						'pomo/translations.php',
						'user.php',
						'wp-db.php',
					];

					// Require dependencies
					foreach ($includes as $include) {
						require_once ABSPATH . WPINC . '/' . $include;
					}
//					define('SHORTINIT', 1);
//					require_once ABSPATH . '/wp-includes/option.php';
//					require_once ABSPATH . '/wp-settings.php';

					// Setup wpdb global variable
					if (!isset($GLOBALS['wpdb'])) {
						$GLOBALS['wpdb'] = new \wpdb(DB_USER, DB_PASSWORD, DB_NAME, DB_HOST);
					}

					if (!isset($GLOBALS['wp_object_cache'])) {
						$GLOBALS['wp_object_cache'] = new \WP_Object_Cache();
					}

					$loaded = true;
				}
			}			
		}

		return $loaded;
	}

}