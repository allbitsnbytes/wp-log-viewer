/**
 * Display date and time
 */
var TimeStamp = React.createClass({

	// Default properties
	getDefaultProps: function() {
		return {
			date: ''
		};
	},
	
	propTypes: {
		date: React.PropTypes.object
	},
	
	render: function() {
		if (this.props.date instanceof Date) {
			var now = new Date();
			var today = now.toLocaleDateString();
			var currentDate = this.props.date.toLocaleDateString();
			var currentTime = this.props.date.toLocaleTimeString();
			
			if (today === currentDate) {
				currentDate = 'Today';
			}
			
			return (
				<div className="when">
					<div className="date">{ currentDate }</div>
					<div className="time">{ currentTime }</div>
				</div>
			);
		}
	}
});