/**
 * Display debugging status
 */
wplv.DebugStatus = React.createClass({

	// Get default properties
	getDefaultProps: function() {
		return {
			debugging: {
				enabled: false,
				detected: true,
				simulating: false
			}
		};
	},

	// Property types
	propTypes: {
		debugging: React.PropTypes.object
	},

	// Render component
	render: function() {
		var status = 'not-detected';
		var simulating = this.props.debugging.simulating ? ' **' : '';
		
		if (this.props.debugging.detected || this.props.debugging.simulating) {
			status = this.props.debugging.enabled ? 'enabled' : 'disabled';
		} 
		
		var className = 'debugger-status '+status;

		return (
			<span className={ className }>
				debug: <strong>{ simulating }{ status }</strong>
			</span>
		);
	}
});
	