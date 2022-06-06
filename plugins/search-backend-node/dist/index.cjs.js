'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stream = require('stream');
var nodeAbortController = require('node-abort-controller');
var ndjson = require('ndjson');
var lunr = require('lunr');
var uuid = require('uuid');
var errors = require('@backstage/errors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var lunr__default = /*#__PURE__*/_interopDefaultLegacy(lunr);

class Scheduler {
  constructor({ logger }) {
    this.logger = logger;
    this.schedule = {};
    this.abortController = new nodeAbortController.AbortController();
    this.isRunning = false;
  }
  addToSchedule({ id, task, scheduledRunner }) {
    if (this.isRunning) {
      throw new Error("Cannot add task to schedule that has already been started.");
    }
    if (this.schedule[id]) {
      throw new Error(`Task with id ${id} already exists.`);
    }
    this.schedule[id] = { task, scheduledRunner };
  }
  start() {
    this.logger.info("Starting all scheduled search tasks.");
    this.isRunning = true;
    Object.keys(this.schedule).forEach((id) => {
      const { task, scheduledRunner } = this.schedule[id];
      scheduledRunner.run({
        id,
        fn: task,
        signal: this.abortController.signal
      });
    });
  }
  stop() {
    this.logger.info("Stopping all scheduled search tasks.");
    this.abortController.abort();
    this.isRunning = false;
  }
}

class IndexBuilder {
  constructor({ logger, searchEngine }) {
    this.collators = {};
    this.decorators = {};
    this.documentTypes = {};
    this.logger = logger;
    this.searchEngine = searchEngine;
  }
  getSearchEngine() {
    return this.searchEngine;
  }
  getDocumentTypes() {
    return this.documentTypes;
  }
  addCollator({ factory, schedule }) {
    this.logger.info(`Added ${factory.constructor.name} collator factory for type ${factory.type}`);
    this.collators[factory.type] = {
      factory,
      schedule
    };
    this.documentTypes[factory.type] = {
      visibilityPermission: factory.visibilityPermission
    };
  }
  addDecorator({ factory }) {
    const types = factory.types || ["*"];
    this.logger.info(`Added decorator ${factory.constructor.name} to types ${types.join(", ")}`);
    types.forEach((type) => {
      if (this.decorators.hasOwnProperty(type)) {
        this.decorators[type].push(factory);
      } else {
        this.decorators[type] = [factory];
      }
    });
  }
  async build() {
    const scheduler = new Scheduler({
      logger: this.logger
    });
    Object.keys(this.collators).forEach((type) => {
      scheduler.addToSchedule({
        id: `search_index_${type.replace("-", "_").toLocaleLowerCase("en-US")}`,
        scheduledRunner: this.collators[type].schedule,
        task: async () => {
          const collator = await this.collators[type].factory.getCollator();
          this.logger.info(`Collating documents for ${type} via ${this.collators[type].factory.constructor.name}`);
          const decorators = await Promise.all((this.decorators["*"] || []).concat(this.decorators[type] || []).map(async (factory) => {
            const decorator = await factory.getDecorator();
            this.logger.info(`Attached decorator via ${factory.constructor.name} to ${type} index pipeline.`);
            return decorator;
          }));
          const indexer = await this.searchEngine.getIndexer(type);
          return new Promise((resolve, reject) => {
            stream.pipeline([collator, ...decorators, indexer], (error) => {
              if (error) {
                this.logger.error(`Collating documents for ${type} failed: ${error}`);
                reject(error);
              } else {
                this.logger.info(`Collating documents for ${type} succeeded`);
                resolve();
              }
            });
          });
        }
      });
    });
    return {
      scheduler
    };
  }
}

class NewlineDelimitedJsonCollatorFactory {
  constructor(type, searchPattern, reader, logger, visibilityPermission) {
    this.searchPattern = searchPattern;
    this.reader = reader;
    this.logger = logger;
    this.type = type;
    this.visibilityPermission = visibilityPermission;
  }
  static fromConfig(_config, options) {
    return new NewlineDelimitedJsonCollatorFactory(options.type, options.searchPattern, options.reader, options.logger, options.visibilityPermission);
  }
  async lastUrl() {
    var _a;
    try {
      this.logger.info(`Attempting to find latest .ndjson matching ${this.searchPattern}`);
      const { files } = await this.reader.search(this.searchPattern);
      const candidates = files.filter((file) => file.url.endsWith(".ndjson")).sort((a, b) => a.url.localeCompare(b.url)).reverse();
      return (_a = candidates[0]) == null ? void 0 : _a.url;
    } catch (e) {
      this.logger.error(`Could not search for ${this.searchPattern}`, e);
      throw e;
    }
  }
  async getCollator() {
    const lastUrl = await this.lastUrl();
    if (!lastUrl) {
      const noMatchingFile = `Could not find an .ndjson file matching ${this.searchPattern}`;
      this.logger.error(noMatchingFile);
      throw new Error(noMatchingFile);
    } else {
      this.logger.info(`Using latest .ndjson file ${lastUrl}`);
    }
    const readerResponse = await this.reader.readUrl(lastUrl);
    const stream = readerResponse.stream();
    return stream.pipe(ndjson.parse());
  }
}

class BatchSearchEngineIndexer extends stream.Writable {
  constructor(options) {
    super({ objectMode: true });
    this.currentBatch = [];
    this.batchSize = options.batchSize;
    this.initialized = new Promise((done) => {
      setImmediate(async () => {
        try {
          await this.initialize();
          done(void 0);
        } catch (e) {
          errors.assertError(e);
          done(e);
        }
      });
    });
  }
  async _write(doc, _e, done) {
    const maybeError = await this.initialized;
    if (maybeError) {
      done(maybeError);
      return;
    }
    this.currentBatch.push(doc);
    if (this.currentBatch.length < this.batchSize) {
      done();
      return;
    }
    try {
      await this.index(this.currentBatch);
      this.currentBatch = [];
      done();
    } catch (e) {
      errors.assertError(e);
      done(e);
    }
  }
  async _final(done) {
    try {
      if (this.currentBatch.length) {
        await this.index(this.currentBatch);
        this.currentBatch = [];
      }
      await this.finalize();
      done();
    } catch (e) {
      errors.assertError(e);
      done(e);
    }
  }
}

class DecoratorBase extends stream.Transform {
  constructor() {
    super({ objectMode: true });
    this.initialized = new Promise((done) => {
      setImmediate(async () => {
        try {
          await this.initialize();
          done(void 0);
        } catch (e) {
          errors.assertError(e);
          done(e);
        }
      });
    });
  }
  async _transform(document, _, done) {
    const maybeError = await this.initialized;
    if (maybeError) {
      done(maybeError);
      return;
    }
    try {
      const decorated = await this.decorate(document);
      if (decorated === void 0) {
        done();
        return;
      }
      if (Array.isArray(decorated)) {
        decorated.forEach((doc) => {
          this.push(doc);
        });
        done();
        return;
      }
      this.push(decorated);
      done();
    } catch (e) {
      errors.assertError(e);
      done(e);
    }
  }
  async _final(done) {
    try {
      await this.finalize();
      done();
    } catch (e) {
      errors.assertError(e);
      done(e);
    }
  }
}

class LunrSearchEngineIndexer extends BatchSearchEngineIndexer {
  constructor() {
    super({ batchSize: 1e3 });
    this.schemaInitialized = false;
    this.docStore = {};
    this.builder = new lunr__default["default"].Builder();
    this.builder.pipeline.add(lunr__default["default"].trimmer, lunr__default["default"].stopWordFilter, lunr__default["default"].stemmer);
    this.builder.searchPipeline.add(lunr__default["default"].stemmer);
    this.builder.metadataWhitelist = ["position"];
  }
  async initialize() {
  }
  async finalize() {
  }
  async index(documents) {
    if (!this.schemaInitialized) {
      Object.keys(documents[0]).forEach((field) => {
        this.builder.field(field);
      });
      this.builder.ref("location");
      this.schemaInitialized = true;
    }
    documents.forEach((document) => {
      this.builder.add(document);
      this.docStore[document.location] = document;
    });
  }
  buildIndex() {
    return this.builder.build();
  }
  getDocumentStore() {
    return this.docStore;
  }
}

class LunrSearchEngine {
  constructor({ logger }) {
    this.lunrIndices = {};
    this.translator = ({
      term,
      filters,
      types
    }) => {
      const pageSize = 25;
      return {
        lunrQueryBuilder: (q) => {
          const termToken = lunr__default["default"].tokenizer(term);
          q.term(termToken, {
            usePipeline: true,
            boost: 100
          });
          q.term(termToken, {
            usePipeline: false,
            boost: 10,
            wildcard: lunr__default["default"].Query.wildcard.TRAILING
          });
          q.term(termToken, {
            usePipeline: false,
            editDistance: 2,
            boost: 1
          });
          if (filters) {
            Object.entries(filters).forEach(([field, fieldValue]) => {
              if (!q.allFields.includes(field)) {
                throw new Error(`unrecognised field ${field}`);
              }
              const value = Array.isArray(fieldValue) && fieldValue.length === 1 ? fieldValue[0] : fieldValue;
              if (["string", "number", "boolean"].includes(typeof value)) {
                q.term(lunr__default["default"].tokenizer(value == null ? void 0 : value.toString()), {
                  presence: lunr__default["default"].Query.presence.REQUIRED,
                  fields: [field]
                });
              } else if (Array.isArray(value)) {
                this.logger.warn(`Non-scalar filter value used for field ${field}. Consider using a different Search Engine for better results.`);
                q.term(lunr__default["default"].tokenizer(value), {
                  presence: lunr__default["default"].Query.presence.OPTIONAL,
                  fields: [field]
                });
              } else {
                this.logger.warn(`Unknown filter type used on field ${field}`);
              }
            });
          }
        },
        documentTypes: types,
        pageSize
      };
    };
    this.logger = logger;
    this.docStore = {};
    const uuidTag = uuid.v4();
    this.highlightPreTag = `<${uuidTag}>`;
    this.highlightPostTag = `</${uuidTag}>`;
  }
  setTranslator(translator) {
    this.translator = translator;
  }
  async getIndexer(type) {
    const indexer = new LunrSearchEngineIndexer();
    indexer.on("close", () => {
      this.lunrIndices[type] = indexer.buildIndex();
      this.docStore = { ...this.docStore, ...indexer.getDocumentStore() };
    });
    return indexer;
  }
  async query(query) {
    const { lunrQueryBuilder, documentTypes, pageSize } = this.translator(query);
    const results = [];
    Object.keys(this.lunrIndices).filter((type) => !documentTypes || documentTypes.includes(type)).forEach((type) => {
      try {
        results.push(...this.lunrIndices[type].query(lunrQueryBuilder).map((result) => {
          return {
            result,
            type
          };
        }));
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("unrecognised field")) {
          return;
        }
        throw err;
      }
    });
    results.sort((doc1, doc2) => {
      return doc2.result.score - doc1.result.score;
    });
    const { page } = decodePageCursor(query.pageCursor);
    const offset = page * pageSize;
    const hasPreviousPage = page > 0;
    const hasNextPage = results.length > offset + pageSize;
    const nextPageCursor = hasNextPage ? encodePageCursor({ page: page + 1 }) : void 0;
    const previousPageCursor = hasPreviousPage ? encodePageCursor({ page: page - 1 }) : void 0;
    const realResultSet = {
      results: results.slice(offset, offset + pageSize).map((d) => ({
        type: d.type,
        document: this.docStore[d.result.ref],
        highlight: {
          preTag: this.highlightPreTag,
          postTag: this.highlightPostTag,
          fields: parseHighlightFields({
            preTag: this.highlightPreTag,
            postTag: this.highlightPostTag,
            doc: this.docStore[d.result.ref],
            positionMetadata: d.result.matchData.metadata
          })
        }
      })),
      nextPageCursor,
      previousPageCursor
    };
    return realResultSet;
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
function parseHighlightFields({
  preTag,
  postTag,
  doc,
  positionMetadata
}) {
  const highlightFieldPositions = Object.values(positionMetadata).reduce((fieldPositions, metadata) => {
    Object.keys(metadata).map((fieldKey) => {
      var _a;
      fieldPositions[fieldKey] = (_a = fieldPositions[fieldKey]) != null ? _a : [];
      fieldPositions[fieldKey].push(...metadata[fieldKey].position);
    });
    return fieldPositions;
  }, {});
  return Object.fromEntries(Object.entries(highlightFieldPositions).map(([field, positions]) => {
    positions.sort((a, b) => b[0] - a[0]);
    const highlightedField = positions.reduce((content, pos) => {
      return `${content.substring(0, pos[0])}${preTag}${content.substring(pos[0], pos[0] + pos[1])}${postTag}${content.substring(pos[0] + pos[1])}`;
    }, doc[field]);
    return [field, highlightedField];
  }));
}

class TestPipeline {
  constructor({
    collator,
    decorator,
    indexer
  }) {
    this.collator = collator;
    this.decorator = decorator;
    this.indexer = indexer;
  }
  static withSubject(subject) {
    if (subject instanceof stream.Transform) {
      return new TestPipeline({ decorator: subject });
    }
    if (subject instanceof stream.Writable) {
      return new TestPipeline({ indexer: subject });
    }
    if (subject.readable || subject instanceof stream.Readable) {
      return new TestPipeline({ collator: subject });
    }
    throw new Error("Unknown test subject: are you passing a readable, writable, or transform stream?");
  }
  withDocuments(documents) {
    if (this.collator) {
      throw new Error("Cannot provide documents when testing a collator.");
    }
    this.collator = new stream.Readable({ objectMode: true });
    this.collator._read = () => {
    };
    process.nextTick(() => {
      documents.forEach((document) => {
        this.collator.push(document);
      });
      this.collator.push(null);
    });
    return this;
  }
  async execute() {
    const documents = [];
    if (!this.collator) {
      throw new Error("Cannot execute pipeline without a collator or documents");
    }
    if (!this.indexer) {
      this.indexer = new stream.Writable({ objectMode: true });
      this.indexer._write = (document, _, done) => {
        documents.push(document);
        done();
      };
    }
    return new Promise((done) => {
      const pipes = [this.collator];
      if (this.decorator) {
        pipes.push(this.decorator);
      }
      pipes.push(this.indexer);
      stream.pipeline(pipes, (error) => {
        done({
          error,
          documents
        });
      });
    });
  }
}

exports.BatchSearchEngineIndexer = BatchSearchEngineIndexer;
exports.DecoratorBase = DecoratorBase;
exports.IndexBuilder = IndexBuilder;
exports.LunrSearchEngine = LunrSearchEngine;
exports.NewlineDelimitedJsonCollatorFactory = NewlineDelimitedJsonCollatorFactory;
exports.Scheduler = Scheduler;
exports.TestPipeline = TestPipeline;
//# sourceMappingURL=index.cjs.js.map
