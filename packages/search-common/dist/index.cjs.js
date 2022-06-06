'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginSearchCommon = require('@backstage/plugin-search-common');



Object.keys(pluginSearchCommon).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return pluginSearchCommon[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
