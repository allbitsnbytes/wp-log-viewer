/**
 * Dashboard Widget
 */
wplv.DashboardWidget = React.createClass({

	// Component is ready
	ready: false,

	// Initial state
	getInitialState: function() {
		return {
			counts: {
			},
			debugging: {
				detected: false,
				enabled: false
			},
			log: {
				filsesize: 0,
				found: false,
				modified: '',
				timezone: '',
				customErrors: this.props.settings.custom_errors
			}
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			debugging: false,
			pluginUrl: ''
		}
	},

	// Property types
	propTypes: {
		debugging: React.PropTypes.bool.isRequired,
		pluginUrl: React.PropTypes.string.isRequired
	},

	// Before mount
	componentWillMount: function() {
		wplv.remote.getAllEntries({}, function(result) {
			var counts = this._prepareCount(result.entries),
				debugging = this.state.debugging,
				log = this.state.log

			this.ready = true;

			debugging.enabled = result.debugDetected ? result.debugEnabled : this.props.debugging;
			debugging.detected = result.debugDetected;

			log.found = result.found;
			log.modified = result.modified;
			log.filesize = result.filesize;
			log.timezone = result.timezone;

			this.setState({
				counts: counts,
				debugging: debugging,
				log: log
			});
		}.bind(this));
	},

	// Prepare count
	_prepareCount: function(entries) {
		var counts = {},
			customErrors = this.state.log.customErrors,
			found = {},
			key = '';

		if (!entries || !(entries instanceof Array)) {
			entries = [];
		}

		entries.forEach(function(entry) {
			key = md5(entry.message.replace('\n', ''));

			if (typeof found[key] === 'undefined') {
				found[key] = entry;
			}
		});

		// Process entries and prepare for use
		Object.keys(found).forEach(function(key) {
			var entry = found[key],
				errorType = entry.message.replace(/^(PHP [\w ]+):.*/gi, '$1');
				
			errorType = errorType && errorType !== entry.message ? errorType.trim() : '';

			if (errorType === '') {
				// Check for custom errors
				if (entry.message.match(/^#[\w_-]+:/gi) !== null) {
					errorType = entry.message.replace(/^#([\w_-]+):.*/gi, '$1');
				} else {
					// Check for Wordpress Database error type if present
					errorType = entry.message.replace(/^(Wordpress database error ).*/gi, '$1');
				}

				errorType = errorType && errorType !== entry.message ? errorType.trim() : '';
			}

			errorTypeKey = errorType.replace(/[ ]+/gi, '-').toLowerCase();

			if (typeof counts[errorTypeKey] === 'undefined') {
				counts[errorTypeKey] = {
					label: errorType,
					count: 1,
					type: errorTypeKey,
					legendColor: '',
					legendBackground: ''
				};

				if (typeof customErrors[errorTypeKey] === 'object') {
					counts[errorTypeKey].label = customErrors[errorTypeKey].label;
					counts[errorTypeKey].legendColor = customErrors[errorTypeKey].color;
					counts[errorTypeKey].legendBackground = customErrors[errorTypeKey].background;
				}
			} else {
				counts[errorTypeKey].count++;
			}
		}.bind(this));

		return counts;
	},

	// Render component
	render: function() {
		var content = '';

		if (this.ready) {
			if (this.state.debugging.enabled || this.state.debugging.detected) {
				if (this.state.log.found) {
					var errors = {},
						lis = [];

					Object.keys(this.state.counts).forEach(function(key) {
						var count = this.state.counts[key],
							styles = count.legendColor !== '' && count.legendBackground !== '' ? { 'color': count.legendColor + ' !important', 'background': count.legendBackground + ' !important'} : {};
						errors[count.label] = (
							<li className={ count.type } key={ count.key }>
								<span className="count" style={ styles }>{ count.count }</span> { count.label }
							</li>
						);
					}.bind(this));

					Object.keys(errors).sort().forEach(function(key) {
						lis.push(errors[key]);
					});

					content = (
						<ul className="wplv-module--error-legends">
							{ lis }
						</ul>
					);
				} else {
					if (this.state.debugging.enabled) {
						content = (
							<p>Debugging is <strong className="debug-status-enabled">enabled</strong>. However, the <strong>debug.log file does not exist or was not found</strong>.</p>
						);
					} else {
						content = (
							<p><strong>Debugging is currently <span className="debug-status-disabled">disabled</span>.</strong></p>
						);
					}
				}
			} else {
				content = (
					<p>Sorry, we <strong>could not detect if debugging is enabled or disabled</strong>.</p>
				);
			}
		}

		return (
			<div className="container">
				{ content }

				<a href={ this.props.pluginUrl } className="button button-primary"><i className="fa fa-arrow-circle-right" /> Go to <strong>Log Viewer</strong></a>
			</div>
		)
	}
});