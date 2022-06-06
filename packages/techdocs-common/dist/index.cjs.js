'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginTechdocsNode = require('@backstage/plugin-techdocs-node');



Object.keys(pluginTechdocsNode).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return pluginTechdocsNode[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
