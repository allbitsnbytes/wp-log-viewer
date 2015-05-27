function wplv_remote(action, method, data, done) {
	var data = typeof data === 'object' ? data : {};
	
	data.do = action;
		
	reqwest({
		url: WPLOGVIEWER.api,
		method: method,
		data: data,
		headers: {
			'wplv-cookie': WPLOGVIEWER.cookie_token,
			'wplv-session': WPLOGVIEWER.session_key
		}
	}).then(done);
}

var wplv_notify = (function() {
	var config = {
		timeout: 4000,
		waitForMove: true,
		baseCls: 'humane-flatty'
	};
	
	return {
		alert: function(msg) {
			config.addnCls = 'humane-wplv-alert';
			humane.log(msg, config);
		},
			
		error: function(msg) {
			config.addnCls = 'humane-wplv-error';
			humane.log(msg, config);
		},
		
		success: function(msg) {
			config.addnCls = 'humane-wplv-success';
			humane.log(msg, config);
		}
	};
})();


React.render(
	<Viewer />,
	document.getElementById('wp-log-viewer-container')
);