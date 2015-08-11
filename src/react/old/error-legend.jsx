/**
 * Display error legend
 */
wplv.ErrorLegend = React.createClass({

	// Render component
	render: function() {
		return (
			<ul className="error-indicator-legend">
				<li className="php-fatal-error">Fatal Error</li>
				<li className="php-notice">PHP Notice</li>
				<li className="php-warning">PHP Warning</li>
			</ul>
		);	
	}
});