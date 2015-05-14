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
	 * @var string Path to debug.log
	 * @since 0.1.0
	 */
	private $log_file = '';
	
	
	/**
	 * Initialize Log
	 * @since 0.1.0
	 */
	public function init() {
		$base = str_replace('plugins/wp-log-viewer/', '', WPLOGVIEWER_BASE);
		$this->log_file = $base . 'debug.log';
	}
	

	/**
	 * Check if debug.log file exists
	 * @return boolean True if debug.log exists
	 * @since 0.1.0
	 */
	public function file_exists() {
		return file_exists($this->log_file);
	}


	/**
	 * Check if debugging is enabled
	 * @return boolean True if debugging is enabled
	 * @since 0.1.0
	 */
	//public function debug_enabled() {
		// TODO
	//}


	/**
	 * Check if file was modified since provided timestamp
	 * @param $timestamp int Timestamp to check against
	 * @return boolean True if was modified
	 * @since 0.1.0
	 */
	public function is_modified($timestamp='') {
		$now = filemtime($this->log_file);
		
		if (is_int($timestamp)) {
			return $timestamp != $now ? true : false;
		} else if(is_string($timestamp)) {
			return $timestamp != date('c', $now) ? true : false;
		}
		
		return false;
	}


	/**
	 * Get last modified timestamp
	 * @return int Last modified timestamp
	 * @since 0.1.0
	 */
	public function last_modified() {
		return date('c', filemtime($this->log_file));
	}


	/**
	 * Get timezone for server
	 * @return string The server timezone
	 * @since 0.1.0
	 */
	public function get_timezone() {
		return date_default_timezone_get();
	}


	/**
	 * Check if file is smaller in size than provided size in bytes
	 * @param $size int Size to check against
	 * @return boolean True if file is smaller
	 * @since 0.1.0
	 */
	public function is_smaller($size='') {
		// TODO
		
		return false; 
	}


	/**
	 * Get all log entries
	 * @return array Array of entries
	 * @since 0.1.0
	 */
	public function get_entries() {
		$sep = '$!$';
		$entries = [];
		
		if ($this->file_exists()) {
			$fp = @fopen($this->log_file, 'r');

			if ($fp) {
    			while (($line = @fgets($fp)) !== false) {
					$line = preg_replace("/^\[([0-9a-zA-Z-]+) ([0-9:]+) ([a-zA-Z_]+)\] (.*)$/i", "$1".$sep."$2".$sep."$3".$sep."$4", $line);
					$parts = explode($sep, $line);
        			$entries[] = [
						'date' => $parts[0], 
						'time' => $parts[1],
						'timezone' => $parts[2],
						'message' => stripslashes($parts[3]),
					];
    			}
    			
				@fclose($fp);
			}
		}

		return $entries;
	}


	/**
	 * Get all entries newer than specified timestamp
	 * @param $timestamp int The oldest date and time to get entries for
	 * @return array Array of entries
	 * @since 0.1.0
	 */
	public function get_recent_entries($timestamp) {
		// TODO
		
		return [];
	}


	/**
	 * Clear debug.log file
	 * @return boolean True if file was cleared
	 * @since 0.1.0
	 */
	public function clear() {
		$fp = @fopen($this->log_file, 'r+');
		
		return @ftruncate($fp, 0);
	}
	
}