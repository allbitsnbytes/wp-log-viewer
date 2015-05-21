/**
 * Display log viewer sidebar
 */
var ViewSidebar = React.createClass({

	// Menu Config
	getMenuOptions: function() {
		return [
			
			// Log actions
			{
				name: 'Actions',
				default: '',
				trackSelected: false,
				options: [
					{ label: 'Clear Log',	key: 'clear',	action: this.props.viewer.clearLogEntries }
				]
			},
			
			// Sort options
			{
				name: 'Sort',
				default: 'newest',
				trackSelected: true,
				options: [
					{ label: 'By Newest',	key: 'newest',	action: this.props.viewer.sortNewest },
					{ label: 'By Oldest',	key: 'oldest',	action: this.props.viewer.sortOldest }
				]
			},
			
			// View options
			{
				name: 'View',
				default: 'group',
				trackSelected: true,
				options: [
					{ label: 'Group View',	key: 'group',	action: this.props.viewer.showGroupView },
					{ label: 'List View',	key: 'list',	action: this.props.viewer.showListView }
				]
			}
		];
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
	
	render: function() {
		var lastModified = 'n/a';
		var defaultMenuOptions = this.getMenuOptions();
		var menuOptions = defaultMenuOptions.map(function(menuGroup) {
			return (
				<ViewActionGroup group={ menuGroup } />
			);
		});
		
		if (this.props.viewer) {
			var lastModifieidDate = new Date(this.props.viewer.state.modified);
			lastModified = ( 
				<span className="last-modified">
					{ lastModifieidDate.toLocaleDateString() }<br />{ lastModifieidDate.toLocaleTimeString() }
				</span> 
			);
		} 
		
		return (
			<div className="sidebar">
				{ menuOptions }

				<small>
					<strong>Last modified</strong><br />
					{ lastModified }
				</small>				
			</div>
		);
	}
});