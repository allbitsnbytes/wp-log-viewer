/**
 * Display a view action
 */
var ViewAction = React.createClass({
	
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
		nav: React.PropTypes.object,
		notify: React.PropTypes.func,
		selected: React.PropTypes.bool
	},
	
	// Component mounted
	componentDidMount: function() {
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
		var className = this.props.selected ? 'active' : '';
		var icon = 'fa fa-'+this.props.nav.icon;
		
		if (className === 'active') {
			return (
				<li className={ className }>
					<a href="#" onClick={ this.handleLinkClicked } title={ this.props.nav.label }><i className={ icon }></i> { this.props.nav.label }</a>
				</li>
			);
		} else {
			return (
				<li>
					<a href="#" onClick={ this.handleLinkClicked } title={ this.props.nav.label }><i className={ icon }></i> { this.props.nav.label }</a>
				</li>
			);
		}
	}
});