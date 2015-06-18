/**
 * Display debugging status
 */
var DebugStatus = React.createClass({

	// Get default properties
	getDefaultProps: function() {
		return {
			enabled: false,
			detected: true,
			simulating: false
		};
	},

	// Property types
	propTypes: {
		enabled: React.PropTypes.bool,
		detected: React.PropTypes.bool,
		simulating: React.PropTypes.bool
	},

	// Render component
	render: function() {
		var status = 'not-detected';
		var simulating = this.props.simulating ? ' **' : '';
		
		if (this.props.detected || this.props.simulating) {
			status = this.props.enabled ? 'enabled' : 'disabled';
		} 
		
		var className = 'debugger-status '+status;

		return (
			<span className={ className }>
				debug: <strong>{ simulating }{ status }</strong>
			</span>
		);
	}
});
	