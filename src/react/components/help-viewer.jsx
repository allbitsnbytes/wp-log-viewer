/**
 * Display help view
 */
wplv.HelpViewer = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			section: this.props.section
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			app: {
				ready: false
			},
			section: ''
		};
	},

	// Property types
	propTypes: {
		app: React.PropTypes.object,
		section: React.PropTypes.string
	},

	// Switch help section
	switchHelpSection: function(section) {
		return function(e) {
			e.preventDefault();

			this.setState({section: section});
		}.bind(this);
	},

	// Get help content
	getHelpContent: function(section) {
		switch (section) {
			// Debug status toggle
			case 'toggle-debugging':
				return (
					<div className="help-section help--toggle-debugging">
						<h4>Toggle Debugging</h4>

						<p>When configured, you can enable/disable WP_DEBUG with just one click.</p>
						<br />

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on "Settings", then click on the slider to enable/disable debugging</li>
						</ul>
						<br />

						<p>Before this feature can be used it will need to be configured.<br /><a href="#" onClick={ this.switchHelpSection('configure-debug-toggling') }>Learn how to configure debug toggling</a></p>
					</div>
				);
				break;

			// Configure debug toggling feature
			case 'configure-debug-toggling':
				var codeStr = "\
					<?php\
					if (!defined('ABSPATH')) {\
						header('HTTP/1.0 403 Forbidden');\
						die;\
					}\
					define('WPLV_DEBUG', false);\
				";

				return (
					<div className="help-section help--configure-debug-toggling">
						<h4>Configure Debug Toggling</h4>

						<p>Once configured, you can enable/disable WP_DEBUG with just one click.  Now that's the life.</p>

						<p><strong className="heading">Step 1</strong>In your site's document root, create the following file:  wplv-config.php</p>
						<p><strong className="heading">Step 2</strong>Add the following code to wplv-config.php:</p>
						<blockquote className="code">
							{ codeStr }
						</blockquote>

						<p><strong className="heading">Step 3</strong>Add the following snippet to the top of your wp-config.php to include wplv-config.php</p>
						<blockquote className="code">
							include_once $_SERVER['DOCUMENT_ROOT'] . '/wplv-config.php';
						</blockquote>

						<p><strong className="heading">Step 4</strong>Add the following snippet where you set the value of WP_DEBUG.  If you are already setting this constant, replace it with this snippet.</p>
						<blockquote className="code">
							define('WP_DEBUG', defined('WPLV_DEBUG') ? WPLV_DEBUG : false);
						</blockquote>

						<p><strong className="heading">Step 5</strong>Refresh the page in the browser (reload page)</p>
					</div>
				);
				break;

			// Fold sidebar
			case 'fold-sidebar':
				return (
					<div className="help-section help--fold-sidebar">
						<h4>Fold Sidebar</h4>

						<p>By default the sidebar will be folded when the log viewer is active. To disable, or toggle this behavious:</p>
						<br />

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on "Settings", then click on the slider to enable/disable sidebar folding</li>
						</ul>
					</div>
				);
				break;

			// Custom errors
			case 'custom-errors':
				return (
					<div className="help-section help--custom-errors">
						<h4>Manage Custom Errors</h4>

						<p>Custom error messages allow you to create custom errors when testing, color code thos errors in the viewer and filter the entries by those errors.</p>

						<em>Action</em>
						<ul>
							<li>To add, edit or remove custom errors go to the "Settings" pane and click on the "Custom Errors" tab</li>
						</ul>
					</div>
				);
				break;

			// Sort entries
			case 'sort-entries':
				return (
					<div className="help-section help--sort-entries">
						<h4>Sort Entries</h4>

						<p>Log entries can be sorted in descending or ascending order.</p>
						<br />

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on the group icon. <span className="sidebar-icon"><i className="fa fa-sort-alpha-asc" /></span></li>
							<li>In the sidebar, click on the list icon. <span className="sidebar-icon"><i className="fa fa-sort-alpha-desc" /></span></li>
						</ul>
					</div>
				);
				break;

			// Switch view type
			case 'switch-view-type':
				return (
					<div className="help-section help--switch-view-type">
						<h4>Switch Between Group and List Views</h4>

						<p>You can switch between Group and List views.</p>

						<p><strong className="heading">Group View</strong>This view groups all similar entries and shows you just one entry with the latest timestamp for each error.  It makes it much easier to analyze the log entries.</p>

						<p><strong className="heading">List View</strong>This view lists every log entry which is similar to the standard log view.</p>
						<br />

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on the group icon. <span className="sidebar-icon"><i className="fa fa-list-alt" /></span></li>
							<li>In the sidebar, click on the list icon. <span className="sidebar-icon"><i className="fa fa-list" /></span></li>
						</ul>
					</div>
				);
				break;

			// Refresh entries
			case 'refresh-entries':
				return (
					<div className="help-section help--refresh-entries">
						<h4>Check For New Errors</h4>

						<p>The plugin automatically check for new log errors every { this.props.app.currentTimeoutInterval / 1000 } seconds and will update the view when new errors are found.  There is no need to refresh the page.</p>

						<p>If you still want to manually check for new errors:</p>

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on the refresh icon under "actions". <span className="sidebar-icon"><i className="fa fa-refresh" /></span></li>
						</ul>
					</div>
				);
				break;

			// Clear log
			case 'clear-log':
				return (
					<div className="help-section help--clear-log">
						<h4>Clear Log</h4>

						<p>If file permissions allow, the debug.log file will be truncated.  If that fails, the file will be deleted.  If the file cannot be truncated or deleted, an error will be displayed.</p>
						<br />

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on the clear icon under "actions".  <span className="sidebar-icon"><i className="fa fa-remove" /></span></li>
						</ul>
					</div>
				);
				break;

			// Download log
			case 'download-log':
				return (
					<div className="help-section help--download-log">
						<h4>Download Log</h4>

						<p>When you click to download the log view, a smart log will be downloaded.  The smart log contains a unique entry for each error with the latest timestamp.  This helps make it much easier to review and can considerably reduce filesize.</p>
						<br />

						<em>Action</em>
						<ul>
							<li>In the sidebar, click on the download icon under "actions".  <span className="sidebar-icon"><i className="fa fa-download" /></span></li>
						</ul>
					</div>
				);
				break;

			// Default
			default:
				return (
					<div className="help-section help--home">
						<ul className="help--questions">
							<li><a href="#" onClick={ this.switchHelpSection('toggle-debugging') }><i className="fa fa-arrow-circle-o-right" /> How to toggle debugging status?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('configure-debug-toggling') }><i className="fa fa-arrow-circle-o-right" />How to configure debug toggling?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('fold-sidebar') }><i className="fa fa-arrow-circle-o-right" /> How to fold sidebar to increase viewing space?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('custom-errors') }><i className="fa fa-arrow-circle-o-right" /> How to add custom errors?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('sort-entries') }><i className="fa fa-arrow-circle-o-right" /> How to sort log entries?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('switch-view-type') }><i className="fa fa-arrow-circle-o-right" /> How to switch between group and list views?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('refresh-entries') }><i className="fa fa-arrow-circle-o-right" /> How to check for new log entries?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('clear-log') }><i className="fa fa-arrow-circle-o-right" /> How to clear the log file?</a></li>
							<li><a href="#" onClick={ this.switchHelpSection('download-log') }><i className="fa fa-arrow-circle-o-right" /> How to download the log file?</a></li>
						</ul>
					</div>
				);
		}
	},

	// Render
	render: function() {
		if (this.props.app.ready) {
			var backBtn = '';

			if (this.state.section !== '') {
				backBtn = (
					<li className="back-btn">
						<a href="#" onClick={ this.switchHelpSection('') }><i className="fa fa-chevron-circle-right" /> Back</a>
					</li>
				);
			}

			return (
				<section className="help-container">
					<header>
						<h2>Help</h2>
					</header>

					{ this.getHelpContent(this.state.section) }

					<ul className="buttons">
						{ backBtn }
						<li><a href="#" onClick={ this.props.app.closeHelp }><i className="fa fa-chevron-circle-right" /> Close</a></li>
					</ul>
				</section>
			);
		}

		return ( <section className="help-container"></section> );
	}
});