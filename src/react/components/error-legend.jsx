/**
 * Display error legend
 */
wplv.ErrorLegend = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			errors: {}
		};
	},

	// Default properties
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
		var errors = {};
		var errorsList = [];
		var found = {};

		// Load errors
		entries.forEach(function(entry) {
			if (found[entry.key] === undefined && entry.errorType) {
				var className = entry.errorType.replace(/[ ]+/, '-').toLowerCase();

				if (errors[className] === undefined) {
					errors[className] = {
						className: className,
						label: entry.errorType,
						count: 1
					};
				} else {
					errors[className].count++;
				}

				found[entry.key] = true;
			}
		});

		// Build markup
		Object.keys(errors).forEach(function(key) {
			var error = errors[key];

			errorsList.push((
				<li className={ error.className }><span className="count">{ error.count }</span> { error.label }</li>
			));
		});

		return (
			<ul className="wplv-module--error-legends">
				{ errorsList }
			</ul>
		);
	}
});