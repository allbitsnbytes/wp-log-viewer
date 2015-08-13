var wplv = {};


/**
 * Main application component
 */
wplv.App = React.createClass({

	// App is ready?
	ready: false,

	// Update checker timeout timer reference
	updateCheckerTimeout: null,

	// Update checker interval
	currentTimeoutInterval: 15000,

	// Initial state
	getInitialState: function() {
		return {
			debugging: {
				enabled: false,
				detected: false,
				simulating: false
			},
			log: {
				entries: [],
				filesize: 0,			
				found: false,
				modified: '',
				sort: this.props.settings.sort,
				timezone: '',
				view: this.props.settings.view
			},
			query: ''
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			debugging: false,
			pluginUrl: '',
			settings: {
				view: 'group',
				sort: 'newest'
			},	
			user: ''
		};
	},

	// Property types
	propTypes: {
		debugging: React.PropTypes.bool,
		pluginUrl: React.PropTypes.string,
		settings: React.PropTypes.object,
		user: React.PropTypes.string
	},

	// Before mount 
	componentWillMount: function() {
		wplv.remote.getAllEntries({}, function(result) {
			var debugging = this.state.debugging;
			var log = this.state.log

			this.ready = true;

			debugging.enabled = result.debugDetected ? result.debugEnabled : this.props.debugging;
			debugging.detected = result.debugDetected;

			log.entries = this._prepareEntries(result.entries);
			log.found = result.found;
			log.modified = result.modified;
			log.filesize = result.filesize;
			log.timezone = result.timezone;

			this.setState({
				debugging: debugging, 
				log: log
			});

			// If File was found and debugging is enabled, start auto checker
			if (this.state.debugging.enabled && (result.found || this.state.debugging.simulating)) {
				this._startUpdateChecker();
			}
		}.bind(this),
		function(result) {
			wplv.notify.error('Plugin could not be loaded.  Please try again.');
		});
	},

	// Before unmount
	componentWillUnmount: function() {
		this._stopUpdateChecker();
	},

	// Check latest
	checkLatest: function() {
		this._getLatestEntries();
	},
	
	// Refresh the viewer
	refreshViewer: function() {
		this._getLatestEntries(true);
	},

	// Search entries
	searchEntries: function(query) {
		this.setState({
			query: query
		});
	},

	// Clear entries
	clearLog: function() {
		wplv.remote.clearEntries(function(result) {
			if (result.cleared == true) {
				var log = this.state.log;
				
				log.entries = [];
				log.filesize = 0;

				this.setState({
					log: log
				});

				wplv.notify.success('Log file <strong>successfully cleared</strong>');
				
				// Broadcast change
				this._broadcastChangeEvent();
			} else {
				wplv.notify.error('Failed to clear log file.  You might not have write permission');
			}
		}.bind(this),
		function(result) {
			wplv.notify.error('Failed to clear log file.  You might not have write permission');
		});
	},

	// Sort newest
	sortNewest: function() {
		var log = this.state.log;

		if (log.sort === 'oldest') {
			log.sort = 'newest';
			log.entries = log.entries.reverse();

			this.setState({
				log: log
			});
		}
	},

	// Sort oldest
	sortOldest: function() {
		var log = this.state.log;

		if (log.sort === 'newest') {
			log.sort = 'oldest';
			log.entries = log.entries.reverse();

			this.setState({
				log: log
			});
		}
	},

	// Show group view
	showGroupView: function() {
		var log = this.state.log;

		log.view = 'group';

		this.setState({
			log: log
		});
	},

	// Show list view
	showListView: function() {
		var log = this.state.log;

		log.view = 'list';

		this.setState({
			log: log
		});
	},

	// Get last modified date
	getLastModified: function() {
		return this.state.log.modified;
	},

	// Get filesize
	getFilesize: function() {
		return this.state.log.filesize;
	},

	// Download log
	downloadLog: function() {
		console.log('Feature coming soon.');
	},

	// Pretend debugging is enabled
	startSimulation: function() {
		document.cookie = '_wplv-sim=1';
		document.cookie = '_wplv-dbg=1';

		var debugging = this.state.debugging;

		debugging.enabled = true;
		debugging.simulating = true;

		this.setState({
			debugging: debugging
		});

		this._startUpdateChecker();
		
		// Broadcast change
		this._broadcastChangeEvent();
	},

	// Preted debugging is disabled
	stopSimulation: function() {
		document.cookie = '_wplv-sim=0';
		document.cookie = '_wplv-dbg=0';

		var debugging = this.state.debugging;

		debugging.enabled = false;
		debugging.simulating = false;

		this.setState({
			debugging: debugging
		});

		this._stopUpdateChecker();
		
		// Broadcast change
		this._broadcastChangeEvent();
	},
	
	// Check if simulating debug status
	isSimulating: function() {
		return this.state.debugging.simulating;
	},

	// Process and format entries for display
	_prepareEntries: function(entries) {
		if (!entries || !(entries instanceof Array)) {
			entries = [];
		}

		// Process entries and prepare for use
		entries = entries.map(function(entry) {

			// Get line number if present
			var line = entry.message.replace(/.* on line ([\d]+).*/gi, '$1');	
			entry.line = line && line !== entry.message ? line.trim() : '';

			// Get error type if present
			var errorType = entry.message.replace(/^(PHP [\w ]+):.*/gi, '$1');
			entry.errorType = errorType && errorType !== entry.message ? errorType.trim() : '';

			// Get file path if present
			var filePath = entry.message.replace(/^.*in (\/[\w /_-]+.php).*/gi, '$1');
			entry.filePath = filePath && filePath != entry.message ? filePath.trim() : '';

			// Reformat message
			if (entry.errorType) {
				entry.message = entry.message.replace(/^PHP [\w ]+:(.*)/gi, '$1', '').trim();
			}

			return entry;
		});

		// Sort order if necessary
		if (this.state.log.sort === 'oldest') {
			entries.reverse();
		}

		return entries;
	},
	
	showDebugHelp: function() {
		return (
			<div>
				<p>To turn on debugging, add the following to your wp-config.php file.</p>

				<p className="code-snippet">
					define('WP_DEBUG', true);<br />
					define('WP_DEBUG_LOG', true);<br />
					define('WP_DEBUG_DISPLAY', false);
				</p>

				<p>For more information visit <a href="https://codex.wordpress.org/Debugging_in_WordPress" target="_blank">Debugging In Wordpress</a></p>
			</div>
		);
	},

	// Get latest entries
	_getLatestEntries: function(showStatus) {
		var data = {
			modified: this.state.log.modified
		};

		showStatus = showStatus === true ? true : false;

		wplv.remote.getLatestEntries(data, function(result) {
			if (result.changed) {
				var log = this.state.log;

				log.entries = this._prepareEntries(result.entries);
				log.modified = result.modified;
				log.filesize = result.filesize;

				this.setState({
					log: log
				});

				// Broadcast change
				this._broadcastChangeEvent();

				wplv.notify.success('Viewer updated with new entries');
			} else {
				if (showStatus) {
					wplv.notify.alert('No new entries found.');
				}
			}
		}.bind(this),
		function(result) {
			this._stopUpdateChecker();
			wplv.notify.error('Checking for updates failed.');
		});
	},

	// Filter out duplicate entries 
	_filterDuplicateEntries: function(entries) {
		if (!entries || !(entries instanceof Array)) {
			entries = [];
		}

		var filtered = [];
		var found = {};

		// Filter duplicate entries
		entries.forEach(function(entry) {
			var key = md5(entry.message);

			if (found[key] === undefined) {
				filtered.push(entry);
				found[key] = true;
			}
		}.bind(this));

		return filtered;
	},

	// Broadcast change event to all listeners
	_broadcastChangeEvent: function() {
		// Prepare change event
		var event = new CustomEvent('wplv-log-changed', { 
			detail: {
				debugging: this.state.debugging.enabled,
				simulating: this.state.debugging.simulating,
				entries: this.state.log.entries
			}
		});

		// Broadcast change
		document.dispatchEvent(event);
	},

	// Check if simulation is enabled
	_isSimulationEnabled: function() {
		return document.cookie.indexOf('_wplv-sim=1') > 0 ? true : false;
	},

	// Get default debugging status
	_getDefaultDebugStatus: function() {
		return document.cookie.indexOf('_wplv-dbg=1') > 0 ? true : false;
	},

	// Start update checker
	_startUpdateChecker: function() {
		this.updateCheckerTimeout = setInterval(this.checkLatest, this.currentTimeoutInterval);
	},

	// Stop update checker
	_stopUpdateChecker: function() {
		clearInterval(this.updateCheckerTimeout);
	},

	// Render component
	render: function() {
		var content = '';
		var debugStatus = '';
		var sidebar = '';

		if (this.ready) {
			if (this.state.debugging.detected || this.state.debugging.simulating) {
				if (this.state.log.found) {
					var count = 0;
					var entries = [];
					var query = this.state.query;
					var view = '';

					debugStatus = (
						<wplv.DebugStatus debugging={ this.state.debugging } />
					);

					if (query !== '') {
						this.state.log.entries.forEach(function(entry) {
							var match = new RegExp(query, 'gi');

							if (entry && entry.message && match.test(entry.message + ' ' + entry.errorType)) {
								entries.push(entry);
							}
						}.bind(this));
					} else {
						entries = this.state.log.entries;
					}

					if (this.state.log.view === 'group') {
						count = this._filterDuplicateEntries(entries).length;
						view = ( <wplv.GroupViewer entries={ entries } /> );
					} else {
						count = entries.length;
						view = ( <wplv.ListViewer entries={ entries } /> );
					}

					content = (
						<div className="viewer-pane">
							<wplv.Search app={ this } />

							<div className="entries-list-header">
								<h3>Log Entries</h3>
								<span className="entries-count">{ count === 1 ? count + ' entry' : count + ' entries' }</span>
							</div>

							{ view }
						</div>
					);
					
					sidebar = (
						<wplv.Sidebar app={ this } />
					);
				} else {
					if (this.state.debugging.enabled) {
						if (this.state.debugging.simulating) {
							content = (
								<div className="viewer-pane">
									<div className="content">
										<p>Currently <strong className="debug-status-simulating">simulating</strong>.  The <strong>debug.log file does not exist or was not found.</strong></p>
										
										<ul className="inline-buttons">
											<li><a href="#" onClick={ function(e) { e.preventDefault(); this.stopSimulation(); }.bind(this) } className="stop-simulation-btn"><i className="fa fa-arrow-circle-right"></i> Stop simulation</a></li>
										</ul>
									</div>
								</div>
							);
						} else {
							content = (
								<div className="viewer-pane">
									<div className="content">
										<p>Debugging is <strong className="debug-status-enabled">enabled</strong>.  However, the <strong>debug.log file does not exist or was not found.</strong></p>
									</div>
								</div>
							);
						}
					} else {
						content = (
							<div className="viewer-pane">
								<div className="content">
									<p><strong>Debugging is currently <span className="debug-status-disabled">disabled</span>.</strong></p>

									{ this.showDebugHelp() }
								</div>
							</div>
						);
					}
				}
			} else {
				content = (
					<div className="viewer-pane">
						<div className="content">
							<p className="debugging-unknown">Sorry, we <strong>could not detect if debugging is enabled or disabled</strong>.</p>
							<br />

							<h3>Simulate Debugging?</h3>

							<p>If you know that debugging is enabled, click below to continue.</p>

							<ul className="inline-buttons">
								<li><a href="#" onClick={ function(e) { e.preventDefault(); this.startSimulation(); }.bind(this) } className="start-simulation-btn"><i className="fa fa-arrow-circle-right"></i> Start simulation</a></li>
							</ul>

							<br />
							<p><small>** Please note that the status of WP_DEBUG is not actually being changed.  This is just a simulation.</small></p>
							<br />

							<h3>How to Enable Debugging?</h3>

							{ this.showDebugHelp() }
						</div>
					</div>
				);
			}
		}

		return (
			<div className="container">
				<header className="view-header">
					<div className="container">
						<h2>Log Viewer { debugStatus }</h2>
						<wplv.ErrorLegend />
					</div>
				</header>

				<section className="row">
					{ content }

					{ sidebar }
				</section>		
			</div>
		);
	},
});