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
				fatal: 0,
				notice: 0,
				warning: 0,
				misc: 0
			},
			debugging: {
				detected: false,
				enabled: false,
			},
			log: {
				filsesize: 0,
				found: false,
				modified: '',
				timezone: ''
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
		debugging: React.PropTypes.bool,
		pluginUrl: React.PropTypes.string
	},

	// Before mount
	componentWillMount: function() {
		wplv.remote.getAllEntries({}, function(result) {
			var counts = this._prepareCount(result.entries);
			var debugging = this.state.debugging;
			var log = this.state.log

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

	// Filter out duplicate entries 
	_filterDuplicateEntries: function(entries) {
		if (!entries || !(entries instanceof Array)) {
			entries = [];
		}

		var filtered = [];
		var found = {};

		// Filter duplicate entries
		entries.forEach(function(entry) {
			var key = md5(entry.message);

			if (found[key] === undefined) {
				filtered.push(entry);
				found[key] = true;
			}
		}.bind(this));
		
		return filtered;
	},

	// Prepare count
	_prepareCount: function(entries) {
		if (!entries || !(entries instanceof Array)) {
			entries = [];
		}

		var counts = this.state.counts;

		// Process entries and prepare for use
		this._filterDuplicateEntries(entries).forEach(function(entry) {

			// Get error type if present
			var errorType = entry.message.replace(/^(PHP [\w ]+):.*/gi, '$1');
			entry.errorType = errorType && errorType !== entry.message ? errorType.trim() : '';

			switch (entry.errorType) {
				case 'PHP Fatal error':
					counts.fatal++;
					break;

				case 'PHP Notice':
					counts.notice++;
					break;

				case 'PHP Warning':
					counts.warning++;
					break;

				default:
					counts.misc++;
			}
		}.bind(this));

		return counts;
	},

	// Render component
	render: function() {
		var content = '';

		if (this.ready) {
			if (this.state.debugging.detected || this.state.debugging.simulating) {
				if (this.state.log.found) {
					content = (
						<ul className="error-types-list">
							<li className="php-fatal-error">
								<div className="label"><i className="fa fa-arrow-circle-o-right" /> Fatal</div>
								<div className="count">{ this.state.counts.fatal }</div>
							</li>
							<li className="php-notice">
								<div className="label"><i className="fa fa-arrow-circle-o-right" /> Notice</div>
								<div className="count">{ this.state.counts.notice }</div>
							</li>
							<li className="php-warning">
								<div className="label"><i className="fa fa-arrow-circle-o-right" /> Warning</div>
								<div className="count">{ this.state.counts.warning }</div>
							</li>
							<li className="php-misc">
								<div className="label"><i className="fa fa-arrow-circle-o-right" /> Misc</div>
								<div className="count">{ this.state.counts.misc }</div>
							</li>
						</ul>
					);
				} else {
					if (this.state.debugging.enabled) {
						if (this.state.debugging.simulating) {
							content = (
								<p>Currently <strong className="debug-status-simulating">simulating</strong>. However, the <strong>debug.log file does not exist or was not found</strong>.</p>
							);
						} else {
							content = (
								<p>Debugging is <strong className="debug-status-enabled">enabled</strong>. However, the <strong>debug.log file does not exist or was not found</strong>.</p>
							);
						}
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

				<a href={ this.props.pluginUrl } className="action-button"><i className="fa fa-arrow-circle-right" /> Go to <strong>Log Viewer</strong></a>
			</div>
		)
	}
});