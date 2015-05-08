/**
 * Display log entries
 */
var LogView = React.createClass({
	
	// Get properties
	getProps: function() {
		return {
			viewer: false,
			entries: []
		};
	},
	
	// Property types
	propTypes: {
		viewer: React.PropTypes.object,
		entries: React.PropTypes.array
	},
		
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