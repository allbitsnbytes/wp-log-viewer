/**
 * Display a log entry
 */
var LogEntry = React.createClass({

	// Get properties
	getProps: function() {
		return {
			entry: {
				date: '',
				time: '',
				message: ''	
			}
		};
	},
	
	// Property types
	propTypes: {
		entry: React.PropTypes.object
	},
	 
	render: function() {
		var date = this.props.entry.date + " " + this.props.entry.time;
		
		return (
			<div className="log-entry">
				<div className="when">{ moment(date).format('MMMM Do YYYY, h:mm a') }</div>
				<div className="message">{ this.props.entry.message }</div>
			</div>
		);
	}
});