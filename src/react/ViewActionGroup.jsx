var ViewActionGroup = React.createClass({
	
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
	
	// Component mounted
	componentDidMount: function() {
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
		group: React.PropTypes.object
	},
	
	render: function() {
		var group = this.props.group;
		var options = group.options.map(function(option) {
			var selected = option.key && option.key === group.default ? true : false;
			
			return (
				<ViewAction notify={ this.updateSelected } selected={ selected } nav={ option } />
			);
		});

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