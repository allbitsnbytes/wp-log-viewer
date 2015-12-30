/**
 * Display a navigation action
 */
wplv.NavAction = React.createClass({

	// Default properties
	getDefaultProps: function() {
		return {
			nav: {
				action: '',
				label: '',
				key: '',
				icon: ''
			},
			notify: null,
			selected: false
		}
	},

	// Property types
	propTypes: {
		nav: React.PropTypes.object.isRequired,
		notify: React.PropTypes.func,
		selected: React.PropTypes.bool
	},

	// Before mount
	componentWillMount: function() {
		if (this.props.selected) {
			this.props.nav.action();
		}
	},

	// Handle action
	handleLinkClicked: function(e) {
		e.preventDefault();

		if (this.props.nav.action) {
			this.props.nav.action();
		}

		if (this.props.notify) {
			this.props.notify(this.props.nav.key);
		}
	},

	// Render component
	render: function() {
		var className = this.props.selected ? 'active' : '',
			icon = 'fa fa-'+this.props.nav.icon,
			link = ( <a href="#" onClick={ this.handleLinkClicked } title={ this.props.nav.label }><i className={ icon }></i> { this.props.nav.label }</a> );

		if (className === 'active') {
			return ( <li className={ className }>{ link }</li> );
		} else {
			return ( <li>{ link } </li> );
		}
	}
});