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

	// Render component
	render: function() {
		var entries = this.props.entries;

		if (entries.length) {		
			var logEntries = entries.map(function(entry) {
				return (
					<LogEntry entry={ entry } />
				);
			});

			return (
				<div className="log-entries">
					<ErrorLegend />
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