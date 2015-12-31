/**
 * Handle tabs
 */
wplv.Tabs = React.createClass({

	// Initial state
	getInitialState: function() {
		return {
			tab: 1
		};
	},

	// Default properties
	getDefaultProps: function() {
		return {
			selected: 1,
			tabs: []
		};
	},

	// Property types
	propTypes: {
		selected: React.PropTypes.number,
		tabs: React.PropTypes.array.isRequired
	},

	// Will mount
	componentWillMount: function() {
		this.setState({tab: this.props.selected});
	},

	// Switch tab
	switchTab: function(e) {
		e.preventDefault();

		this.setState({tab: e.currentTarget.getAttribute('data-tab-index')});
	},

	// Render
	render: function() {
		var tabs = this.props.tabs.map(function(tab, index) {
			var tabIndex = index + 1,
				selectedClass = this.state.tab == tabIndex ? ' selected' : '';

			return (
				<li className={ 'tab ' + tab.replace(/[^\w]+/gi, '-').toLowerCase() + selectedClass } onClick={ this.switchTab } data-tab-index={ tabIndex } key={ index }>
					{ tab }
				</li>
			);
		}.bind(this));
		var content = React.Children.map(this.props.children, function(tab, index) {
			var tabIndex = index + 1,
				selectedClass = this.state.tab == tabIndex ? ' selected' : '';

			return ( <div className={ 'tab-content' + selectedClass }>{ tab }</div> );
		}.bind(this));

		return (
			<div className="wplv-module--tabs">
				<ul className="tabs">
					{ tabs }
				</ul>

				{ content }
			</div>
		);
	}
});