/**
 * WP Admin Bar Menu Button
 */
wplv.AdminBarNav = React.createClass({

	// Component ready
	ready: false,
	
	// Initial state
	getInitialState: function() {
		return {
			count: 0,
			debugging: {
				enabled: false,
				simulating: false,
				detected: false
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
			var debugging = this.state.debugging;

			this.ready = true;

			debugging.enabled = result.debugDetected ? result.debugEnabled : this.props.debugging;
			debugging.simulating = this._isSimulationEnabled();
			debugging.detected = result.debugDetected;

			this.setState({
				count: this._filterDuplicateEntries(result.entries).length,
				debugging: debugging 
			});
		}.bind(this));

		// Listen for wplv change events
		document.addEventListener('wplv-log-changed', function(e) {
			var debugging = this.state.debugging;

			debugging.enabled = e.detail.debugging;
			debugging.simulating = e.detail.simulating;

			this.setState({
				count: this._filterDuplicateEntries(e.detail.entries).length,
				debugging: debugging
			});
		}.bind(this));
	},

	// Before unmound
	componentWillUnmount: function() {
		document.removeEventListener('wplv-log-changed');
	},

	// Update error count
	updateCount: function(count) {
		this.setState({count: count});
	},
	
	// Check if simulation is enabled
	_isSimulationEnabled: function() {
		return document.cookie.indexOf('_wplv-sim=1') > 0 ? true : false;
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

	// Render component
	render: function() {
		var summary = '';

		if (this.ready && (this.state.debugging.simulating || this.state.debugging.detected)) {
			var errorClass = this.state.count > 0 ? 'error-count has-errors' : 'error-count no-errors';
			var status = this.state.debugging.enabled ? 'enabled' : 'disabled';
			var statusClass = 'debug-status';

			if (this.state.debugging.simulating) {
				status = 'simulating';
			}

			summary = (
				<div className="summary">
					<div className={ statusClass + ' ' + status }>{ status }</div>
					<div className={ errorClass }>{ this.state.count }</div>
				</div>
			);
		}

		return (
			<div className="">
				<a href={ this.props.pluginUrl } className="ab-item">Debug Log { summary }</a>
			</div>
		);
	}
});