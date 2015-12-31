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
			},
			query: '',
			filter: []
		};
	},

	// Property types
	propTypes: {
		app: React.PropTypes.object.isRequired,
		query: React.PropTypes.string,
		filter: React.PropTypes.array
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

				if (found === -1) {
					types.push(type);
				} else {
					types.splice(found, 1);
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
			var entries = this.props.app.getEntries(),
				customErrors = this.props.app.state.log.customErrors,
				errors = {},
				found = {};

			// Load errors
			entries.forEach(function(entry) {
				if (found[entry.key] === undefined && entry.errorType) {
					var matched = true,
						errorTypeKey = entry.errorTypeKey;

					if (this.props.query !== '') {
						var match = new RegExp(this.props.query, 'gi');

						if (!(entry && entry.message && match.test(entry.message + ' ' + entry.errorType))) {
							matched = false;
						}
					}

					if (matched) {
						if (errors[errorTypeKey] === undefined) {
							var custom = {
								label: entry.errorType,
								color: '',
								background: ''
							};

							if (typeof customErrors[errorTypeKey] !== 'undefined') {
								custom.label = customErrors[errorTypeKey].label;
								custom.color = typeof customErrors[errorTypeKey]['color'] === 'undefined' ? '' : customErrors[errorTypeKey].color;
								custom.background = typeof customErrors[errorTypeKey]['background'] === 'undefined' ? '' : customErrors[errorTypeKey].background;
							}

							errors[errorTypeKey] = {
								className: errorTypeKey,
								label: custom.label,
								count: 1,
								styles: {
									color: custom.color,
									background: custom.background
								}
							};
						} else {
							errors[errorTypeKey].count++;
						}

						found[entry.key] = true;
					}
				}
			}.bind(this));

			// Build markup
			Object.keys(errors).filter(function(key) {
				var filter = this.props.filter;

				if (filter.length > 0) {
					return filter.indexOf(key) === -1 ? false : true;
				}

				return true;
			}.bind(this)).forEach(function(key, index) {
				var error = errors[key],
					className = error.className,
					styles = {};

				if (this.state.errorTypes.length > 0) {
					className += this.state.errorTypes.indexOf(key) !== -1 ? ' selected' : ' not-selected';
				}

				if (error.styles.color !== '' && error.styles.background !== '') {
					styles = {
						'color': error.styles.color + ' !important',
						'background-color': error.styles.background + ' !important'
					};
				}

				errorsList.push((
					<li className={ className } key={ index }>
						<a href="#" onClick={ this.toggleFilter(key) } title={ "Filter by: " + error.label }>
							<span className="count" style={ styles }>{ error.count }</span> { error.label }
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