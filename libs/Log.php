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
 * Log file handler
 * @since 0.1.0
 */
class Log {

	use IsSingleton;

	/**
	 * Check if debug.log file exists
	 * @return boolean True if debug.log exists
	 * @since 0.1.0
	 */
	public function file_exists() {
		// TODO
	}


	/**
	 * Check if debugging is enabled
	 * @return boolean True if debugging is enabled
	 * @since 0.1.0
	 */
	public function debug_enabled() {
		// TODO
	}


	/**
	 * Check if file was modified since provided timestamp
	 * @param $timestamp int Timestamp to check against
	 * @return boolean True if was modified
	 * @since 0.1.0
	 */
	public function is_modified($timestamp) {
		// TODO
	}


	/**
	 * Get last modified timestamp
	 * @return int Last modified timestamp
	 * @since 0.1.0
	 */
	public function last_modified() {
		// TODO
	}


	/**
	 * Get timezone for server
	 * @return The server timezone
	 * @since 0.1.0
	 */
	public function get_timezone() {
		// TODO
	}


	/**
	 * Check if file is smaller in size than provided size in bytes
	 * @param $size int Size to check against
	 * @return boolean True if file is smaller
	 * @since 0.1.0
	 */
	public function is_smaller($size) {
		// TODO
	}


	/**
	 * Get all log entries
	 * @return array Array of entries
	 * @since 0.1.0
	 */
	public function get_entries() {
		// TODO
	}


	/**
	 * Get all entries newer than specified timestamp
	 * @param $timestamp int The oldest date and time to get entries for
	 * @return array Array of entries
	 * @since 0.1.0
	 */
	public function get_recent_entries($timestamp) {
		// TODO
	}


	/**
	 * Clear debug.log file
	 * @return boolean True if file was cleared
	 * @since 0.1.0
	 */
	public function clear() {
		// TODO
	}
}