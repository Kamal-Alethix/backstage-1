'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var catalogModel = require('@backstage/catalog-model');
var lodash = require('lodash');
var uuid = require('uuid');
var msal = require('@azure/msal-node');
var fetch = require('node-fetch');
var qs = require('qs');
var limiterFactory = require('p-limit');
var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var uuid__namespace = /*#__PURE__*/_interopNamespace(uuid);
var msal__namespace = /*#__PURE__*/_interopNamespace(msal);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);
var limiterFactory__default = /*#__PURE__*/_interopDefaultLegacy(limiterFactory);

class MicrosoftGraphClient {
  constructor(baseUrl, pca) {
    this.baseUrl = baseUrl;
    this.pca = pca;
  }
  static create(config) {
    const clientConfig = {
      auth: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        authority: `${config.authority}/${config.tenantId}`
      }
    };
    const pca = new msal__namespace.ConfidentialClientApplication(clientConfig);
    return new MicrosoftGraphClient(config.target, pca);
  }
  async *requestCollection(path, query, queryMode) {
    const appliedQueryMode = (query == null ? void 0 : query.search) ? "advanced" : queryMode != null ? queryMode : "basic";
    if (appliedQueryMode === "advanced" && ((query == null ? void 0 : query.filter) || (query == null ? void 0 : query.select))) {
      query.count = true;
    }
    const headers = appliedQueryMode === "advanced" ? {
      ConsistencyLevel: "eventual"
    } : {};
    let response = await this.requestApi(path, query, headers);
    for (; ; ) {
      if (response.status !== 200) {
        await this.handleError(path, response);
      }
      const result = await response.json();
      const elements = result.value;
      yield* elements;
      if (!result["@odata.nextLink"]) {
        return;
      }
      response = await this.requestRaw(result["@odata.nextLink"], headers);
    }
  }
  async requestApi(path, query, headers) {
    var _a;
    const queryString = qs__default["default"].stringify({
      $search: query == null ? void 0 : query.search,
      $filter: query == null ? void 0 : query.filter,
      $select: (_a = query == null ? void 0 : query.select) == null ? void 0 : _a.join(","),
      $expand: query == null ? void 0 : query.expand,
      $count: query == null ? void 0 : query.count
    }, {
      addQueryPrefix: true,
      encode: false
    });
    return await this.requestRaw(`${this.baseUrl}/${path}${queryString}`, headers);
  }
  async requestRaw(url, headers) {
    const token = await this.pca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"]
    });
    if (!token) {
      throw new Error("Error while requesting token for Microsoft Graph");
    }
    return await fetch__default["default"](url, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token.accessToken}`
      }
    });
  }
  async getUserProfile(userId, query) {
    const response = await this.requestApi(`users/${userId}`, query);
    if (response.status !== 200) {
      await this.handleError("user profile", response);
    }
    return await response.json();
  }
  async getUserPhotoWithSizeLimit(userId, maxSize) {
    return await this.getPhotoWithSizeLimit("users", userId, maxSize);
  }
  async getUserPhoto(userId, sizeId) {
    return await this.getPhoto("users", userId, sizeId);
  }
  async *getUsers(query, queryMode) {
    yield* this.requestCollection(`users`, query, queryMode);
  }
  async getGroupPhotoWithSizeLimit(groupId, maxSize) {
    return await this.getPhotoWithSizeLimit("groups", groupId, maxSize);
  }
  async getGroupPhoto(groupId, sizeId) {
    return await this.getPhoto("groups", groupId, sizeId);
  }
  async *getGroups(query, queryMode) {
    yield* this.requestCollection(`groups`, query, queryMode);
  }
  async *getGroupMembers(groupId) {
    yield* this.requestCollection(`groups/${groupId}/members`);
  }
  async getOrganization(tenantId) {
    const response = await this.requestApi(`organization/${tenantId}`);
    if (response.status !== 200) {
      await this.handleError(`organization/${tenantId}`, response);
    }
    return await response.json();
  }
  async getPhotoWithSizeLimit(entityName, id, maxSize) {
    const response = await this.requestApi(`${entityName}/${id}/photos`);
    if (response.status === 404) {
      return void 0;
    } else if (response.status !== 200) {
      await this.handleError(`${entityName} photos`, response);
    }
    const result = await response.json();
    const photos = result.value;
    let selectedPhoto = void 0;
    for (const p of photos) {
      if (!selectedPhoto || p.height >= selectedPhoto.height && p.height <= maxSize) {
        selectedPhoto = p;
      }
    }
    if (!selectedPhoto) {
      return void 0;
    }
    return await this.getPhoto(entityName, id, selectedPhoto.id);
  }
  async getPhoto(entityName, id, sizeId) {
    const path = sizeId ? `${entityName}/${id}/photos/${sizeId}/$value` : `${entityName}/${id}/photo/$value`;
    const response = await this.requestApi(path);
    if (response.status === 404) {
      return void 0;
    } else if (response.status !== 200) {
      await this.handleError("photo", response);
    }
    return `data:image/jpeg;base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
  }
  async handleError(path, response) {
    const result = await response.json();
    const error = result.error;
    throw new Error(`Error while reading ${path} from Microsoft Graph: ${error.code} - ${error.message}`);
  }
}

function readMicrosoftGraphConfig(config) {
  var _a;
  const providers = [];
  const providerConfigs = (_a = config.getOptionalConfigArray("providers")) != null ? _a : [];
  for (const providerConfig of providerConfigs) {
    const target = lodash.trimEnd(providerConfig.getString("target"), "/");
    const authority = providerConfig.getOptionalString("authority") ? lodash.trimEnd(providerConfig.getOptionalString("authority"), "/") : "https://login.microsoftonline.com";
    const tenantId = providerConfig.getString("tenantId");
    const clientId = providerConfig.getString("clientId");
    const clientSecret = providerConfig.getString("clientSecret");
    const userExpand = providerConfig.getOptionalString("userExpand");
    const userFilter = providerConfig.getOptionalString("userFilter");
    const userGroupMemberFilter = providerConfig.getOptionalString("userGroupMemberFilter");
    const userGroupMemberSearch = providerConfig.getOptionalString("userGroupMemberSearch");
    const groupExpand = providerConfig.getOptionalString("groupExpand");
    const groupFilter = providerConfig.getOptionalString("groupFilter");
    const groupSearch = providerConfig.getOptionalString("groupSearch");
    if (userFilter && userGroupMemberFilter) {
      throw new Error(`userFilter and userGroupMemberFilter are mutually exclusive, only one can be specified.`);
    }
    if (userFilter && userGroupMemberSearch) {
      throw new Error(`userGroupMemberSearch cannot be specified when userFilter is defined.`);
    }
    const groupSelect = providerConfig.getOptionalStringArray("groupSelect");
    const queryMode = providerConfig.getOptionalString("queryMode");
    if (queryMode !== void 0 && queryMode !== "basic" && queryMode !== "advanced") {
      throw new Error(`queryMode must be one of: basic, advanced`);
    }
    providers.push({
      target,
      authority,
      tenantId,
      clientId,
      clientSecret,
      userExpand,
      userFilter,
      userGroupMemberFilter,
      userGroupMemberSearch,
      groupExpand,
      groupFilter,
      groupSearch,
      groupSelect,
      queryMode
    });
  }
  return providers;
}

const MICROSOFT_EMAIL_ANNOTATION = "microsoft.com/email";
const MICROSOFT_GRAPH_TENANT_ID_ANNOTATION = "graph.microsoft.com/tenant-id";
const MICROSOFT_GRAPH_GROUP_ID_ANNOTATION = "graph.microsoft.com/group-id";
const MICROSOFT_GRAPH_USER_ID_ANNOTATION = "graph.microsoft.com/user-id";

function normalizeEntityName(name) {
  let cleaned = name.trim().toLocaleLowerCase().replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  while (cleaned.endsWith("_")) {
    cleaned = cleaned.substring(0, cleaned.length - 1);
  }
  while (cleaned.includes("__")) {
    cleaned = cleaned.replace("__", "_");
  }
  return cleaned;
}

function buildOrgHierarchy(groups) {
  const groupsByName = new Map(groups.map((g) => [g.metadata.name, g]));
  for (const group of groups) {
    const selfName = group.metadata.name;
    const parentName = group.spec.parent;
    if (parentName) {
      const parent = groupsByName.get(parentName);
      if (parent && !parent.spec.children.includes(selfName)) {
        parent.spec.children.push(selfName);
      }
    }
  }
  for (const group of groups) {
    const selfName = group.metadata.name;
    for (const childName of group.spec.children) {
      const child = groupsByName.get(childName);
      if (child && !child.spec.parent) {
        child.spec.parent = selfName;
      }
    }
  }
}
function buildMemberOf(groups, users) {
  const groupsByName = new Map(groups.map((g) => [g.metadata.name, g]));
  users.forEach((user) => {
    var _a;
    const transitiveMemberOf = /* @__PURE__ */ new Set();
    const todo = [
      ...(_a = user.spec.memberOf) != null ? _a : [],
      ...groups.filter((g) => {
        var _a2;
        return (_a2 = g.spec.members) == null ? void 0 : _a2.includes(user.metadata.name);
      }).map((g) => g.metadata.name)
    ];
    for (; ; ) {
      const current = todo.pop();
      if (!current) {
        break;
      }
      if (!transitiveMemberOf.has(current)) {
        transitiveMemberOf.add(current);
        const group = groupsByName.get(current);
        if (group == null ? void 0 : group.spec.parent) {
          todo.push(group.spec.parent);
        }
      }
    }
    user.spec.memberOf = [...transitiveMemberOf];
  });
}

async function defaultUserTransformer(user, userPhoto) {
  if (!user.id || !user.displayName || !user.mail) {
    return void 0;
  }
  const name = normalizeEntityName(user.mail);
  const entity = {
    apiVersion: "backstage.io/v1alpha1",
    kind: "User",
    metadata: {
      name,
      annotations: {
        [MICROSOFT_EMAIL_ANNOTATION]: user.mail,
        [MICROSOFT_GRAPH_USER_ID_ANNOTATION]: user.id
      }
    },
    spec: {
      profile: {
        displayName: user.displayName,
        email: user.mail
      },
      memberOf: []
    }
  };
  if (userPhoto) {
    entity.spec.profile.picture = userPhoto;
  }
  return entity;
}
async function readMicrosoftGraphUsers(client, options) {
  var _a;
  const users = [];
  const limiter = limiterFactory__default["default"](10);
  const transformer = (_a = options.transformer) != null ? _a : defaultUserTransformer;
  const promises = [];
  for await (const user of client.getUsers({
    filter: options.userFilter,
    expand: options.userExpand
  }, options.queryMode)) {
    promises.push(limiter(async () => {
      let userPhoto;
      try {
        userPhoto = await client.getUserPhotoWithSizeLimit(user.id, 120);
      } catch (e) {
        options.logger.warn(`Unable to load photo for ${user.id}`);
      }
      const entity = await transformer(user, userPhoto);
      if (!entity) {
        return;
      }
      users.push(entity);
    }));
  }
  await Promise.all(promises);
  return { users };
}
async function readMicrosoftGraphUsersInGroups(client, options) {
  var _a;
  const users = [];
  const limiter = limiterFactory__default["default"](10);
  const transformer = (_a = options.transformer) != null ? _a : defaultUserTransformer;
  const userGroupMemberPromises = [];
  const userPromises = [];
  const groupMemberUsers = /* @__PURE__ */ new Set();
  for await (const group of client.getGroups({
    expand: options.groupExpand,
    search: options.userGroupMemberSearch,
    filter: options.userGroupMemberFilter
  }, options.queryMode)) {
    userGroupMemberPromises.push(limiter(async () => {
      for await (const member of client.getGroupMembers(group.id)) {
        if (!member.id) {
          continue;
        }
        if (member["@odata.type"] === "#microsoft.graph.user") {
          groupMemberUsers.add(member.id);
        }
      }
    }));
  }
  await Promise.all(userGroupMemberPromises);
  options.logger.info(`groupMemberUsers ${groupMemberUsers.size}`);
  for (const userId of groupMemberUsers) {
    userPromises.push(limiter(async () => {
      let user;
      let userPhoto;
      try {
        user = await client.getUserProfile(userId, {
          expand: options.userExpand
        });
      } catch (e) {
        options.logger.warn(`Unable to load user for ${userId}`);
      }
      if (user) {
        try {
          userPhoto = await client.getUserPhotoWithSizeLimit(user.id, 120);
        } catch (e) {
          options.logger.warn(`Unable to load userphoto for ${userId}`);
        }
        const entity = await transformer(user, userPhoto);
        if (!entity) {
          return;
        }
        users.push(entity);
      }
    }));
  }
  await Promise.all(userPromises);
  return { users };
}
async function defaultOrganizationTransformer(organization) {
  if (!organization.id || !organization.displayName) {
    return void 0;
  }
  const name = normalizeEntityName(organization.displayName);
  return {
    apiVersion: "backstage.io/v1alpha1",
    kind: "Group",
    metadata: {
      name,
      description: organization.displayName,
      annotations: {
        [MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]: organization.id
      }
    },
    spec: {
      type: "root",
      profile: {
        displayName: organization.displayName
      },
      children: []
    }
  };
}
async function readMicrosoftGraphOrganization(client, tenantId, options) {
  var _a;
  const organization = await client.getOrganization(tenantId);
  const transformer = (_a = options == null ? void 0 : options.transformer) != null ? _a : defaultOrganizationTransformer;
  const rootGroup = await transformer(organization);
  return { rootGroup };
}
function extractGroupName(group) {
  if (group.securityEnabled) {
    return group.displayName;
  }
  return group.mailNickname || group.displayName;
}
async function defaultGroupTransformer(group, groupPhoto) {
  if (!group.id || !group.displayName) {
    return void 0;
  }
  const name = normalizeEntityName(extractGroupName(group));
  const entity = {
    apiVersion: "backstage.io/v1alpha1",
    kind: "Group",
    metadata: {
      name,
      annotations: {
        [MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]: group.id
      }
    },
    spec: {
      type: "team",
      profile: {},
      children: []
    }
  };
  if (group.description) {
    entity.metadata.description = group.description;
  }
  if (group.displayName) {
    entity.spec.profile.displayName = group.displayName;
  }
  if (group.mail) {
    entity.spec.profile.email = group.mail;
  }
  if (groupPhoto) {
    entity.spec.profile.picture = groupPhoto;
  }
  return entity;
}
async function readMicrosoftGraphGroups(client, tenantId, options) {
  var _a;
  const groups = [];
  const groupMember = /* @__PURE__ */ new Map();
  const groupMemberOf = /* @__PURE__ */ new Map();
  const limiter = limiterFactory__default["default"](10);
  const { rootGroup } = await readMicrosoftGraphOrganization(client, tenantId, {
    transformer: options == null ? void 0 : options.organizationTransformer
  });
  if (rootGroup) {
    groupMember.set(rootGroup.metadata.name, /* @__PURE__ */ new Set());
    groups.push(rootGroup);
  }
  const transformer = (_a = options == null ? void 0 : options.groupTransformer) != null ? _a : defaultGroupTransformer;
  const promises = [];
  for await (const group of client.getGroups({
    expand: options == null ? void 0 : options.groupExpand,
    search: options == null ? void 0 : options.groupSearch,
    filter: options == null ? void 0 : options.groupFilter,
    select: options == null ? void 0 : options.groupSelect
  }, options == null ? void 0 : options.queryMode)) {
    promises.push(limiter(async () => {
      const entity = await transformer(group);
      if (!entity) {
        return;
      }
      for await (const member of client.getGroupMembers(group.id)) {
        if (!member.id) {
          continue;
        }
        if (member["@odata.type"] === "#microsoft.graph.user") {
          ensureItem(groupMemberOf, member.id, group.id);
        }
        if (member["@odata.type"] === "#microsoft.graph.group") {
          ensureItem(groupMember, group.id, member.id);
        }
      }
      groups.push(entity);
    }));
  }
  await Promise.all(promises);
  return {
    groups,
    rootGroup,
    groupMember,
    groupMemberOf
  };
}
function resolveRelations(rootGroup, groups, users, groupMember, groupMemberOf) {
  const groupMap = /* @__PURE__ */ new Map();
  for (const group of groups) {
    if (group.metadata.annotations[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]) {
      groupMap.set(group.metadata.annotations[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION], group);
    }
    if (group.metadata.annotations[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]) {
      groupMap.set(group.metadata.annotations[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION], group);
    }
  }
  const parentGroups = /* @__PURE__ */ new Map();
  groupMember.forEach((members, groupId) => members.forEach((m) => ensureItem(parentGroups, m, groupId)));
  if (rootGroup) {
    const tenantId = rootGroup.metadata.annotations[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION];
    groups.forEach((group) => {
      const groupId = group.metadata.annotations[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION];
      if (!groupId) {
        return;
      }
      if (retrieveItems(parentGroups, groupId).size === 0) {
        ensureItem(parentGroups, groupId, tenantId);
        ensureItem(groupMember, tenantId, groupId);
      }
    });
  }
  groups.forEach((group) => {
    var _a;
    const id = (_a = group.metadata.annotations[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]) != null ? _a : group.metadata.annotations[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION];
    retrieveItems(groupMember, id).forEach((m) => {
      const childGroup = groupMap.get(m);
      if (childGroup) {
        group.spec.children.push(catalogModel.stringifyEntityRef(childGroup));
      }
    });
    retrieveItems(parentGroups, id).forEach((p) => {
      const parentGroup = groupMap.get(p);
      if (parentGroup) {
        group.spec.parent = catalogModel.stringifyEntityRef(parentGroup);
      }
    });
  });
  buildOrgHierarchy(groups);
  users.forEach((user) => {
    const id = user.metadata.annotations[MICROSOFT_GRAPH_USER_ID_ANNOTATION];
    retrieveItems(groupMemberOf, id).forEach((p) => {
      const parentGroup = groupMap.get(p);
      if (parentGroup) {
        if (!user.spec.memberOf) {
          user.spec.memberOf = [];
        }
        user.spec.memberOf.push(catalogModel.stringifyEntityRef(parentGroup));
      }
    });
  });
  buildMemberOf(groups, users);
}
async function readMicrosoftGraphOrg(client, tenantId, options) {
  const users = [];
  if (options.userGroupMemberFilter || options.userGroupMemberSearch) {
    const { users: usersInGroups } = await readMicrosoftGraphUsersInGroups(client, {
      queryMode: options.queryMode,
      userGroupMemberFilter: options.userGroupMemberFilter,
      userGroupMemberSearch: options.userGroupMemberSearch,
      transformer: options.userTransformer,
      logger: options.logger
    });
    users.push(...usersInGroups);
  } else {
    const { users: usersWithFilter } = await readMicrosoftGraphUsers(client, {
      queryMode: options.queryMode,
      userFilter: options.userFilter,
      userExpand: options.userExpand,
      transformer: options.userTransformer,
      logger: options.logger
    });
    users.push(...usersWithFilter);
  }
  const { groups, rootGroup, groupMember, groupMemberOf } = await readMicrosoftGraphGroups(client, tenantId, {
    queryMode: options.queryMode,
    groupSearch: options.groupSearch,
    groupFilter: options.groupFilter,
    groupSelect: options.groupSelect,
    groupTransformer: options.groupTransformer,
    organizationTransformer: options.organizationTransformer
  });
  resolveRelations(rootGroup, groups, users, groupMember, groupMemberOf);
  users.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  groups.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  return { users, groups };
}
function ensureItem(target, key, value) {
  let set = target.get(key);
  if (!set) {
    set = /* @__PURE__ */ new Set();
    target.set(key, set);
  }
  set.add(value);
}
function retrieveItems(target, key) {
  var _a;
  return (_a = target.get(key)) != null ? _a : /* @__PURE__ */ new Set();
}

class MicrosoftGraphOrgEntityProvider {
  constructor(options) {
    this.options = options;
  }
  static fromConfig(configRoot, options) {
    const config = configRoot.getOptionalConfig("catalog.processors.microsoftGraphOrg");
    const providers = config ? readMicrosoftGraphConfig(config) : [];
    const provider = providers.find((p) => options.target.startsWith(p.target));
    if (!provider) {
      throw new Error(`There is no Microsoft Graph Org provider that matches "${options.target}". Please add a configuration entry for it under "catalog.processors.microsoftGraphOrg.providers".`);
    }
    const logger = options.logger.child({
      target: options.target
    });
    const result = new MicrosoftGraphOrgEntityProvider({
      id: options.id,
      userTransformer: options.userTransformer,
      groupTransformer: options.groupTransformer,
      organizationTransformer: options.organizationTransformer,
      logger,
      provider
    });
    result.schedule(options.schedule);
    return result;
  }
  getProviderName() {
    return `MicrosoftGraphOrgEntityProvider:${this.options.id}`;
  }
  async connect(connection) {
    var _a;
    this.connection = connection;
    await ((_a = this.scheduleFn) == null ? void 0 : _a.call(this));
  }
  async read(options) {
    var _a;
    if (!this.connection) {
      throw new Error("Not initialized");
    }
    const logger = (_a = options == null ? void 0 : options.logger) != null ? _a : this.options.logger;
    const provider = this.options.provider;
    const { markReadComplete } = trackProgress(logger);
    const client = MicrosoftGraphClient.create(this.options.provider);
    const { users, groups } = await readMicrosoftGraphOrg(client, provider.tenantId, {
      userFilter: provider.userFilter,
      userGroupMemberFilter: provider.userGroupMemberFilter,
      userGroupMemberSearch: provider.userGroupMemberSearch,
      groupFilter: provider.groupFilter,
      groupSearch: provider.groupSearch,
      groupSelect: provider.groupSelect,
      queryMode: provider.queryMode,
      groupTransformer: this.options.groupTransformer,
      userTransformer: this.options.userTransformer,
      organizationTransformer: this.options.organizationTransformer,
      logger
    });
    const { markCommitComplete } = markReadComplete({ users, groups });
    await this.connection.applyMutation({
      type: "full",
      entities: [...users, ...groups].map((entity) => ({
        locationKey: `msgraph-org-provider:${this.options.id}`,
        entity: withLocations(this.options.id, entity)
      }))
    });
    markCommitComplete();
  }
  schedule(schedule) {
    if (schedule === "manual") {
      return;
    }
    this.scheduleFn = async () => {
      const id = `${this.getProviderName()}:refresh`;
      await schedule.run({
        id,
        fn: async () => {
          const logger = this.options.logger.child({
            class: MicrosoftGraphOrgEntityProvider.prototype.constructor.name,
            taskId: id,
            taskInstanceId: uuid__namespace.v4()
          });
          try {
            await this.read({ logger });
          } catch (error) {
            logger.error(error);
          }
        }
      });
    };
  }
}
function trackProgress(logger) {
  let timestamp = Date.now();
  let summary;
  logger.info("Reading msgraph users and groups");
  function markReadComplete(read) {
    summary = `${read.users.length} msgraph users and ${read.groups.length} msgraph groups`;
    const readDuration = ((Date.now() - timestamp) / 1e3).toFixed(1);
    timestamp = Date.now();
    logger.info(`Read ${summary} in ${readDuration} seconds. Committing...`);
    return { markCommitComplete };
  }
  function markCommitComplete() {
    const commitDuration = ((Date.now() - timestamp) / 1e3).toFixed(1);
    logger.info(`Committed ${summary} in ${commitDuration} seconds.`);
  }
  return { markReadComplete };
}
function withLocations(providerId, entity) {
  var _a, _b, _c;
  const uid = ((_a = entity.metadata.annotations) == null ? void 0 : _a[MICROSOFT_GRAPH_USER_ID_ANNOTATION]) || ((_b = entity.metadata.annotations) == null ? void 0 : _b[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]) || ((_c = entity.metadata.annotations) == null ? void 0 : _c[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]) || entity.metadata.name;
  const location = `msgraph:${providerId}/${encodeURIComponent(uid)}`;
  return lodash.merge({
    metadata: {
      annotations: {
        [catalogModel.ANNOTATION_LOCATION]: location,
        [catalogModel.ANNOTATION_ORIGIN_LOCATION]: location
      }
    }
  }, entity);
}

class MicrosoftGraphOrgReaderProcessor {
  static fromConfig(config, options) {
    const c = config.getOptionalConfig("catalog.processors.microsoftGraphOrg");
    return new MicrosoftGraphOrgReaderProcessor({
      ...options,
      providers: c ? readMicrosoftGraphConfig(c) : []
    });
  }
  constructor(options) {
    this.providers = options.providers;
    this.logger = options.logger;
    this.userTransformer = options.userTransformer;
    this.groupTransformer = options.groupTransformer;
    this.organizationTransformer = options.organizationTransformer;
  }
  getProcessorName() {
    return "MicrosoftGraphOrgReaderProcessor";
  }
  async readLocation(location, _optional, emit) {
    if (location.type !== "microsoft-graph-org") {
      return false;
    }
    const provider = this.providers.find((p) => location.target.startsWith(p.target));
    if (!provider) {
      throw new Error(`There is no Microsoft Graph Org provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.microsoftGraphOrg.providers.`);
    }
    const startTimestamp = Date.now();
    this.logger.info("Reading Microsoft Graph users and groups");
    const client = MicrosoftGraphClient.create(provider);
    const { users, groups } = await readMicrosoftGraphOrg(client, provider.tenantId, {
      userExpand: provider.userExpand,
      userFilter: provider.userFilter,
      userGroupMemberFilter: provider.userGroupMemberFilter,
      userGroupMemberSearch: provider.userGroupMemberSearch,
      groupExpand: provider.groupExpand,
      groupFilter: provider.groupFilter,
      groupSearch: provider.groupSearch,
      groupSelect: provider.groupSelect,
      queryMode: provider.queryMode,
      userTransformer: this.userTransformer,
      groupTransformer: this.groupTransformer,
      organizationTransformer: this.organizationTransformer,
      logger: this.logger
    });
    const duration = ((Date.now() - startTimestamp) / 1e3).toFixed(1);
    this.logger.debug(`Read ${users.length} users and ${groups.length} groups from Microsoft Graph in ${duration} seconds`);
    for (const group of groups) {
      emit(pluginCatalogBackend.processingResult.entity(location, group));
    }
    for (const user of users) {
      emit(pluginCatalogBackend.processingResult.entity(location, user));
    }
    return true;
  }
}

exports.MICROSOFT_EMAIL_ANNOTATION = MICROSOFT_EMAIL_ANNOTATION;
exports.MICROSOFT_GRAPH_GROUP_ID_ANNOTATION = MICROSOFT_GRAPH_GROUP_ID_ANNOTATION;
exports.MICROSOFT_GRAPH_TENANT_ID_ANNOTATION = MICROSOFT_GRAPH_TENANT_ID_ANNOTATION;
exports.MICROSOFT_GRAPH_USER_ID_ANNOTATION = MICROSOFT_GRAPH_USER_ID_ANNOTATION;
exports.MicrosoftGraphClient = MicrosoftGraphClient;
exports.MicrosoftGraphOrgEntityProvider = MicrosoftGraphOrgEntityProvider;
exports.MicrosoftGraphOrgReaderProcessor = MicrosoftGraphOrgReaderProcessor;
exports.defaultGroupTransformer = defaultGroupTransformer;
exports.defaultOrganizationTransformer = defaultOrganizationTransformer;
exports.defaultUserTransformer = defaultUserTransformer;
exports.normalizeEntityName = normalizeEntityName;
exports.readMicrosoftGraphConfig = readMicrosoftGraphConfig;
exports.readMicrosoftGraphOrg = readMicrosoftGraphOrg;
//# sourceMappingURL=index.cjs.js.map
