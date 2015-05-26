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
					{ label: 'Refresh',		key: 'refresh',	action: this.props.viewer.refreshViewer },
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