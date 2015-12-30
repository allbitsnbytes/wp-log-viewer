/**
 * Display log in group view
 */
wplv.GroupViewer = React.createClass({

	// Get default properties
	getDefaultProps: function() {
		return {
			entries: []
		};
	},

	// Property types
	propTypes: {
		entries: React.PropTypes.array.isRequired
	},

	// Render component
	render: function() {
		var groups = {},
			groupContent = [];

		this.props.entries.forEach(function(entry) {
			if (groups[entry.key] === undefined) {
				groups[entry.key] = {
					date: new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone),
					message: entry.message,
					line: entry.line,
					errorType: entry.errorType,
					errorLabel: entry.errorLabel,
					errorTypeKey: entry.errorTypeKey,
					legendColor: entry.legendColor,
					legendBackground: entry.legendBackground,
					filePath: entry.filePath,
					entries: []
				};
			}

			groups[entry.key].entries.push(entry);
		}.bind(this));

		for (var key in groups) {
			groupContent.push((
				<wplv.GroupEntry key={ key } group={ groups[key] } />
			));
		}

		if (groupContent.length === 0) {
			groupContent = (
				<p>No entries found.</p>
			);
		}

		return (
			<div className="group-entries">
				{ groupContent }
			</div>
		);
	}
});