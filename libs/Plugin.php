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


// Plugin class
class Plugin {
	
	use IsSingleton;
	
	/**
	 * Initialize plugin
	 */
	public function init() {
		add_action('admin_enqueue_scripts', [$this, 'load_css_and_js']);
		add_action('admin_menu', [$this, 'add_navigation']);
	}
	
	
	/**
	 * Enqueue css and js files
	 */
	public function load_css_and_js() {
		// Stylesheet files
		wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.min.css');

		// Javascript files
		wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.min.js', false, false, true);
	}
	
	
	/**
	 * Add navigation entry
	 */
	public function add_navigation() {
		add_management_page('Wordpress Log Viewer', 'Log Viewer', 'manage_options', 'wp-log-viewer', [$this, 'get_view']);
	}


	/**
	 * Get main view
	 */
	public function get_view() {
		echo '
			<div id="wp-log-viewer" class="wrap">
				<h2>Log Viewer</h2>
				
				<div id="viewer-pane"></div>
			</div>
		';
	}
}