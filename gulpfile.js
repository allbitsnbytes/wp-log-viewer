// Dependencies
var $			= require('gulp-load-plugins')();
var gulp		= require('gulp');
var jeet		= require('jeet');


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


// Watch 
gulp.task('watch', function() {
	gulp.watch(paths.src.css, 'css');
	gulp.watch(paths.src.js, 'js');
});


// Process all stylus files
gulp.task('css', function() {
	return gulp.src(paths.src.css)
		.pipe($.stylus({
			use: [jeet]
		}))
		.pipe($.minifyCss())
		.pipe($.autoprefixer())
		.pipe(gulp.dest(paths.build.css));
});


// Process all javascript files
gulp.task('js', function() {
	return gulp.src(paths.src.js)
		.pipe($.uglify())
		.pipe(gulp.dest(paths.build.js));
});