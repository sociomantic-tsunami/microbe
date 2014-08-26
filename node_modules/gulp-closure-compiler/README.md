# [gulp](http://gulpjs.com)-closure-compiler
[![Build Status](https://secure.travis-ci.org/steida/gulp-closure-compiler.png?branch=master)](http://travis-ci.org/steida/gulp-closure-compiler) [![Dependency Status](https://david-dm.org/steida/gulp-closure-compiler.png)](https://david-dm.org/steida/gulp-closure-compiler) [![devDependency Status](https://david-dm.org/steida/gulp-closure-compiler/dev-status.png)](https://david-dm.org/steida/gulp-closure-compiler#info=devDependencies)

> Gulp plugin for Google Closure Compiler

*Issues with the output or Java should be reported on the Closure Compiler [issue tracker](https://code.google.com/p/closure-compiler/issues/list).*

## Install

```
npm install --save-dev gulp-closure-compiler
```

## Example

### Simple optimizations

Simple optimizations for classic minifying.

```js
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('default', function() {
  gulp.src('src/*.js')
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'build.js'
    }))
    .pipe(gulp.dest('dist'));
});
```

### Advanced optimizations

Advanced optimizations is much more aggressive. It's aimed for libraries like [Closure Library](https://developers.google.com/closure/library/).

```js
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('default', function() {
  gulp.src('src/*.js')
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'build.js',
      compilerFlags: {
        closure_entry_point: 'app.main',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        define: [
          "goog.DEBUG=false"
        ],
        externs: [
          'bower_components/este-library/externs/react.js'
        ],
        extra_annotation_name: 'jsx',
        only_closure_dependencies: true,
        output_wrapper: '(function(){%output%})();',
        warning_level: 'VERBOSE'
      }
    }))
    .pipe(gulp.dest('dist'));
});
```

## API

### closureCompiler(options)

#### options

##### fileName

Type: `String`  
Required

Generated file name.

##### compilerPath

Type: `String`  
Required

Path to compiler.jar

##### compilerFlags

Type: `Object`  

Closure compiler [flags](https://github.com/steida/gulp-closure-compiler/blob/master/flags.txt).

## How to download [Closure Compiler](https://developers.google.com/closure/compiler/)

Use [Bower](http://bower.io/).

```js
{
  "name": "foo",
  "version": "0.0.0",
  "dependencies": {
    "closure-compiler": "http://dl.google.com/closure-compiler/compiler-latest.zip"
  }
}
```

## Implementation notes

- Closure compiler supports pipes, but not correctly [(issue)](https://code.google.com/p/closure-compiler/issues/detail?id=1292).
- You don't need closurebuilder.py script, compiler knows how to resolve dependencies.
- Java 1.7+ is required.

## License

MIT © [Daniel Steigerwald](https://github.com/steida)
