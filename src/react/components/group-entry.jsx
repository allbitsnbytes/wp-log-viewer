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
		group: React.PropTypes.object,
		key: React.PropTypes.string
	},

	// Toggle entry details
	toggleDetails: function(e) {
		e.preventDefault();

		this.setState({showDetails: !this.state.showDetails});
	},

	// Render component
	render: function() {
		var entryClasses = ['group-entry'];
		var group = this.props.group;
		var errorDetails = [];
		var groupDetails = '';
		var groupLabel = '';

		if (group.errorType) {
			entryClasses.push(group.errorType.toLowerCase().replace(/[ ]+/gi, '-'));
			errorDetails.push((
				<div className="error-type"><i className="fa fa-angle-right"></i> Type: <span className="type">{ group.errorType }</span></div>
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
				var entry = group.entries[key];
				var entryDate = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);

				groupEntryDetails.push((
					<wplv.TimeStamp key={ groupEntryDetails.length } date={ entryDate } />
				));
			}

			if (groupEntryDetails.length > 1) {
				groupLabel = (
					<p className="label">Dates and times this error occured:</p>
				);
			} else {
				groupLabel = (
					<p className="label">Date and time this error occured:</p>
				);
			}

			groupDetails = (
				<div className="group-entry-details active">
					<div className="details">
						<a href="#" className="toggle hide-group-details" onClick={ this.toggleDetails }>Hide details</a>

						{ groupLabel }
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
			<section className={ entryClasses.join(' ') }>
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