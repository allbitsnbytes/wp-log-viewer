/**
 * Display a navigation group
 */
wplv.NavActionGroup = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			selected: ''
		}
	},

	// Get default properties
	getDefaultProps: function() {
		return {
			group: {
				name: '',
				default: '',
				trackSelected: true,
				options: []
			}
		}
	},

	// Before mount
	componentWillMount: function() {
		this.setState({selected: this.props.group.default});
	},

	// Update which menu is selected for this group
	updateSelected: function(selected) {
		if (this.props.group.trackSelected) {
			this.setState({selected: selected});
		}
	},

	// Property types
	propTypes: {
		group: React.PropTypes.object.isRequired
	},

	// Render component
	render: function() {
		var group = this.props.group,
			options = group.options.map(function(option, index) {
			var selected = (option.key && option.key == this.state.selected) ? true : false;

			return (
				<wplv.NavAction key={ index } notify={ this.updateSelected } selected={ selected } nav={ option } />
			);
		}.bind(this));

		return (
			<div className="menu-group">
				<h3>{ group.name }</h3>
				<ul>
					{ options }
				</ul>
			</div>
		);
	}
});