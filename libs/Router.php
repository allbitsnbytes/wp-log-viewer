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
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;


/**
 * Request router
 * @since 0.1.0
 */
class Router {
	
	use IsSingleton;
	
	/**
	 * @var array Registered handlers
	 * @since 0.1.0
	 */
	private $handlers = [];
	
	/**
	 * Initialize
	 * @since 0.1.0
	 */
	public function init() {
		
	}
	
	
	/**
	 * Get all request headers
	 * @return array The request headers
	 * @since 0.1.0
	 */
	private function getRequestHeaders() {
		if (function_exists('getallheaders')) {
			return getallheaders();
		}
		
		$headers = [];
		
		foreach ($_SERVER as $key => $value) {
			if ((substr($key, 0, 5) == 'HTTP_')) {
				$headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))))] = $value;
			}
		}
		
		return $headers;
	}
	
	
	/**
	 * Get request method
	 * @return string The request method
	 * @since 0.1.0
	 */
	private function getRequestMethod() {
		return $_SERVER['REQUEST_METHOD'];
	}
	
	
	/**
	 * Register an action and handler
	 * @param string $action The action to handle
	 * @param array $handler An array with the following keys: method, call, auth.  Method must be either POST or GET, call must be a callable function, and auth a boolean.
	 * @return void
	 * @since 0.1.0
	 */
	public function handle($action, $handler) {
		if (!isset($this->handlers[$action]) || !is_array($this->handlers[$action])) {
			$this->handlers[$action] = [];
		}
		
		if (is_array($handler) && isset($handler['method']) && isset($handler['call']) && isset($handler['auth']) && is_callable($handler['call'])) {
			$this->handlers[$action][] = $handler;
		}
	}
	
	
	/**
	 * Register a GET handler
	 * @param string $action The action to handle
	 * @param callable $fn The callable function to call if action is matched
	 * @param boolean $auth Whether must be authenticated to perform action
	 * @since 0.1.0
	 */
	public function get($action, $fn, $auth) {
		$this->handle($action, [
			'method'	=> 'GET',
			'call'		=> $fn,
			'auth'		=> $auth,
		]);
	}
	
	
	/**
	 * Register a POST handler
	 * @param string $action The action to handle
	 * @param callable $fn The callable function to call if action is matched
	 * @param boolean $auth Whether must be authenticated to perform action
	 * @since 0.1.0
	 */
	public function post($action, $fn, $auth) {
		$this->handle($action, [
			'method'	=> 'POST',
			'call'		=> $fn,
			'auth'		=> $auth,
		]);
	}
	
	
	/**
	 * Process incoming request
	 * @since 0.1.0
	 */
	public function run() {
		
	}
		
}