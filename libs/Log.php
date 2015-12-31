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


/**
 * Log file handler
 *
 * @since 0.1.0
 */
class Log {

	use IsSingleton;

	/**
	 * Path to debug.log file
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	private $log_file = '';


	/**
	 * Initialize Log
	 *
	 * @since 0.1.0
	 */
	public function init() {
		$this->log_file = WP_CONTENT_DIR . '/debug.log';
	}


	/**
	 * Get debug.log path
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_debug_file_path() {
		return $this->log_file;
	}


	/**
	 * Check if debug.log file exists
	 *
	 * @since 0.1.0
	 *
	 * @return boolean True if debug.log exists
	 */
	public function file_exists() {
		return file_exists($this->log_file);
	}


	/**
	 * Check if debugging is enabled
	 *
	 * @since 0.1.0
	 *
	 * @return boolean True if debugging is enabled
	 */
	public function debug_enabled() {
		 return defined('WP_DEBUG') && (WP_DEBUG === true || WP_DEBUG === 'true') ? true : false;
	}


	/**
	 * Check if debugging status can be toggled and saved
	 *
	 * @since 1.0.0
	 *
	 * @return boolean True if status can be toggled and saved
	 */
	function is_debug_toggleable() {
		$index_file = $_SERVER['DOCUMENT_ROOT'].'/wplv-config.php';

		return defined('WPLV_DEBUG') && file_exists($index_file) && is_writable($index_file) ? true : false;
	}


	/**
	 * Check if debug status was detected or not
	 *
	 * @since 0.11.0
	 *
	 * @return boolean True if debugging status was detected
	 */
	public function debug_status_detected() {
		return defined('WP_DEBUG');
	}


	/**
	 * Enable debugging
	 *
	 * @since 1.0.0
	 *
	 * @return boolean True if debugging was enabled
	 */
	public function enable_debugging() {
		return $this->set_debugging_status(true);
	}


	/**
	 * Disable debugging
	 *
	 * @since 1.0.0
	 *
	 * @return boolean True if debugging was disabled
	 */
	public function disable_debugging() {
		return $this->set_debugging_status(false);
	}


	/**
	 * Check if file was modified since provided timestamp
	 *
	 * @since 0.1.0
	 *
	 * @param $timestamp int Timestamp to check against
	 * @return boolean True if was modified
	 */
	public function is_modified($timestamp='') {
		if (file_exists($this->log_file)) {
			$now = filemtime($this->log_file);

			if (is_int($timestamp)) {
				return $timestamp != $now ? true : false;
			} else if (is_string($timestamp)) {
				return $timestamp != date('c', $now) ? true : false;
			}
		}

		return false;
	}


	/**
	 * Get last modified timestamp
	 *
	 * @since 0.1.0
	 *
	 * @return int Last modified timestamp
	 */
	public function last_modified() {
		if (file_exists($this->log_file)) {
			return date('c', filemtime($this->log_file));
		}

		return false;
	}


	/**
	 * Get timezone for server
	 *
	 * @since 0.1.0
	 *
	 * @return string The server timezone
	 */
	public function get_timezone() {
		return date_default_timezone_get();
	}


	/**
	 * Check if file is smaller in size than provided size in bytes
	 *
	 * @since 0.1.0
	 *
	 * @param $size int Size to check against
	 * @return boolean True if file is smaller
	 */
	public function is_smaller($size='') {
		if (file_exists($this->log_file)) {
			return filesize($this->log_file) < intval($size) ? true : false;
		}

		return false;
	}


	/**
	 * Get the file size for the log file
	 *
	 * @since 0.1.0
	 *
	 * @return int The size in bytes
	 */
	public function get_file_size() {
		if (file_exists($this->log_file)) {
			return filesize($this->log_file);
		}

		return false;
	}


	/**
	 * Get all log entries
	 *
	 * @since 0.1.0
	 *
	 * @return array Array of entries
	 */
	public function get_entries() {
		$sep = '$!$';
		$entries = [];

		if ($this->file_exists()) {
			$fp = @fopen($this->log_file, 'r');

			if ($fp) {
    			while (($line = @fgets($fp)) !== false) {
					$line = preg_replace("/^\[([0-9a-zA-Z-]+) ([0-9:]+) ([a-zA-Z_\/]+)\] (.*)$/i", "$1".$sep."$2".$sep."$3".$sep."$4", $line);
					$parts = explode($sep, $line);

					if (count($parts) >= 4) {
	        			$entries[] = [
							'date' => date('Y/m/d', strtotime($parts[0])),
							'time' => $parts[1],
							'timezone' => $parts[2],
							'message' => stripslashes($parts[3]),
						];
					}
    			}

				@fclose($fp);
			}
		}

		return array_reverse($entries);
	}


	/**
	 * Get all file contents
	 *
	 * @since 1.0.0
	 *
	 * @return string The contents or empty string
	 */
	public function get_contents() {
		if ($this->file_exists()) {
			return file_get_contents($this->log_file);
		}

		return '';
	}


	/**
	 * Get all entries newer than specified timestamp
	 *
	 * @since 0.1.0
	 *
	 * @param $timestamp int The oldest date and time to get entries for
	 * @return array Array of entries
	 */
	public function get_recent_entries($timestamp) {
		// TODO

		return [];
	}


	/**
	 * Clear debug.log file
	 *
	 * @since 0.1.0
	 *
	 * @return boolean True if file was cleared
	 */
	public function clear() {
		$fp = @fopen($this->log_file, 'r+');

		return @ftruncate($fp, 0);
	}


	/**
	 * Delete debug.log file
	 *
	 * @since 0.1.0
	 *
	 * @return boolean True if file was deleted
	 */
	public function delete() {
		return unlink($this->log_file) === TRUE ? true : false;
	}


	/**
	 * Set debugging status if possible
	 *
	 * @since 1.0.0
	 *
	 * @param $status boolean The new status
	 * @return boolean True if status updated
	 */
	private function set_debugging_status($status=false) {
		$saved = false;

		if ($this->is_debug_toggleable()) {
			$index_file = $_SERVER['DOCUMENT_ROOT'].'/wplv-config.php';

			// Get file contents then updated constant value
			$content = file_get_contents($index_file);
			$content = preg_replace('/define\([ \"\']+WPLV_DEBUG[ \"\']+,.*;/', 'define("WPLV_DEBUG", '.($status == true ? 'true' : 'false').');', $content);

			// Write updated content to debug.log
			$saved = file_put_contents($index_file, $content);
		}

		return $saved !== false || $saved > 0 ? true : false;
	}
}