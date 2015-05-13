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
 * Plugin class
 * @since 0.1.0
 */
class Plugin {
	
	use IsSingleton;
	
	/**
	 * Initialize plugin
	 * @since 0.1.0
	 */
	public function init() {
		add_action('admin_enqueue_scripts', [$this, 'load_css_and_js']);
		add_action('admin_menu', [$this, 'add_navigation']);
	}
	
	
	/**
	 * Enqueue css and js files
	 * @since 0.1.0
	 */
	public function load_css_and_js() {
		// Stylesheet files
		wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.min.css');

		// Javascript files
		wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.min.js', false, false, true);
		
		// Localize some variables
		wp_localize_script('wplogviewer-js', 'WPLOGVIEWER', ['api' => WPLOGVIEWER_API, 'debugEnabled' => WP_DEBUG]);
	}
	
	
	/**
	 * Add navigation entry
	 * @since 0.1.0
	 */
	public function add_navigation() {
		add_management_page('Wordpress Log Viewer', 'Log Viewer', 'manage_options', 'wp-log-viewer', [$this, 'get_view']);
	}


	/**
	 * Get main view
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
	 * @return boolean Whether WP functionality was loaded or not
	 * @since 0.1.0
	 */
	public static function initWP() {
		$loaded = false;
		$config_path = $_SERVER['DOCUMENT_ROOT'] . '/wp-config.php';
		$db_path = $_SERVER['DOCUMENT_ROOT'] . '/wp-includes/wp-db.php';

		// Check if required files found
		if (file_exists($config_path) && file_exists($db_path)) {
			$fp = @fopen($config_path, 'r');

			if ($fp) {
				$sep = '$|$';

				// loop, parse and define wp-config constants
    			while (($line = @fgets($fp)) !== false) {
					$line = preg_replace("/^define\([ '\"]+(\w+)[ '\"]+,[ '\"]+(.*)[ '\"]+\)/i", "$1".$sep."$2", $line);

					if (!empty($line)) {
						$info = explode($sep, $line);

						if (is_array($info) && count($info) == 2 && !defined($info[0])) {
							define($info[0], $info[1]);
						}
					}
    			}
    			
				@fclose($fp);
			
				$loaded = true;
				
				// Require dependencies
				require_once $db_path;
			}			
		}
				
		return $loaded;
	}
}