/**
 * Display a log entry
 */
var LogEntry = React.createClass({

	// Get properties
	getDefaultProps: function() {
		return {
			date: '',
			message: '',
			className: ''
		};
	},

	// Property types
	propTypes: {
		date: React.PropTypes.object,
		message: React.PropTypes.string,
		className: React.PropTypes.string
	},

	render: function() {
		var defaultClass = 'log-entry';
		var classes = this.props.className === '' ? defaultClass : defaultClass + ' ' + this.props.className; 

		return (
			<div className={ classes }>
				<TimeStamp date={ this.props.date } />
				<div className="message">{ this.props.message }</div>
			</div>
		);
	}
});