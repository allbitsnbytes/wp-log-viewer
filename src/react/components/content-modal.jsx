/**
 * Content modal pane
 */
wplv.ContentModal = React.createClass({

	// Mixins
	mixins: [wplv.ModalMixin],

	// Default properties
	getDefaultProps: function() {
		return {
			className: '',
			isOpen: false,
			size: 'medium'			// large, medium, small
		};
	},

	// Property types
	propTypes: {
		className: React.PropTypes.string,
		isOpen: React.PropTypes.bool.isRequired,
		size: React.PropTypes.string
	},

	// Component did mount
	componentDidMount: function() {
		this.setState({isOpen: this.props.isOpen});
	},

	// Render component
	render: function() {
		var containerClassName = this.props.className ? 'wplv-module--modal ' + this.props.className : 'wplv-module--modal',
			paneClassName = 'modal-content-pane ' + this.props.size

		if (this.props.isOpen) {
			document.querySelector('body').scrollTop = 0;

			return (
				<div className={ containerClassName }>
					<div className={ paneClassName }>
						{ this.props.children }
					</div>
				</div>
			);
		}

		return (
			<div></div>
		);
	}

});