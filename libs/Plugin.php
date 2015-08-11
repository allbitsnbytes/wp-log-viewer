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
use Allbitsnbytes\WPLogViewer\Settings;


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
		if (isset($_REQUEST['page']) && $_REQUEST['page'] == 'wp-log-viewer') {
			add_action('admin_enqueue_scripts', [$this, 'load_css_and_js']);
		} else if ((!defined('DOING_AJAX') || (defined('DOING_AJAX') && !DOING_AJAX)) && isset($_COOKIE['wplv_logged_in'])) {
			$auth = Auth::get_instance();
			$auth->clear_api_session();
			setcookie('wplv_logged_in', null, -1);
		}

		add_action('admin_menu', [$this, 'add_navigation']);
	}


	/**
	 * Enqueue css and js files
	 *
	 * @since 0.1.0
	 */
	public function load_css_and_js() {
		$auth = Auth::get_instance();
		$settings = Settings::get_instance();
		$user_id = \get_current_user_id();
		$localized = [
			'api' 			=> WPLOGVIEWER_URL . 'api/',
			'debugEnabled' 	=> WP_DEBUG,
			'cookie_token'	=> '',
			'session_key'	=> '',
			'user_id'		=> $user_id,
			'settings'		=> $settings->get_settings($user_id),
		];

		// Stylesheet files
		wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.min.css');

		// Javascript files
		wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.min.js', false, false, true);

		// Localize some variables
		$wp_session_info = $auth->get_api_session($user_id);

		// If session is not valid, create one
		if ($wp_session_info['valid'] === true) {
			$localized['cookie_token']	= $wp_session_info['cookie_token']; 
			$localized['session_key']	= $wp_session_info['session_key'];

			if ($auth->create_api_session($user_id)) {
				$expires = time() + (200 * WEEK_IN_SECONDS);
				setcookie('wplv_logged_in', $wp_session_info['cookie_token'], $expires, '/', $_SERVER['SERVER_NAME'], false, true);
			}
		}

		wp_localize_script('wplogviewer-js', 'WPLOGVIEWER', $localized);
	}


	/**
	 * Add navigation entry
	 *
	 * @since 0.1.0
	 */
	public function add_navigation() {
		add_management_page('Wordpress Log Viewer', 'Log Viewer', 'manage_options', 'wp-log-viewer', [$this, 'display_viewer_page']);
	}


	/**
	 * Get main view
	 *
	 * @since 0.1.0
	 */
	public function display_viewer_page() {
		echo '<div id="wplv-container" class="wrap"></div>';
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
		$table_prefix = 'wp_';

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
					} else if (strpos($line, '$table_prefix') !== false) {
						$table_prefix = trim(preg_replace("/^[\$ ]+table_prefix[ =\"']+([a-zA-Z0-9_-]+)[\"';]+/i", "$1", $line));
					}
    			}

				@fclose($fp);

				// Define additional constants if missing
				if (!defined('WP_DEBUG')) {
					define('WP_DEBUG', false);
					define('WP_DEBUG_DETECTED', false);
				} else {
					define('WP_DEBUG_DETECTED', true);
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

					// Setup wpdb global variable
					global $wpdb;

					if (!is_object($wpdb)) {
						$wpdb = new \wpdb(DB_USER, DB_PASSWORD, DB_NAME, DB_HOST);
						$wpdb->set_prefix($table_prefix);
					}

					$loaded = true;
				}
			}			
		}

		return $loaded;
	}

}