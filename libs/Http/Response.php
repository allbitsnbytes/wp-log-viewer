<?php 
	
namespace Allbitsnbytes\WPLogViewer\Http;

if (!defined('WPLOGVIEWER_BASE')) {
	header('HTTP/1.0 403 Forbidden');
	die;
}


/**
 * Represents a response
 * @since 0.1.0
 */
class Response {
	
	/**
	 * @var constant Default response type
	 * @static
	 * @since 0.1.0
	 */
	static $default_content_type = 'text/html';
	
	/**
	 * @var int The response code
	 * @since 0.1.0
	 */
	private $code = 200;
	
	/**
	 * @var string The response type
	 * @since 0.1.0
	 */
	private $type = '';
	
	/**
	 * @var array Array of containing the response contents
	 * @since 0.1.0
	 */
	private $data = [];
	
	
	/**
	 * Constructor
	 * @param int $code The code to initialize the response with
	 * @param string $type The response type to initialize the response with
	 * @since 0.1.0
	 */
	public function __construct($code=200, $type='') {
		$this->code = $code;
		$this->type = $type;
	}


	/**
	 * Set data to send
	 * @param string $data Data to send 
	 * @since 0.1.0
	 */
	public function set($data) {
		$this->data[] = $data;
	}
	
	
	/**
	 * Set JSON data to send
	 * @param array $data The data to JSONify and return
	 * @since 0.1.0
	 */
	public function set_json($data) {
		$this->set_type('application/json');
		$this->set($data);
	}
	
	
	/**
	 * Set JSONP data to send
	 * @param array $data The data to JSONify and return
	 * @since 0.1.0
	 */
	public function set_jsonp($data) {
		$this->set_type('application/javascript');
		$this->set($data);
	}


	/**
	 * Set response type if not already set
	 * @param string $type The type to set
	 * @since 0.1.0
	 */
	public function set_type($type) {
		if (empty($this->type)) {
			$this->type = $type;
		}
	}


	/** 
	 * Set response code
	 * @param int $code The response code to set
	 * @since 0.1.0
	 */
	public function set_code($code) {
		$this->code = $code;
	}


	/**
	 * Prepare and send response
	 * @return void
	 * @since 0.1.0
	 */
	public function send() {
		$content_type = empty($this->type) ? self::$default_content_type : $this->type;
		$content = '';

		if ($this->type === 'application/json' || $this->type === 'application/javascript') {
			$data = [];

			foreach($this->data as $field) {
				$data = array_merge($data, $field);	
			}

			$content = json_encode($data);	
		} else {
			$content = implode('', $this->data);
		}

		// Set headers
		if (!headers_sent()) {
			http_response_code($this->code);
			header('Content-Type: ' . $content_type);
		}

		// Echo content if request is ok
		if ($this->code === 200) {
			echo $content;
		}

		exit;
	}
}