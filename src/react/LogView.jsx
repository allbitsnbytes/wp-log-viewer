/**
 * Display log entries
 */
var LogView = React.createClass({
	
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
			var today = (new Date()).toLocaleDateString();
			
			var logEntries = entries.map(function(entry) {
				var entryDate = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);
				var day = entryDate.toLocaleDateString();

				entry.formatted = {
					date: '',
					time: entryDate.toLocaleTimeString()
				}

				if (today == day) {
					entry.formatted.date = 'Today';
				} else {
					entry.formatted.date = day;
				}

				return (
					<LogEntry entry={ entry } />
				);
			});
			
			return (
				<div className="log-entries">
					<p>There are <strong>{ entries.length }</strong> entries.</p><br />
					
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