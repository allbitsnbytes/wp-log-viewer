/**
 * Display log viewer
 */
var Viewer = React.createClass({

	// Reference to currently active timer
	currentTimer: false,

	// Current active time check interval
	currentTimerInterval: 15000,

	// Get default properties
	getDefaultProps: function() {
		return {
			user_id: 0,
			settings: {
				view: 'group',
				sort: 'newest'
			}
		};
	},

	// Property types
	propTypes: {
		user_id: React.PropTypes.number,
		settings: React.PropTypes.object
	},

	// Get initial state
	getInitialState: function() {
		return {
			entries: [],
			debugEnabled: this.getDefaultDebuggingStatus(),
			debugDetected: false,
			filesize: 0,
			found: false,
			modified: '',
			query: '',
			ready: false,
			sort: 'newest',
			timezone: '',
			view: 'group',
			simulating: this.isSimulationEnabled()
		};
	},

	// Initialize when component is to be mounted
	componentDidMount: function() {
		this.setState({
			view: this.props.settings.view,
			sort: this.props.settings.sort
		});
		
		// Initialize component
		wplv_remote('get-log', 'GET', {}, function(res) {
			this.setState({
				found: res.found,
				timezone: res.timezone,
				debugEnabled: res.debugDetected ? res.debugEnabled : this.state.debugEnabled,
				debugDetected: res.debugDetected,
				ready: true
			});

			this.updateEntries({
				entries: res.entries, 
				modified: res.modified,
				filesize: res.filesize
			});

			// If File was found and debugging is enabled, start auto checker
			if (this.state.debugEnabled && (res.found || this.state.simulating)) {
				this.startUpdateChecker();
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

		wplv_remote('get-entries-if-modified', 'GET', data, 
			function(res) {
				if (res.changed) {		
					this.updateEntries({
						entries: res.entries, 
						modified: res.modified, 
						filesize: res.filesize
					});
					wplv_notify.success('Log entries updated.');
				}
			}.bind(this),
			function(res) {
				if (res && res.status && res.status === 401) {
					this.stopUpdateChecker();
				}
			}.bind(this)
		);
			
		
	},

	// Search entries
	searchEntries: function(query) {
		this.setState({query: query});
	},

	// Update entries
	updateEntries: function(data) {
		if (!data.entries || !(data.entries instanceof Array)) {
			data.entries = [];
		}
		
		// Process entries and prepare for use
		data.entries = data.entries.map(function(entry) {
			
			// Get line number if present
			var line = entry.message.replace(/.* on line ([\d]+).*/gi, '$1');	
			entry.line = line && line !== entry.message ? line.trim() : '';

			// Get error type if present
			var errorType = entry.message.replace(/^(PHP [\w]+):.*/gi, '$1');
			entry.errorType = errorType && errorType !== entry.message ? errorType.trim() : '';
			
			// Get file path if present
			var filePath = entry.message.replace(/^.*in (\/[\w /_-]+.php).*/gi, '$1');
			entry.filePath = filePath && filePath != entry.message ? filePath.trim() : '';
			
			// Reformat message
			if (entry.errorType) {
				entry.message = entry.message.replace(/^PHP [\w]+:(.*)/gi, '$1', '').trim();
			}

			return entry;
		});

		// Sort order if necessary
		if (this.state.sort === 'oldest') {
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
	
	// Pretend debugging enabled
	pretendDebugEnabled: function(e) {
		e.preventDefault();
		
		document.cookie = '_wplv-sim=1';
		document.cookie = '_wplv-dbg=1';
		this.setState({debugEnabled: true, simulating: true});
		this.startUpdateChecker();
	},
	
	// Pretend debugging disabled
	pretendDebugDisabled: function(e) {
		e.preventDefault();
		
		document.cookie = '_wplv-sim=0';
		document.cookie = '_wplv-dbg=0';
		this.setState({debugEnabled: false, simulating: true});
		this.startUpdateChecker();
	},

	// Check if simulation enabled
	isSimulationEnabled: function() {
		return document.cookie.indexOf('_wplv-sim=1') > 0 ? true : false;
	},

	// Get default debugging status
	getDefaultDebuggingStatus: function() {
		return document.cookie.indexOf('_wplv-dbg=1') > 0 ? true : false;
	},

	// Start checking for debug log changes
	startUpdateChecker: function() {
		this.currentTimer = setInterval(this.checkLatest, this.currentTimerInterval);
	},

	// Stop checking for debug log changes
	stopUpdateChecker: function() {
		clearInterval(this.currentTimer);
	},

	// Render component
	render: function() { 
		if (this.state.ready) {
			if (this.state.debugDetected || this.state.simulating) {
				if (this.state.found) {
					var entries = [];
					var query = this.state.query;
					var viewHeader = (
						<div className="view-header">
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } detected={ this.state.debugDetected } simulating={ this.state.simulating } /></h2>
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
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } detected={ this.state.debugDetected } simulating={ this.state.simulating } /></h2>
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
			} else {
				return (
					<div id="viewer-pane">
						<div className="view-header">
							<h2>Log Viewer <DebugStatus enabled={ this.state.debugEnabled } detected={ this.state.debugDetected } simulating={ this.state.simulating } /></h2>
						</div>
					
						<p>Sorry, we could not detect if debugging is enabled or disabled.  We can simulate the status of WP_DEBUG.</p>
						
						<p><strong>How you would like to proceed?</strong></p>
						
						<p>
							<a href="#" onClick={ this.pretendDebugEnabled } className="enable-debugging-btn"><i className="fa fa-arrow-circle-right"></i> Enabled</a>
							<a href="#" onClick={ this.pretendDebugDisabled } className="disable-debugging-btn"><i className="fa fa-arrow-circle-right"></i> Disabled</a>
						</p>
						<br />
						
						<p><small>** Please note that the status of WP_DEBUG is not actually being changed.  This is just a simulation.</small></p>
					</div>
				);
			}
		}

		return (
			<div id="viewer-pane">
				<h2>Log Viewer</h2>
			</div>
		);
	}
});