/**
 * Display a view action
 */
var ViewAction = React.createClass({
	
	// Default properties
	getDefaultProps: function() {
		return {
			action: null
		}
	},
	
	// Property types
	propTypes: {
		action: React.PropTypes.func
	},
	
	// Handle action
	handleAction: function(e) {
		e.preventDefault();
		
		if (this.props.action) {
			this.props.action();
		}
	},
	
	// Render component
	render: function() {
		return (
			<li>
				<a href="#" onClick={ this.handleAction } title={ this.props.children }>{ this.props.children }</a>
			</li>
		);
	}
});