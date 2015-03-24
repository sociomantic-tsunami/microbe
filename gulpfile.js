var gulp            = require('gulp');
var fs              = require( 'fs' );
var clean           = require('gulp-rimraf');
var concat          = require('gulp-concat');
var replace         = require('gulp-replace');

var browserify      = require('browserify');
var token           = 'ThisIsVeryUnlikelyThatAVariableWillBeCalledThisWay';
var exportName      = 'µ';

// Basic usage
gulp.task('build', function()
{
    browserify('./src/microbe.js', {standalone: token})
        .bundle()
        .pipe(fs.createWriteStream(__dirname + '/dist/microbe.js'))
        .on( 'finish', function()
        {
            gulp.src('./dist/microbe.js')
                .pipe(replace(token, exportName))
                .pipe(gulp.dest('./dist/'));
        });
});

gulp.task('test', function()
{
    return true;
});

gulp.task('clean', function()
{
    return gulp.src(['dist/'], {read: false}).pipe(clean());
});

gulp.task('default', [], function()
{
    gulp.start('build');
});

gulp.task('watch', function()
{
    gulp.watch('src/**/*.js', ['build']);
});
