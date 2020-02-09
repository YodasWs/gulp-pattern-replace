# @yodasws/gulp-pattern-replace
> Replaces strings in files by using a string, a regex pattern, or an array of either.

## Installation

### yarn
```shell
yarn add --dev @yodasws/gulp-pattern-replace
```

### npm
```shell
npm install --save-dev @yodasws/gulp-pattern-replace
```

## Usage

```javascript
replace(pattern, replacement[, options])
```

### Regex Replace
```javascript
var replace = require('@yodasws/gulp-pattern-replace');

gulp.task('replace_1', function() {
  gulp.src(["./config.js"])
    .pipe(replace(new RegExp('@env@', 'g'), 'production'))
    .pipe(gulp.dest('./build/config.js'))
});

gulp.task('replace_2', function() {
  gulp.src(["./index.html"])
    .pipe(replace(/version(={1})/g, '$1v0.2.2'))
    .pipe(gulp.dest('./build/index.html'))
});

gulp.task('replace_3', function() {
  gulp.src(["./config.js"])
    .pipe(replace(/foo/g, function () {
        return 'bar';
    }))
    .pipe(gulp.dest('./build/config.js'))
});
```

### String Replace
```javascript
gulp.task('replace_1', function() {
  gulp.src(["./config.js"])
    .pipe(replace('@env@', 'production'))
    .pipe(gulp.dest('./build/config.js'))
});
```

### Function Replace
```javascript
gulp.task('replace_1', function() {
  gulp.src(["./config.js"])
    .pipe(replace('@env@', function () {
        return argv.env === 'dev' ? 'dev' : 'production';
    }))
    .pipe(gulp.dest('./build/config.js'))
});

gulp.task('replace_2', function() {
  gulp.src(["./config.js"])
    .pipe(replace('environment', function (pattern) {
        return pattern + '_mocked';
    }))
    .pipe(gulp.dest('./build/config.js'))
});
```
### Providing an Array for Multiple Replacements

You may pass an array where the first item is the search string/regex and the second item is the replacement:

```javascript
replace(replacementArray)
```

```javascript
gulp.task('lint-js', () => {
  gulp.src(["./config.js"])
    .pipe(replace(
		[/(if|for|switch|while)\(/g, '$1 (')],
	))
    .pipe(gulp.dest('./build/config.js'));
});
```
Or you may pass an array of such arrays:

```javascript
gulp.task('lint-js', () => {
  gulp.src(["./config.js"])
    .pipe(replace([
		[/(if|for|switch|while)\(/g, '$1 ('],
		['function (', 'function('],
	])
    .pipe(gulp.dest('./build/config.js'));
});
```

### Example with options object

If you prefer to pass arguments in an object:

```javascript
var options = {
  pattern: /@env@/g
  replacement: 'dev',
};

gulp.task('replace_1', function() {
  gulp.src(["./config.js"])
    .pipe(replace(options)
    .pipe(gulp.dest('./build/config.js'))
});
```

## API

### replace(pattern, replacement[, options])

#### pattern
Type: `String` or `RegExp`

The string to search for.

#### replacement
Type: `String` or `Function`

The replacement string or function. Called once for each match.
Function has access to regex outcome (all arguments are passed).

#### options
Type: `Object`

Same as above, but without properties `pattern` or `replacement`

### replace(replaceArray)

#### replaceArray
Type: `Array`

Either:
1. An array with 2 items: the first is the string or regex to replace, the second is the replacement
1. An array with multiple items, each an array with two items as above, `[ search, replacement ]`

### replace(options)

#### options
Type: `Object`

##### options.pattern
Type: `String` or `RegExp`

The string to search for.

##### options.replacement
Type: `String` or `Function`

The replacement string or function. Called once for each match.
Function has access to regex outcome (all arguments are passed).

More details here: [MDN documentation for RegExp] and [MDN documentation for String.replace].
