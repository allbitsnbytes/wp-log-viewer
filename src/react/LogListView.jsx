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
			var now = new Date();
			var today = now.toLocaleDateString();
			var section = '';
			
			var logEntries = entries.map(function(entry) {
				var entryDate = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);
				var day = entryDate.toLocaleDateString();
				var currentSection = entryDate.getMonth() + ' ' + entryDate.getFullYear();
				var additionalClasses = '';
				
				entry.formatted = {
					date: '',
					time: entryDate.toLocaleTimeString()
				}
				
				if (today == day) {
					entry.formatted.date = 'Today';
				} else {
					entry.formatted.date = day;
				}
				
				if (section !== currentSection) {
					if (section !== '') {
						additionalClasses = 'padded-top';
					}
					
					section = currentSection;
				}

				return (
					<LogEntry entry={ entry } additionalClasses={ additionalClasses } />
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