/**
 * Display log viewer
 */
var Viewer = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			entries: [],
			found: false,
			debugEnabled: false,
			timezone: '',
			modified: '',
			sort: 'newest',
			view: 'group',
			ready: false
		};
	},

	// Initialize when component is to be mounted
	componentDidMount: function() {
		// Initialize component
		wplv_remote('get-log', 'GET', {}, function(res) {
			this.setState({
				found: res.found,
				timezone: res.timezone,
				debugEnabled: res.debugEnabled,
				ready: true
			});

			this.updateEntries(res.entries, res.modified);
		}.bind(this));

		// Check for changes
		//var timer = setInterval(this.checkLastest, 15000);
	},

	// Clear log entries
	clearLogEntries: function() {
		wplv_remote('clear-log', 'GET', {}, function(res) {
			if (res.cleared) {
				this.setState({entries: []});
			}
		}.bind(this));
	},

	// Get log entries if modified
	checkLastest: function() {
		var data = {
			modified: this.state.modified
		};

		wplv_remote('get-entries-if-modified', 'GET', data, function(res) {
			if (res.changed) {		
				this.updateEntries(res.entries, res.modified);
			}
		}.bind(this));
	},

	// Update entries
	updateEntries: function(entries, modified) {
		if (this.state.sort === 'oldest') {
			entries.reverse();
		}

		var data = {
			entries: entries
		};

		if (modified) {
			data.modified = modified;
		}

		this.setState(data);
	},

	// Download log file
	downloadFile: function() {
		console.log('Download log file');
	},

	// Sort newest
	sortNewest: function() {
		if (this.state.sort === 'oldest') {
			this.setState({sort: 'newest', entries: this.state.entries.reverse()});
		}
	},

	// Sort oldest
	sortOldest: function() {
		if (this.state.sort === 'newest') {
			this.setState({sort: 'oldest', entries: this.state.entries.reverse()});
		}
	},

	// List view
	showListView: function() {
		this.setState({view: 'list'});
	},

	// Group view
	showGroupView: function() {
		this.setState({view: 'group'});
	},

	// Render component
	render: function() { 
		if (this.state.ready) {
			if (this.state.found) {
				if (this.state.view == 'list') {
					return (
						<div id="viewer-pane">
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } /></h2>
							
							<LogListView entries={ this.state.entries } />
							<ViewSidebar viewer={ this } />
						</div>
					);
				} else {
					return (
						<div id="viewer-pane">
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } /></h2>
							
							<LogGroupView entries={ this.state.entries } />
							<ViewSidebar viewer={ this } />
						</div>
					);
				}
			} else { 
				if (this.state.debugEnabled) {
					return (
						<div id="viewer-pane">
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } /></h2>
						
							<p>Debugging is enabled. However, the <strong>debug.log file does not exist</strong>.</p>
						</div> 
					);
				} else {
					return (
						<div id="viewer-pane">
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } /></h2>
	
							<p><strong>Debugging is currently <span className="highlight">disabled</span>.</strong></p>
							<br />
													
							<p>To turn on debugging, add the following to your wp-config.php file.</p>
			
							<p className="code-snippet">
								define('WP_DEBUG', true);<br />
								define('WP_DEBUG_LOG', true);<br />
								define('WP_DEBUG_DISPLAY', false);
							</p>
							
							<p>For more info: <a href="https://codex.wordpress.org/Debugging_in_WordPress" target="_blank">Debugging In Wordpress</a></p>
						</div>
					);
				}
			}
		}

		return (
			<div id="viewer-pane">
				<h2>Log Viewer</h2>
			</div>
		);
	}
});