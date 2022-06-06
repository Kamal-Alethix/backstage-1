'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');
var AWS = require('aws-sdk');
var errors = require('@backstage/errors');
var limiterFactory = require('p-limit');
var integration = require('@backstage/integration');
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

var AWS__default = /*#__PURE__*/_interopDefaultLegacy(AWS);
var limiterFactory__default = /*#__PURE__*/_interopDefaultLegacy(limiterFactory);
var uuid__namespace = /*#__PURE__*/_interopNamespace(uuid);

function readAwsOrganizationConfig(config) {
  const providerConfig = config.getOptionalConfig("provider");
  const roleArn = providerConfig == null ? void 0 : providerConfig.getOptionalString("roleArn");
  return {
    roleArn
  };
}

const AWS_ORGANIZATION_REGION = "us-east-1";
const LOCATION_TYPE = "aws-cloud-accounts";
const ACCOUNTID_ANNOTATION = "amazonaws.com/account-id";
const ARN_ANNOTATION = "amazonaws.com/arn";
const ORGANIZATION_ANNOTATION = "amazonaws.com/organization-id";
class AwsOrganizationCloudAccountProcessor {
  static fromConfig(config, options) {
    const c = config.getOptionalConfig("catalog.processors.awsOrganization");
    return new AwsOrganizationCloudAccountProcessor({
      ...options,
      provider: c ? readAwsOrganizationConfig(c) : {}
    });
  }
  static buildCredentials(config) {
    const roleArn = config.roleArn;
    if (!roleArn) {
      return void 0;
    }
    return new AWS__default["default"].ChainableTemporaryCredentials({
      params: {
        RoleSessionName: "backstage-aws-organization-processor",
        RoleArn: roleArn
      }
    });
  }
  constructor(options) {
    this.provider = options.provider;
    const credentials = AwsOrganizationCloudAccountProcessor.buildCredentials(this.provider);
    this.organizations = new AWS__default["default"].Organizations({
      credentials,
      region: AWS_ORGANIZATION_REGION
    });
  }
  getProcessorName() {
    return "AwsOrganizationCloudAccountProcessor";
  }
  async readLocation(location, _optional, emit) {
    if (location.type !== LOCATION_TYPE) {
      return false;
    }
    (await this.getAwsAccounts()).map((account) => this.mapAccountToComponent(account)).filter((entity) => {
      if (location.target !== "") {
        if (entity.metadata.annotations) {
          return entity.metadata.annotations[ORGANIZATION_ANNOTATION] === location.target;
        }
        return false;
      }
      return true;
    }).forEach((entity) => {
      emit(pluginCatalogBackend.processingResult.entity(location, entity));
    });
    return true;
  }
  normalizeName(name) {
    return name.trim().toLocaleLowerCase("en-US").replace(/[^a-zA-Z0-9\-]/g, "-");
  }
  extractInformationFromArn(arn) {
    const parts = arn.split("/");
    return {
      accountId: parts[parts.length - 1],
      organizationId: parts[parts.length - 2]
    };
  }
  async getAwsAccounts() {
    let awsAccounts = [];
    let isInitialAttempt = true;
    let nextToken = void 0;
    while (isInitialAttempt || nextToken) {
      isInitialAttempt = false;
      const orgAccounts = await this.organizations.listAccounts({ NextToken: nextToken }).promise();
      if (orgAccounts.Accounts) {
        awsAccounts = awsAccounts.concat(orgAccounts.Accounts);
      }
      nextToken = orgAccounts.NextToken;
    }
    return awsAccounts;
  }
  mapAccountToComponent(account) {
    const { accountId, organizationId } = this.extractInformationFromArn(account.Arn);
    return {
      apiVersion: "backstage.io/v1alpha1",
      kind: "Resource",
      metadata: {
        annotations: {
          [ACCOUNTID_ANNOTATION]: accountId,
          [ARN_ANNOTATION]: account.Arn || "",
          [ORGANIZATION_ANNOTATION]: organizationId
        },
        name: this.normalizeName(account.Name || ""),
        namespace: "default"
      },
      spec: {
        type: "cloud-account",
        owner: "unknown"
      }
    };
  }
}

class AwsS3DiscoveryProcessor {
  constructor(reader) {
    this.reader = reader;
  }
  getProcessorName() {
    return "AwsS3DiscoveryProcessor";
  }
  async readLocation(location, optional, emit, parser) {
    if (location.type !== "s3-discovery") {
      return false;
    }
    try {
      const output = await this.doRead(location.target);
      for (const item of output) {
        for await (const parseResult of parser({
          data: item.data,
          location: { type: location.type, target: item.url }
        })) {
          emit(parseResult);
        }
      }
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;
      if (errors.isError(error) && error.name === "NotFoundError") {
        if (!optional) {
          emit(pluginCatalogBackend.processingResult.notFoundError(location, message));
        }
      } else {
        emit(pluginCatalogBackend.processingResult.generalError(location, message));
      }
    }
    return true;
  }
  async doRead(location) {
    const limiter = limiterFactory__default["default"](5);
    const response = await this.reader.readTree(location);
    const responseFiles = await response.files();
    const output = responseFiles.map(async (file) => ({
      url: file.path,
      data: await limiter(file.content)
    }));
    return Promise.all(output);
  }
}

class AwsCredentials {
  static create(config, roleSessionName) {
    if (!config) {
      return void 0;
    }
    const accessKeyId = config.accessKeyId;
    const secretAccessKey = config.secretAccessKey;
    let explicitCredentials;
    if (accessKeyId && secretAccessKey) {
      explicitCredentials = new AWS.Credentials({
        accessKeyId,
        secretAccessKey
      });
    }
    const roleArn = config.roleArn;
    if (roleArn) {
      return new AWS__default["default"].ChainableTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleArn: roleArn,
          RoleSessionName: roleSessionName
        }
      });
    }
    return explicitCredentials;
  }
}

const DEFAULT_PROVIDER_ID = "default";
function readAwsS3Configs(config) {
  const configs = [];
  const providerConfigs = config.getOptionalConfig("catalog.providers.awsS3");
  if (!providerConfigs) {
    return configs;
  }
  if (providerConfigs.has("bucketName")) {
    configs.push(readAwsS3Config(DEFAULT_PROVIDER_ID, providerConfigs));
    return configs;
  }
  for (const id of providerConfigs.keys()) {
    configs.push(readAwsS3Config(id, providerConfigs.getConfig(id)));
  }
  return configs;
}
function readAwsS3Config(id, config) {
  const bucketName = config.getString("bucketName");
  const region = config.getOptionalString("region");
  const prefix = config.getOptionalString("prefix");
  return {
    id,
    bucketName,
    region,
    prefix
  };
}

class AwsS3EntityProvider {
  constructor(config, integration, logger, schedule) {
    this.config = config;
    this.logger = logger.child({
      target: this.getProviderName()
    });
    this.s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      credentials: AwsCredentials.create(integration.config, "backstage-aws-s3-provider"),
      endpoint: integration.config.endpoint,
      region: this.config.region,
      s3ForcePathStyle: integration.config.s3ForcePathStyle
    });
    this.scheduleFn = this.createScheduleFn(schedule);
  }
  static fromConfig(configRoot, options) {
    const providerConfigs = readAwsS3Configs(configRoot);
    const integration$1 = integration.ScmIntegrations.fromConfig(configRoot).awsS3.list()[0];
    if (!integration$1) {
      throw new Error("No integration found for awsS3");
    }
    return providerConfigs.map((providerConfig) => new AwsS3EntityProvider(providerConfig, integration$1, options.logger, options.schedule));
  }
  createScheduleFn(schedule) {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: AwsS3EntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid__namespace.v4()
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(error);
          }
        }
      });
    };
  }
  getProviderName() {
    return `awsS3-provider:${this.config.id}`;
  }
  async connect(connection) {
    this.connection = connection;
    await this.scheduleFn();
  }
  async refresh(logger) {
    if (!this.connection) {
      throw new Error("Not initialized");
    }
    logger.info("Discovering AWS S3 objects");
    const keys = await this.listAllObjectKeys();
    logger.info(`Discovered ${keys.length} AWS S3 objects`);
    const locations = keys.map((key) => this.createLocationSpec(key));
    await this.connection.applyMutation({
      type: "full",
      entities: locations.map((location) => {
        return {
          locationKey: this.getProviderName(),
          entity: pluginCatalogBackend.locationSpecToLocationEntity({ location })
        };
      })
    });
    logger.info(`Committed ${locations.length} Locations for AWS S3 objects`);
  }
  async listAllObjectKeys() {
    const keys = [];
    let continuationToken = void 0;
    let output;
    do {
      const request = this.s3.listObjectsV2({
        Bucket: this.config.bucketName,
        ContinuationToken: continuationToken,
        Prefix: this.config.prefix
      });
      output = await request.promise();
      if (output.Contents) {
        output.Contents.forEach((item) => {
          if (item.Key && !item.Key.endsWith("/")) {
            keys.push(item.Key);
          }
        });
      }
      continuationToken = output.NextContinuationToken;
    } while (continuationToken);
    return keys;
  }
  createLocationSpec(key) {
    return {
      type: "url",
      target: this.createObjectUrl(key),
      presence: "required"
    };
  }
  createObjectUrl(key) {
    const bucketName = this.config.bucketName;
    const endpoint = this.s3.endpoint.href;
    return encodeURI(`${endpoint}${bucketName}/${key}`);
  }
}

exports.AwsOrganizationCloudAccountProcessor = AwsOrganizationCloudAccountProcessor;
exports.AwsS3DiscoveryProcessor = AwsS3DiscoveryProcessor;
exports.AwsS3EntityProvider = AwsS3EntityProvider;
//# sourceMappingURL=index.cjs.js.map
