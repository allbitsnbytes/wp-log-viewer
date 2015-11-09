/**
 * Display error legend
 */
wplv.ErrorLegend = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			errors: {},
			errorTypes: []
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			app: {
				ready: false
			}
		};
	},

	// Property types
	propTypes: {
		app: React.PropTypes.object
	},

	// Toggle filter
	toggleFilter: function(type) {
		return function(e) {
			e.preventDefault();

			var types = this.state.errorTypes;

			if (type === 'clear') {
				types = [];
			} else {
				var found = types.indexOf(type);

				if (found) {
					types.splice(found, 1);
				} else {
					types.push(type);
				}
			}

			this.setState({errorTypes: types});
			this.props.app.filterEntriesByErrorType(types);
		}.bind(this);
	},

	// Render component
	render: function() {
		var errorsList = [];

		if (this.props.app.ready) {
			var entries = this.props.app.getEntries();
			var errors = {};
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
				var className = error.className;

				if (this.state.errorTypes.length > 0) {
					className += this.state.errorTypes.indexOf(error.label) ? ' selected' : ' not-selected';
				}

				errorsList.push((
					<li className={ className }>
						<a href="#" onClick={ this.toggleFilter(error.label) } title={ "Filter by: " + error.label }>
							<span className="count">{ error.count }</span> { error.label }
						</a>
					</li>
				));
			}.bind(this));
		}

		return (
			<ul className="wplv-module--error-legends">
				{ errorsList }
			</ul>
		);
	}
});