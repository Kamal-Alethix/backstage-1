'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');
var pluginAuthNode = require('@backstage/plugin-auth-node');
var uuid = require('uuid');
var errors = require('@backstage/errors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const todos = {};
const matches = (todo, filters) => {
  if (!filters) {
    return true;
  }
  if ("allOf" in filters) {
    return filters.allOf.every((filter) => matches(todo, filter));
  }
  if ("anyOf" in filters) {
    return filters.anyOf.some((filter) => matches(todo, filter));
  }
  if ("not" in filters) {
    return !matches(todo, filters.not);
  }
  return filters.values.includes(todo[filters.property]);
};
function add(todo) {
  const id = uuid.v4();
  const obj = { ...todo, id, timestamp: Date.now() };
  todos[id] = obj;
  return obj;
}
function update({ id, title }) {
  let todo = todos[id];
  if (!todo) {
    throw new errors.NotFoundError("Item not found");
  }
  todo = { ...todo, title, timestamp: Date.now() };
  todos[id] = todo;
  return todo;
}
function getAll(filter) {
  return Object.values(todos).filter((value) => matches(value, filter)).sort((a, b) => b.timestamp - a.timestamp);
}
add({ title: "just a note" });
add({ title: "another note" });

async function createRouter(options) {
  const { logger, identity } = options;
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.send({ status: "ok" });
  });
  router.get("/todos", async (_req, res) => {
    res.json(getAll());
  });
  router.post("/todos", async (req, res) => {
    const token = pluginAuthNode.getBearerTokenFromAuthorizationHeader(req.header("authorization"));
    let author = void 0;
    const user = token ? await identity.authenticate(token) : void 0;
    author = user == null ? void 0 : user.identity.userEntityRef;
    if (!isTodoCreateRequest(req.body)) {
      throw new errors.InputError("Invalid payload");
    }
    const todo = add({ title: req.body.title, author });
    res.json(todo);
  });
  router.put("/todos", async (req, res) => {
    if (!isTodoUpdateRequest(req.body)) {
      throw new errors.InputError("Invalid payload");
    }
    res.json(update(req.body));
  });
  router.use(backendCommon.errorHandler());
  return router;
}
function isTodoCreateRequest(request) {
  return typeof (request == null ? void 0 : request.title) === "string";
}
function isTodoUpdateRequest(request) {
  return typeof (request == null ? void 0 : request.id) === "string" && isTodoCreateRequest(request);
}

exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
