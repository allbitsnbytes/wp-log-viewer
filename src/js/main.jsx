wplv.remote = (function() {
	var callRemote = function(action, method, data, success, failed) {
		var data = typeof data === 'object' ? data : {};

		data.action = action;

		reqwest({
			url: WPLOGVIEWER.api,
			method: method,
			data: data
			//headers: {
			//	'wplv-cookie': WPLOGVIEWER.cookie_token,
			//	'wplv-session': WPLOGVIEWER.session_key,
			//	'wplv-path': WPLOGVIEWER.path
			//}
		}).then(success)
		.fail(failed);
	}

	return {
		getAllEntries: function(data, success, fail) {
			return callRemote('get-log', 'POST', data, success, fail);
		},

		getLatestEntries: function(data, success, fail) {
			return callRemote('get-entries-if-modified', 'POST', data, success, fail);
		},

		clearEntries: function(success, fail) {
			return callRemote('clear-log', 'POST', {}, success, fail);
		},

		toggleDebugging: function(status, success, fail) {
			return callRemote('toggle-debugging', 'POST', {status: status}, success, fail);
		},

		getGlobalSettings: function(success, fail) {
			return callRemote('get-global-settings', 'POST', {}, success, fail);
		},

		updateGlobalSetting: function(key, value, success, fail) {
			var data = {};
			data[key] = value;

			return callRemote('update-global-settings', 'POST', {user_id: WPLOGVIEWER.user_id, settings: data}, success, fail);
		},

		updateGlobalSettings: function(data, success, fail) {
			if (typeof data === 'object') {
				return callRemote('update-global-settings', 'POST', {user_id: WPLOGVIEWER.user_id, settings: data}, success, fail);
			}
		},

		updateUserSetting: function(key, value, success, fail) {
			var data = {};
			data[key] = value;

			return callRemote('update-user-settings', 'POST', {user_id: WPLOGVIEWER.user_id, settings: data}, success, fail);
		},

		updateUserSettings: function(data, success, fail) {
			if (typeof data === 'object') {
				return callRemote('update-user-settings', 'POST', {user_id: WPLOGVIEWER.user_id, settings: data}, success, fail);
			}
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

var wplvDDStatus = WPLOGVIEWER.debug_enabled == 1 || WPLOGVIEWER.debug_enabled == true ? true : false;

if (WPLOGVIEWER.current_page === 'tools_page_wp-log-viewer') {
	React.render(
		<wplv.App user={ WPLOGVIEWER.user_id } settings={ WPLOGVIEWER.settings } debugging={ wplvDDStatus } pluginUrl={ WPLOGVIEWER.plugin_url } />,
		document.getElementById('wplv-viewer-container')
	);

	if (WPLOGVIEWER['settings'] && WPLOGVIEWER.settings['fold_sidebar'] && WPLOGVIEWER.settings.fold_sidebar == 1) {
		document.getElementsByTagName('body')[0].className += ' folded';
	}

	var fixedSidebar = false;

	window.onscroll = function() {
		var body = document.getElementsByTagName('body')[0];

		if (body.scrollTop >= 130) {
			if (fixedSidebar === false) {
				body.className += ' fixed-sidebar';
				fixedSidebar = true;
			}
		} else {
			if (fixedSidebar === true) {
				body.className = body.className.replace(' fixed-sidebar', ' ');
				fixedSidebar = false;
			}
		}
	};
} else if (WPLOGVIEWER.current_page === 'dashboard') {
	React.render(
		<wplv.DashboardWidget debugging={ wplvDDStatus } pluginUrl={ WPLOGVIEWER.plugin_url } />,
		document.getElementById('wplv-dashboard-widget-container')
	);
}

React.render(
	<wplv.AdminBarNav debugging={ wplvDDStatus } pluginUrl={ WPLOGVIEWER.plugin_url } />,
	document.getElementById('wp-admin-bar-wplv-menu')
);