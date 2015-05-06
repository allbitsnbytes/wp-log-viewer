/**
 * Display log viewer
 */
var Viewer = React.createClass({
	
	// Get initial state
	getInitialState: function() {
		return {
			log: {
				entries: [],
				found: false,
				timezone: '',
				modified: ''
			},
			debuggingEnabled: false,
			ready: false
		}
	},
	
	// Get default props
	getDefaultProps: function() {
		return {
			api: ''
		};
	},
	
	// Property types
	propTypes: {
		api: React.PropTypes.string
	},
	
	// Initialize when component is to be mounted
	componentWillMount: function() {
		this.setState({ready: true});
	},
	
	// Render component
	render: function() {
		if (this.state.ready) {
			if (this.state.log.found) {
				return (
					<div id="viewer-pane">
						<h2>Log Viewer <DebugStatus debuggingEnabled={ this.state.debuggingEnabled } /></h2>
						
						<LogView log={ this.state.log } />
						<ViewSidebar />
					</div>
				);
			} else { 
				if (this.state.debuggingEnabled) {
					return (
						<div id="viewer-pane">
							<h2>Log Viewer <DebugStatus debuggingEnabled={ this.state.debuggingEnabled } /></h2>
							
							<p>Debugging is enabled. However, <strong>debug.log does not exist</strong>.</p>
						</div> 
					);
				} else {
					return (
						<div id="viewer-pane">
							<h2>Log Viewer <DebugStatus debuggingEnabled={ this.state.debuggingEnabled } /></h2>

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
		} 
	}
});