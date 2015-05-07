/**
 * Display debugging status
 */
var DebugStatus = React.createClass({

	// Set the initial state
	getInitialState: function() {
		return {
			visible: false
		};
	},
	
	// Run when component mounts 
	componentWillMount: function() {
		if (WPLOGVIEWER.debugEnabled) {
			this.setState({visible: true});
		}
	},
	
	// Render
	render: function() {
		if (this.state.visible) {
			var status = WPLOGVIEWER.debugEnabled ? 'enabled' : 'disabled';
			var className = 'debugger-status '+status;
			
			return (
				<span className={ className }>
					debug: <strong>{ status }</strong>
				</span>
			);
		}
	}
});
	
	