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
		var entryClasses = ['log-entry'];
		var entryDate = new Date(this.props.entry.date + ' ' + this.props.entry.time + ' ' + this.props.entry.timezone);

		if (this.props.className) {
			entryClasses.push(this.props.className);
		}

		if (this.props.entry.errorType) {
			entryClasses.push(this.props.entry.errorType.toLowerCase().replace(/[ ]+/gi, '-'));
		}

		return (
			<section className={ entryClasses.join(' ') }>
				<wplv.TimeStamp date={ entryDate } />
				<div className="message force-wrap">
					{ this.props.entry.message }
				</div>
			</section>
		);
	}
});