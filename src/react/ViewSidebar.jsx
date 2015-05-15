/**
 * Display log viewer sidebar
 */
var ViewSidebar = React.createClass({

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

	render: function() {
		var lastModified = 'n/a';
		
		if (this.props.viewer) {
			var date = new Date(this.props.viewer.state.modified);
			lastModified = ( 
				<span className="last-modified">{ date.toLocaleDateString() }<br />{ date.toLocaleTimeString() }</span> 
			);
		} 
		
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

				<h3>View</h3>
				<ul>
					<ViewAction action={ this.props.viewer.groupView }>Group view</ViewAction>
					<ViewAction action={ this.props.viewer.listView }>List view</ViewAction>
				</ul>

				<small>
					<strong>Last modified</strong><br />
					{ lastModified }
				</small>				
			</div>
		);
	}
});