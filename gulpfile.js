var gulp                = require('gulp');
var browserSync         = require('browser-sync');
var del                 = require('del');
var vinylPaths          = require('vinyl-paths');
var concat              = require('gulp-concat');
var source              = require('vinyl-source-stream');
var buffer              = require('vinyl-buffer');
var wiredep             = require('wiredep').stream;
var inject              = require('gulp-inject');
var nodemon             = require('gulp-nodemon');
var jshint              = require('gulp-jshint');
var jscs                = require('gulp-jscs');
var complexity          = require('gulp-complexity');
var karma               = require('karma').server;
var stylish             = require('jshint-stylish');
var eslint              = require('gulp-eslint');
var eslintPathFormatter = require('eslint-path-formatter');
var mocha               = require('gulp-mocha');
var  mochaLcovReporter  = require('mocha-lcov-reporter');
var coverage            = require('gulp-coverage');
var open                = require('gulp-open');
var istanbul            = require('gulp-istanbul');
var Promise          	= require('Bluebird');
var merge               = require('gulp-merge');
var Vulcanize 			= require('vulcanize');
var fs 					= require('fs');

var CONFIG              = require('./build.config');

gulp.task('hello', function()
{
	console.log('Waaazzuuuuuppp');
	});

// **********************************************************************
// **********************************************************************
// **********************************************************************

// tells you everything wrong with your code, quickly. Format, styling, and complexity.
gulp.task('analyze', function() {
	return gulp.src(CONFIG.client.sourceFiles)
	.pipe(jshint.extract('always'))
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'))
	.on('error', function(e)
	{
		console.warn('jshint failed.');
		});
    /*
    .pipe(jscs())
    .on('error', function(e)
    {
    	console.warn('jscs failed');
    })
    .pipe(complexity({
        	cyclomatic: [3, 7, 12],
            halstead: [8, 13, 20],
            maintainability: 100
        })
    )
    .on('error', function(e)
    {
    	console.warn('complexity failed');
    });
*/
});

// **********************************************************************
// **********************************************************************
// **********************************************************************

// cleans the build directories
gulp.task('clean', function(done)
{
	del(CONFIG.buildFilesAndDirectoriesToClean)
	.then(function(paths)
	{
		console.log("clean done, args:", arguments);
		done();
		})
	.catch(function(error)
	{
		console.error("Clean error:", error);
		done(error);
		});
	});

// copies all the files you need for a dev build. Missing prod for now.
gulp.task('copy', ['clean'], function()
{
	return new Promise(function(resolve, reject)
	{
		gulp.src('src/client/index.html')
		.pipe(wiredep({ignorePath: "../../"}))
		.pipe(gulp.dest('./build'))
		.on('end', resolve)
		.on('error', reject);
		})
	.then(function()
	{
		return new Promise(function(resolve, reject)
		{
			gulp.src(CONFIG.client.imageFiles)
			.pipe(gulp.dest('./build/images'))
			.on('end', resolve)
			.on('error', reject);
			});
		})
	.then(function()
	{
		return new Promise(function(resolve, reject)
		{
			gulp.src('./node_modules/**/*')
			.pipe(gulp.dest('./build/node_modules'))
			.on('end', resolve)
			.on('error', reject);
			});
		})
	.then(function()
	{
		return new Promise(function(resolve, reject)
		{
			gulp.src('./bower_components/**/*')
			.pipe(gulp.dest('./build/bower_components'))
			.on('end', resolve)
			.on('error', reject);
			});
		});
	});

// injects all your files into index.html
gulp.task('inject', ['copy'], function()
{
	var sources = gulp.src(CONFIG.client.sourceFiles, {read: false});
	return gulp.src('./build/index.html')
	.pipe(inject(sources, {ignorePath: '/src/client/'}))
	.pipe(gulp.dest('./build'));
	});

gulp.task('jxlVulcan', function (done) {
	
	var devTag = '<link rel="import" href="app-view.html">';
	var prodTag = '<link rel="import" href="src/client/app-view.html">';

	var vulcan = new Vulcanize({
		abspath: './',
		excludes: ['node_modules/moment/moment.js',
		'node_modules/page/page.js',
		'node_modules/rx/dist/rx.all.js',
		'bower_components/webcomponentsjs/webcomponents.js',
		'node_modules/lodash/index.js'
		],
		stripExcludes: [
		],
		inlineScripts: true,
		inlineCss: true,
		implicitStrip: false,
		stripComments: false,
	  	inputUrl: ''
	  });

	vulcan.process('src/client/index.html', function(err, inlinedHtml)
	{
		function escapeForRegExp (str) {
			return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}
		function getInjectorTagsRegExp (starttag, endtag) {
			return new RegExp('([\t ]*)(' + escapeForRegExp(starttag) + ')(\\n|\\r|.)*?(' + escapeForRegExp(endtag) + ')', 'gi');
		}
		var re = getInjectorTagsRegExp(starttag, endtag);
		inlinedHtml = inlinedHtml.replace(re, function (match, indent, starttag, content, endtag) {
			return indent + starttag + devTag + endtag;
		});
		// fix for image, lol #insanity
		inlinedHtml = inlinedHtml.split('src="/src/client/images/starting-strength.jpg"').join('src="images/starting-strength.jpg"');
		fs.writeFile("./build/index.html", inlinedHtml, function(err)
		{
		    if(err)
		    {
		        done(err);
		        return;
		    }
		    done();
		});
	});

});

var concat = require('gulp-concat');

gulp.task('scripts', function() {
	return gulp.src(CONFIG.client.sourceFiles)
	.pipe(concat('all.html'))
	.pipe(gulp.dest('./build/'));
	});

// starts nodemon to watch files and reboot your static and api web server when they change
gulp.task('start', function (done)
{
	nodemon({
		script: 'src/static/app.js',
		ext: 'js html',
		ignore: ['gulpfile.js', 'node_modules', 'bower_components'],
		env: { 'NODE_ENV': 'development' },
		tasks: ['clean', 'copy', 'inject']
		});
	done();
	});

// git-r-done
gulp.task('default', [
	'clean', 
	'copy', 
	'inject'
	]);