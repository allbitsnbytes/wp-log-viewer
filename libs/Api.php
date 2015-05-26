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
			'cleared'		=> $log->clear(),
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
}