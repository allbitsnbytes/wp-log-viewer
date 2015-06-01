/**
 * Handle search query for log entries
 */
var SearchField = React.createClass({

	// Get initial state
	getInitialState: function() {
		return {
			query: ''
		};
	},

	// Get default properties
	getDefaultProps: function() {
		return {
			viewer: {}
		};
	},

	// Property types
	propTypes: {
		viewer: React.PropTypes.object
	},

	// Handle query submitted
	handleSearch: function(e) {
		e.preventDefault();

		var query = React.findDOMNode(this.refs.q).value;
		React.findDOMNode(this.refs.q).value = query = query.replace(/[^a-z0-9 ]+/gi, '');
		
		if (typeof query === 'string' && query.length > 2 && this.props.viewer.searchEntries) {
			this.setState({query: query});
			this.props.viewer.searchEntries(query);
		} else {
			this.setState({query: ''});
			this.props.viewer.searchEntries('');
		}
	},

	// Render component
	render: function() {
		return (
			<div className="search-group">
				<i className="fa fa-search"></i>
				<input type="text" name="q" ref="q" className="search-field" placeholder="Search ..." onChange={ this.handleSearch } />
			</div>
		);
	}
});