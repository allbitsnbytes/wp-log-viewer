/**
 * Display debugging status
 */
var DebugStatus = React.createClass({

	// Default property 
	getDefaultProps: function() {
		return {
			debuggingEnabled: true
		};
	},
	
	// Property types
	propTypes: {
		debuggingEnabled: React.PropTypes.boolean
	},
	
	// Render
	render: function() {
		var status = this.props.debuggingEnabled ? 'enabled' : 'disabled';
		var className = 'debugger-status '+status;
		
		return (
			<span className={ className }>
				debug: <strong>{ status }</strong>
			</span>
		);
	}
});
	
	