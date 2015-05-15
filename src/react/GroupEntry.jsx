/**
 * Display a group entry
 */
var GroupEntry = React.createClass({

	// Get properties
	getDefaultProps: function() {
		return {
			group: {
				date: '',
				time: '',
				timezone: '',
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
		var group = this.props.group;
		var when = new Date(group.date+' '+group.time+' '+group.timezone);
		var groupDetails = [];

		for (var key in group.entries) {
			var entry = group.entries[key];
			var entryWhen = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);

			groupDetails.push((
				<div className="entry-detail">
					<div className="when">{ entryWhen.toLocaleDateString() }</div>
					<div className="time">{ entryWhen.toLocaleTimeString() }</div>
				</div>
			));
		}

		return (
			<div className="group-entry">
				<div className="when">
					<span className="date">{ when.toLocaleDateString() }</span>
					<span className="time">{ when.toLocaleTimeString() }</span>
				</div>
				<div className="message">
					{ group.message }
					<div className="group-actions">
						<a href="#" className="entry-details-link" title="See details">more details</a>
					</div>
				</div>
				{ groupDetails }
			</div>
		);
	}
});