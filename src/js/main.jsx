wplv.remote = (function() {
	var callRemote = function(action, method, data, success, failed) {
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
		}).then(success)
		.fail(failed);
	}

	return {
		getAllEntries: function(data, success, fail) {
			return callRemote('get-log', 'GET', data, success, fail);
		},

		getLatestEntries: function(data, success, fail) {
			return callRemote('get-entries-if-modified', 'GET', data, success, fail);
		},

		clearEntries: function(success, fail) {
			return callRemote('clear-log', 'GET', {}, success, fail);
		}
	};
})();

wplv.notify = (function() {
	var config = {
		timeout: 4000,
		waitForMove: true,
		baseCls: 'humane-flatty'
	};

	return {
		alert: function(msg) {
			config.addnCls = 'humane-wplv-alert';
			humane.remove(function() {
				humane.log(msg, config);
			});
		},

		error: function(msg) {
			config.addnCls = 'humane-wplv-error';
			humane.remove(function() {
				humane.log(msg, config);
			});
		},

		success: function(msg) {
			config.addnCls = 'humane-wplv-success';
			humane.remove(function() {
				humane.log(msg, config);
			});
		}
	};
})();

var defaultDebugging = WPLOGVIEWER.debug_enabled == 1 || WPLOGVIEWER.debug_enabled == true ? true : false;
var pluginUrl = WPLOGVIEWER.plugin_url;

if (WPLOGVIEWER.current_page === 'tools_page_wp-log-viewer') {
	React.render(
		<wplv.App user={ WPLOGVIEWER.user_id } settings={ WPLOGVIEWER.settings } debugging={ defaultDebugging } pluginUrl={ pluginUrl } />,
		document.getElementById('wplv-container')
	);
} else if (WPLOGVIEWER.current_page === 'dashboard') {
	React.render(
		<wplv.DashboardWidget debugging={ defaultDebugging } pluginUrl={ pluginUrl } />,
		document.getElementById('wplv-dashboard-widget-container')
	);
}

React.render(
	<wplv.AdminBarNav debugging={ defaultDebugging } pluginUrl={ pluginUrl } />,
	document.getElementById('wp-admin-bar-wplv-menu')
);