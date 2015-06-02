<?php
/**
 * @package   	wp-log-viewer
 * @author    	Maxwell Berkel <maxwell@allbitsnbytes.com>
 * @link      	http://allbitsnbytes.com
 * @copyright 	MIT License
 *
 * @wordpress-plugin
 * Plugin Name: WP Log Viewer
 * Plugin URI:  https://github.com/allbitsnbytes/wp-log-viewer
 * Description: Wordpress debug log viewer plugin
 * Version:     0.1.0 
 * Author:      Maxwell Berkel
 * Author URI:  http://allbitsnbytes.com
 * Text Domain: wplv
 **/


if (!defined('WPINC')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Define Constants
 */
define('WPLOGVIEWER_BASE', dirname(__FILE__) . '/');
define('WPLOGVIEWER_URL', plugin_dir_url(__FILE__));


// Register autoloader
require_once WPLOGVIEWER_BASE . 'autoload.php';

use Allbitsnbytes\WPLogViewer\Plugin;

// Load plugin
$plugin = Plugin::get_instance();