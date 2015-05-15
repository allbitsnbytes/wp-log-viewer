/**
 * Display a group entry
 */
var GroupEntry = React.createClass({

	// Get properties
	getDefaultProps: function() {
		return {
			group: {
				date: '',
				message: '',
				entries: []	
			}
		};
	},
	
	// Property types
	propTypes: {
		group: React.PropTypes.object
	},
	 
	render: function() {
		var defaultClass = 'group-entry';
		var group = this.props.group;
		var when = new Date(group.date);

		return (
			<div className={ classes }>
				<div className="when">{ when.toLocaleDate() }</div>
				<div className="time">{ when.toLocalTime() }</div>
				<div className="message">{ group.message }</div>
			</div>
		);
	}
});