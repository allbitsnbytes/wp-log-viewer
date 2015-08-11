/**
 * Handle search query for log entries
 */
wplv.Search = React.createClass({

	// Minimum search string length
	minimumLength: 2,

	// Get initial state
	getInitialState: function() {
		return {
			query: ''
		};
	},

	// Get properties
	getDefaultProps: function() {
		return {
			app: {
				ready: false
			}
		}
	},
	
	// Mounted
	componentDidMount: function() {
		React.findDOMNode(this.refs.q).focus();
	},

	// Property types
	propTypes: {
		app: React.PropTypes.object
	},

	// Handle query submitted
	handleSearch: function(e) {
		e.preventDefault();

		if (this.props.app.ready) {
			var query = React.findDOMNode(this.refs.q).value;
			React.findDOMNode(this.refs.q).value = query = query.replace(/[^a-z0-9 ]+/gi, '');
			
			if (typeof query === 'string' && query.length > this.minimumLength && this.props.app.searchEntries) {
				this.setState({
					query: query
				});

				this.props.app.searchEntries(query);
			} else {
				this.setState({
					query: ''
				});

				this.props.app.searchEntries('');
			}
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