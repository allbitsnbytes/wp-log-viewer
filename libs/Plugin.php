<?php

namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Ajax;
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;
use Allbitsnbytes\WPLogViewer\Log;
use Allbitsnbytes\WPLogViewer\Settings;


/**
 * Plugin class
 *
 * @since 0.1.0
 */
class Plugin {

	use IsSingleton;

	/**
	 * @var boolean Check if current user has permission to access WP Log Viewer
	 *
	 * @since 1.0.1
	 */
	var $user_authorized = true;


	/**
	 * Initialize plugin
	 *
	 * @since 0.1.0
	 */
	public function init() {
		// Register actions
		add_action('admin_init', [$this, 'check_if_authorized'], 1);
		add_action('template_redirect', [$this, 'add_dynamic_routes'], 1, 1);

		if (\is_admin()) {
			add_action('admin_menu', [$this, 'add_navigation']);
			add_action('admin_enqueue_scripts', [$this, 'load_plugin_css_and_js']);
			add_action('wp_dashboard_setup', [$this, 'register_dashboard_widgets']);
			add_action('admin_bar_menu', [$this, 'add_admin_bar_menu'], 900);

			// Initialize ajax handler
			Ajax::get_instance();
		}
	}


	/**
	 * Check if user has permission to access WP Log Viewer
	 *
	 * @since 1.0.1
	 */
	public function check_if_authorized() {
		$authorized = \current_user_can('manage_options');
		$this->user_authorized = apply_filters('wplv_user_authorized', $authorized);
	}


	/**
	 * Enqueue css and js files when on plugin page
	 *
	 * @since 0.1.0
	 */
	public function load_plugin_css_and_js() {
		if ($this->user_authorized) {
			// $auth = Auth::get_instance();
			$settings = Settings::get_instance();
			$log = Log::get_instance();
			$user_id = \get_current_user_id();
			$screen = get_current_screen();
			$localized = [
				'api' 				=> admin_url('admin-ajax.php'),
				'debug_enabled' 	=> WP_DEBUG,
				'debug_toggleable'	=> $log->is_debug_toggleable() ? 1 : 0,
				'current_page'		=> is_object($screen) ? $screen->id : '',
				'plugin_url'		=> admin_url('tools.php?page=wp-log-viewer'),
				'settings'			=> $settings->get_settings($user_id),
				'user_id'			=> $user_id,
			];

			// Stylesheet files
			wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.min.css');

			// Javascript files
			wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.min.js', false, false, true);

			// Localize variables
			wp_localize_script('wplogviewer-js', 'WPLOGVIEWER', $localized);
		}
	}


	/**
	 * Add navigation entry
	 *
	 * @since 0.1.0
	 */
	public function add_navigation() {
		if ($this->user_authorized) {
			add_management_page('Wordpress Log Viewer', 'Log Viewer', 'manage_options', 'wp-log-viewer', [$this, 'display_viewer_page']);
		}
	}


	/**
	 * Get main view
	 *
	 * @since 0.1.0
	 */
	public function display_viewer_page() {
		echo '<div id="wplv-viewer-container" class="wrap"></div>';
	}


	/**
	 * Register dashboard widgets
	 *
	 * @since 0.12.0
	 */
	public function register_dashboard_widgets() {
		$show_dashboard_widget = apply_filters('wplv_show_dashboard_widget', $this->user_authorized);

		if ($show_dashboard_widget) {
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
		$show_adminbar = apply_filters('wplv_show_adminbar_widget', $this->user_authorized);

		if ($show_adminbar) {
			$admin_bar->add_node([
				'id'	=> 'wplv-menu',
				'title'	=> 'Debug Log',
				'href'	=> admin_url('tools.php?page=wp-log-viewer'),
				'meta'	=> ['class' => 'wplv-admin-bar-node']
			]);
		}
	}


	/**
	 * Add dynamic routes
	 *
	 * @since 1.0.0
	 */
	public function add_dynamic_routes() {
		$log = Log::get_instance();
		$settings = Settings::get_instance();
		$url_path = trailingslashit(explode('?', $_SERVER['REQUEST_URI'])[0]);

		if (is_user_logged_in()) {
			$user_id = \get_current_user_id();

			if ($url_path == '/debugging/download/log/') {
				$can_download = apply_filters('wplv_can_download_log', $this->user_authorized);

				if ($can_download) {
					header('Pragma: PUBLIC');
					header('Content-Type: application/octet-stream; charset=utf-8');
					header('Content-Disposition: attachment; filename="debug.log"');
					header('HTTP/1.1 200 OK');

					$config = $settings->get_settings($user_id);

					if (isset($config['truncate_download']) && $config['truncate_download']) {
						$found = [];
						$entries = $log->get_entries();

						foreach ($entries as $entry) {
							$key = md5($entry['message']);

							if (!isset($found[$key])) {
								$found[$key] = true;
								echo '[' . $entry['date'] . ' ' . $entry['time'] . ' ' . $entry['timezone'] . '] ' . $entry['message'];
							}
						}
					} else {
						echo trim($log->get_contents());
					}

					exit();
				}
			}
		}

		if ($url_path == '/debugging/share/') {
			// TODO
		}
	}
}