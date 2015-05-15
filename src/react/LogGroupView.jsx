/**
 * Display log entries
 */
var LogGroupView = React.createClass({
	
	// Get properties
	getDefaultProps: function() {
		return {
			entries: []
		};
	},
	
	// Property types
	propTypes: {
		entries: React.PropTypes.array
	},
	
	// Sort entries into groups
	getGroupedEntries: function() {
		var groups = {};

		for (var i=0, length=this.props.entries.length; i < length; i++) {
			var entry = this.props.entries[i];
			var key = md5(entry.message);

			if (groups[key] === undefined) {
				groups[key] = {
					date: entry.date,
					time: entry.time,
					timezone: entry.timezone,
					message: entry.message,
					entries: []
				};
			}

			groups[key].entries.push(entry);
		}

		return groups;
	},
		
	render: function() {
		var groups = this.getGroupedEntries();
		var groupSections = [];

		for (var key in groups) {
			groupSections.push((
				<GroupEntry group={ groups[key] } />
			));
		}

		if (groupSections.length) {
			return (
				<div className="group-entries">
					{ groupSections }
				</div>
			);
		} else {
			return (
				<div className="log-entries">
					<p>No entries found.</p>
				</div>
			);
		}
	}
});