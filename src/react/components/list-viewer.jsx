/**
 * Display log in list view
 */
wplv.ListViewer = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			entries: this.props.entries
		};
	},

	// Get default properties
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
		var listContent = this.props.entries.map(function(entry) {
			return (
				<wplv.LogEntry entry={ entry } />
			);
		});

		if (listContent.length === 0) {
			listContent = (
				<p>No entries found.</p>
			);
		}

		return (
			<div className="log-entries">
				{ listContent }
			</div>
		);
	}
});