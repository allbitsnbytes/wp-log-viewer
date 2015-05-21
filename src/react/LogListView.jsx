/**
 * Display log entries
 */
var LogListView = React.createClass({

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

	render: function() {
		var entries = this.props.entries;

		if (entries.length) {		
			var logEntries = entries.map(function(entry) {
				var entryDate = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);

				return (
					<LogEntry date={ entryDate } message={ entry.message } />
				);
			});

			return (
				<div className="log-entries">
					{ logEntries }
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