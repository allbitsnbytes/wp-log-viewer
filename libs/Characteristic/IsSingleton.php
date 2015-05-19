<?php
	
namespace Allbitsnbytes\WPLogViewer\Characteristic;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


// Trait to make a class a singleton
trait IsSingleton 
{

	/**
	 * Singleton instance variable
	 * @var object 
	 * @static
	 */
	static $instance;

	
	/**
	 * Get and return the instance of service
	 * @return object
	 * @static
	 */
	public static function get_instance() 
	{
		$class = __CLASS__;
		return isset(static::$instance) ? static::$instance : static::$instance = new $class;
	}


	/**
     * Private constructor to prevent creating a new instance of the *Singleton* via the `new` operator from outside of this class.
	 * @final
     */
	final private function __construct() 
	{
		$this->init();
	}


    /**
     * Private clone method to prevent cloning of the instance of the *Singleton* instance.
     * @return void
	 * @final
     */
	final private function __clone() {}


    /**
     * Private unserialize method to prevent unserializing of the *Singleton* instance.
     * @return void
	 * @final
     */
	final private function __wakeup() {}


	/**
	 * Called when an instance is created.  Overwrite this method to perform a custom action when an instance is created.
	 * @return void 
	 */
	public function init() {}

}