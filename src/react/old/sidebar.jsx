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
					{ label: 'Refresh',		key: 'refresh',		icon: 'refresh',	action: this.props.viewer.refreshViewer },
					{ label: 'Clear Log',	key: 'clear',		icon: 'remove',		action: this.props.viewer.clearLogEntries }
				]
			},
			
			// Sort options
			{
				name: 'Sort',
				default: this.props.viewer.state.sort,
				trackSelected: true,
				options: [
					{ label: 'By Newest',	key: 'newest',	icon: 'sort-down',	action: this.props.viewer.sortNewest },
					{ label: 'By Oldest',	key: 'oldest',	icon: 'sort-up',	action: this.props.viewer.sortOldest }
				]
			},
			
			// View options
			{
				name: 'View',
				default: this.props.viewer.state.view,
				trackSelected: true,
				options: [
					{ label: 'Group View',	key: 'group',	icon: 'th',			action: this.props.viewer.showGroupView },
					{ label: 'List View',	key: 'list',	icon: 'list',		action: this.props.viewer.showListView }
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

	// Render component
	render: function() {
		if (this.props.viewer) {
			var lastModifiedDate = new Date(this.props.viewer.state.modified);
			var defaultMenuOptions = this.getMenuOptions();
			var menuOptions = defaultMenuOptions.map(function(menuGroup) {
				return (
					<ViewActionGroup group={ menuGroup } />
				);
			});

			return (
				<div className="sidebar">
					
					{ menuOptions }

					<div className="last-modified">
						<strong>Last modified</strong><br />
						<TimeStamp date={ lastModifiedDate } />
					</div>
			
					<div className="log-filesize">
						<strong>Filesize</strong><br />
						<PrettyFilesize filesize={ this.props.viewer.state.filesize } />
					</div>
				</div>
			);
		}
	}
});