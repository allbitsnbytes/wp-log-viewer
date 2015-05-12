/**
 * Display a log entry
 */
var LogEntry = React.createClass({

	// Get properties
	getDefaultProps: function() {
		return {
			additionalClasses: '',
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
		additionalClasses: React.PropTypes.string,
		entry: React.PropTypes.object
	},
	 
	render: function() {
		var defaultClass = 'log-entry';
		var classes = this.props.additionalClasses === '' ? defaultClass : defaultClass + ' ' + this.props.additionalClasses; 
		var entry = this.props.entry;

		return (
			<div className={ classes }>
				<div className="when">{ entry.formatted.date }</div>
				<div className="time">{ entry.formatted.time }</div>
				<div className="message">{ entry.message }</div>
			</div>
		);
	}
});