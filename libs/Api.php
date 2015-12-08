<?php

namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Log;
use Allbitsnbytes\WPLogViewer\Settings;


/**
 * Handle authentication
 *
 * @since 0.1.0
 */
class Api {

	/**
	 * Get log file details
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function get_log_details($req, $res) {
		$log = Log::get_instance();

		$res->set_json([
			'entries'		=> $log->get_entries(),
			'found'			=> $log->file_exists(),
			'debugEnabled'	=> $log->debug_enabled(),
			'debugDetected'	=> $log->debug_status_detected(),
			'timezone'		=> $log->get_timezone(),
			'modified'		=> $log->last_modified(),
			'filesize'		=> $log->get_file_size(),
		]);

		return $res;
	}


	/**
	 * Check if log file has been modified
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function check_if_log_modified($req, $res) {
		$log = Log::get_instance();

		$res->set_json([
			'modified'		=> isset($req->params['modified']) && $log->is_modified($req->params['modified']) ? true : false,
			'truncated'		=> $log->is_smaller(),
		]);

		return $res;
	}


	/**
	 * Check if log file exists
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function check_if_log_exists($req, $res) {
		$log = Log::get_instance();

		$res->set_json([
			'exists'		=> $log->file_exists(),
		]);

		return $res;
	}


	/**
	 * Check if debugging is enabled
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function check_if_debug_enabled($req, $res) {
		$log = Log::get_instance();

		$res->set_json([
			'debugEnabled'	=> $log->debug_enabled(),
			'debugDetected'	=> $log->debug_status_detected(),
		]);

		return $res;
	}


	/**
	 * Get log entries
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function get_log_entries($req, $res) {
		$log = Log::get_instance();
		$truncated = $log->is_smaller();

		$res->set_json([
			'truncated'		=> $truncated,
			//'entries'		=> $truncated ? $log->get_recent_entries() : $log->get_entries(),
			'entries'		=> $log->get_entries(),
			'modified'		=> $log->last_modified(),
			'filesize'		=> $log->get_file_size(),
		]);

		return $res;
	}


	/**
	 * Get log entries if log file has been modified
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function get_log_entries_if_modified($req, $res) {
		$log = Log::get_instance();
		$changed = false;

		if (isset($req->params['modified']) && $log->is_modified($req->params['modified'])) {
			$res = self::get_log_entries($req, $res);
			$changed = true;
		}

		$res->set_json([
			'changed'		=> $changed,
		]);

		return $res;
	}


	/**
	 * Clear log file
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function clear_log($req, $res) {
		$log = Log::get_instance();

		$res->set_json([
			'cleared'		=> $log->clear() || $log->delete() ? true : false,
		]);

		return $res;
	}


	/**
	 * Clear currently logged in session
	 *
	 * @since 0.1.0
	 *
	 * @return Response Whether the session was cleared
	 */
	public static function clear_session($req, $res) {
		$res->set_json([
			'cleared'		=> $auth->clear_api_session(),
		]);

		return $res;
	}


	/**
	 * Process user login
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 *
	 * @todo
	 *		- Add brute force protection
	 *		- Limit login attempts
	 */
	public static function login_user($req, $res) {
		// TODO

		return $res;
	}


	/**
	 * Process user login
	 *
	 * @since 0.1.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function logout_user($req, $res) {
		// TODO

		return $res;
	}


	/**
	 * Get user settings
	 *
	 * @since 0.12.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function get_user_settings($req, $res) {
		$settings = [];

		if (isset($req->params['user_id'])) {
			$handler = Settings::get_instance();
			$settings = $handler->get_user_settings($req->params['user_id']);
		}

		$res->set_json([
			'settings'	=> $settings,
		]);

		return $res;
	}


	/**
	 * Update user settings
	 *
	 * @since 0.12.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function update_user_settings($req, $res) {
		$updated = false;

		if (isset($req->params['user_id']) && isset($req->params['settings'])) {
			$handler = Settings::get_instance();
			$updated = $handler->update_user_settings($req->params['user_id'], $req->params['setttings']);
		}

		$res->set_json([
			'updated'		=> $updated,
		]);

		return $res;
	}


	/**
	 * Get global settings
	 *
	 * @since 0.12.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function get_global_settings($req, $res) {
		$handler = Settings::get_instance();
		$settings = $handler->get_global_settings();

		$res->set_json([
			'settings'		=> $settings,
		]);

		return $res;
	}


	/**
	 * Update global settings
	 *
	 * @since 0.12.0
	 *
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 */
	public static function update_global_settings($req, $res) {
		$updated = false;

		if (isset($req->params['settings'])) {
			$handler = Settings::get_instance();
			$updated = $handler->update_global_settings($req->params['settings']);
		}

		$res->set_json([
			'updated'		=> $updated,
		]);

		return $res;
	}
}