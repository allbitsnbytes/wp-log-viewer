/**
 * Display log viewer
 */
var Viewer = React.createClass({
	
	// Get initial state
	getInitialState: function() {
		return {
			entries: [],
			found: false,
			timezone: '',
			modified: '',
			sort: 'newest'
		};
	},

	// Initialize when component is to be mounted
	componentDidMount: function() {
		// Initialize component
		reqwest(WPLOGVIEWER.api + '?do=get-log', function(res) {
			this.setState({
				found: res.found,
				timezone: res.timezone
			});
			
			this.updateEntries(res.entries, res.modified);
		}.bind(this));
		
		// Check for changes
		var timer = setInterval(this.checkLastest, 15000);
	},
	
	// Clear log entries
	clearLogEntries: function() {
		reqwest(WPLOGVIEWER.api + '?do=clear-log', function(res) {
			if (res.cleared) {
				this.setState({entries: []});
			}
		}.bind(this));
	},
	
	// Get log entries if modified
	checkLastest: function() {
		reqwest({
			url: WPLOGVIEWER.api + '?do=get-entries-if-modified',
			data: {
				modified: this.state.modified
			}, 
			success: function(res) {
				if (res.changed) {		
					this.updateEntries(res.entries, res.modified);
				}
			}.bind(this)
		});
	},
	
	// Update entries
	updateEntries: function(entries, modified) {
		if (this.state.sort === 'newest') {
			entries.reverse();
		}
					
		this.setState({
			entries: entries,
			modified: modified
		});
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

	// Render component
	render: function() { 
		if (this.state.found) {
			return (
				<div id="viewer-pane">
					<h2>Log Viewer <DebugStatus /></h2>
						
					<LogView entries={ this.state.entries } />
					<ViewSidebar viewer={ this } />
				</div>
			);
		} else { 
			if (WPLOGVIEWER.debugEnabled) {
				return (
					<div id="viewer-pane">
						<h2>Log Viewer <DebugStatus /></h2>
					
						<p>Debugging is enabled. However, <strong>debug.log does not exist</strong>.</p>
					</div> 
				);
			} else {
				return (
					<div id="viewer-pane">
						<h2>Log Viewer <DebugStatus /></h2>

						<p><strong>Debugging is currently <span className="highlight">disabled</span>.</strong></p>
						<br />
												
						<p>To turn on debugging, add the following to your wp-config.php file.</p>
		
						<p className="code-snippet">
							define('WP_DEBUG', true);<br />
							define('WP_DEBUG_LOG', true);<br />
							define('WP_DEBUG_DISPLAY', false);
						</p>
					</div>
				);
			}
		}

		return (
			<div id="viewer-pane">
				Loading ...
			</div>
		);
	}
});