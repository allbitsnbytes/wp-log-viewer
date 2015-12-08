/**
 * Settings pane
 */
wplv.Settings = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			debug: false,
			foldSidebar: true
		};
	},

	// Properties
	getDefaultProps: function() {
		return {
			app: {
				ready: false,
			}
		};
	},

	// Property defaults
	propTypes: {
		app: React.PropTypes.object
	},

	// Mounted
	componentWillMount: function() {
		this.setState({
			debug: this.props.app.state.debugging.enabled,
			foldSidebar: WPLOGVIEWER.settings.fold_sidebar
		});
	},

	// Toggle debug status
	updateDebugStatus: function(e) {
		e.preventDefault();

		var newStatus = !this.state.debug;

		this.props.app.setDebugStatus(newStatus);
		this.setState({
			debug: newStatus
		});
	},

	// Toggle fode sidebar
	updateFoldSidebar: function(e) {
		e.preventDefault();

		var newValue = this.state.foldSidebar == 1 ? 0 : 1;

		wplv.remote.updateUserSetting('fold_sidebar', newValue, function(result) {
			if (result.updated == true || result.updated == 'true') {
				this.setState({
					foldSidebar: newValue
				});

				var body = document.getElementsByTagName('body')[0];

				if (newValue) {
					body.className += 'folded';
				} else {
					body.className = body.className.replace(' folded', ' ');
				}
			}
		}.bind(this));
	},

	// Render component
	render: function() {
		if (this.props.app.ready) {
			return (
				<div className="wplv-module--form settings-pane">
					<h2>Settings</h2>

					<div className="form-row">
						<label>Enable debugging?</label>
						<a href="#" className="toggle-field" onClick={ this.updateDebugStatus }>
							<i className={ this.state.debug ? 'fa fa-toggle-on' : 'fa fa-toggle-off' }></i>
						</a>
					</div>

					<div className="form-row">
						<label>Fold sidebar to increase viewing area?</label>
						<a href="#" className="toggle-field" onClick={ this.updateFoldSidebar }>
							<i className={ this.state.foldSidebar ? 'fa fa-toggle-on' : 'fa fa-toggle-off' }></i>
						</a>
					</div>

					<ul className="buttons">
						<li><a href="#" onClick={ this.props.app.closeSettingsPane }><i className="fa fa-chevron-circle-right" />Close</a></li>
					</ul>
				</div>
			);
		}

		return (
			<div className="wplv-module--form settings-container"></div>
		);
	}

});