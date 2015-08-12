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
		
		if (this.props.debugging.detected) {
			status = this.props.debugging.enabled ? 'enabled' : 'disabled';
		} else if (this.props.debugging.simulating) {
			status = 'simulating';
		}
		
		var className = 'debugger-status '+status;

		return (
			<span className={ className }>
				debug:  <strong className="status">{ status }</strong>
			</span>
		);
	}
});
	