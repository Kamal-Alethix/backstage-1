'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var Router = require('express-promise-router');
var luxon = require('luxon');
var errors = require('@backstage/errors');
var container = require('@google-cloud/container');
var clientNode = require('@kubernetes/client-node');
var AWS = require('aws-sdk');
var aws4 = require('aws4');
var identity = require('@azure/identity');
var lodash = require('lodash');

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

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var container__namespace = /*#__PURE__*/_interopNamespace(container);
var AWS__default = /*#__PURE__*/_interopDefaultLegacy(AWS);
var lodash__default = /*#__PURE__*/_interopDefaultLegacy(lodash);

class ConfigClusterLocator {
  constructor(clusterDetails) {
    this.clusterDetails = clusterDetails;
  }
  static fromConfig(config) {
    return new ConfigClusterLocator(config.getConfigArray("clusters").map((c) => {
      var _a, _b;
      const authProvider = c.getString("authProvider");
      const clusterDetails = {
        name: c.getString("name"),
        url: c.getString("url"),
        serviceAccountToken: c.getOptionalString("serviceAccountToken"),
        skipTLSVerify: (_a = c.getOptionalBoolean("skipTLSVerify")) != null ? _a : false,
        skipMetricsLookup: (_b = c.getOptionalBoolean("skipMetricsLookup")) != null ? _b : false,
        caData: c.getOptionalString("caData"),
        authProvider
      };
      const dashboardUrl = c.getOptionalString("dashboardUrl");
      if (dashboardUrl) {
        clusterDetails.dashboardUrl = dashboardUrl;
      }
      const dashboardApp = c.getOptionalString("dashboardApp");
      if (dashboardApp) {
        clusterDetails.dashboardApp = dashboardApp;
      }
      if (c.has("dashboardParameters")) {
        clusterDetails.dashboardParameters = c.get("dashboardParameters");
      }
      switch (authProvider) {
        case "google": {
          return clusterDetails;
        }
        case "aws": {
          const assumeRole = c.getOptionalString("assumeRole");
          const externalId = c.getOptionalString("externalId");
          return { assumeRole, externalId, ...clusterDetails };
        }
        case "azure": {
          return clusterDetails;
        }
        case "oidc": {
          const oidcTokenProvider = c.getString("oidcTokenProvider");
          return { oidcTokenProvider, ...clusterDetails };
        }
        case "serviceAccount": {
          return clusterDetails;
        }
        case "googleServiceAccount": {
          return clusterDetails;
        }
        default: {
          throw new Error(`authProvider "${authProvider}" has no config associated with it`);
        }
      }
    }));
  }
  async getClusters() {
    return this.clusterDetails;
  }
}

function runPeriodically(fn, delayMs) {
  let cancel;
  let cancelled = false;
  const cancellationPromise = new Promise((resolve) => {
    cancel = () => {
      resolve();
      cancelled = true;
    };
  });
  const startRefresh = async () => {
    while (!cancelled) {
      try {
        await fn();
      } catch {
      }
      await Promise.race([
        new Promise((resolve) => setTimeout(resolve, delayMs)),
        cancellationPromise
      ]);
    }
  };
  startRefresh();
  return cancel;
}

class GkeClusterLocator {
  constructor(options, client, clusterDetails = void 0, hasClusterDetails = false) {
    this.options = options;
    this.client = client;
    this.clusterDetails = clusterDetails;
    this.hasClusterDetails = hasClusterDetails;
  }
  static fromConfigWithClient(config, client, refreshInterval) {
    var _a, _b, _c, _d, _e, _f;
    const matchingResourceLabels = (_b = (_a = config.getOptionalConfigArray("matchingResourceLabels")) == null ? void 0 : _a.map((mrl) => {
      return { key: mrl.getString("key"), value: mrl.getString("value") };
    })) != null ? _b : [];
    const options = {
      projectId: config.getString("projectId"),
      region: (_c = config.getOptionalString("region")) != null ? _c : "-",
      skipTLSVerify: (_d = config.getOptionalBoolean("skipTLSVerify")) != null ? _d : false,
      skipMetricsLookup: (_e = config.getOptionalBoolean("skipMetricsLookup")) != null ? _e : false,
      exposeDashboard: (_f = config.getOptionalBoolean("exposeDashboard")) != null ? _f : false,
      matchingResourceLabels
    };
    const gkeClusterLocator = new GkeClusterLocator(options, client);
    if (refreshInterval) {
      runPeriodically(() => gkeClusterLocator.refreshClusters(), refreshInterval.toMillis());
    }
    return gkeClusterLocator;
  }
  static fromConfig(config, refreshInterval = void 0) {
    return GkeClusterLocator.fromConfigWithClient(config, new container__namespace.v1.ClusterManagerClient(), refreshInterval);
  }
  async getClusters() {
    var _a;
    if (!this.hasClusterDetails) {
      await this.refreshClusters();
    }
    return (_a = this.clusterDetails) != null ? _a : [];
  }
  async refreshClusters() {
    var _a;
    const {
      projectId,
      region,
      skipTLSVerify,
      skipMetricsLookup,
      exposeDashboard,
      matchingResourceLabels
    } = this.options;
    const request = {
      parent: `projects/${projectId}/locations/${region}`
    };
    try {
      const [response] = await this.client.listClusters(request);
      this.clusterDetails = ((_a = response.clusters) != null ? _a : []).filter((r) => {
        return matchingResourceLabels == null ? void 0 : matchingResourceLabels.every((mrl) => {
          if (!r.resourceLabels) {
            return false;
          }
          return r.resourceLabels[mrl.key] === mrl.value;
        });
      }).map((r) => {
        var _a2, _b;
        return {
          name: (_a2 = r.name) != null ? _a2 : "unknown",
          url: `https://${(_b = r.endpoint) != null ? _b : ""}`,
          authProvider: "google",
          skipTLSVerify,
          skipMetricsLookup,
          ...exposeDashboard ? {
            dashboardApp: "gke",
            dashboardParameters: {
              projectId,
              region,
              clusterName: r.name
            }
          } : {}
        };
      });
      this.hasClusterDetails = true;
    } catch (e) {
      throw new errors.ForwardedError(`There was an error retrieving clusters from GKE for projectId=${projectId} region=${region}`, e);
    }
  }
}

class CombinedClustersSupplier {
  constructor(clusterSuppliers) {
    this.clusterSuppliers = clusterSuppliers;
  }
  async getClusters() {
    return await Promise.all(this.clusterSuppliers.map((supplier) => supplier.getClusters())).then((res) => {
      return res.flat();
    }).catch((e) => {
      throw e;
    });
  }
}
const getCombinedClusterSupplier = (rootConfig, refreshInterval = void 0) => {
  const clusterSuppliers = rootConfig.getConfigArray("kubernetes.clusterLocatorMethods").map((clusterLocatorMethod) => {
    const type = clusterLocatorMethod.getString("type");
    switch (type) {
      case "config":
        return ConfigClusterLocator.fromConfig(clusterLocatorMethod);
      case "gke":
        return GkeClusterLocator.fromConfig(clusterLocatorMethod, refreshInterval);
      default:
        throw new Error(`Unsupported kubernetes.clusterLocatorMethods: "${type}"`);
    }
  });
  return new CombinedClustersSupplier(clusterSuppliers);
};

class MultiTenantServiceLocator {
  constructor(clusterSupplier) {
    this.clusterSupplier = clusterSupplier;
  }
  async getClustersByServiceId(_serviceId) {
    return this.clusterSupplier.getClusters();
  }
}

class KubernetesClientProvider {
  getKubeConfig(clusterDetails) {
    const cluster = {
      name: clusterDetails.name,
      server: clusterDetails.url,
      skipTLSVerify: clusterDetails.skipTLSVerify,
      caData: clusterDetails.caData
    };
    const user = {
      name: "backstage",
      token: clusterDetails.serviceAccountToken
    };
    const context = {
      name: `${clusterDetails.name}`,
      user: user.name,
      cluster: cluster.name
    };
    const kc = new clientNode.KubeConfig();
    if (clusterDetails.serviceAccountToken) {
      kc.loadFromOptions({
        clusters: [cluster],
        users: [user],
        contexts: [context],
        currentContext: context.name
      });
    } else {
      kc.loadFromDefault();
    }
    return kc;
  }
  getCoreClientByClusterDetails(clusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);
    return kc.makeApiClient(clientNode.CoreV1Api);
  }
  getMetricsClient(clusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);
    return new clientNode.Metrics(kc);
  }
  getCustomObjectsClient(clusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);
    return kc.makeApiClient(clientNode.CustomObjectsApi);
  }
}

class GoogleKubernetesAuthTranslator {
  async decorateClusterDetailsWithAuth(clusterDetails, requestBody) {
    var _a;
    const clusterDetailsWithAuthToken = Object.assign({}, clusterDetails);
    const authToken = (_a = requestBody.auth) == null ? void 0 : _a.google;
    if (authToken) {
      clusterDetailsWithAuthToken.serviceAccountToken = authToken;
    } else {
      throw new Error("Google token not found under auth.google in request body");
    }
    return clusterDetailsWithAuthToken;
  }
}

class ServiceAccountKubernetesAuthTranslator {
  async decorateClusterDetailsWithAuth(clusterDetails, _requestBody) {
    return clusterDetails;
  }
}

class AwsIamKubernetesAuthTranslator {
  constructor() {
    this.awsGetCredentials = async () => {
      return new Promise((resolve, reject) => {
        AWS__default["default"].config.getCredentials((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(AWS__default["default"].config.credentials);
        });
      });
    };
  }
  validCredentials(creds) {
    return (creds == null ? void 0 : creds.accessKeyId) && (creds == null ? void 0 : creds.secretAccessKey);
  }
  async getCredentials(assumeRole, externalId) {
    return new Promise(async (resolve, reject) => {
      const awsCreds = await this.awsGetCredentials();
      if (!(awsCreds instanceof AWS.Credentials))
        return reject(Error("No AWS credentials found."));
      let creds = {
        accessKeyId: awsCreds.accessKeyId,
        secretAccessKey: awsCreds.secretAccessKey,
        sessionToken: awsCreds.sessionToken
      };
      if (!this.validCredentials(creds))
        return reject(Error("Invalid AWS credentials found."));
      if (!assumeRole)
        return resolve(creds);
      try {
        const params = {
          RoleArn: assumeRole,
          RoleSessionName: "backstage-login"
        };
        if (externalId)
          params.ExternalId = externalId;
        const assumedRole = await new AWS__default["default"].STS().assumeRole(params).promise();
        if (!assumedRole.Credentials) {
          throw new Error(`No credentials returned for role ${assumeRole}`);
        }
        creds = {
          accessKeyId: assumedRole.Credentials.AccessKeyId,
          secretAccessKey: assumedRole.Credentials.SecretAccessKey,
          sessionToken: assumedRole.Credentials.SessionToken
        };
      } catch (e) {
        console.warn(`There was an error assuming the role: ${e}`);
        return reject(Error(`Unable to assume role: ${e}`));
      }
      return resolve(creds);
    });
  }
  async getBearerToken(clusterName, assumeRole, externalId) {
    const credentials = await this.getCredentials(assumeRole, externalId);
    const request = {
      host: `sts.amazonaws.com`,
      path: `/?Action=GetCallerIdentity&Version=2011-06-15&X-Amz-Expires=60`,
      headers: {
        "x-k8s-aws-id": clusterName
      },
      signQuery: true
    };
    const signed = aws4.sign(request, credentials);
    const url = `https://${signed.host}${signed.path}`;
    const base64Url = Buffer.from(url, "binary").toString("base64");
    const urlSafeBase64Url = base64Url.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `k8s-aws-v1.${urlSafeBase64Url}`;
  }
  async decorateClusterDetailsWithAuth(clusterDetails) {
    const clusterDetailsWithAuthToken = Object.assign({}, clusterDetails);
    clusterDetailsWithAuthToken.serviceAccountToken = await this.getBearerToken(clusterDetails.name, clusterDetails.assumeRole, clusterDetails.externalId);
    return clusterDetailsWithAuthToken;
  }
}

class GoogleServiceAccountAuthTranslator {
  async decorateClusterDetailsWithAuth(clusterDetails) {
    const clusterDetailsWithAuthToken = Object.assign({}, clusterDetails);
    const client = new container__namespace.v1.ClusterManagerClient();
    const accessToken = await client.auth.getAccessToken();
    if (accessToken) {
      clusterDetailsWithAuthToken.serviceAccountToken = accessToken;
    } else {
      throw new Error("Unable to obtain access token for the current Google Application Default Credentials");
    }
    return clusterDetailsWithAuthToken;
  }
}

const aksScope = "6dae42f8-4368-4678-94ff-3960e28e3630/.default";
class AzureIdentityKubernetesAuthTranslator {
  constructor(logger, tokenCredential = new identity.DefaultAzureCredential()) {
    this.logger = logger;
    this.tokenCredential = tokenCredential;
    this.accessToken = { token: "", expiresOnTimestamp: 0 };
  }
  async decorateClusterDetailsWithAuth(clusterDetails) {
    const clusterDetailsWithAuthToken = Object.assign({}, clusterDetails);
    clusterDetailsWithAuthToken.serviceAccountToken = await this.getToken();
    return clusterDetailsWithAuthToken;
  }
  async getToken() {
    if (!this.tokenRequiresRefresh()) {
      return this.accessToken.token;
    }
    if (!this.newTokenPromise) {
      this.newTokenPromise = this.fetchNewToken();
    }
    return this.newTokenPromise;
  }
  async fetchNewToken() {
    try {
      this.logger.info("Fetching new Azure token for AKS");
      const newAccessToken = await this.tokenCredential.getToken(aksScope, {
        requestOptions: { timeout: 1e4 }
      });
      if (!newAccessToken) {
        throw new Error("AccessToken is null");
      }
      this.accessToken = newAccessToken;
    } catch (err) {
      this.logger.error("Unable to fetch Azure token", err);
      if (this.tokenExpired()) {
        throw err;
      }
    }
    this.newTokenPromise = void 0;
    return this.accessToken.token;
  }
  tokenRequiresRefresh() {
    const expiresOn = this.accessToken.expiresOnTimestamp - 15 * 60 * 1e3;
    return Date.now() >= expiresOn;
  }
  tokenExpired() {
    return Date.now() >= this.accessToken.expiresOnTimestamp;
  }
}

class OidcKubernetesAuthTranslator {
  async decorateClusterDetailsWithAuth(clusterDetails, requestBody) {
    var _a, _b;
    const clusterDetailsWithAuthToken = Object.assign({}, clusterDetails);
    const { oidcTokenProvider } = clusterDetails;
    if (!oidcTokenProvider || oidcTokenProvider === "") {
      throw new Error(`oidc authProvider requires a configured oidcTokenProvider`);
    }
    const authToken = (_b = (_a = requestBody.auth) == null ? void 0 : _a.oidc) == null ? void 0 : _b[oidcTokenProvider];
    if (authToken) {
      clusterDetailsWithAuthToken.serviceAccountToken = authToken;
    } else {
      throw new Error(`Auth token not found under oidc.${oidcTokenProvider} in request body`);
    }
    return clusterDetailsWithAuthToken;
  }
}

class KubernetesAuthTranslatorGenerator {
  static getKubernetesAuthTranslatorInstance(authProvider, options) {
    switch (authProvider) {
      case "google": {
        return new GoogleKubernetesAuthTranslator();
      }
      case "aws": {
        return new AwsIamKubernetesAuthTranslator();
      }
      case "azure": {
        return new AzureIdentityKubernetesAuthTranslator(options.logger);
      }
      case "serviceAccount": {
        return new ServiceAccountKubernetesAuthTranslator();
      }
      case "googleServiceAccount": {
        return new GoogleServiceAccountAuthTranslator();
      }
      case "oidc": {
        return new OidcKubernetesAuthTranslator();
      }
      default: {
        throw new Error(`authProvider "${authProvider}" has no KubernetesAuthTranslator associated with it`);
      }
    }
  }
}

const DEFAULT_OBJECTS = [
  {
    group: "",
    apiVersion: "v1",
    plural: "pods",
    objectType: "pods"
  },
  {
    group: "",
    apiVersion: "v1",
    plural: "services",
    objectType: "services"
  },
  {
    group: "",
    apiVersion: "v1",
    plural: "configmaps",
    objectType: "configmaps"
  },
  {
    group: "apps",
    apiVersion: "v1",
    plural: "deployments",
    objectType: "deployments"
  },
  {
    group: "apps",
    apiVersion: "v1",
    plural: "replicasets",
    objectType: "replicasets"
  },
  {
    group: "autoscaling",
    apiVersion: "v1",
    plural: "horizontalpodautoscalers",
    objectType: "horizontalpodautoscalers"
  },
  {
    group: "batch",
    apiVersion: "v1",
    plural: "jobs",
    objectType: "jobs"
  },
  {
    group: "batch",
    apiVersion: "v1",
    plural: "cronjobs",
    objectType: "cronjobs"
  },
  {
    group: "networking.k8s.io",
    apiVersion: "v1",
    plural: "ingresses",
    objectType: "ingresses"
  },
  {
    group: "apps",
    apiVersion: "v1",
    plural: "statefulsets",
    objectType: "statefulsets"
  }
];
const isPodFetchResponse = (fr) => fr.type === "pods";
const isString = (str) => str !== void 0;
const numberOrBigIntToNumberOrString = (value) => {
  return typeof value === "bigint" ? value.toString() : value;
};
const toClientSafeResource = (current) => {
  return {
    currentUsage: numberOrBigIntToNumberOrString(current.CurrentUsage),
    requestTotal: numberOrBigIntToNumberOrString(current.RequestTotal),
    limitTotal: numberOrBigIntToNumberOrString(current.LimitTotal)
  };
};
const toClientSafeContainer = (container) => {
  return {
    container: container.Container,
    cpuUsage: toClientSafeResource(container.CPUUsage),
    memoryUsage: toClientSafeResource(container.MemoryUsage)
  };
};
const toClientSafePodMetrics = (podMetrics) => {
  return podMetrics.flat().map((pd) => {
    return {
      pod: pd.Pod,
      memory: toClientSafeResource(pd.Memory),
      cpu: toClientSafeResource(pd.CPU),
      containers: pd.Containers.map(toClientSafeContainer)
    };
  });
};
class KubernetesFanOutHandler {
  constructor({
    logger,
    fetcher,
    serviceLocator,
    customResources,
    objectTypesToFetch = DEFAULT_OBJECTS
  }) {
    this.logger = logger;
    this.fetcher = fetcher;
    this.serviceLocator = serviceLocator;
    this.customResources = customResources;
    this.objectTypesToFetch = new Set(objectTypesToFetch);
    this.authTranslators = {};
  }
  async getKubernetesObjectsByEntity(requestBody) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const entityName = ((_c = (_b = (_a = requestBody.entity) == null ? void 0 : _a.metadata) == null ? void 0 : _b.annotations) == null ? void 0 : _c["backstage.io/kubernetes-id"]) || ((_e = (_d = requestBody.entity) == null ? void 0 : _d.metadata) == null ? void 0 : _e.name);
    const clusterDetails = await this.serviceLocator.getClustersByServiceId(entityName);
    const promises = clusterDetails.map((cd) => {
      return this.getAuthTranslator(cd.authProvider).decorateClusterDetailsWithAuth(cd, requestBody);
    });
    const clusterDetailsDecoratedForAuth = await Promise.all(promises);
    this.logger.info(`entity.metadata.name=${entityName} clusterDetails=[${clusterDetailsDecoratedForAuth.map((c) => c.name).join(", ")}]`);
    const labelSelector = ((_h = (_g = (_f = requestBody.entity) == null ? void 0 : _f.metadata) == null ? void 0 : _g.annotations) == null ? void 0 : _h["backstage.io/kubernetes-label-selector"]) || `backstage.io/kubernetes-id=${entityName}`;
    const namespace = (_k = (_j = (_i = requestBody.entity) == null ? void 0 : _i.metadata) == null ? void 0 : _j.annotations) == null ? void 0 : _k["backstage.io/kubernetes-namespace"];
    return Promise.all(clusterDetailsDecoratedForAuth.map((clusterDetailsItem) => {
      return this.fetcher.fetchObjectsForService({
        serviceId: entityName,
        clusterDetails: clusterDetailsItem,
        objectTypesToFetch: this.objectTypesToFetch,
        labelSelector,
        customResources: this.customResources,
        namespace
      }).then((result) => this.getMetricsForPods(clusterDetailsItem, result)).then((r) => this.toClusterObjects(clusterDetailsItem, r));
    })).then(this.toObjectsByEntityResponse);
  }
  toObjectsByEntityResponse(clusterObjects) {
    return {
      items: clusterObjects.filter((item) => item.errors !== void 0 && item.errors.length >= 1 || item.resources !== void 0 && item.resources.length >= 1 && item.resources.some((fr) => fr.resources.length >= 1))
    };
  }
  toClusterObjects(clusterDetails, [result, metrics]) {
    const objects = {
      cluster: {
        name: clusterDetails.name
      },
      podMetrics: toClientSafePodMetrics(metrics),
      resources: result.responses,
      errors: result.errors
    };
    if (clusterDetails.dashboardUrl) {
      objects.cluster.dashboardUrl = clusterDetails.dashboardUrl;
    }
    if (clusterDetails.dashboardApp) {
      objects.cluster.dashboardApp = clusterDetails.dashboardApp;
    }
    if (clusterDetails.dashboardParameters) {
      objects.cluster.dashboardParameters = clusterDetails.dashboardParameters;
    }
    return objects;
  }
  async getMetricsForPods(clusterDetails, result) {
    if (clusterDetails.skipMetricsLookup) {
      return [result, []];
    }
    const namespaces = new Set(result.responses.filter(isPodFetchResponse).flatMap((r) => r.resources).map((p) => {
      var _a;
      return (_a = p.metadata) == null ? void 0 : _a.namespace;
    }).filter(isString));
    const podMetrics = Array.from(namespaces).map((ns) => this.fetcher.fetchPodMetricsByNamespace(clusterDetails, ns));
    return Promise.all([result, Promise.all(podMetrics)]);
  }
  getAuthTranslator(provider) {
    if (this.authTranslators[provider]) {
      return this.authTranslators[provider];
    }
    this.authTranslators[provider] = KubernetesAuthTranslatorGenerator.getKubernetesAuthTranslatorInstance(provider, {
      logger: this.logger
    });
    return this.authTranslators[provider];
  }
}

const isError = (fr) => fr.hasOwnProperty("errorType");
function fetchResultsToResponseWrapper(results) {
  var _a, _b;
  const groupBy = lodash__default["default"].groupBy(results, (value) => {
    return isError(value) ? "errors" : "responses";
  });
  return {
    errors: (_a = groupBy.errors) != null ? _a : [],
    responses: (_b = groupBy.responses) != null ? _b : []
  };
}
const statusCodeToErrorType = (statusCode) => {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED_ERROR";
    case 500:
      return "SYSTEM_ERROR";
    default:
      return "UNKNOWN_ERROR";
  }
};
class KubernetesClientBasedFetcher {
  constructor({
    kubernetesClientProvider,
    logger
  }) {
    this.kubernetesClientProvider = kubernetesClientProvider;
    this.logger = logger;
  }
  fetchObjectsForService(params) {
    const fetchResults = Array.from(params.objectTypesToFetch).concat(params.customResources).map((toFetch) => {
      return this.fetchResource(params.clusterDetails, toFetch, params.labelSelector || `backstage.io/kubernetes-id=${params.serviceId}`, toFetch.objectType, params.namespace).catch(this.captureKubernetesErrorsRethrowOthers.bind(this));
    });
    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }
  fetchPodMetricsByNamespace(clusterDetails, namespace) {
    const metricsClient = this.kubernetesClientProvider.getMetricsClient(clusterDetails);
    const coreApi = this.kubernetesClientProvider.getCoreClientByClusterDetails(clusterDetails);
    return clientNode.topPods(coreApi, metricsClient, namespace);
  }
  captureKubernetesErrorsRethrowOthers(e) {
    if (e.response && e.response.statusCode) {
      this.logger.warn(`statusCode=${e.response.statusCode} for resource ${e.response.request.uri.pathname} body=[${JSON.stringify(e.response.body)}]`);
      return {
        errorType: statusCodeToErrorType(e.response.statusCode),
        statusCode: e.response.statusCode,
        resourcePath: e.response.request.uri.pathname
      };
    }
    throw e;
  }
  fetchResource(clusterDetails, resource, labelSelector, objectType, namespace) {
    const customObjects = this.kubernetesClientProvider.getCustomObjectsClient(clusterDetails);
    customObjects.addInterceptor((requestOptions) => {
      requestOptions.uri = requestOptions.uri.replace("/apis//v1/", "/api/v1/");
    });
    if (namespace) {
      return customObjects.listNamespacedCustomObject(resource.group, resource.apiVersion, namespace, resource.plural, "", false, "", "", labelSelector).then((r) => {
        return {
          type: objectType,
          resources: r.body.items
        };
      });
    }
    return customObjects.listClusterCustomObject(resource.group, resource.apiVersion, resource.plural, "", false, "", "", labelSelector).then((r) => {
      return {
        type: objectType,
        resources: r.body.items
      };
    });
  }
}

class KubernetesBuilder {
  constructor(env) {
    this.env = env;
    this.defaultClusterRefreshInterval = luxon.Duration.fromObject({
      minutes: 60
    });
  }
  static createBuilder(env) {
    return new KubernetesBuilder(env);
  }
  async build() {
    var _a, _b, _c, _d;
    const logger = this.env.logger;
    const config = this.env.config;
    logger.info("Initializing Kubernetes backend");
    if (!config.has("kubernetes")) {
      if (process.env.NODE_ENV !== "development") {
        throw new Error("Kubernetes configuration is missing");
      }
      logger.warn("Failed to initialize kubernetes backend: kubernetes config is missing");
      return {
        router: Router__default["default"]()
      };
    }
    const customResources = this.buildCustomResources();
    const fetcher = (_a = this.fetcher) != null ? _a : this.buildFetcher();
    const clusterSupplier = (_b = this.clusterSupplier) != null ? _b : this.buildClusterSupplier(this.defaultClusterRefreshInterval);
    const serviceLocator = (_c = this.serviceLocator) != null ? _c : this.buildServiceLocator(this.getServiceLocatorMethod(), clusterSupplier);
    const objectsProvider = (_d = this.objectsProvider) != null ? _d : this.buildObjectsProvider({
      logger,
      fetcher,
      serviceLocator,
      customResources,
      objectTypesToFetch: this.getObjectTypesToFetch()
    });
    const router = this.buildRouter(objectsProvider, clusterSupplier);
    return {
      clusterSupplier,
      customResources,
      fetcher,
      objectsProvider,
      router,
      serviceLocator
    };
  }
  setClusterSupplier(clusterSupplier) {
    this.clusterSupplier = clusterSupplier;
    return this;
  }
  setDefaultClusterRefreshInterval(refreshInterval) {
    this.defaultClusterRefreshInterval = refreshInterval;
    return this;
  }
  setObjectsProvider(objectsProvider) {
    this.objectsProvider = objectsProvider;
    return this;
  }
  setFetcher(fetcher) {
    this.fetcher = fetcher;
    return this;
  }
  setServiceLocator(serviceLocator) {
    this.serviceLocator = serviceLocator;
    return this;
  }
  buildCustomResources() {
    var _a;
    const customResources = ((_a = this.env.config.getOptionalConfigArray("kubernetes.customResources")) != null ? _a : []).map((c) => ({
      group: c.getString("group"),
      apiVersion: c.getString("apiVersion"),
      plural: c.getString("plural"),
      objectType: "customresources"
    }));
    this.env.logger.info(`action=LoadingCustomResources numOfCustomResources=${customResources.length}`);
    return customResources;
  }
  buildClusterSupplier(refreshInterval) {
    const config = this.env.config;
    return getCombinedClusterSupplier(config, refreshInterval);
  }
  buildObjectsProvider(options) {
    return new KubernetesFanOutHandler(options);
  }
  buildFetcher() {
    return new KubernetesClientBasedFetcher({
      kubernetesClientProvider: new KubernetesClientProvider(),
      logger: this.env.logger
    });
  }
  buildServiceLocator(method, clusterSupplier) {
    switch (method) {
      case "multiTenant":
        return this.buildMultiTenantServiceLocator(clusterSupplier);
      case "http":
        return this.buildHttpServiceLocator(clusterSupplier);
      default:
        throw new Error(`Unsupported kubernetes.clusterLocatorMethod "${method}"`);
    }
  }
  buildMultiTenantServiceLocator(clusterSupplier) {
    return new MultiTenantServiceLocator(clusterSupplier);
  }
  buildHttpServiceLocator(_clusterSupplier) {
    throw new Error("not implemented");
  }
  buildRouter(objectsProvider, clusterSupplier) {
    const logger = this.env.logger;
    const router = Router__default["default"]();
    router.use(express__default["default"].json());
    router.post("/services/:serviceId", async (req, res) => {
      const serviceId = req.params.serviceId;
      const requestBody = req.body;
      try {
        const response = await objectsProvider.getKubernetesObjectsByEntity(requestBody);
        res.json(response);
      } catch (e) {
        logger.error(`action=retrieveObjectsByServiceId service=${serviceId}, error=${e}`);
        res.status(500).json({ error: e.message });
      }
    });
    router.get("/clusters", async (_, res) => {
      const clusterDetails = await this.fetchClusterDetails(clusterSupplier);
      res.json({
        items: clusterDetails.map((cd) => ({
          name: cd.name,
          dashboardUrl: cd.dashboardUrl,
          authProvider: cd.authProvider,
          oidcTokenProvider: cd.oidcTokenProvider
        }))
      });
    });
    return router;
  }
  async fetchClusterDetails(clusterSupplier) {
    const clusterDetails = await clusterSupplier.getClusters();
    this.env.logger.info(`action=loadClusterDetails numOfClustersLoaded=${clusterDetails.length}`);
    return clusterDetails;
  }
  getServiceLocatorMethod() {
    return this.env.config.getString("kubernetes.serviceLocatorMethod.type");
  }
  getObjectTypesToFetch() {
    const objectTypesToFetchStrings = this.env.config.getOptionalStringArray("kubernetes.objectTypes");
    const apiVersionOverrides = this.env.config.getOptionalConfig("kubernetes.apiVersionOverrides");
    let objectTypesToFetch;
    if (objectTypesToFetchStrings) {
      objectTypesToFetch = DEFAULT_OBJECTS.filter((obj) => objectTypesToFetchStrings.includes(obj.objectType));
    }
    if (apiVersionOverrides) {
      objectTypesToFetch = objectTypesToFetch != null ? objectTypesToFetch : DEFAULT_OBJECTS;
      for (const obj of objectTypesToFetch) {
        if (apiVersionOverrides.has(obj.objectType)) {
          obj.apiVersion = apiVersionOverrides.getString(obj.objectType);
        }
      }
    }
    return objectTypesToFetch;
  }
}

async function createRouter(options) {
  const { router } = await KubernetesBuilder.createBuilder(options).setClusterSupplier(options.clusterSupplier).build();
  return router;
}

exports.DEFAULT_OBJECTS = DEFAULT_OBJECTS;
exports.KubernetesBuilder = KubernetesBuilder;
exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
