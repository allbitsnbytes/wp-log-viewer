/**
 * Display a group entry
 */
wplv.GroupEntry = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			showDetails: false
		};
	},

	// Get properties
	getDefaultProps: function() {
		return {
			group: {
				date: '',
				message: '',
				entries: []
			},
			key: ''
		};
	},

	// Property types
	propTypes: {
		group: React.PropTypes.object.isRequired,
		key: React.PropTypes.string.isRequired
	},

	// Toggle entry details
	toggleDetails: function(e) {
		e.preventDefault();

		this.setState({showDetails: !this.state.showDetails});
	},

	// Render component
	render: function() {
		var entryClasses = ['group-entry'],
			group = this.props.group,
			style = group.legendBackground === '' ? {} : {'border-left-color': group.legendBackground},
			errorDetails = [],
			groupDetails = '';

		if (group.errorType) {
			entryClasses.push(group.errorTypeKey);
			errorDetails.push((
				<div className="error-type"><i className="fa fa-angle-right"></i> Type: <span className="type">{ group.errorLabel }</span></div>
			));
		}

		if (group.line) {
			errorDetails.push((
				<div className="line-number"><i className="fa fa-angle-right"></i> Line: <span className="line">{ group.line }</span></div>
			));
		}

		if (group.filePath) {
			errorDetails.push((
				<div className="file-path"><i className="fa fa-angle-right"></i> File: <span className="file">{ group.filePath }</span></div>
			));
		}

		if (this.state.showDetails) {
			var groupEntryDetails = [];

			for (var key in group.entries) {
				var entry = group.entries[key],
					entryDate = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);

				groupEntryDetails.push((
					<wplv.TimeStamp key={ groupEntryDetails.length } date={ entryDate } />
				));
			}

			groupDetails = (
				<div className="group-entry-details active">
					<div className="details">
						<a href="#" className="toggle hide-group-details" onClick={ this.toggleDetails }>Hide details</a>

						{ groupEntryDetails }
					</div>
				</div>
			);
		} else {
			groupDetails = (
				<div className="group-entry-details">
					<div className="details">
						<a href="#" className="toggle show-group-details" onClick={ this.toggleDetails }>More details</a>
					</div>
				</div>
			);
		}

		return (
			<section className={ entryClasses.join(' ') } style={ style }>
				<aside className="summary">
					<wplv.TimeStamp date={ group.date } />
				</aside>
				<div className="message">
					<div className="force-wrap">
						{ group.message }
					</div>
					<div className="wplv-module--error-summary">
						{ errorDetails }
					</div>
					{ groupDetails }
				</div>
			</section>
		);
	}
});