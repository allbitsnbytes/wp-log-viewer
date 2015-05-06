/**
 * Display log entries
 */
var LogView = React.createClass({
	
	render: function() {
		return (
			<div className="log-entries">
				<LogEntry />
			</div>
		);
	}
});