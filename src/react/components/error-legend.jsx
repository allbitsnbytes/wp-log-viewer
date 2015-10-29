/**
 * Display error legend
 */
wplv.ErrorLegend = React.createClass({

	// Render component
	render: function() {
		return (
			<ul className="wplv-module--error-legends">
				<li className="php-fatal-error">Fatal Error</li>
				<li className="php-warning">PHP Warning</li>
				<li className="php-notice">PHP Notice</li>
				<li className="php-deprecated">PHP Deprecated</li>
				<li className="wordpress-database-error">Database error</li>
			</ul>
		);
	}
});