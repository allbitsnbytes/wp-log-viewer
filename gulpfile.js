// Dependencies
var $			= require('gulp-load-plugins');
var gulp		= require('gulp');


// Paths
var paths = {
	src: {
		css: 'src/css/**/*.styl',
		js: 'src/js/**/*.js'
	},
	
	build: {
		css: 'assets/css',
		js: 'assets/js'
	}
};


// Default Task
gulp.task('default', ['css', 'js']);


// Process all stylus files
gulp.task('css', function() {
	
});


// Process all javascript files
gulp.task('js', function() {
	
});