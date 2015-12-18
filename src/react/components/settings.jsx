/**
 * Settings pane
 */
wplv.Settings = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			editing: null,
			ui: {
				customErrorView: 'list'
			},
			showPicker: {}
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

	// Toggle debug status
	updateDebugStatus: function(e) {
		e.preventDefault();

		this.props.app.setDebugStatus(!this.props.app.state.debugging.enabled);
	},

	// Toggle fode sidebar
	updateFoldSidebar: function(e) {
		e.preventDefault();

		var folded = !this.props.app.state.ui.foldSidebar,
			body = document.querySelectorAll('body')[0];

		wplv.remote.updateUserSetting('fold_sidebar', (folded ? 1 : 0));

		if (folded) {
			body.className += 'folded';
		} else {
			body.className = body.className.replace(' folded', ' ');
		}
	},

	// Add custom error
	showAddCustomErrorForm: function(e) {
		e.preventDefault();

		this.setState({
			ui: {
				customErrorView: 'add'
			},
			showPicker: {
				color: false,
				background: false
			}
		});
	},

	// Edit custom error
	showEditCustomErrorForm: function(e) {
		e.preventDefault();

		var customErrors = this.props.app.state.log.customErrors,
			error = jQuery(e.currentTarget).closest('.table-row').attr('data-custom-error');

		if (typeof customErrors[error] === 'object') {
			this.setState({
				editing: customErrors[error],
				ui: {
					customErrorView: 'edit'
				},
				showPicker: {
					color: false,
					background: false
				}
			});
		} else {
			wplv.alert('Not found');
		}
	},

	// List custom errors
	showCustomErrorsList: function(e) {
		e.preventDefault();

		this._showCustomErrorsList();
	},

	// Save custom error
	saveCustomError: function(e) {
		e.preventDefault();

		var customErrors = this.props.app.state.log.customErrors,
			newError = {
				label: React.findDOMNode(this.refs.errorNewLabel).value,
				key: React.findDOMNode(this.refs.errorNewKey).value,
				color: React.findDOMNode(this.refs.legendNewColor).value,
				background: React.findDOMNode(this.refs.legendNewBackgroundColor).value
			};

		if (this._isValidCustomError(newError)) {
			customErrors[newError.key] = newError;

			wplv.remote.updateGlobalSetting('custom_errors', customErrors, function(result) {
				if (result.updated) {
					wplv.notify.success('Custom error successfully added');
					this.setState({ui: {customErrorView: 'list'}});
					this._showCustomErrorsList();
				}
			}.bind(this));
		} else {
			wplv.notify.error('Please complete all required fields');
		}
	},

	// Update custom error
	updateCustomError: function(e) {
		e.preventDefault();

		var customErrors = this.props.app.state.log.customErrors,
			updatedError = {
				key: React.findDOMNode(this.refs.errorEditKey).value,
				label: React.findDOMNode(this.refs.errorEditLabel).value,
				color: React.findDOMNode(this.refs.legendEditColor).value,
				background: React.findDOMNode(this.refs.legendEditBackgroundColor).value
			};

		if (this._isValidCustomError(updatedError)) {
			customErrors[updatedError.key] = updatedError;

			wplv.remote.updateGlobalSetting('custom_errors', customErrors, function(result) {
				if (result.updated) {
					wplv.notify.success('Custom error successfully updated');
					this.props.app.setState({log: {customErrors: customErrors}});
					this._showCustomErrorsList();
				}
			}.bind(this));
		} else {
			wplv.notify.error('Please complete all required fields');
		}
	},

	// Remove custom error
	removeCustomError: function(e) {
		e.preventDefault();

		if (confirm('Are you sure you want to delete this custom error message?')) {
			var customErrors = this.props.app.state.log.customErrors,
				error = jQuery(e.currentTarget).closest('.table-row').attr('data-custom-error');

			if (typeof customErrors[error] === 'object') {
				delete(customErrors[error]);

				wplv.remote.updateGlobalSetting('custom_errors', customErrors, function(result) {
					if (result.updated) {
						wplv.notify.success('Custom error successfully deleted');
						this.props.app.setState({log: {customErrors: customErrors}});
					}
				}.bind(this));
			} else {
				wplv.notify.error('Custom error could not be deleted');
			}
		}
	},

	// Validate custom error form
	_isValidCustomError: function(error) {
		return error["label"] && error["key"] ? true : false;
	},

	// Show custom errors list
	_showCustomErrorsList: function() {
		this.setState({
			editing: null,
			ui: {customErrorView: 'list'}
		});
	},

	// Render component
	render: function() {
		if (this.props.app.ready) {
			var customErrorView = '';

			if (this.state.ui.customErrorView === 'add') {
				customErrorView = (
					<div className="add-custom-error">
						<h3>Add Custom Error</h3>

						<div className="form-row">
							<div className="form-field col50">
								<label className="required">Label</label>
								<input type="text" ref="errorNewLabel" />
							</div>

							<div className="form-field col50">
								<label className="required">Error key</label>
								<input type="text" ref="errorNewKey" />
							</div>
						</div>

						<div className="form-row">
							<div className="form-field col50">
								<label>Color</label>
								<input type="text" className="color-picker" ref="legendNewColor" />
							</div>

							<div className="form-field col50">
								<label>Background</label>
								<input type="text" className="color-picker" ref="legendNewBackgroundColor" />
							</div>
						</div>

						<div className="view-buttons">
							<a href="#" className="primary" onClick={ this.saveCustomError }>Save</a>
							<a href="#" onClick={ this.showCustomErrorsList }>Cancel</a>
						</div>
					</div>
				);
			} else if (this.state.ui.customErrorView === 'edit') {
				customErrorView = (
					<div className="edit-custom-error">
						<h3>Edit Custom Error</h3>

						<div className="form-row">
							<div className="form-field col50">
								<label className="required">Label</label>
								<input type="text" ref="errorEditLabel" defaultValue={ this.state.editing.label } />
							</div>

							<div className="form-field col50">
								<label className="required">Error key</label>
								<input type="text" ref="errorEditKey" defaultValue={ this.state.editing.key } />
							</div>
						</div>

						<div className="form-row">
							<div className="form-field col50">
								<label>Color</label>
								<input type="text" ref="legendEditColor" className="color-picker" defaultValue={ this.state.editing.color } />
							</div>

							<div className="form-field col50">
								<label>Background</label>
								<input type="text" ref="legendEditBackgroundColor" className="color-picker" defaultValue={ this.state.editing.background } />
							</div>
						</div>

						<div className="view-buttons">
							<a href="#" className="primary" onClick={ this.updateCustomError }>Update</a>
							<a href="#" onClick={ this.showCustomErrorsList }>Cancel</a>
						</div>
					</div>
				);
			} else {
				var customErrors = this.props.app.state.log.customErrors;
					listOfErrorEntries = Object.keys(customErrors).map(function(error, index) {
						var colorSwatch = ( <span className="color-swatch" style={{'background-color': customErrors[error].color}}></span> ),
							bgColorSwatch = ( <span className="color-swatch" style={{'background-color': customErrors[error].background}}></span> );

						return (
							<li className="table-row" data-custom-error={ error } key={ index }>
								<div className="error-key">{ customErrors[error].key }</div>
								<div className="error-label">{ customErrors[error].label }</div>
								<div className="legend-color"> { colorSwatch }</div>
								<div className="legend-background">{ bgColorSwatch }</div>
								<div className="actions">
									<a href="#" onClick={ this.showEditCustomErrorForm } title="Edit"><i className="fa fa-pencil" /></a>
									<a href="#" onClick={ this.removeCustomError } title="Delete"><i className="fa fa-trash" /></a>
								</div>
							</li>
						);
				}.bind(this));

				if (listOfErrorEntries.length) {
					listOfErrors = (
						<ul className="custom-errors-list">
							<li className="header">
								<div className="error-key">Key</div>
								<div className="error-label">Label</div>
								<div className="legend-color">Color</div>
								<div className="legend-background">Background</div>
							</li>
							{ listOfErrorEntries }
						</ul>
					);
				} else {
					listOfErrors = ( <p>No custom error messages defined.</p> );
				}

				customErrorView = (
					<div className="list-custom-error">
						{ listOfErrors }

						<div className="view-buttons">
							<a href="#" className="primary" onClick={ this.showAddCustomErrorForm }>Add new</a>
						</div>
					</div>
				);
			}

			return (
				<div className="wplv-module--form settings-pane">
					<h2>Settings</h2>

					<wplv.Tabs handler={ this } tabs={ ['General', 'Custom Errors'] }>
						<div>
							<div className="form-row">
								<label>Enable debugging?</label>
								<a href="#" className="toggle-field" onClick={ this.updateDebugStatus }>
									<i className={ this.props.app.state.debugging.enabled ? 'fa fa-toggle-on' : 'fa fa-toggle-off' }></i>
								</a>
							</div>

							<div className="form-row">
								<label>Fold sidebar to increase viewing area?</label>
								<a href="#" className="toggle-field" onClick={ this.updateFoldSidebar }>
									<i className={ this.props.app.state.ui.foldSidebar ? 'fa fa-toggle-on' : 'fa fa-toggle-off' }></i>
								</a>
							</div>
						</div>

						<div>
							<div className="form-row">
								{ customErrorView }
							</div>
						</div>
					</wplv.Tabs>

					<ul className="buttons">
						<li><a href="#" onClick={ this.props.app.closeSettings }><i className="fa fa-chevron-circle-right" />Close</a></li>
					</ul>
				</div>
			);
		}

		return (
			<div className="wplv-module--form settings-container"></div>
		);
	}

});7