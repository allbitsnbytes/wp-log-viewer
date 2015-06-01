/**
 * Display filesize in a prettier size than just bytes
 */
var PrettyFilesize = React.createClass({

	// Get default properties
	getDefaultProps: function() {
		return {
			filesize: 0,
			precision: 2
		};
	},

	// Property types
	propTypes: {
		filesize: React.PropTypes.number
	},

	// Format filesize decimal position
	formatDecimal: function(filesize, precision) {
		var divider = parseInt(1 + Array(precision).join('0'));

		return Math.round(filesize * divider)/divider;
	},

	// Render component
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
				{ this.formatDecimal(filesize, this.props.precision) } { format }
			</div>
		);
	}
});