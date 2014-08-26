var gulp            = require('gulp');
var jshint          = require('gulp-jshint');
var closureCompiler = require('gulp-closure-compiler');
var rename          = require('gulp-rename');
var clean           = require('gulp-rimraf');
var concat          = require('gulp-concat');
var notify          = require('gulp-notify');
var traceur         = require('gulp-traceur');
var sourcemaps      = require('gulp-sourcemaps');
var wrapper         = require('gulp-wrapper');

var defineAMD = {
    header: '( function ( root, factory )\n' +
            '{\n' +
            '   /* globals define */\n\n' +
            '   /**\n' +
            '    * AMD module\n' +
            '    */\n' +
            '    if ( typeof define === \'function\' && define.amd )\n' +
            '    {\n' +
            '        define( \'microbe\', [], factory );\n' +
            '    }\n' +
            '    else\n' +
            '    {\n' +
            '        root.µ = factory();\n' +
            '    }\n' +
            '}( this, function ()\n' +
            '{\n' +
            '    \'use strict\';\n',

    footer: '    return µ;\n' +
            '\n' +
            '} ) );\n'
};

gulp.task('legacy', function()
{
  return gulp.src([
        'src/microbe.js',
        'src/microbe.html.js',
        'src/microbe.css.js',
        'src/microbe.events.js',
        'src/microbe.http.js',
        'src/microbe.main.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('microbe.js'))
    .pipe(wrapper(defineAMD))
    .pipe(gulp.dest('lib/'))
    .pipe(notify({ message: 'Legacy scripts task complete' }));
});

gulp.task('scripts', function()
{
  return gulp.src([
        'src/es6/microbe.js',
        'src/es6/microbe.html.js',
        'src/es6/microbe.css.js',
        'src/es6/microbe.events.js',
        'src/es6/microbe.http.js',
        'src/es6/microbe.main.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('microbe.js'))
    // .pipe(wrapper(defineAMD))
    .pipe(gulp.dest('lib/es6/'))
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.traceur'}))
    .pipe(traceur({experimental: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('lib/es6/'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('closure', function() {
  gulp.src('lib/es6/microbe.traceur.js')
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'microbe.traceur.min.js'
    }))
    .pipe(gulp.dest('lib/es6/'))
    .pipe(notify({ message: 'Closure task complete' }));
});


gulp.task('clean', function()
{
  return gulp.src(['lib/'], {read: false})
    .pipe(clean());
});

gulp.task('default', [], function()
{
    gulp.start('scripts');
    gulp.start('legacy');
});

gulp.task('watch', function()
{
  gulp.watch('src/*.js', ['legacy']);
  gulp.watch('src/es6/*.js', ['scripts']);

});
