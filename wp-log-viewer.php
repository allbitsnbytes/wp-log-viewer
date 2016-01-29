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
 * Version:     1.0.3
 * Author:      Maxwell Berkel
 * Author URI:  http://allbitsnbytes.com
 * Text Domain: wplv
 *
 * WP Log Viewer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * WP Log Viewer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with WP Log Viewer. If not, see https://github.com/allbitsnbytes/wp-log-viewer/blob/LICENSE.
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