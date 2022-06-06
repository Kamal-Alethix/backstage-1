'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@backstage/integration');
var path = require('path');
var leasot = require('leasot');
var catalogModel = require('@backstage/catalog-model');
var errors = require('@backstage/errors');
var express = require('express');
var Router = require('express-promise-router');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

function createTodoParser(options = {}) {
  return ({ content, path: path$1 }) => {
    try {
      const comments = leasot.parse(content, {
        customTags: options.additionalTags,
        extension: path.extname(path$1)
      });
      return comments.map((comment) => ({
        text: comment.text,
        tag: comment.tag,
        author: comment.ref || void 0,
        lineNumber: comment.line
      }));
    } catch {
      return [];
    }
  };
}

const excludedExtensions = [
  ".png",
  ".svg",
  ".jpg",
  ".jpeg",
  ".gif",
  ".raw",
  ".lock",
  ".ico"
];
const MAX_FILE_SIZE = 2e5;
class TodoScmReader {
  constructor(options) {
    this.cache = /* @__PURE__ */ new Map();
    this.inFlightReads = /* @__PURE__ */ new Map();
    var _a, _b;
    this.logger = options.logger;
    this.reader = options.reader;
    this.parser = (_a = options.parser) != null ? _a : createTodoParser();
    this.integrations = options.integrations;
    this.filePathFilter = (_b = options.filePathFilter) != null ? _b : () => true;
  }
  static fromConfig(config, options) {
    return new TodoScmReader({
      ...options,
      integrations: integration.ScmIntegrations.fromConfig(config)
    });
  }
  async readTodos(options) {
    const { url } = options;
    const inFlightRead = this.inFlightReads.get(url);
    if (inFlightRead) {
      return inFlightRead.then((read) => read.result);
    }
    const cacheItem = this.cache.get(url);
    const newRead = this.doReadTodos({ url }, cacheItem == null ? void 0 : cacheItem.etag).catch((error) => {
      if (cacheItem && error.name === "NotModifiedError") {
        return cacheItem;
      }
      throw error;
    });
    this.inFlightReads.set(url, newRead);
    try {
      const newCacheItem = await newRead;
      this.cache.set(url, newCacheItem);
      return newCacheItem.result;
    } finally {
      this.inFlightReads.delete(url);
    }
  }
  async doReadTodos(options, etag) {
    const { url } = options;
    const filePathFilter = this.filePathFilter;
    const tree = await this.reader.readTree(url, {
      etag,
      filter(filePath, info) {
        const extname = path__default["default"].extname(filePath);
        if (info && info.size > MAX_FILE_SIZE) {
          return false;
        }
        return !filePath.startsWith(".") && !filePath.includes("/.") && !excludedExtensions.includes(extname) && filePathFilter(filePath);
      }
    });
    const files = await tree.files();
    this.logger.info(`Read ${files.length} files from ${url}`);
    const todos = new Array();
    for (const file of files) {
      const content = await file.content();
      try {
        const items = this.parser({
          path: file.path,
          content: content.toString("utf8")
        });
        todos.push(...items.map(({ lineNumber, text, tag, author }) => ({
          text,
          tag,
          author,
          lineNumber,
          repoFilePath: file.path,
          viewUrl: this.integrations.resolveUrl({
            url: file.path,
            base: url,
            lineNumber
          })
        })));
      } catch (error) {
        this.logger.error(`Failed to parse TODO in ${url} at ${file.path}, ${error}`);
      }
    }
    return { result: { items: todos }, etag: tree.etag };
  }
}

const TODO_FIELDS = [
  "text",
  "tag",
  "author",
  "viewUrl",
  "repoFilePath"
];
async function createRouter(options) {
  const { todoService } = options;
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/v1/todos", async (req, res) => {
    const offset = parseIntegerParam(req.query.offset, "offset query");
    const limit = parseIntegerParam(req.query.limit, "limit query");
    const orderBy = parseOrderByParam(req.query.orderBy, TODO_FIELDS);
    const filters = parseFilterParam(req.query.filter, TODO_FIELDS);
    const entityRef = req.query.entity;
    if (entityRef && typeof entityRef !== "string") {
      throw new errors.InputError(`entity query must be a string`);
    }
    let entity = void 0;
    if (entityRef) {
      try {
        entity = catalogModel.parseEntityRef(entityRef);
      } catch (error) {
        throw new errors.InputError(`Invalid entity ref, ${error}`);
      }
    }
    const todos = await todoService.listTodos({
      entity,
      offset,
      limit,
      orderBy,
      filters
    }, {
      token: getBearerToken(req.headers.authorization)
    });
    res.json(todos);
  });
  return router;
}
function parseIntegerParam(str, ctx) {
  if (str === void 0) {
    return void 0;
  }
  if (typeof str !== "string") {
    throw new errors.InputError(`invalid ${ctx}, must be a string`);
  }
  const parsed = parseInt(str, 10);
  if (!Number.isInteger(parsed) || String(parsed) !== str) {
    throw new errors.InputError(`invalid ${ctx}, not an integer`);
  }
  return parsed;
}
function parseOrderByParam(str, allowedFields) {
  if (str === void 0) {
    return void 0;
  }
  if (typeof str !== "string") {
    throw new errors.InputError(`invalid orderBy query, must be a string`);
  }
  const [field, direction] = str.split("=");
  if (!field) {
    throw new errors.InputError(`invalid orderBy query, field name is empty`);
  }
  if (direction !== "asc" && direction !== "desc") {
    throw new errors.InputError(`invalid orderBy query, order direction must be 'asc' or 'desc'`);
  }
  if (field && !allowedFields.includes(field)) {
    throw new errors.InputError(`invalid orderBy field, must be one of ${allowedFields.join(", ")}`);
  }
  return { field, direction };
}
function parseFilterParam(str, allowedFields) {
  if (str === void 0) {
    return void 0;
  }
  const filters = new Array();
  const strs = [str].flat();
  for (const filterStr of strs) {
    if (typeof filterStr !== "string") {
      throw new errors.InputError(`invalid filter query, must be a string or list of strings`);
    }
    const splitIndex = filterStr.indexOf("=");
    if (splitIndex <= 0) {
      throw new errors.InputError(`invalid filter query, must separate field from value using '='`);
    }
    const field = filterStr.slice(0, splitIndex);
    if (!allowedFields.includes(field)) {
      throw new errors.InputError(`invalid filter field, must be one of ${allowedFields.join(", ")}`);
    }
    const value = filterStr.slice(splitIndex + 1);
    if (!value) {
      throw new errors.InputError(`invalid filter query, value may not be empty`);
    }
    filters.push({ field, value });
  }
  return filters;
}
function getBearerToken(header) {
  var _a;
  return (_a = header == null ? void 0 : header.match(/Bearer\s+(\S+)/i)) == null ? void 0 : _a[1];
}

const DEFAULT_DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MAX_PAGE_SIZE = 50;
function wildcardRegex(str) {
  const pattern = str.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${pattern}$`, "i");
}
class TodoReaderService {
  constructor(options) {
    var _a, _b;
    this.todoReader = options.todoReader;
    this.catalogClient = options.catalogClient;
    this.maxPageSize = (_a = options.maxPageSize) != null ? _a : DEFAULT_MAX_PAGE_SIZE;
    this.defaultPageSize = (_b = options.defaultPageSize) != null ? _b : DEFAULT_DEFAULT_PAGE_SIZE;
  }
  async listTodos(req, options) {
    var _a, _b;
    if (!req.entity) {
      throw new errors.InputError("Entity filter is required to list TODOs");
    }
    const token = options == null ? void 0 : options.token;
    const entity = await this.catalogClient.getEntityByRef(req.entity, {
      token
    });
    if (!entity) {
      throw new errors.NotFoundError(`Entity not found, ${catalogModel.stringifyEntityRef(req.entity)}`);
    }
    const entitySourceLocation = catalogModel.getEntitySourceLocation(entity);
    if (entitySourceLocation.type !== "url") {
      throw new errors.InputError(`Invalid entity location type for ${catalogModel.stringifyEntityRef(entity)}, got '${entitySourceLocation.type}' for location ${entitySourceLocation.target}`);
    }
    const url = entitySourceLocation.target;
    const todos = await this.todoReader.readTodos({ url });
    let limit = (_a = req.limit) != null ? _a : this.defaultPageSize;
    if (limit < 0) {
      limit = 0;
    } else if (limit > this.maxPageSize) {
      limit = this.maxPageSize;
    }
    let offset = (_b = req.offset) != null ? _b : 0;
    if (offset < 0) {
      offset = 0;
    }
    let items = todos.items;
    const { orderBy, filters } = req;
    if (filters) {
      for (const { field, value } of filters) {
        const pattern = wildcardRegex(value);
        items = items.filter((item) => {
          var _a2;
          return (_a2 = item[field]) == null ? void 0 : _a2.match(pattern);
        });
      }
    }
    if (orderBy) {
      const dir = orderBy.direction === "asc" ? 1 : -1;
      const field = orderBy.field;
      items = items.slice().sort((item1, item2) => {
        const field1 = item1[field];
        const field2 = item2[field];
        if (field1 && field2) {
          return dir * field1.localeCompare(field2, "en-US");
        } else if (field1 && !field2) {
          return -1;
        } else if (!field1 && field2) {
          return 1;
        }
        return 0;
      });
    }
    return {
      items: items.slice(offset, offset + limit),
      totalCount: items.length,
      offset,
      limit
    };
  }
}

exports.TodoReaderService = TodoReaderService;
exports.TodoScmReader = TodoScmReader;
exports.createRouter = createRouter;
exports.createTodoParser = createTodoParser;
//# sourceMappingURL=index.cjs.js.map
