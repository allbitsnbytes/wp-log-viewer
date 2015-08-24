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
		// Register actions
		add_action('admin_menu', [$this, 'add_navigation']);
		add_action('admin_enqueue_scripts', [$this, 'load_plugin_css_and_js']);
		add_action('wp_dashboard_setup', [$this, 'register_dashboard_widgets']);
		add_action('admin_bar_menu', [$this, 'add_admin_bar_menu'], 900);
	}


	/**
	 * Enqueue css and js files when on plugin page
	 *
	 * @since 0.1.0
	 */
	public function load_plugin_css_and_js() {
		$auth = Auth::get_instance();
		$settings = Settings::get_instance();
		$user_id = \get_current_user_id();
		$screen = get_current_screen();
		$localized = [
			'api' 				=> WPLOGVIEWER_URL . 'api/',
			'debug_enabled' 	=> WP_DEBUG,
			'current_page'		=> is_object($screen) ? $screen->id : '',
			'plugin_url'		=> admin_url('tools.php?page=wp-log-viewer'),
			'cookie_token'		=> '',
			'session_key'		=> '',
			'user_id'			=> $user_id,
			'settings'			=> $settings->get_settings($user_id),
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

			$auth->create_api_session($user_id);
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
	 * Register dashboard widgets
	 *
	 * @since 0.12.0
	 */
	public function register_dashboard_widgets() {
		if (\current_user_can('manage_options')) {
			\wp_add_dashboard_widget('wplv-widget', 'WP Log Viewer', [$this, 'display_dashboard_widget']);
		}
	}


	/**
	 * Add dashboard widget
	 *
	 * @since 0.12.0
	 */
	public function display_dashboard_widget() {
		echo '<div id="wplv-dashboard-widget-container"></div>';
	}


	/**
	 * Add admin bar menu
	 *
	 * @since 0.12.0
	 */
	public function add_admin_bar_menu($admin_bar) {
		$admin_bar->add_node([
			'id'	=> 'wplv-menu',
			'title'	=> 'Debug Log',
			'href'	=> admin_url('tools.php?page=wp-log-viewer'),
			'meta'	=> ['class' => 'wplv-admin-bar-node']
		]);
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
				if (defined('WP_DEBUG')) {
					if (WP_DEBUG === true || WP_DEBUG === 'true' || WP_DEBUG === false || WP_DEBUG === 'false') {
						define('WP_DEBUG_DETECTED', true);
					} else {
						define('WP_DEBUG_DETECTED', false);
					}
				} else {
					define('WP_DEBUG', false);
					define('WP_DEBUG_DETECTED', false);
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