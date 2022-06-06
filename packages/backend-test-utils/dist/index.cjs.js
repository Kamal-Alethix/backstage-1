'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var config = require('@backstage/config');
var crypto = require('crypto');
var createConnection = require('knex');
var uuid = require('uuid');

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

var createConnection__default = /*#__PURE__*/_interopDefaultLegacy(createConnection);

function isDockerDisabledForTests() {
  return Boolean(process.env.BACKSTAGE_TEST_DISABLE_DOCKER) || !Boolean(process.env.CI);
}

async function waitForMysqlReady(connection) {
  var _a;
  const startTime = Date.now();
  const db = createConnection__default["default"]({ client: "mysql2", connection });
  try {
    for (; ; ) {
      try {
        const result = await db.select(db.raw("version() AS version"));
        if ((_a = result[0]) == null ? void 0 : _a.version) {
          return;
        }
      } catch (e) {
        if (Date.now() - startTime > 3e4) {
          throw new Error(`Timed out waiting for the database to be ready for connections, ${e}`);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } finally {
    db.destroy();
  }
}
async function startMysqlContainer(image) {
  const user = "root";
  const password = uuid.v4();
  const { GenericContainer } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('testcontainers')); });
  const container = await new GenericContainer(image).withExposedPorts(3306).withEnv("MYSQL_ROOT_PASSWORD", password).withTmpFs({ "/var/lib/mysql": "rw" }).start();
  const host = container.getHost();
  const port = container.getMappedPort(3306);
  const stop = async () => {
    await container.stop({ timeout: 1e4 });
  };
  await waitForMysqlReady({ host, port, user, password });
  return { host, port, user, password, stop };
}

async function waitForPostgresReady(connection) {
  var _a;
  const startTime = Date.now();
  const db = createConnection__default["default"]({ client: "pg", connection });
  try {
    for (; ; ) {
      try {
        const result = await db.select(db.raw("version()"));
        if (Array.isArray(result) && ((_a = result[0]) == null ? void 0 : _a.version)) {
          return;
        }
      } catch (e) {
        if (Date.now() - startTime > 3e4) {
          throw new Error(`Timed out waiting for the database to be ready for connections, ${e}`);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } finally {
    db.destroy();
  }
}
async function startPostgresContainer(image) {
  const user = "postgres";
  const password = uuid.v4();
  const { GenericContainer } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('testcontainers')); });
  const container = await new GenericContainer(image).withExposedPorts(5432).withEnv("POSTGRES_PASSWORD", password).withTmpFs({ "/var/lib/postgresql/data": "rw" }).start();
  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const stop = async () => {
    await container.stop({ timeout: 1e4 });
  };
  await waitForPostgresReady({ host, port, user, password });
  return { host, port, user, password, stop };
}

const allDatabases = Object.freeze({
  POSTGRES_13: {
    name: "Postgres 13.x",
    driver: "pg",
    dockerImageName: "postgres:13",
    connectionStringEnvironmentVariableName: "BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING"
  },
  POSTGRES_9: {
    name: "Postgres 9.x",
    driver: "pg",
    dockerImageName: "postgres:9",
    connectionStringEnvironmentVariableName: "BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING"
  },
  MYSQL_8: {
    name: "MySQL 8.x",
    driver: "mysql2",
    dockerImageName: "mysql:8",
    connectionStringEnvironmentVariableName: "BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING"
  },
  SQLITE_3: {
    name: "SQLite 3.x",
    driver: "better-sqlite3"
  }
});

class TestDatabases {
  static create(options) {
    const defaultOptions = {
      ids: Object.keys(allDatabases),
      disableDocker: isDockerDisabledForTests()
    };
    const { ids, disableDocker } = Object.assign({}, defaultOptions, options != null ? options : {});
    const supportedIds = ids.filter((id) => {
      const properties = allDatabases[id];
      if (!properties) {
        return false;
      }
      if (properties.connectionStringEnvironmentVariableName && process.env[properties.connectionStringEnvironmentVariableName]) {
        return true;
      }
      if (!properties.dockerImageName) {
        return true;
      }
      if (disableDocker) {
        return false;
      }
      return true;
    });
    const databases = new TestDatabases(supportedIds);
    if (supportedIds.length > 0) {
      afterAll(async () => {
        await databases.shutdown();
      });
    }
    return databases;
  }
  constructor(supportedIds) {
    this.instanceById = /* @__PURE__ */ new Map();
    this.supportedIds = supportedIds;
  }
  supports(id) {
    return this.supportedIds.includes(id);
  }
  eachSupportedId() {
    return this.supportedIds.map((id) => [id]);
  }
  async init(id) {
    const properties = allDatabases[id];
    if (!properties) {
      const candidates = Object.keys(allDatabases).join(", ");
      throw new Error(`Unknown test database ${id}, possible values are ${candidates}`);
    }
    if (!this.supportedIds.includes(id)) {
      const candidates = this.supportedIds.join(", ");
      throw new Error(`Unsupported test database ${id} for this environment, possible values are ${candidates}`);
    }
    let instance = this.instanceById.get(id);
    if (!instance) {
      instance = await this.initAny(properties);
      this.instanceById.set(id, instance);
    }
    const connection = await instance.databaseManager.forPlugin(`db${crypto.randomBytes(16).toString("hex")}`).getClient();
    instance.connections.push(connection);
    return connection;
  }
  async initAny(properties) {
    if (properties.driver === "pg" || properties.driver === "mysql2") {
      const envVarName = properties.connectionStringEnvironmentVariableName;
      if (envVarName) {
        const connectionString = process.env[envVarName];
        if (connectionString) {
          const databaseManager = backendCommon.DatabaseManager.fromConfig(new config.ConfigReader({
            backend: {
              database: {
                client: properties.driver,
                connection: connectionString
              }
            }
          }));
          return {
            databaseManager,
            connections: []
          };
        }
      }
    }
    switch (properties.driver) {
      case "pg":
        return this.initPostgres(properties);
      case "mysql2":
        return this.initMysql(properties);
      case "better-sqlite3":
      case "sqlite3":
        return this.initSqlite(properties);
      default:
        throw new Error(`Unknown database driver ${properties.driver}`);
    }
  }
  async initPostgres(properties) {
    const { host, port, user, password, stop } = await startPostgresContainer(properties.dockerImageName);
    const databaseManager = backendCommon.DatabaseManager.fromConfig(new config.ConfigReader({
      backend: {
        database: {
          client: "pg",
          connection: { host, port, user, password }
        }
      }
    }));
    return {
      stopContainer: stop,
      databaseManager,
      connections: []
    };
  }
  async initMysql(properties) {
    const { host, port, user, password, stop } = await startMysqlContainer(properties.dockerImageName);
    const databaseManager = backendCommon.DatabaseManager.fromConfig(new config.ConfigReader({
      backend: {
        database: {
          client: "mysql2",
          connection: { host, port, user, password }
        }
      }
    }));
    return {
      stopContainer: stop,
      databaseManager,
      connections: []
    };
  }
  async initSqlite(properties) {
    const databaseManager = backendCommon.DatabaseManager.fromConfig(new config.ConfigReader({
      backend: {
        database: {
          client: properties.driver,
          connection: ":memory:"
        }
      }
    }));
    return {
      databaseManager,
      connections: []
    };
  }
  async shutdown() {
    const instances = [...this.instanceById.values()];
    await Promise.all(instances.map(async ({ stopContainer, connections }) => {
      try {
        await Promise.all(connections.map((c) => c.destroy()));
      } catch {
      }
      try {
        await (stopContainer == null ? void 0 : stopContainer());
      } catch {
      }
    }));
  }
}

function setupRequestMockHandlers(worker) {
  beforeAll(() => worker.listen({ onUnhandledRequest: "error" }));
  afterAll(() => worker.close());
  afterEach(() => worker.resetHandlers());
}

exports.TestDatabases = TestDatabases;
exports.isDockerDisabledForTests = isDockerDisabledForTests;
exports.setupRequestMockHandlers = setupRequestMockHandlers;
//# sourceMappingURL=index.cjs.js.map
