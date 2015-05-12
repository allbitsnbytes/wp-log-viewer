/**
 * Display log viewer sidebar
 */
var ViewSidebar = React.createClass({

	// Get default state
	getInitialState: function() {
		return {
			modified: ''
		}
	},

	// Get properties
	getDefaultProps: function() {
		return {
			viewer: {}
		}
	},
	
	// Property types
	propTypes: {
		viewer: React.PropTypes.object
	},

	// Component mounted
	componentDidMount: function() {
		if (this.props.viewer) {
			this.setState({modified: this.props.viewer.state.modified});
		}
	},

	render: function() {
		var lastModified = new Date(this.state.modified);
		
		return (
			<div className="sidebar">
				<h3>Actions</h3>
				<ul>
					<ViewAction action={ this.props.viewer.clearLogEntries }>Clear Log</ViewAction>			
				</ul>

				<h3>Sort</h3>
				<ul>
					<ViewAction action={ this.props.viewer.sortNewest }>By Newest</ViewAction>
					<ViewAction action={ this.props.viewer.sortOldest }>By Oldest</ViewAction>
				</ul>

				<small>
					<strong>Last modified</strong><br />
					<span className="last-modified">{ lastModified.toLocaleDateString() } { lastModified.toLocaleTimeString() }</span>
				</small>				
			</div>
		);
	}
});