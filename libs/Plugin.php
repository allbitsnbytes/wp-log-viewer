<?php

namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
// use Allbitsnbytes\WPLogViewer\Auth;
use Allbitsnbytes\WPLogViewer\Ajax;
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;
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


		// Initialize ajax handler
		Ajax::get_instance();
	}


	/**
	 * Enqueue css and js files when on plugin page
	 *
	 * @since 0.1.0
	 */
	public function load_plugin_css_and_js() {
		// $auth = Auth::get_instance();
		$settings = Settings::get_instance();
		$user_id = \get_current_user_id();
		$screen = get_current_screen();
		$localized = [
			'api' 				=> admin_url('admin-ajax.php'),
			'debug_enabled' 	=> WP_DEBUG,
			'current_page'		=> is_object($screen) ? $screen->id : '',
			'plugin_url'		=> admin_url('tools.php?page=wp-log-viewer'),
			'settings'			=> $settings->get_settings($user_id),
			// 'cookie_token'		=> '',
			// 'session_key'		=> '',
			'user_id'			=> $user_id,
			// 'path'				=> ABSPATH,
		];

		// Stylesheet files
		wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.min.css');

		// Javascript files
		wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.min.js', false, false, true);

		// Localize some variables
		// $wp_session_info = $auth->get_api_session($user_id);

		// If session is not valid, create one
		// if ($wp_session_info['valid'] === true) {
		// 	$localized['cookie_token']	= $wp_session_info['cookie_token'];
		// 	$localized['session_key']	= $wp_session_info['session_key'];
		// 	$localized['path'] = relative_path(untrailingslashit($_SERVER['DOCUMENT_ROOT']), untrailingslashit(ABSPATH));

		// 	$auth->create_api_session($user_id);
		// }

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
	// public static function initWP() {
	// 	$loaded = false;
	// 	$wp_load_path = $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php';

	// 	if (defined('WPLV_WP_CORE_PATH') && WPLV_WP_CORE_PATH != '') {
	// 		$wp_load_path = str_replace('//', '/', $_SERVER['DOCUMENT_ROOT'] . '/' . WPLV_WP_CORE_PATH . '/wp-load.php');
	// 	}

	// 	// Check if wp-load.php file exists
	// 	if (file_exists($wp_load_path)) {

	// 		// Defined to stop wordpress from fully loading
	// 		define('SHORTINIT', true);

	// 		require_once($wp_load_path);

	// 		global $wpdb;

	// 		if (is_object($wpdb)) {
	// 			$loaded = true;
	// 		} else if (!is_object($wpdb) && defined('DB_USER') && defined('DB_PASSWORD') && defined('DB_NAME') && defined('DB_HOST')) {
	// 			$wpdb = new \wpdb(DB_USER, DB_PASSWORD, DB_NAME, DB_HOST);
	// 			$wpdb->set_prefix($table_prefix);
	// 			$loaded = true;
	// 		}
	// 	}

	// 	return $loaded;
	// }
}


/**
 * Compute relative path between 2 paths
 *
 * @since 0.12.4
 *
 * @param string $from Path to compute from
 * @param string $to Path to compute to
 * @param string $ps Directory seperator
 * @return string
 */
// function relative_path($from, $to, $ps = DIRECTORY_SEPARATOR) {
//   	$arFrom = explode($ps, rtrim($from, $ps));
//   	$arTo = explode($ps, rtrim($to, $ps));

// 	while(count($arFrom) && count($arTo) && ($arFrom[0] == $arTo[0])) {
//     	array_shift($arFrom);
//     	array_shift($arTo);
//   	}

//   	return str_pad("", count($arFrom) * 3, '..' . $ps) . implode($ps, $arTo);
// }