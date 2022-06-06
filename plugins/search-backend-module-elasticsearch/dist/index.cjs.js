'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var awsEsConnection = require('@acuris/aws-es-connection');
var elasticsearch = require('@elastic/elasticsearch');
var esb = require('elastic-builder');
var lodash = require('lodash');
var uuid = require('uuid');
var pluginSearchBackendNode = require('@backstage/plugin-search-backend-node');
var stream = require('stream');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var esb__default = /*#__PURE__*/_interopDefaultLegacy(esb);

function duration(startTimestamp) {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}
class ElasticSearchSearchEngineIndexer extends pluginSearchBackendNode.BatchSearchEngineIndexer {
  constructor(options) {
    super({ batchSize: 1e3 });
    this.received = 0;
    this.processed = 0;
    this.removableIndices = [];
    this.logger = options.logger;
    this.startTimestamp = process.hrtime();
    this.type = options.type;
    this.indexPrefix = options.indexPrefix;
    this.indexSeparator = options.indexSeparator;
    this.indexName = this.constructIndexName(`${Date.now()}`);
    this.alias = options.alias;
    this.removableAlias = `${this.alias}_removable`;
    this.elasticSearchClient = options.elasticSearchClient;
    this.sourceStream = new stream.Readable({ objectMode: true });
    this.sourceStream._read = () => {
    };
    const that = this;
    this.bulkResult = this.elasticSearchClient.helpers.bulk({
      datasource: this.sourceStream,
      onDocument() {
        that.processed++;
        return {
          index: { _index: that.indexName }
        };
      },
      refreshOnCompletion: that.indexName
    });
  }
  async initialize() {
    this.logger.info(`Started indexing documents for index ${this.type}`);
    const aliases = await this.elasticSearchClient.cat.aliases({
      format: "json",
      name: [this.alias, this.removableAlias]
    });
    this.removableIndices = [
      ...new Set(aliases.body.map((r) => r.index))
    ];
    await this.elasticSearchClient.indices.create({
      index: this.indexName
    });
  }
  async index(documents) {
    await this.isReady();
    documents.forEach((document) => {
      this.received++;
      this.sourceStream.push(document);
    });
  }
  async finalize() {
    await this.isReady();
    this.sourceStream.push(null);
    const result = await this.bulkResult;
    this.logger.info(`Indexing completed for index ${this.type} in ${duration(this.startTimestamp)}`, result);
    await this.elasticSearchClient.indices.updateAliases({
      body: {
        actions: [
          {
            remove: { index: this.constructIndexName("*"), alias: this.alias }
          },
          this.removableIndices.length ? {
            add: {
              indices: this.removableIndices,
              alias: this.removableAlias
            }
          } : void 0,
          {
            add: { index: this.indexName, alias: this.alias }
          }
        ].filter(Boolean)
      }
    });
    if (this.removableIndices.length) {
      this.logger.info("Removing stale search indices", this.removableIndices);
      try {
        await this.elasticSearchClient.indices.delete({
          index: this.removableIndices
        });
      } catch (e) {
        this.logger.warn(`Failed to remove stale search indices: ${e}`);
      }
    }
  }
  isReady() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.received === this.processed) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }
  constructIndexName(postFix) {
    return `${this.indexPrefix}${this.type}${this.indexSeparator}${postFix}`;
  }
}

function isBlank(str) {
  return lodash.isEmpty(str) && !lodash.isNumber(str) || lodash.isNaN(str);
}
class ElasticSearchSearchEngine {
  constructor(elasticSearchClientOptions, aliasPostfix, indexPrefix, logger, highlightOptions) {
    this.elasticSearchClientOptions = elasticSearchClientOptions;
    this.aliasPostfix = aliasPostfix;
    this.indexPrefix = indexPrefix;
    this.logger = logger;
    this.indexSeparator = "-index__";
    this.elasticSearchClient = this.newClient((options) => new elasticsearch.Client(options));
    const uuidTag = uuid.v4();
    this.highlightOptions = {
      preTag: `<${uuidTag}>`,
      postTag: `</${uuidTag}>`,
      fragmentSize: 1e3,
      numFragments: 1,
      fragmentDelimiter: " ... ",
      ...highlightOptions
    };
  }
  static async fromConfig({
    logger,
    config,
    aliasPostfix = `search`,
    indexPrefix = ``
  }) {
    const options = await createElasticSearchClientOptions(config.getConfig("search.elasticsearch"));
    if (options.provider === "elastic") {
      logger.info("Initializing Elastic.co ElasticSearch search engine.");
    } else if (options.provider === "aws") {
      logger.info("Initializing AWS ElasticSearch search engine.");
    } else {
      logger.info("Initializing ElasticSearch search engine.");
    }
    return new ElasticSearchSearchEngine(options, aliasPostfix, indexPrefix, logger, config.getOptional("search.elasticsearch.highlightOptions"));
  }
  newClient(create) {
    return create(this.elasticSearchClientOptions);
  }
  translator(query, options) {
    const { term, filters = {}, types, pageCursor } = query;
    const filter = Object.entries(filters).filter(([_, value]) => Boolean(value)).map(([key, value]) => {
      if (["string", "number", "boolean"].includes(typeof value)) {
        const keyword = typeof value === "string" ? `${key}.keyword` : key;
        return esb__default["default"].matchQuery(keyword, value.toString());
      }
      if (Array.isArray(value)) {
        return esb__default["default"].boolQuery().should(value.map((it) => esb__default["default"].matchQuery(key, it.toString())));
      }
      this.logger.error("Failed to query, unrecognized filter type", key, value);
      throw new Error("Failed to add filters to query. Unrecognized filter type");
    });
    const esbQuery = isBlank(term) ? esb__default["default"].matchAllQuery() : esb__default["default"].multiMatchQuery(["*"], term).fuzziness("auto").minimumShouldMatch(1);
    const pageSize = 25;
    const { page } = decodePageCursor(pageCursor);
    let esbRequestBodySearch = esb__default["default"].requestBodySearch().query(esb__default["default"].boolQuery().filter(filter).must([esbQuery])).from(page * pageSize).size(pageSize);
    if (options == null ? void 0 : options.highlightOptions) {
      esbRequestBodySearch = esbRequestBodySearch.highlight(esb__default["default"].highlight("*").numberOfFragments(options.highlightOptions.numFragments).fragmentSize(options.highlightOptions.fragmentSize).preTags(options.highlightOptions.preTag).postTags(options.highlightOptions.postTag));
    }
    return {
      elasticSearchQuery: esbRequestBodySearch.toJSON(),
      documentTypes: types,
      pageSize
    };
  }
  setTranslator(translator) {
    this.translator = translator;
  }
  async getIndexer(type) {
    const alias = this.constructSearchAlias(type);
    const indexer = new ElasticSearchSearchEngineIndexer({
      type,
      indexPrefix: this.indexPrefix,
      indexSeparator: this.indexSeparator,
      alias,
      elasticSearchClient: this.elasticSearchClient,
      logger: this.logger
    });
    indexer.on("error", async (e) => {
      this.logger.error(`Failed to index documents for type ${type}`, e);
      try {
        const response = await this.elasticSearchClient.indices.exists({
          index: indexer.indexName
        });
        const indexCreated = response.body;
        if (indexCreated) {
          this.logger.info(`Removing created index ${indexer.indexName}`);
          await this.elasticSearchClient.indices.delete({
            index: indexer.indexName
          });
        }
      } catch (error) {
        this.logger.error(`Unable to clean up elastic index: ${error}`);
      }
    });
    return indexer;
  }
  async query(query) {
    const { elasticSearchQuery, documentTypes, pageSize } = this.translator(query, { highlightOptions: this.highlightOptions });
    const queryIndices = documentTypes ? documentTypes.map((it) => this.constructSearchAlias(it)) : this.constructSearchAlias("*");
    try {
      const result = await this.elasticSearchClient.search({
        index: queryIndices,
        body: elasticSearchQuery
      });
      const { page } = decodePageCursor(query.pageCursor);
      const hasNextPage = result.body.hits.total.value > (page + 1) * pageSize;
      const hasPreviousPage = page > 0;
      const nextPageCursor = hasNextPage ? encodePageCursor({ page: page + 1 }) : void 0;
      const previousPageCursor = hasPreviousPage ? encodePageCursor({ page: page - 1 }) : void 0;
      return {
        results: result.body.hits.hits.map((d) => {
          const resultItem = {
            type: this.getTypeFromIndex(d._index),
            document: d._source
          };
          if (d.highlight) {
            resultItem.highlight = {
              preTag: this.highlightOptions.preTag,
              postTag: this.highlightOptions.postTag,
              fields: Object.fromEntries(Object.entries(d.highlight).map(([field, fragments]) => [
                field,
                fragments.join(this.highlightOptions.fragmentDelimiter)
              ]))
            };
          }
          return resultItem;
        }),
        nextPageCursor,
        previousPageCursor
      };
    } catch (e) {
      this.logger.error(`Failed to query documents for indices ${queryIndices}`, e);
      return Promise.reject({ results: [] });
    }
  }
  getTypeFromIndex(index) {
    return index.substring(this.indexPrefix.length).split(this.indexSeparator)[0];
  }
  constructSearchAlias(type) {
    const postFix = this.aliasPostfix ? `__${this.aliasPostfix}` : "";
    return `${this.indexPrefix}${type}${postFix}`;
  }
}
function decodePageCursor(pageCursor) {
  if (!pageCursor) {
    return { page: 0 };
  }
  return {
    page: Number(Buffer.from(pageCursor, "base64").toString("utf-8"))
  };
}
function encodePageCursor({ page }) {
  return Buffer.from(`${page}`, "utf-8").toString("base64");
}
async function createElasticSearchClientOptions(config) {
  if (!config) {
    throw new Error("No elastic search config found");
  }
  const clientOptionsConfig = config.getOptionalConfig("clientOptions");
  const sslConfig = clientOptionsConfig == null ? void 0 : clientOptionsConfig.getOptionalConfig("ssl");
  if (config.getOptionalString("provider") === "elastic") {
    const authConfig2 = config.getConfig("auth");
    return {
      provider: "elastic",
      cloud: {
        id: config.getString("cloudId")
      },
      auth: {
        username: authConfig2.getString("username"),
        password: authConfig2.getString("password")
      },
      ...sslConfig ? {
        ssl: {
          rejectUnauthorized: sslConfig == null ? void 0 : sslConfig.getOptionalBoolean("rejectUnauthorized")
        }
      } : {}
    };
  }
  if (config.getOptionalString("provider") === "aws") {
    const awsCredentials = await awsEsConnection.awsGetCredentials();
    const AWSConnection = awsEsConnection.createAWSConnection(awsCredentials);
    return {
      provider: "aws",
      node: config.getString("node"),
      ...AWSConnection,
      ...sslConfig ? {
        ssl: {
          rejectUnauthorized: sslConfig == null ? void 0 : sslConfig.getOptionalBoolean("rejectUnauthorized")
        }
      } : {}
    };
  }
  const authConfig = config.getOptionalConfig("auth");
  const auth = authConfig && (authConfig.has("apiKey") ? {
    apiKey: authConfig.getString("apiKey")
  } : {
    username: authConfig.getString("username"),
    password: authConfig.getString("password")
  });
  return {
    node: config.getString("node"),
    auth,
    ...sslConfig ? {
      ssl: {
        rejectUnauthorized: sslConfig == null ? void 0 : sslConfig.getOptionalBoolean("rejectUnauthorized")
      }
    } : {}
  };
}

exports.ElasticSearchSearchEngine = ElasticSearchSearchEngine;
//# sourceMappingURL=index.cjs.js.map
