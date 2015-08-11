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
			settings: {
				view: 'group',
				sort: 'newest'
			},	
			user: ''
		};
	},

	// Property types
	propTypes: {
		settings: React.PropTypes.object,
		user: React.PropTypes.string
	},

	// Before mount 
	componentWillMount: function() {
		wplv.remote.getAllEntries({}, function(result) {
			var debugging = this.state.debugging;
			var log = this.state.log

			this.ready = true;

			debugging.enabled = result.debugDetected ? result.debugEnabled : this.state.debugging.enabled,
			debugging.detected = result.debugDetected

			log.entries = this._prepareEntries(result.entries),
			log.found = result.found,
			log.modified = result.modified,
			log.filesize = result.filesize,
			log.timezone = result.timezone

			this.setState({
				debugging: debugging, 
				log: log
			});

			// If File was found and debugging is enabled, start auto checker
			if (this.state.debugging.enabled && (result.found || this.state.debugging.simulating)) {
				this._startUpdateChecker();
			}
		}.bind(this));
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
			if (result.cleared) {
				var log = this.state.log;
				
				log.entries = [];
				log.filesize = 0;

				this.setState({
					log: log
				});

				wplv.notify.success('Log file <strong>successfully cleared</strong>');
			} else {
				wplv.notify.error('Failed to clear log file.  You might not have write permission');
			}
		}.bind(this));
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
	pretendDebugEnabled: function(e) {
		e.preventDefault();

		document.cookie = '_wplv-sim=1';
		document.cookie = '_wplv-dbg=1';

		var debugging = this.state.debugging;

		debugging.enabled = true;
		debugging.simulating = true;

		this.setState({
			debugging: debugging
		});

		this._startUpdateChecker();
	},

	// Preted debugging is disabled
	pretendDebugDisabled: function(e) {
		e.preventDefault();

		document.cookie = '_wplv-sim=0';
		document.cookie = '_wplv-dbg=0';

		var debugging = this.state.debugging;

		debugging.enabled = true;
		debugging.simulating = true;

		this.setState({
			debugging: debugging
		});

		this._startUpdateChecker();
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

				wplv.notify.success('Viewer updated with new entries');
			} else {
				if (showStatus) {
					wplv.notify.alert('No new entries found.');
				}
			}
		}.bind(this));
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
		var entries = [];
		var query = this.state.query;
		var view = '';

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

		if (true) {
			if (this.state.log.view === 'group') {
				view = ( <wplv.GroupViewer entries={ entries } /> );
			} else {
				view = ( <wplv.ListViewer entries={ entries } /> );
			}
		}

		return (
			<div className="container">
				<header className="view-header">
					<h2>Log Viewer <wplv.DebugStatus debugging={ this.state.debugging } /></h2>
					<wplv.ErrorLegend />
				</header>

				<section className="row">
					<div className="viewer-pane">
						<wplv.Search app={ this } />

						<h3>Log Entries</h3>

						{ view }
					</div>

					<wplv.Sidebar app={ this } />
				</section>		
			</div>
		);
	},
});