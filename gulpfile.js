// Dependencies
var $			= require('gulp-load-plugins')();
var Gulp		= require('gulp');
var Jeet		= require('Jeet');
var Rupture		= require('rupture');


// Paths
var paths = {
	src: {
		css: [
			'src/bower/font-awesome/css/font-awesome.css',
			'src/bower/humane/themes/flatty.css',
			'src/bower/spectrum/spectrum.css',
			'src/css/main.styl'
		],
		img: 'src/img/**/*',
		fonts: 'src/bower/font-awesome/fonts/**/*',
		js: [
			'src/bower/react/react.js',
			'src/bower/reqwest/reqwest.js',
			'src/bower/blueimp-md5/js/md5.js',
			'src/bower/humane/humane.js',
			'src/bower/spectrum/spectrum.js',
			'src/react/app.jsx',
			'src/react/admin-bar-nav.jsx',
			'src/react/mixins/**/*.jsx',
			'src/react/components/**/*.jsx',
			'src/js/main.jsx'
		]
	},

	build: {
		css: 'assets/css',
		fonts: 'assets/fonts',
		img: 'assets/img',
		js: 'assets/js'
	}
};


/**
 * Check if is jsx file
 * @param {object} Vinyl file object
 * @return {boolean}
 */
function isJSX(file) {
	var ext = '.jsx';
	var startIndex = file.path.length - ext.length;

	return file.path.indexOf(ext, startIndex) !== -1 ? true : false;
}


// Default Task
Gulp.task('default', ['css', 'fonts', 'images', 'js']);


// Watch
Gulp.task('watch', function() {
	Gulp.watch('src/css/**/*', ['css']);
	Gulp.watch(paths.src.img, ['images']);
	Gulp.watch(paths.src.js, ['js']);
});


// Process all stylus files
Gulp.task('css', function() {
	return Gulp.src(paths.src.css)
		.pipe($.plumber())
		.pipe($.stylus({
			use: [Jeet(), Rupture()],
			'include css': true
		}))
		.pipe($.autoprefixer())
		.pipe($.csso())
		.pipe($.concat('main.min.css'))
		.pipe(Gulp.dest(paths.build.css));
});


// Copy fonts
Gulp.task('fonts', function() {
	return Gulp.src(paths.src.fonts)
		.pipe(Gulp.dest(paths.build.fonts));
});


// Process all image files
Gulp.task('images', function() {
	return Gulp.src(paths.src.img)
		.pipe($.plumber())
		.pipe(Gulp.dest(paths.build.img));
});


// Process all javascript files
Gulp.task('js', function() {
	return Gulp.src(paths.src.js)
		.pipe($.plumber())
		.pipe($.if(isJSX, $.react()))
		.pipe($.concat('main.min.js'))
		.pipe($.uglify())
		.pipe(Gulp.dest(paths.build.js));
});
