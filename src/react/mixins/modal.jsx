/**
 * Modal mixin
 */
wplv.ModalMixin = {

	// Initial state
	getInitialState: function() {
		return {
			isOpen: this.props.isOpen
		};
	},

	// Open modal
	openModal: function() {
		this.setState({isOpen: true});
	},

	// Close modal
	closeModal: function() {
		this.setState({isOpen: false});
	}
	
};