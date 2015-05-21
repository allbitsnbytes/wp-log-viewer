/**
 * Display debugging status
 */
var DebugStatus = React.createClass({

	// Get default properties
	getDefaultProps: function() {
		return {
			enabled: true
		};
	},
	
	// Property types
	propTypes: {
		enabled: React.PropTypes.bool
	},
	
	// Render
	render: function() {
		var status = this.props.enabled ? 'enabled' : 'disabled';
		var className = 'debugger-status '+status;
			
		return (
			<span className={ className }>
				debug: <strong>{ status }</strong>
			</span>
		);
	}
});
	
	