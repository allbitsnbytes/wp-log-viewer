/**
 * Display a log entry
 */
wplv.LogEntry = React.createClass({

	// Get properties
	getDefaultProps: function() {
		return {
			entry: {
				date: '',
				errorType: '',
				errorLabel: '',
				line: '',
				filePath: '',
				message: '',
				time: '',
				timezone: ''
			},
			className: ''
		};
	},

	// Property types
	propTypes: {
		entry: React.PropTypes.object
	},

	// Render component
	render: function() {
		var entry = this.props.entry;
		var entryClasses = ['log-entry'];
		var style = entry.legendBackground === '' ? {} : {'border-left-color': entry.legendBackground};
		var entryDate = new Date(entry.date + ' ' + entry.time + ' ' + entry.timezone);
		var errorDetails = [];

		if (this.props.className) {
			entryClasses.push(this.props.className);
		}

		if (entry.errorType) {
			entryClasses.push(entry.errorType.toLowerCase().replace(/[ ]+/gi, '-'));
			errorDetails.push((
				<div className="error-type"><i className="fa fa-angle-right"></i> Type: <span className="type">{ entry.errorLabel }</span></div>
			));
		}

		if (entry.line) {
			errorDetails.push((
				<div className="line-number"><i className="fa fa-angle-right"></i> Line: <span className="line">{ entry.line }</span></div>
			));
		}

		if (entry.filePath) {
			errorDetails.push((
				<div className="file-path"><i className="fa fa-angle-right"></i> File: <span className="file">{ entry.filePath }</span></div>
			));
		}

		return (
			<section className={ entryClasses.join(' ') }>
				<wplv.TimeStamp date={ entryDate } />
				<div className="message force-wrap">
					{ entry.message }

					<div className="wplv-module--error-summary">
						{ errorDetails }
					</div>
				</div>
			</section>
		);
	}
});