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
		
	render: function() {
		var entries = this.props.entries;
		
		if (entries.length) {
			return (
				<div className="log-entries">
					Group view coming soon.
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