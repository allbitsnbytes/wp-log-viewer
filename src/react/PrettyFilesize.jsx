/**
 * Display filesize in a prettier size than just bytes
 */
var PrettyFilesize = React.createClass({

	// Get default properties
	getDefaultProps: function() {
		return {
			filesize: 0
		};
	},

	// Property types
	propTypes: {
		filesize: React.PropTypes.number
	},

	render: function() {
		var kilobyte = 1000,
			megabyte = 1000 * kilobyte,
			gigabyte = 1000 * megabyte,
			terrabyte = 1000 * gigabyte,
			filesize = this.props.filesize,
			format = 'Bytes';

		if (filesize > terrabyte) {
			filesize = filesize/terrabyte;
			format = 'TB'
		} else if (filesize > gigabyte) {
			filesize = filesize/gigabyte;
			format = 'GB'
		} else if (filesize > megabyte) {
			filesize = filesize/megabyte;
			format = 'MB'
		} else if (filesize > kilobyte) {
			filesize = filesize/kilobyte;
			format = 'KB'
		}

		return (
			<div className="filesize">
				{ filesize } { format }
			</div>
		);
	}
});