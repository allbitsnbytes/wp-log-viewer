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
 * @since 0.1.0
 */
class Api {
	
	/**
	 * Get log file details
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function get_log_details($req, $res) {
		$log = Log::getInstance();
	
		$res->setJSON([
			'entries'		=> $log->get_entries(),
			'found'			=> $log->file_exists(),
//			'debug_enabled'	=> $log->debug_enabled(),
			'timezone'		=> $log->get_timezone(),
			'modified'		=> $log->last_modified(),
		]);
	
		return $res;
	}
	

	/**
	 * Check if log file has been modified
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function check_if_log_modified($req, $res) {
		$log = Log::getInstance();
		
		$res->setJSON([
			'modified'		=> isset($req->params['modified']) && $log->is_modified($req->params['modified']) ? true : false,
			'truncated'		=> $log->is_smaller(),
		]);
		
		return $res;
	}
	

	/**
	 * Check if log file exists
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function check_if_log_exists($req, $res) {
		$log = Log::getInstance();
		
		$res->setJSON([
			'exists'		=> $log->file_exists(),
		]);
		
		return $res;
	}
	

	/**
	 * Check if debugging is enabled
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	//public static function check_if_debug_enabled($req, $res) {
	//	$log = Log::getInstance();
		
	//	$res->setJSON([
	//		'debug_enabled'	=> $log->debug_enabled(),
	//	]);
		
	//	return $res;
	//}
	

	/**
	 * Get log entries
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function get_log_entries($req, $res) {
		$log = Log::getInstance();
		$truncated = $log->is_smaller();

		$res->setJSON([
			'truncated'		=> $truncated,
			//'entries'		=> $truncated ? $log->get_recent_entries() : $log->get_entries(),
			'entries'		=> $log->get_entries(),
			'modified'		=> $log->last_modified(),
		]);
		
		return $res;
	}
	
	
	/**
	 * Get log entries if log file has been modified
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function get_log_entries_if_modified($req, $res) {
		$log = Log::getInstance();
		$changed = false;

		if (isset($req->params['modified']) && $log->is_modified($req->params['modified'])) {
			$res = self::get_log_entries($req, $res);
			$changed = true;
		} 

		$res->setJSON([
			'changed'		=> $changed,
		]);
		
		return $res;
	}
	
	
	/**
	 * Clear log file
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function clear_log($req, $res) {
		$log = Log::getInstance();
		
		$res->setJSON([
			'cleared'		=> $log->clear(),
		]);
		
		return $res;
	}
	
	
	/**
	 * Process user login
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
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
	 * @param Request $req Request instance
	 * @param Response $res Response instance
	 * @return Response The current response instance
	 * @since 0.1.0
	 */
	public static function logout_user($req, $res) {
		// TODO
		
		return $res;
	}
}