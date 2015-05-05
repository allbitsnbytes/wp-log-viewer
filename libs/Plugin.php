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
		wp_enqueue_style('wplogviewer-css', WPLOGVIEWER_URL . 'assets/css/main.css');
		
		// Javascript files
		wp_enqueue_script('wplogviewer-js', WPLOGVIEWER_URL . 'assets/js/main.js');
	}
	
	
	/**
	 * Add navigation entry
	 */
	public function add_navigation() {
		add_management_page('Wordpress Log Viewer', 'Log Viewer', 'manage_options', 'wp-log-viewer', function() {
			echo '
				<div id="wp-log-viewer" class="wrap">
					<h2>Log Viewer</h2>
					
					<div class="viewer">
					</div>
					
					<div class="sidebar">
						<h3>Actions</h3>
						<ul>
							<li><a href="#" title="Clear debug.log">Clear</a></li>
							<li><a href="#" tilte="Download file">Download</a></li>
						</ul>

						<h3>Date Range</h3>
						<ul>
							<li><a href="#" title="Show today">Today</a></li>
							<li><a href="#" tilte="Show yesterday">Yesterday</a></li>
							<li><a href="#" title="This Week">This week</a></li>
							<li><a href="#" title="This Month">This month</a></li>
						</ul>
						
						<h3>Sort</h3>
						<ul>
							<li><a href="#" title="Sort by most recent">Most recent</a></li>
							<li><a href="#" tilte="Sort by oldest">Oldest first</a></li>
						</ul>
						
						<h3>Severity</h3>
						<ul>
							<li><a href="#" title="All errors">All</a></li>
							<li><a href="#" title="Fatal errors">Fatal</a></li>
							<li><a href="#" title="Warnings errors">Warnings</a></li>
							<li><a href="#" title="Misc errors">Misc</a></li>
						</ul>
						
						<small>
							<strong>Last modified</strong><br>
							<span class="last-modified">today</span>
						</small>
					</div>
				</div>
			';
		});
	}
}