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
					message: entry.message,
					entries: []
				};
			}

			groups[key].entries.concat(entry);
		}

		return groups;
	},
		
	render: function() {
		var groups = this.getGroupedEntries();
		var groupSections = [];
		
		for (group of groups) {
			groupSections.concat((
				<GroupEntry group={ group } />
			));
		}
		
		if (groups.length) {
			var groupEntries = groups.for(function(group) {
				return (
					<GroupEntry group={ group } />
				);
			});
			
			return (
				<div className="group-entries">
					{ groupEntries }
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