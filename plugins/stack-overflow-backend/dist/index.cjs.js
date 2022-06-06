'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stream = require('stream');
var fetch = require('cross-fetch');
var qs = require('qs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

class StackOverflowQuestionsCollatorFactory {
  constructor(options) {
    this.type = "stack-overflow";
    this.baseUrl = options.baseUrl;
    this.requestParams = options.requestParams;
    this.logger = options.logger;
  }
  static fromConfig(config, options) {
    const baseUrl = config.getOptionalString("stackoverflow.baseUrl") || "https://api.stackexchange.com/2.2";
    return new StackOverflowQuestionsCollatorFactory({ ...options, baseUrl });
  }
  async getCollator() {
    return stream.Readable.from(this.execute());
  }
  async *execute() {
    if (!this.baseUrl) {
      this.logger.debug(`No stackoverflow.baseUrl configured in your app-config.yaml`);
    }
    const params = qs__default["default"].stringify(this.requestParams, {
      arrayFormat: "comma",
      addQueryPrefix: true
    });
    const res = await fetch__default["default"](`${this.baseUrl}/questions${params}`);
    const data = await res.json();
    for (const question of data.items) {
      yield {
        title: question.title,
        location: question.link,
        text: question.owner.display_name,
        tags: question.tags,
        answers: question.answer_count
      };
    }
  }
}

exports.StackOverflowQuestionsCollatorFactory = StackOverflowQuestionsCollatorFactory;
//# sourceMappingURL=index.cjs.js.map
