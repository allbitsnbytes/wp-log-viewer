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
			modified: ''
		};
	},
			
	// Initialize when component is to be mounted
	componentWillMount: function() {
		reqwest(WPLOGVIEWER.api + '?do=get-log', function(res) {
			this.setState({
				entries: res.entries,
				found: res.found,
				timezone: res.timezone,
				modified: res.modified
			});
		}.bind(this));
	},

	// Render component
	render: function() { 
		if (this.state.found) {
			return (
				<div id="viewer-pane">
					<h2>Log Viewer <DebugStatus /></h2>
						
					<LogView entries={ this.state.entries } />
					<ViewSidebar viewer={ this.viewer } />
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