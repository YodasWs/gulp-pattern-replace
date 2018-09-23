/**
 * Gulp Replace String
 * https://github.com/YodasWs/gulp-pattern-replace
 *
 * Copyright (c) 2016 Tomasz Czechowski
 * Copyright (c) 2017-2018 Sam Grundman
 * MIT license.
 */

'use strict';

const PluginError = require('plugin-error');
const through = require('through2');
const rs = require('replacestream');
const extend = require('extend');

const defaultOptions = {
	logs: {
		enabled: true,
		notReplaced: false,
	},
};

module.exports = function (object, optReplaceTo=null) {
	const arr = (Array.isArray(object) ? object : [object]).map((obj) => {
		let replaceFrom = '';
		let replaceTo = optReplaceTo || '';

		if (Array.isArray(obj)) {
			[replaceFrom, replaceTo] = obj;
		} else if (typeof obj === 'object' && ! (obj instanceof RegExp)) {
			if (obj.pattern) replaceFrom = obj.pattern;
			if (obj.replacement) replaceTo = obj.replacement;
		} else {
			replaceFrom = obj;
		}
		return [replaceFrom, replaceTo];
	});

	return through.obj((file, enc, callback) => {
		const fileName = file.path.split('/')[file.path.split('/').length - 1];

		if (file.isStream()) {
			arr.forEach((replacement) => {
				file.contents = file.contents.pipe(rs(...replacement));
			});
			return callback(null, file);
		}

		if (file.isBuffer()) {
			try {
				let contents = String(file.contents);
				arr.forEach((replacement) => {
					const [replaceFrom, replaceTo] = replacement;
					const regex = replaceFrom instanceof RegExp
						? replaceFrom
						: new RegExp(replaceFrom, 'g');
					if (regex.test(contents)) {
						if (typeof replaceTo === 'string') {
							contents = contents.replace(regex, replaceTo);
						} else {
							contents = contents.replace(regex, (...args) => {
								if (typeof replaceTo === 'function') {
									return replaceTo.apply(replaceTo, args);
								}
								return replaceTo;
							});
						}
					}
				});
				file.contents = new Buffer(contents);
			} catch (e) {
				return callback(new PluginError('gulp-pattern-replace', e));
			}
		}

		callback(null, file);
	});
}
