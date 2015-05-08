if (WPLOGVIEWER.debugEnabled) {
	WPLOGVIEWER.debugEnabled = parseInt(WPLOGVIEWER.debugEnabled);
}

React.render(
	<Viewer />,
	document.getElementById('wp-log-viewer')
);