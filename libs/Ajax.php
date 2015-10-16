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
use Allbitsnbytes\WPLogViewer\Log;
use Allbitsnbytes\WPLogViewer\Settings;


/**
 * Handle ajax requests
 *
 * @since 0.1.0
 */
class Ajax {

	use IsSingleton;


	/**
	 * Initialize Log
	 *
	 * @since 0.1.0
	 */
	public function init() {

		// Register ajax actions
		add_action('wp_ajax_get-log', [$this, 'get_log_details']);
		add_action('wp_ajax_log-changed', [$this, 'check_if_log_modified']);
		add_action('wp_ajax_log-exists', [$this, 'check_if_log_exists']);
		add_action('wp_ajax_debug-enabled', [$this, 'check_if_debug_enabled']);
		add_action('wp_ajax_get-entries', [$this, 'get_log_entries']);
		add_action('wp_ajax_get-entries-if-modified', [$this, 'get_log_entries_if_modified']);
		add_action('wp_ajax_clear-log', [$this, 'clear_log']);
		add_action('wp_ajax_get-default-settings', [$this, 'get_default_settings']);
		add_action('wp_ajax_update-default-settings', [$this, 'update_default_settings']);
		add_action('wp_ajax_get-user-settings', [$this, 'get_user_settings']);
		add_action('wp_ajax_update-user-settings', [$this, 'update_user_settings']);
	}


	/**
	 *
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
	 *
	 *
	 * @since 0.13.0
	 */
	function check_if_log_modified() {
		$log = Log::get_instance();

		wp_send_json([
			'modified'		=> isset($req->params['modified']) && $log->is_modified($req->params['modified']) ? true : false,
			'truncated'		=> $log->is_smaller(),
		]);
	}


	/**
	 *
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
	 *
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
	 *
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
	 *
	 *
	 * @since 0.13.0
	 */
	function get_log_entries_if_modified() {
		$log = Log::get_instance();
		$changed = false;

		if (isset($req->params['modified']) && $log->is_modified($req->params['modified'])) {
			$res = self::get_log_entries($req, $res);
			$changed = true;
		}

		wp_send_json([
			'changed'		=> $changed,
		]);
	}


	/**
	 *
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
	 *
	 *
	 * @since 0.13.0
	 */
	function get_default_settings() {
		$handler = Settings::get_instance();
		$settings = $handler->get_default_settings();

		wp_send_json([
			'settings'		=> $settings,
		]);

		return $res;
	}


	/**
	 *
	 *
	 * @since 0.13.0
	 */
	function update_default_settings() {
		$updated = false;

		if (isset($req->params['settings'])) {
			$handler = Settings::get_instance();
			$updated = $handler->update_default_settings($req->params['settings']);
		}

		wp_send_json([
			'updated'		=> $updated,
		]);
	}


	/**
	 *
	 *
	 * @since 0.13.0
	 */
	function get_user_settings() {
		$settings = [];

		if (isset($req->params['user_id'])) {
			$handler = Settings::get_instance();
			$settings = $handler->get_user_settings($req->params['user_id']);
		}

		wp_send_json([
			'settings'	=> $settings,
		]);
	}


	/**
	 *
	 *
	 * @since 0.13.0
	 */
	function update_user_settings() {
		$updated = false;

		if (isset($req->params['user_id']) && isset($req->params['settings'])) {
			$handler = Settings::get_instance();
			$updated = $handler->update_user_settings($req->params['user_id'], $req->params['setttings']);
		}

		wp_send_json([
			'updated'		=> $updated,
		]);
	}

}