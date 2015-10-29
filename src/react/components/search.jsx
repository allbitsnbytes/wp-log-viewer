/**
 * Handle search query for log entries
 */
wplv.Search = React.createClass({

	// Minimum search string length
	minimumLength: 3,

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

			if (typeof query === 'string' && query.length >= this.minimumLength && this.props.app.searchEntries) {
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
		var searchQuery = '';

		if (this.state.query.length >= this.minimumLength) {
			searchQuery = (
				<div className="search-query">
					<span className="label">Searching for</span> <strong className="query">{ this.state.query }</strong>
				</div>
			);
		}

		return (
			<div className="wplv-module--search">
				<div className="search-component">
					<i className="fa fa-search"></i>
					<input type="text" name="q" ref="q" className="search-field" placeholder="Search for ..." onChange={ this.handleSearch } />
				</div>

				{ searchQuery }
			</div>
		);
	}
});