/**
 * Display date and time
 */
var TimeStamp = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			localeSupported: false
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			date: ''
		};
	},
	
	// Property types
	propTypes: {
		date: React.PropTypes.object
	},
	
	// Component mounted
	componentDidMount: function() {
		try {
	    	new Date().toLocaleDateString('i');
	    	this.setState({localeSupported: true});
	 	} catch (e) {}
	},
	
	// Render component
	render: function() {
		if (this.props.date instanceof Date) {
			var now = new Date();
			
			if (this.state.localeSupported) {
				var today = now.toLocaleDateString();
				var currentDate = this.props.date.toLocaleDateString();
				var currentTime = this.props.date.toLocaleTimeString();
			} else {
				var today = now.toDateString();
				var currentDate = this.props.date.toDateString();
				var currentTime = this.props.date.toTimeString();
			}
			
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