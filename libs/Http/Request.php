<?php 
	
namespace Allbitsnbytes\WPLogViewer\Http;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Represents an http request
 * @since 0.1.0
 */
class Request {
	
	/**
	 * @var string The request method
	 * @since 0.1.0
	 */
	public $method = '';
	
	/**
	 * @var string The requested action
	 * @since 0.1.0
	 */
	public $action = '';
	
	/**
	 * @var array The request headers
	 * @since 0.1.0
	 */
	public $headers = [];
	
	/**
	 * @var array The provided parameters
	 * @since 0.1.0
	 */
	public $params = [];
	
	
	/**
	 * Constructor
	 * @param string $action The requested action
	 * @param string $method The request method
	 * @param array $headers The request headers
	 * @param array $params Parameters provided
	 * @since 0.1.0
	 */
	public function __construct($action, $method, $headers, $params=[]) {
		$this->action = $action;
		$this->method = $method;
		$this->headers = $headers;
		$this->params = $params;
	}
}