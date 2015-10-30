/**
 * Display error legend
 */
wplv.ErrorLegend = React.createClass({

	// Render component
	render: function() {
		return (
			<ul className="wplv-module--error-legends">
				<li className="php-fatal-error"><span className="count"></span> Fatal Error</li>
				<li className="php-warning"><span className="count"></span> PHP Warning</li>
				<li className="php-notice"><span className="count"></span> PHP Notice</li>
				<li className="php-deprecated"><span className="count"></span> PHP Deprecated</li>
				<li className="wordpress-database-error"><span className="count"></span> Database error</li>
			</ul>
		);
	}
});