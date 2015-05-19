function wplv_remote(action, method, data, success) {
	var data = typeof data === 'object' ? data : {};
	
	data.do = action;
		
	reqwest({
		url: WPLOGVIEWER.api,
		method: method,
		data: data,
		headers: {
			'wplv-api': WPLOGVIEWER.api_key,
			'wplv-session': WPLOGVIEWER.session_key
		},
		success: success
	});
}

if (WPLOGVIEWER.debugEnabled) {
	WPLOGVIEWER.debugEnabled = parseInt(WPLOGVIEWER.debugEnabled);
}

React.render(
	<Viewer />,
	document.getElementById('wp-log-viewer')
);