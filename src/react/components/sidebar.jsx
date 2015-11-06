/**
 * Display log viewer sidebar
 */
wplv.Sidebar = React.createClass({

	// Menu Config
	getMenuOptions: function() {
		return [

			// Log actions
			{
				name: 'Actions',
				default: '',
				trackSelected: false,
				options: [
					{ label: 'Refresh',		key: 'refresh',		icon: 'refresh',	action: this.props.app.refreshViewer },
					{ label: 'Clear Log',	key: 'clear',		icon: 'remove',		action: this.props.app.clearLog },
					{ label: 'Download', 	key: 'download',	icon: 'download', 	action: this.props.app.downloadFile }
				]
			},

			// Sort options
			{
				name: 'Sort',
				default: this.props.app.state.log.sort,
				trackSelected: true,
				options: [
					{ label: 'By Newest',	key: 'newest',	icon: 'sort-alpha-asc',	action: this.props.app.sortNewest },
					{ label: 'By Oldest',	key: 'oldest',	icon: 'sort-alpha-desc',	action: this.props.app.sortOldest }
				]
			},

			// View options
			{
				name: 'View',
				default: this.props.app.state.log.view,
				trackSelected: true,
				options: [
					{ label: 'Group View',	key: 'group',	icon: 'list-alt',			action: this.props.app.showGroupView },
					{ label: 'List View',	key: 'list',	icon: 'list',		action: this.props.app.showListView }
				]
			}
		];
	},

	// Get properties
	getDefaultProps: function() {
		return {
			app: {
				ready: false
			}
		}
	},

	// Property types
	propTypes: {
		app: React.PropTypes.object
	},

	// Render component
	render: function() {
		if (this.props.app.ready) {
			var lastModifiedDate = this.props.app.getLastModified();
			var defaultMenuOptions = this.getMenuOptions();
			var simulateMenuOption = '';

			if (this.props.app.isSimulating()) {
				defaultMenuOptions.push({
					name: 'Simulating',
					default: '',
					trackSelected: false,
					options: [
						{ label: 'Disable',	key: 'disable-debugging',	icon: 'power-off',	action: this.props.app.stopSimulation }
					]
				});
			}

			var menuOptions = defaultMenuOptions.map(function(menuGroup, index) {
				return (
					<wplv.NavActionGroup key={ index } group={ menuGroup } />
				);
			});

			return (
				<aside className="wplv-page--sidebar">
					{ menuOptions }

					{ simulateMenuOption }

					<div className="last-modified">
						<h4>Last modified</h4>
						<wplv.TimeStamp date={ lastModifiedDate !== '' ? new Date(lastModifiedDate) : '' } />
					</div>

					<div className="log-filesize">
						<h4>Filesize</h4>
						<wplv.PrettyFilesize filesize={ this.props.app.getFilesize() } />
					</div>
				</aside>
			);
		}

		return (
			<aside className="wplv-page--sidebar"></aside>
		);
	}
});