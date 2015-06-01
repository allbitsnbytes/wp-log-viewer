/**
 * Display log viewer
 */
var Viewer = React.createClass({

	// Reference to currently active timer
	currentTimer: false,

	// Current active time check interval
	currentTimerInterval: 15000,

	// Get initial state
	getInitialState: function() {
		return {
			entries: [],
			debugEnabled: false,
			filesize: 0,
			found: false,
			modified: '',
			query: '',
			ready: false,
			sort: 'newest',
			timezone: '',
			view: 'group'
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

			this.updateEntries({
				entries: res.entries, 
				modified: res.modified,
				filesize: res.filesize
			});

			// If File was found and debugging is enabled, start auto checker
			if (res.found && res.debugEnabled) {
				this.currentTimer = setInterval(this.checkLatest, this.currentTimerInterval);
			}
		}.bind(this));
	},

	// Clear log entries
	clearLogEntries: function() {
		wplv_remote('clear-log', 'GET', {}, function(res) {
			if (res.cleared) {
				this.setState({entries: [], filesize: 0});
				wplv_notify.success('Log file <strong>successfully cleared</strong>');
			} else {
				wplv_notify.error('Failed to clear log file.  You might not have write permission');
			}
		}.bind(this));
	},

	// Refresh the viewer by checking for new log entries
	refreshViewer: function() {
		var data = {
			modified: this.state.modified
		};

		wplv_remote('get-entries-if-modified', 'GET', data, function(res) {
			if (res.changed) {
				this.updateEntries({
					entries: res.entries, 
					modified: res.modified,
					filesize: res.filesize
				});
				wplv_notify.success('Viewer updated with new entries');
			} else {
				wplv_notify.alert('No new entries found.');
			}
		}.bind(this));
	},

	// Get log entries if modified
	checkLatest: function() {
		var data = {
			modified: this.state.modified
		};

		wplv_remote('get-entries-if-modified', 'GET', data, function(res) {
			if (res.changed) {		
				this.updateEntries({
					entries: res.entries, 
					modified: res.modified, 
					filesize: res.filesize
				});
				wplv_notify.success('Log entries updated.');
			}
		}.bind(this));
	},

	// Search entries
	searchEntries: function(query) {
		this.setState({query: query});
	},

	// Update entries
	updateEntries: function(data) {
		if (data.entries && data.entries instanceof Array && this.state.sort === 'oldest') {
			data.entries.reverse();
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
				var entries = [];
				var query = this.state.query;
				var viewHeader = (
					<div className="view-header">
						<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } /></h2>
						<SearchField viewer={ this } />
					</div>
				);

				if (query !== '') {
					for (var index in this.state.entries) {
						var entry = this.state.entries[index];
						var match = new RegExp(query, 'gi');

						if (entry && entry.message && match.test(entry.message)) {
							entries.push(entry);
						}
					}
				} else {
					entries = this.state.entries;
				}

				if (this.state.view == 'list') {
					return (
						<div id="viewer-pane">
							{ viewHeader }

							<LogListView entries={ entries } />
							<ViewSidebar viewer={ this } />
						</div>
					);
				} else {
					return (
						<div id="viewer-pane">
							{ viewHeader }

							<LogGroupView entries={ entries } />
							<ViewSidebar viewer={ this } />
						</div>
					);
				}
			} else { 
				var viewHeader = (
					<div className="view-header">
						<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } /></h2>
					</div>
				);

				if (this.state.debugEnabled) {
					return (
						<div id="viewer-pane">
							{ viewHeader }
						
							<p>Debugging is enabled. However, the <strong>debug.log file does not exist</strong>.</p>
						</div> 
					);
				} else {
					return (
						<div id="viewer-pane">
							{ viewHeader }

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