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
	 * Default view
	 *
	 * @since 0.12.0
	 *
	 * @var string
	 */
	private $view = 'group';

	/**
	 * Default sort order
	 *
	 * @since 0.12.0
	 */
	private $sort = 'newest';


	/**
	 * Get settings for user provided.  If no user is provided or no settings have been set for that user, return defailt settings
	 *
	 * @since 0.12.0
	 *
	 * @param int $user_id The user id for the user to get settings for
	 * @return array
	 */
	public function get_settings($user_id=0) {
		$settings = false;

		if ($user_id > 0) {
			$settings = $this->get_user_settings($user_id);
		}

		if (empty($settings)) {
			$settings = $this->get_default_settings();
		}

		if (empty($settings)) {
			$settings = [
				'view'	=> $this->view,
				'sort'	=> $this->sort,
			];
		}

		return $settings;
	}


	/**
	 * Get default settings
	 *
	 * @since 0.12.0
	 *
	 * @return array|false
	 */
	public function get_default_settings() {
		return \get_option('_wplv_settings', false);
	}


	/**
	 * Update default settings
	 *
	 * @since 0.12.0
	 *
	 * @param array $new_settings The settings to set
	 * @return boolean
	 */
	public function update_default_settings($new_settings) {
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
	 * Merge key and value into default array if it's not currently present set.  If it is already set, update the value
	 *
	 * @since 0.12.0
	 *
	 * @param array $default The array to merge into or update
	 * @param array $new The array to merge
	 * @return array
	 */
	private function merge_settings($default, $new) {
		if (is_array($new) && count($new) > 0) {
			foreach ($new as $key=>$value) {
				$default[$key] = $value;
			}
		}

		return $default;
	}

}