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
 * Settings handler
 *
 * @since 0.1.0
 */
class Settings {

	use IsSingleton;

	/**
	 * Allowed setting fields
	 *
	 * @since 0.14.0
	 */
	private $allowed = ['sort', 'view', 'query', 'legends', 'fold_sidebar', 'truncate_download', 'wpconfig_path'];


	/**
	 * Global settings
	 *
	 * @since 0.14.0
	 */
	private $globals = [
		'view'				=> 'group',
		'sort'				=> 'newest',
		'query'				=> '',
		'legends'			=> '',
		'fold_sidebar'		=> 1,
		'truncate_download'	=> 1,
		'wpconfig_path'		=> '',
	];


	/**
	 * Get settings for user provided.  If no user is provided or no settings have been set for that user, return global settings
	 *
	 * @since 0.12.0
	 *
	 * @param int $user_id The user id for the user to get settings for
	 * @return array
	 */
	public function get_settings($user_id=0) {
		$settings = [];

		if ($user_id > 0) {
			$settings = $this->get_user_settings($user_id);
		}

		if (empty($settings)) {
			$settings = $this->get_global_settings();
		}

		return $this->merge_settings($this->globals, $settings);
	}


	/**
	 * Get global settings
	 *
	 * @since 0.12.0
	 *
	 * @return array|false
	 */
	public function get_global_settings() {
		return \get_option('_wplv_settings', false);
	}


	/**
	 * Update global settings
	 *
	 * @since 0.12.0
	 *
	 * @param array $new_settings The settings to set
	 * @return boolean
	 */
	public function update_global_settings($new_settings) {
		$settings = $this->get_settings();
		$settings = $this->merge_settings($settings, $new_settings);

		$updated = \update_option('_wplv_settings', $settings);

		return $updated;
	}


	/**
	 * Get settings for a user
	 *
	 * @since 0.12.0
	 *
	 * @param int $user_id The user id for the user to get settings for
	 * @return object|false
	 */
	public function get_user_settings($user_id) {
		$settings = \get_user_meta($user_id, '_wplv_settings', true);

		return empty($settings) ? false : $settings;
	}


	/**
	 * Update settings for a user
	 *
	 * @since 0.12.0
	 *
	 * @param int $user_id The user id of the user to get settings for
	 * @param array $new_settings The settings to set
	 * @return boolean
	 */
	public function update_user_settings($user_id, $new_settings) {
		$settings = $this->get_settings($user_id);
		$settings = $this->merge_settings($settings, $new_settings);

		return \update_user_meta($user_id, '_wplv_settings', $settings);
	}


	/**
	 * Merge key and value into global array if it's not currently present set.  If it is already set, update the value
	 *
	 * @since 0.12.0
	 *
	 * @param array $global The array to merge into or update
	 * @param array $new The array to merge
	 * @return array
	 */
	private function merge_settings($global, $new) {
		if (is_array($new) && count($new) > 0) {
			foreach ($new as $key=>$value) {
				if (in_array($key, $this->allowed)) {
					$global[$key] = $value;
				}
			}
		}

		return $global;
	}

}