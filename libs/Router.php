<?php 
	
namespace Allbitsnbytes\WPLogViewer;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Dependencies
 */
use Allbitsnbytes\WPLogViewer\Auth;
use Allbitsnbytes\WPLogViewer\Characteristic\IsSingleton;
use Allbitsnbytes\WPLogViewer\Helper;
use Allbitsnbytes\WPLogViewer\Http\Request;
use Allbitsnbytes\WPLogViewer\Http\Response;


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
	 * Get requested action
	 * @return string The requested action
	 * @since 0.1.0
	 */
	private function getAction() {
		return isset($_REQUEST['do']) ? $_REQUEST['do'] : '';
	}
	
	
	/**
	 * Get parameters sent in the request
	 * @return array Array of parameters
	 * @since 0.1.0
	 */
	private function getParams() {
		$params = $_REQUEST;
		
		unset($params['do']);
		
		return $params;
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
	 * @return void
	 * @since 0.1.0
	 */
	public function get($action, $fn, $auth=true) {
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
	 * @return void
	 * @since 0.1.0
	 */
	public function post($action, $fn, $auth=true) {
		$this->handle($action, [
			'method'	=> 'POST',
			'call'		=> $fn,
			'auth'		=> $auth,
		]);
	}
	
	
	/**
	 * Process incoming request
	 * @return void
	 * @since 0.1.0
	 */
	public function run() {
		$headers = $this->getRequestHeaders();
		$method = $this->getRequestMethod();
		$action = $this->getAction();
		$params = $this->getParams();
		$request = new Request($action, $method, $headers, $params);
		$response = new Response();
		$handled = 0;

		if (isset($this->handlers[$action])) {
			$handlers = $this->handlers[$action];
			
			foreach ($handlers as $handler) {
				if ($method === strtoupper($handler['method'])) {
					if ($handler['auth']) {
						$auth = Auth::getInstance();
						
						// TODO: Check if authenticated
						
						//if (false) {
						//	$response->setCode(401);
						//	$response->send();
						//}
					}

					if (is_callable($handler['call'])) {
						// Execute handler
						$response = call_user_func_array($handler['call'], [$request, $response]);
						
						// If response instance was not returned, let's invalite this request
						if (!isset($response) || !is_object($response)) {
							$response = new Response(400);
							$response->send();
						}
						
						$handled++;
					}
				}
			}
		}
		
		if ($handled === 0) {
			$response->setCode(404);
		} 
		
		$response->send();
	}
}