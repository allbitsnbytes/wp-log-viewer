/**
 * Display a log entry
 */
var LogEntry = React.createClass({

	// Get properties
	getDefaultProps: function() {
		return {
			entry: {
				formatted: {
					date: '',
					time: ''
				},
				message: ''	
			}
		};
	},
	
	// Property types
	propTypes: {
		entry: React.PropTypes.object
	},
	 
	render: function() {
		var entry = this.props.entry;

		return (
			<div className="log-entry">
				<div className="when">{ entry.formatted.date }</div>
				<div className="time">{ entry.formatted.time }</div>
				<div className="message">{ entry.message }</div>
			</div>
		);
	}
});