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
use Allbitsnbytes\WPLogViewer\Log;
use Allbitsnbytes\WPLogViewer\Settings;


/**
 * Handle ajax requests
 *
 * @since 0.13.0
 */
class Ajax {

	use IsSingleton;


	/**
	 * Initialize Log
	 *
	 * @since 0.13.0
	 */
	public function init() {

		// Register ajax actions
		add_action('wp_ajax_get-log', [$this, 'get_log_details']);
		add_action('wp_ajax_log-changed', [$this, 'check_if_log_modified']);
		add_action('wp_ajax_log-exists', [$this, 'check_if_log_exists']);
		add_action('wp_ajax_debug-enabled', [$this, 'check_if_debug_enabled']);
		add_action('wp_ajax_toggle-debugging', [$this, 'toggle_debugging_status']);
		add_action('wp_ajax_get-entries', [$this, 'get_log_entries']);
		add_action('wp_ajax_get-entries-if-modified', [$this, 'get_log_entries_if_modified']);
		add_action('wp_ajax_clear-log', [$this, 'clear_log']);
		add_action('wp_ajax_get-global-settings', [$this, 'get_global_settings']);
		add_action('wp_ajax_update-global-settings', [$this, 'update_global_settings']);
		add_action('wp_ajax_get-user-settings', [$this, 'get_user_settings']);
		add_action('wp_ajax_update-user-settings', [$this, 'update_user_settings']);
	}


	/**
	 * Get log file details
	 *
	 * @since 0.13.0
	 */
	function get_log_details() {
		$log = Log::get_instance();

		wp_send_json([
			'entries'		=> $log->get_entries(),
			'found'			=> $log->file_exists(),
			'debugEnabled'	=> $log->debug_enabled(),
			'debugDetected'	=> $log->debug_status_detected(),
			'timezone'		=> $log->get_timezone(),
			'modified'		=> $log->last_modified(),
			'filesize'		=> $log->get_file_size(),
		]);
	}

	/**
	 * Check if log file has been modified
	 *
	 * @since 0.13.0
	 */
	function check_if_log_modified() {
		$log = Log::get_instance();

		wp_send_json([
			'modified'		=> isset($_REQUEST['modified']) && $log->is_modified($_REQUEST['modified']) ? true : false,
			'truncated'		=> $log->is_smaller(),
		]);
	}


	/**
	 * Check if log file exists
	 *
	 * @since 0.13.0
	 */
	function check_if_log_exists() {
		$log = Log::get_instance();

		wp_send_json([
			'exists'		=> $log->file_exists(),
		]);
	}


	/**
	 * Check if debugging is enabled
	 *
	 * @since 0.13.0
	 */
	function check_if_debug_enabled() {
		$log = Log::get_instance();

		wp_send_json([
			'debugEnabled'	=> $log->debug_enabled(),
			'debugDetected'	=> $log->debug_status_detected(),
		]);
	}


	/**
	 * Toggle debugging status
	 *
	 * @since 1.0.0
	 */
	function toggle_debugging_status() {
		$log = Log::get_instance();
		$status = isset($_POST['status']) && intval($_POST['status']) == 1 ? true : false;
		$changed = $status ? $log->enable_debugging() : $log->disable_debugging();

		wp_send_json([
			'changed'		=> $changed,
			'status'		=> $status,
		]);
	}


	/**
	 * Get log entries
	 *
	 * @since 0.13.0
	 */
	function get_log_entries() {
		$log = Log::get_instance();
		$truncated = $log->is_smaller();

		wp_send_json([
			'truncated'		=> $truncated,
			//'entries'		=> $truncated ? $log->get_recent_entries() : $log->get_entries(),
			'entries'		=> $log->get_entries(),
			'modified'		=> $log->last_modified(),
			'filesize'		=> $log->get_file_size(),
		]);
	}


	/**
	 * Get log entries if log file has been modified
	 *
	 * @since 0.13.0
	 */
	function get_log_entries_if_modified() {
		$log = Log::get_instance();

		if (isset($_REQUEST['modified']) && $log->is_modified($_REQUEST['modified'])) {
			$truncated = $log->is_smaller();

			wp_send_json([
				'truncated'		=> $truncated ,
				'entries'		=> $log->get_entries(),
				'modified'		=> $log->last_modified(),
				'filesize'		=> $log->get_file_size(),
				'changed'		=> true,
			]);
		}

		wp_send_json([
			'changed'		=> false,
		]);
	}


	/**
	 * Clear log file
	 *
	 * @since 0.13.0
	 */
	function clear_log() {
		$log = Log::get_instance();

		wp_send_json([
			'cleared'		=> $log->clear() || $log->delete() ? true : false,
		]);
	}


	/**
	 * Get global settings
	 *
	 * @since 0.13.0
	 */
	function get_global_settings() {
		$handler = Settings::get_instance();
		$settings = $handler->get_global_settings();

		wp_send_json([
			'settings'		=> $settings,
		]);
	}


	/**
	 * Update global settings
	 *
	 * @since 0.13.0
	 */
	function update_global_settings() {
		$updated = false;

		if (isset($_REQUEST['settings'])) {
			$handler = Settings::get_instance();
			$updated = $handler->update_global_settings($_REQUEST['settings']);
		}

		wp_send_json([
			'updated'		=> $updated,
		]);
	}


	/**
	 * Get user settings
	 *
	 * @since 0.13.0
	 */
	function get_user_settings() {
		$settings = [];

		if (isset($_REQUEST['user_id'])) {
			$handler = Settings::get_instance();
			$settings = $handler->get_user_settings($_REQUEST['user_id']);
		}

		wp_send_json([
			'settings'	=> $settings,
		]);
	}


	/**
	 * Update user settings
	 *
	 * @since 0.13.0
	 */
	function update_user_settings() {
		$updated = false;

		if (isset($_REQUEST['user_id']) && isset($_REQUEST['settings'])) {
			$handler = Settings::get_instance();
			$updated = $handler->update_user_settings($_REQUEST['user_id'], $_REQUEST['settings']);
		}

		wp_send_json([
			'updated'		=> $updated,
		]);
	}

}