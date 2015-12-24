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
			errorTypes: [],
			log: {
				entries: [],
				filesize: 0,
				found: false,
				modified: '',
				sort: this.props.settings.sort,
				timezone: '',
				view: this.props.settings.view,
				customErrors: this.props.settings.custom_errors
			},
			ui: {
				foldSidebar: parseInt(this.props.settings.fold_sidebar) === 1 ? true : false
			},
			query: '',
			showSettings: false,
			showHelp: false,
			helpSection: ''
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			debugging: false,
			pluginUrl: '',
			settings: {
				view: 'group',
				sort: 'newest',
				custom_errors: {},
				fold_sidebar: 1
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
			var log = this.state.log;

			this.ready = true;

			debugging.enabled = this.props.debugging;
			debugging.simulating = this._isSimulationEnabled();
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

	// Download debug.log
	downloadFile: function() {
		window.location.href = '/debugging/download/log';
	},

	// Search entries
	searchEntries: function(query) {
		this.setState({
			query: query
		});

		wplv.remote.updateUserSetting('query', query);
	},

	// Filter entries by error type
	filterEntriesByErrorType: function(errors) {
		this.setState({
			errorTypes: errors
		});

		wplv.remote.updateUserSetting('legends', errors);
	},

	// Toggle debugging status
	setDebugStatus: function(status) {
console.error('debug? '+(status?'yes':'no'))
		wplv.remote.toggleDebugging((status ? 1 : 0), function(result) {
console.error(result)
			if (result.changed === true || result.changed === 'true') {
				this.setState({
					debugging: { enabled: result.status }
				});

				this._broadcastChangeEvent();
				wplv.notify.alert('Debbugging has been <strong>' + (result.status ? 'enabled' : 'disabled') + '</strong>');
			}
		}.bind(this));
	},

	// Toggle sidebar folded status
	setSidebarFolded: function(folded) {
		var body = document.querySelectorAll('body')[0];

		if (folded) {
			body.className += ' folded';
		} else {
			body.className = body.className.replace(' folded', '');
		}

		wplv.remote.updateUserSetting('fold_sidebar', (folded ? 1 : 0));
		this.setState({
			ui: {foldSidebar: folded}
		});
		this._broadcastChangeEvent();
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

			wplv.remote.updateUserSetting('sort', 'newest');
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

			wplv.remote.updateUserSetting('sort', 'oldest');
		}
	},

	// Show group view
	showGroupView: function() {
		var log = this.state.log;

		log.view = 'group';

		this.setState({
			log: log
		});

		wplv.remote.updateUserSetting('view', 'group');
	},

	// Show list view
	showListView: function() {
		var log = this.state.log;

		log.view = 'list';

		this.setState({
			log: log
		});

		wplv.remote.updateUserSetting('view', 'list');
	},

	// Get list of current entries
	getEntries: function() {
		return this.state.log.entries;
	},

	// Get last modified date
	getLastModified: function() {
		return this.state.log.modified;
	},

	// Get filesize
	getFilesize: function() {
		return this.state.log.filesize;
	},

	// Open settings page
	openSettings: function(e) {
		e.preventDefault();

		this.setState({showSettings: true});
	},

	// Save settings pane
	saveSettings: function(e) {
		e.preventDefault();

		wplv.remote.updateUserSettings({
			'fold_sidebar': React.findDOMNode(this.refs.foldSidebar).value
		});

		this.setState({showSettings: false});
	},

	// Close settings page
	closeSettings: function(e) {
		e.preventDefault();

		this.setState({showSettings: false});
	},

	// Open help page
	openHelp: function(section) {
		return function(e) {
			e.preventDefault();

			this.setState({showHelp: true, helpSection: section});
		}.bind(this);
	},

	// Close help pane
	closeHelp: function(e) {
		e.preventDefault();

		this.setState({showHelp: false, helpSection: ''});
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

		var customErrors = this.state.log.customErrors;

		// Process entries and prepare for use
		entries = entries.map(function(entry) {

			// Generate entry key based on error message
			entry.key = md5(entry.message);

			// Get line number if present
			var line = entry.message.replace(/.* on line ([\d]+).*/gi, '$1');
			entry.line = line && line !== entry.message ? line.trim() : '';

			// Get PHP error type if present
			var errorType = entry.message.replace(/^(PHP [\w ]+):.*/gi, '$1');
			entry.errorType = errorType && errorType !== entry.message ? errorType.trim() : '';

			if (entry.errorType === '') {
				// Check for custom errors
				if (entry.message.match(/^#[\w_-]+:/gi) !== null) {
					errorType = entry.message.replace(/^#([\w_-]+):.*/gi, '$1');
				} else {
					// Check for Wordpress Database error type if present
					errorType = entry.message.replace(/^(Wordpress database error ).*/gi, '$1');
				}

				entry.errorType = errorType && errorType !== entry.message ? errorType.trim() : '';
			}

			entry.errorTypeKey = entry.errorType.replace(/[ ]+/gi, '-').toLowerCase();

			// Get file path if present
			var filePath = entry.message.replace(/.*in (\/[\w\/._-]+.php).*/gi, '$1');
			entry.filePath = filePath && filePath != entry.message ? filePath.trim() : '';

			// Reformat message
			if (entry.errorType) {
				if (entry.line) {
					entry.message = entry.message.replace('in ' + entry.filePath, '');
				}

				if (entry.filePath) {
					entry.message = entry.message.replace('on line ' + entry.line, '');
				}

				entry.message = entry.message.replace(/^(PHP [\w ]+:|#[\w_-]+:|Wordpress database error)(.*)/gi, '$2', '').trim();
			}

			// Prep additional fields
			if (typeof customErrors[entry.errorTypeKey] === 'object') {
				entry.errorLabel = customErrors[entry.errorTypeKey].label;
				entry.legendColor = customErrors[entry.errorTypeKey].color;
				entry.legendBackground = customErrors[entry.errorTypeKey].background;
			} else {
				entry.errorLabel = entry.errorType;
				entry.legendColor = '';
				entry.legendBackground = '';
			}

			return entry;
		}.bind(this));

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
			if (result.changed == true && result.changed == 'true') {
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
			if (found[entry.key] === undefined) {
				filtered.push(entry);
				found[entry.key] = true;
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
		var settingsPane = '';

		if (this.ready) {
			if (this.state.debugging.enabled || this.state.debugging.detected || this.state.debugging.simulating) {
				if (this.state.log.found) {
					var count = 0;
					var entries = this.state.log.entries;
					var query = this.state.query;
					var filterErrorTypes = this.state.errorTypes;
					var view = '';

					debugStatus = (
						<wplv.DebugStatus debugging={ this.state.debugging } />
					);

					// Filter by error type
					if (filterErrorTypes.length > 0) {
						entries = entries.filter(function(entry) {
							if (filterErrorTypes.indexOf(entry.errorTypeKey) !== -1) {
								return true;
							}

							return false;
						}.bind(this));
					}

					// Filter by query string
					if (query !== '') {
						entries = entries.filter(function(entry) {
							var match = new RegExp(query, 'gi');

							if (entry && entry.message && match.test(entry.message + ' ' + entry.errorType)) {
								return true
							}

							return false;
						}.bind(this));
					}

					if (this.state.log.view === 'group') {
						count = this._filterDuplicateEntries(entries).length;
						view = ( <wplv.GroupViewer entries={ entries } /> );
					} else {
						count = entries.length;
						view = ( <wplv.ListViewer entries={ entries } /> );
					}

					var errorClass = entries.length > 0 ? 'count has-errors' : 'count no-errors';
					var errorLabel = entries.length == 1 ? ' entry' : ' entries';

					content = (
						<section className="wplv-page--content">
							<header className="entries-header">
								<h3>Log Entries</h3>
								<span className="entries-count"><span className={ errorClass }>{ count }</span> { errorLabel }</span>
							</header>

							{ view }
						</section>
					);

					sidebar = (
						<wplv.Sidebar app={ this } />
					);
				} else {
					if (this.state.debugging.enabled) {
						if (this.state.debugging.simulating) {
							content = (
								<section className="wplv-page--content">
									<p>Currently <strong className="debug-status-simulating">simulating</strong>.  The <strong>debug.log file does not exist or was not found.</strong></p>

									<ul className="inline-buttons">
										<li><a href="#" onClick={ function(e) { e.preventDefault(); this.stopSimulation(); }.bind(this) } className="stop-simulation-btn"><i className="fa fa-arrow-circle-right"></i> Stop simulation</a></li>
									</ul>
								</section>
							);
						} else {
							content = (
								<section className="wplv-page--content">
									<p>Debugging is <strong className="debug-status-enabled">enabled</strong>.  However, the <strong>debug.log file does not exist or was not found.</strong></p>
								</section>
							);
						}
					} else {
						content = (
							<section className="wplv-page--content">
								<p><strong>Debugging is currently <span className="debug-status-disabled">disabled</span>.</strong></p>

								{ this.showDebugHelp() }
							</section>
						);
					}
				}
			} else {
				content = (
					<section className="wplv-page--content">
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
					</section>
				);
			}
		} else {
			content = (
				<section className="wplv-page--content">
					<div className="loading-viewer">
						<i className="fa fa-spin fa-refresh" /> Loading entries ...
					</div>
				</section>
			);
		}

		return (
			<div className="wplv-container">
				<section className="wplv-page--header">
					<header>
						<h2>Log Viewer { debugStatus }</h2>

						<wplv.ErrorLegend app={ this } />
					</header>

					<wplv.Search app={ this } />
				</section>

				<section className="wplv-page--viewer">
					{ content }

					{ sidebar }
				</section>

				<wplv.ContentModal ref="settingsPane" className="settings-pane" isOpen={ this.state.showSettings } size="medium">
					<wplv.Settings app={ this } />
				</wplv.ContentModal>

				<wplv.ContentModal ref="helpPane" className="help-pane" isOpen={ this.state.showHelp } size="large">
					<wplv.HelpViewer app={ this } section={ this.state.helpSection } />
				</wplv.ContentModal>
			</div>
		);
	},
});