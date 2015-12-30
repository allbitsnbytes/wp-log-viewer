/**
 * Overlay
 */
wplv.Overlay = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			active: false
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			active: false,
			close: null
		};
	},

	// Property types
	propTypes: {
		active: React.PropTypes.bool.isRequired,
		children: React.PropTypes.element.isRequired
	},

	// Before mount
	componentWillMount: function() {
		this.setState({active: this.props.active});
	},

	// Properties changed
	componentWillReceiveProps: function(newProps) {
		this.setState({active: newProps.active});
	},

	// Render component
	render: function() {
		var overlayClass = this.state.active === true ? 'overlay active' : 'overlay hidden';

		return (
			<div className={ overlayClass }>
				<div className="overlay--content">
					{ this.props.children }
				</div>
			</div>
		);
	}

});