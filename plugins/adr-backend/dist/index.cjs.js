'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stream = require('stream');
var catalogClient = require('@backstage/catalog-client');
var catalogModel = require('@backstage/catalog-model');
var errors = require('@backstage/errors');
var integration = require('@backstage/integration');
var pluginAdrCommon = require('@backstage/plugin-adr-common');
var luxon = require('luxon');
var marked = require('marked');

const applyArgsToFormat = (format, args) => {
  let formatted = format;
  for (const [key, value] of Object.entries(args)) {
    formatted = formatted.replace(`:${key}`, value);
  }
  return formatted.toLowerCase();
};
const DEFAULT_LOCATION_TEMPLATE = "/catalog/:namespace/:kind/:name/adrs?record=:record";
const createMadrParser = (options = {}) => {
  var _a, _b;
  const locationTemplate = (_a = options.locationTemplate) != null ? _a : DEFAULT_LOCATION_TEMPLATE;
  const dateFormat = (_b = options.dateFormat) != null ? _b : pluginAdrCommon.MADR_DATE_FORMAT;
  return async ({ entity, content, path }) => {
    var _a2, _b2, _c, _d, _e;
    const tokens = marked.marked.lexer(content);
    if (!tokens.length) {
      throw new Error("ADR has no content");
    }
    const adrTitle = (_a2 = tokens.find((t) => t.type === "heading" && t.depth === 1)) == null ? void 0 : _a2.text;
    const listTokens = (_b2 = tokens.find((t) => t.type === "list")) == null ? void 0 : _b2.items;
    const adrStatus = (_c = listTokens.find((t) => /^status:/i.test(t.text))) == null ? void 0 : _c.text.replace(/^status:/i, "").trim().toLocaleLowerCase("en-US");
    const adrDateTime = luxon.DateTime.fromFormat((_e = (_d = listTokens.find((t) => /^date:/i.test(t.text))) == null ? void 0 : _d.text.replace(/^date:/i, "").trim()) != null ? _e : "", dateFormat);
    const adrDate = adrDateTime.isValid ? adrDateTime.toFormat(pluginAdrCommon.MADR_DATE_FORMAT) : void 0;
    return {
      title: adrTitle != null ? adrTitle : path.replace(/\.md$/, ""),
      text: content,
      status: adrStatus,
      date: adrDate,
      location: applyArgsToFormat(locationTemplate, {
        namespace: entity.metadata.namespace || "default",
        kind: entity.kind,
        name: entity.metadata.name,
        record: path
      })
    };
  };
};

class DefaultAdrCollatorFactory {
  constructor(options) {
    this.type = "adr";
    var _a, _b, _c;
    this.adrFilePathFilterFn = (_a = options.adrFilePathFilterFn) != null ? _a : pluginAdrCommon.madrFilePathFilter;
    this.cacheClient = options.cache.getClient();
    this.catalogClient = (_b = options.catalogClient) != null ? _b : new catalogClient.CatalogClient({ discoveryApi: options.discovery });
    this.logger = options.logger;
    this.parser = (_c = options.parser) != null ? _c : createMadrParser();
    this.reader = options.reader;
    this.scmIntegrations = integration.ScmIntegrations.fromConfig(options.config);
    this.tokenManager = options.tokenManager;
  }
  static fromConfig(options) {
    return new DefaultAdrCollatorFactory(options);
  }
  async getCollator() {
    return stream.Readable.from(this.execute());
  }
  async *execute() {
    const { token } = await this.tokenManager.getToken();
    const entities = (await this.catalogClient.getEntities({
      filter: {
        [`metadata.annotations.${pluginAdrCommon.ANNOTATION_ADR_LOCATION}`]: catalogClient.CATALOG_FILTER_EXISTS
      },
      fields: [
        "kind",
        "metadata.annotations",
        "metadata.name",
        "metadata.namespace"
      ]
    }, { token })).items;
    for (const ent of entities) {
      let adrsUrl;
      try {
        adrsUrl = pluginAdrCommon.getAdrLocationUrl(ent, this.scmIntegrations);
      } catch (e) {
        this.logger.error(`Unable to get ADR location URL for ${catalogModel.stringifyEntityRef(ent)}: ${e.message}`);
        continue;
      }
      const cacheItem = await this.cacheClient.get(adrsUrl);
      let adrFiles = cacheItem == null ? void 0 : cacheItem.adrFiles;
      try {
        const tree = await this.reader.readTree(adrsUrl, {
          etag: cacheItem == null ? void 0 : cacheItem.etag,
          filter: (filePath) => this.adrFilePathFilterFn(filePath)
        });
        adrFiles = await Promise.all((await tree.files()).map(async (f) => ({
          path: f.path,
          content: (await f.content()).toString("utf8")
        })));
        await this.cacheClient.set(adrsUrl, { adrFiles, etag: tree.etag });
      } catch (error) {
        if (!cacheItem || error.name !== errors.NotModifiedError.name) {
          throw error;
        }
      }
      for (const { content, path } of adrFiles) {
        try {
          const adrDoc = await this.parser({
            entity: ent,
            path,
            content
          });
          yield adrDoc;
        } catch (e) {
          this.logger.error(`Unable to parse ADR ${path}: ${e.message}`);
        }
      }
      this.logger.info(`Indexed ${adrFiles.length} ADRs from ${adrsUrl}`);
    }
  }
}

exports.DefaultAdrCollatorFactory = DefaultAdrCollatorFactory;
exports.createMadrParser = createMadrParser;
//# sourceMappingURL=index.cjs.js.map
