/**
 * Display help view
 */
wplv.HelpViewer = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			section: ''
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			app: {
				ready: false
			}
		};
	},

	// Property types
	propTypes: {
		app: React.PropTypes.object
	},

	// Render
	render: function() {
		var content = '',
			sections = [],
			section = this.state.section;

		if (this.props.app.ready) {
			// Debug Status Toggle
			sections.push((
				<div className="help-section help-section--debugging">
					<h4>Toggle Debugging</h4>

					<p>TODO ...</p>
				</div>
			));

			// Fold Sidebar
			sections.push((
				<div className="help-section help-section--fold-sidebar">
					<h4>Fold Sidebar</h4>

					<p>TODO ...</p>
				</div>
			));

			content = sections[section] === 'undefined' ? sections.concat() : sections[section];

			return (
				<section className="help-container">
					<header>
						<h2>Help</h2>
					</header>

					{ content }

					<ul className="buttons">
						<li><a href="#" onClick={ this.props.app.closeHelp }><i className="fa fa-chevron-circle-right" />Close</a></li>
					</ul>
				</section>
			);
		}

		return ( <section className="help-container"></section> );
	}
});