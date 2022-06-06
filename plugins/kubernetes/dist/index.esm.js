import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, googleAuthApiRef, microsoftAuthApiRef, oktaAuthApiRef, oneloginAuthApiRef, createRoutableExtension, useApi } from '@backstage/core-plugin-api';
import * as React from 'react';
import React__default, { Fragment, useState, useEffect, useContext } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Routes, Route } from 'react-router-dom';
import { Typography, Chip, Grid, makeStyles, createStyles, Button, Drawer, IconButton, FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails, Divider, Stepper, Step, StepLabel } from '@material-ui/core';
import { WarningPanel, InfoCard, Table, SubvalueCell, StatusOK, StatusError, StatusAborted, Button as Button$1, CodeSnippet, StructuredMetadataTable, StatusPending, Page, Content, Progress, MissingAnnotationEmptyState } from '@backstage/core-components';
import EmptyStateImage from './assets/emptystate.svg';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Close from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { withStyles } from '@material-ui/core/styles';
import jsYaml from 'js-yaml';
import useInterval from 'react-use/lib/useInterval';
import cronstrue from 'cronstrue';
import lodash from 'lodash';
import PauseIcon from '@material-ui/icons/Pause';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { DateTime } from 'luxon';

class KubernetesBackendClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async handleResponse(response) {
    if (!response.ok) {
      const payload = await response.text();
      let message;
      switch (response.status) {
        case 404:
          message = "Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.";
          break;
        default:
          message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }
    return await response.json();
  }
  async postRequired(path, requestBody) {
    const url = `${await this.discoveryApi.getBaseUrl("kubernetes")}${path}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...idToken && { Authorization: `Bearer ${idToken}` }
      },
      body: JSON.stringify(requestBody)
    });
    return this.handleResponse(response);
  }
  async getObjectsByEntity(requestBody) {
    return await this.postRequired(`/services/${requestBody.entity.metadata.name}`, requestBody);
  }
  async getClusters() {
    const { token: idToken } = await this.identityApi.getCredentials();
    const url = `${await this.discoveryApi.getBaseUrl("kubernetes")}/clusters`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    });
    return (await this.handleResponse(response)).items;
  }
}

const kubernetesApiRef = createApiRef({
  id: "plugin.kubernetes.service"
});

const kubernetesAuthProvidersApiRef = createApiRef({
  id: "plugin.kubernetes-auth-providers.service"
});

class GoogleKubernetesAuthProvider {
  constructor(authProvider) {
    this.authProvider = authProvider;
  }
  async decorateRequestBodyForAuth(requestBody) {
    const googleAuthToken = await this.authProvider.getAccessToken("https://www.googleapis.com/auth/cloud-platform");
    if ("auth" in requestBody) {
      requestBody.auth.google = googleAuthToken;
    } else {
      requestBody.auth = { google: googleAuthToken };
    }
    return requestBody;
  }
}

class ServiceAccountKubernetesAuthProvider {
  async decorateRequestBodyForAuth(requestBody) {
    return requestBody;
  }
}

class AwsKubernetesAuthProvider {
  async decorateRequestBodyForAuth(requestBody) {
    return requestBody;
  }
}

class GoogleServiceAccountAuthProvider {
  async decorateRequestBodyForAuth(requestBody) {
    return requestBody;
  }
}

class AzureKubernetesAuthProvider {
  async decorateRequestBodyForAuth(requestBody) {
    return requestBody;
  }
}

class OidcKubernetesAuthProvider {
  constructor(providerName, authProvider) {
    this.providerName = providerName;
    this.authProvider = authProvider;
  }
  async decorateRequestBodyForAuth(requestBody) {
    const authToken = await this.authProvider.getIdToken();
    const auth = { ...requestBody.auth };
    if (auth.oidc) {
      auth.oidc[this.providerName] = authToken;
    } else {
      auth.oidc = { [this.providerName]: authToken };
    }
    requestBody.auth = auth;
    return requestBody;
  }
}

class KubernetesAuthProviders {
  constructor(options) {
    this.kubernetesAuthProviderMap = /* @__PURE__ */ new Map();
    this.kubernetesAuthProviderMap.set("google", new GoogleKubernetesAuthProvider(options.googleAuthApi));
    this.kubernetesAuthProviderMap.set("serviceAccount", new ServiceAccountKubernetesAuthProvider());
    this.kubernetesAuthProviderMap.set("googleServiceAccount", new GoogleServiceAccountAuthProvider());
    this.kubernetesAuthProviderMap.set("aws", new AwsKubernetesAuthProvider());
    this.kubernetesAuthProviderMap.set("azure", new AzureKubernetesAuthProvider());
    if (options.oidcProviders) {
      Object.keys(options.oidcProviders).forEach((provider) => {
        this.kubernetesAuthProviderMap.set(`oidc.${provider}`, new OidcKubernetesAuthProvider(provider, options.oidcProviders[provider]));
      });
    }
  }
  async decorateRequestBodyForAuth(authProvider, requestBody) {
    const kubernetesAuthProvider = this.kubernetesAuthProviderMap.get(authProvider);
    if (kubernetesAuthProvider) {
      return await kubernetesAuthProvider.decorateRequestBodyForAuth(requestBody);
    }
    if (authProvider.startsWith("oidc.")) {
      throw new Error(`KubernetesAuthProviders has no oidcProvider configured for ${authProvider}`);
    }
    throw new Error(`authProvider "${authProvider}" has no KubernetesAuthProvider defined for it`);
  }
}

const rootCatalogKubernetesRouteRef = createRouteRef({
  id: "kubernetes"
});
const kubernetesPlugin = createPlugin({
  id: "kubernetes",
  apis: [
    createApiFactory({
      api: kubernetesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef
      },
      factory: ({ discoveryApi, identityApi }) => new KubernetesBackendClient({ discoveryApi, identityApi })
    }),
    createApiFactory({
      api: kubernetesAuthProvidersApiRef,
      deps: {
        googleAuthApi: googleAuthApiRef,
        microsoftAuthApi: microsoftAuthApiRef,
        oktaAuthApi: oktaAuthApiRef,
        oneloginAuthApi: oneloginAuthApiRef
      },
      factory: ({
        googleAuthApi,
        microsoftAuthApi,
        oktaAuthApi,
        oneloginAuthApi
      }) => {
        const oidcProviders = {
          google: googleAuthApi,
          microsoft: microsoftAuthApi,
          okta: oktaAuthApi,
          onelogin: oneloginAuthApi
        };
        return new KubernetesAuthProviders({ googleAuthApi, oidcProviders });
      }
    })
  ],
  routes: {
    entityContent: rootCatalogKubernetesRouteRef
  }
});
const EntityKubernetesContent = kubernetesPlugin.provide(createRoutableExtension({
  name: "EntityKubernetesContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootCatalogKubernetesRouteRef
}));

const clustersWithErrorsToErrorMessage = (clustersWithErrors) => {
  return clustersWithErrors.map((c, i) => {
    return /* @__PURE__ */ React__default.createElement("div", {
      key: i
    }, /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "body2"
    }, `Cluster: ${c.cluster.name}`), c.errors.map((e, j) => {
      return /* @__PURE__ */ React__default.createElement(Typography, {
        variant: "body2",
        key: j
      }, `Error fetching Kubernetes resource: '${e.resourcePath}', error: ${e.errorType}, status code: ${e.statusCode}`);
    }), /* @__PURE__ */ React__default.createElement("br", null));
  });
};
const ErrorPanel$1 = ({
  entityName,
  errorMessage,
  clustersWithErrors
}) => /* @__PURE__ */ React__default.createElement(WarningPanel, {
  title: "There was a problem retrieving Kubernetes objects",
  message: `There was a problem retrieving some Kubernetes resources for the entity: ${entityName}. This could mean that the Error Reporting card is not completely accurate.`
}, clustersWithErrors && /* @__PURE__ */ React__default.createElement("div", null, "Errors: ", clustersWithErrorsToErrorMessage(clustersWithErrors)), errorMessage && /* @__PURE__ */ React__default.createElement(Typography, {
  variant: "body2"
}, "Errors: ", errorMessage));

const columns = [
  {
    title: "cluster",
    width: "15%",
    render: (detectedError) => detectedError.cluster
  },
  {
    title: "kind",
    width: "15%",
    render: (detectedError) => detectedError.kind
  },
  {
    title: "name",
    width: "30%",
    render: (detectedError) => {
      const errorCount = detectedError.names.length;
      if (errorCount === 0) {
        return null;
      }
      const displayName = detectedError.names[0];
      const otherErrorCount = errorCount - 1;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, displayName, " ", otherErrorCount > 0 && /* @__PURE__ */ React.createElement(Chip, {
        label: `+ ${otherErrorCount} other${otherErrorCount > 1 ? "s" : ""}`,
        size: "small"
      }));
    }
  },
  {
    title: "messages",
    width: "40%",
    render: (detectedError) => /* @__PURE__ */ React.createElement(React.Fragment, null, detectedError.message.map((m, i) => /* @__PURE__ */ React.createElement("div", {
      key: i
    }, m)))
  }
];
const sortBySeverity = (a, b) => {
  if (a.severity < b.severity) {
    return 1;
  } else if (b.severity < a.severity) {
    return -1;
  }
  return 0;
};
const ErrorEmptyState = () => {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "space-around",
    direction: "row",
    alignItems: "center",
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Nice! There are no errors to report!")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement("img", {
    src: EmptyStateImage,
    alt: "EmptyState",
    "data-testid": "emptyStateImg"
  })));
};
const ErrorReporting = ({ detectedErrors }) => {
  const errors = Array.from(detectedErrors.values()).flat().sort(sortBySeverity);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, errors.length === 0 ? /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Error Reporting"
  }, /* @__PURE__ */ React.createElement(ErrorEmptyState, null)) : /* @__PURE__ */ React.createElement(Table, {
    title: "Error Reporting",
    data: errors,
    columns,
    options: { paging: true, search: false }
  }));
};

const groupResponses = (fetchResponse) => {
  return fetchResponse.reduce((prev, next) => {
    switch (next.type) {
      case "deployments":
        prev.deployments.push(...next.resources);
        break;
      case "pods":
        prev.pods.push(...next.resources);
        break;
      case "replicasets":
        prev.replicaSets.push(...next.resources);
        break;
      case "services":
        prev.services.push(...next.resources);
        break;
      case "configmaps":
        prev.configMaps.push(...next.resources);
        break;
      case "horizontalpodautoscalers":
        prev.horizontalPodAutoscalers.push(...next.resources);
        break;
      case "ingresses":
        prev.ingresses.push(...next.resources);
        break;
      case "jobs":
        prev.jobs.push(...next.resources);
        break;
      case "cronjobs":
        prev.cronJobs.push(...next.resources);
        break;
      case "customresources":
        prev.customResources.push(...next.resources);
        break;
      case "statefulsets":
        prev.statefulsets.push(...next.resources);
        break;
    }
    return prev;
  }, {
    pods: [],
    replicaSets: [],
    deployments: [],
    services: [],
    configMaps: [],
    horizontalPodAutoscalers: [],
    ingresses: [],
    jobs: [],
    cronJobs: [],
    customResources: [],
    statefulsets: []
  });
};

const imageChips = (pod) => {
  var _a, _b;
  const containerStatuses2 = (_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : [];
  const images = containerStatuses2.map((cs, i) => {
    return /* @__PURE__ */ React__default.createElement(Chip, {
      key: i,
      label: `${cs.name}=${cs.image}`,
      size: "small"
    });
  });
  return /* @__PURE__ */ React__default.createElement("div", null, images);
};
const containersReady = (pod) => {
  var _a, _b;
  const containerStatuses2 = (_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : [];
  const containersReadyItem = containerStatuses2.filter((cs) => cs.ready).length;
  return `${containersReadyItem}/${containerStatuses2.length}`;
};
const totalRestarts = (pod) => {
  var _a, _b;
  const containerStatuses2 = (_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : [];
  return containerStatuses2 == null ? void 0 : containerStatuses2.reduce((a, b) => a + b.restartCount, 0);
};
const containerStatuses = (pod) => {
  var _a, _b;
  const containerStatusesItem = (_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : [];
  const errors = containerStatusesItem.reduce((accum, next) => {
    if (next.state === void 0) {
      return accum;
    }
    const waiting = next.state.waiting;
    const terminated = next.state.terminated;
    const renderCell = (reason) => {
      var _a2;
      return /* @__PURE__ */ React__default.createElement(Fragment, {
        key: `${(_a2 = pod.metadata) == null ? void 0 : _a2.name}-${next.name}`
      }, /* @__PURE__ */ React__default.createElement(SubvalueCell, {
        value: reason === "Completed" ? /* @__PURE__ */ React__default.createElement(StatusOK, null, "Container: ", next.name) : /* @__PURE__ */ React__default.createElement(StatusError, null, "Container: ", next.name),
        subvalue: reason
      }), /* @__PURE__ */ React__default.createElement("br", null));
    };
    if (waiting) {
      accum.push(renderCell(waiting.reason));
    }
    if (terminated) {
      accum.push(renderCell(terminated.reason));
    }
    return accum;
  }, []);
  if (errors.length === 0) {
    return /* @__PURE__ */ React__default.createElement(StatusOK, null, "OK");
  }
  return errors;
};
const renderCondition = (condition) => {
  var _a;
  const status = condition.status;
  if (status === "True") {
    return [condition.type, /* @__PURE__ */ React__default.createElement(StatusOK, null, "True")];
  } else if (status === "False") {
    return [
      condition.type,
      /* @__PURE__ */ React__default.createElement(SubvalueCell, {
        value: /* @__PURE__ */ React__default.createElement(StatusError, null, "False"),
        subvalue: (_a = condition.message) != null ? _a : ""
      })
    ];
  }
  return [condition.type, /* @__PURE__ */ React__default.createElement(StatusAborted, null)];
};
const currentToDeclaredResourceToPerc = (current, resource) => {
  if (Number(resource) === 0)
    return `0%`;
  if (typeof current === "number" && typeof resource === "number") {
    return `${Math.round(current / resource * 100)}%`;
  }
  const numerator = BigInt(current);
  const denominator = BigInt(resource);
  return `${numerator * BigInt(100) / denominator}%`;
};
const formatMilicores = (value) => {
  return `${parseFloat(value.toString()) * 1e3}m`;
};
const podStatusToCpuUtil = (podStatus) => {
  const cpuUtil = podStatus.cpu;
  let currentUsage = cpuUtil.currentUsage;
  if (typeof cpuUtil.currentUsage === "number") {
    currentUsage = cpuUtil.currentUsage / 10;
  }
  return /* @__PURE__ */ React__default.createElement(SubvalueCell, {
    value: `requests: ${currentToDeclaredResourceToPerc(currentUsage, cpuUtil.requestTotal)} of ${formatMilicores(cpuUtil.requestTotal)}`,
    subvalue: `limits: ${currentToDeclaredResourceToPerc(currentUsage, cpuUtil.limitTotal)} of ${formatMilicores(cpuUtil.limitTotal)}`
  });
};
const bytesToMiB = (value) => {
  return `${parseFloat(value.toString()) / 1024 / 1024}MiB`;
};
const podStatusToMemoryUtil = (podStatus) => {
  const memUtil = podStatus.memory;
  return /* @__PURE__ */ React__default.createElement(SubvalueCell, {
    value: `requests: ${currentToDeclaredResourceToPerc(memUtil.currentUsage, memUtil.requestTotal)} of ${bytesToMiB(memUtil.requestTotal)}`,
    subvalue: `limits: ${currentToDeclaredResourceToPerc(memUtil.currentUsage, memUtil.limitTotal)} of ${bytesToMiB(memUtil.limitTotal)}`
  });
};

const detectErrorsInObjects = (objects, kind, clusterName, errorMappers) => {
  var _a, _b;
  const errors = /* @__PURE__ */ new Map();
  for (const object of objects) {
    for (const errorMapper of errorMappers) {
      if (errorMapper.errorExists(object)) {
        const message = errorMapper.messageAccessor(object);
        const dedupKey = message.join("");
        const value = errors.get(dedupKey);
        const name = (_b = (_a = object.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown";
        if (value !== void 0) {
          value.names.push(name);
          errors.set(dedupKey, value);
        } else {
          errors.set(dedupKey, {
            cluster: clusterName,
            kind,
            names: [name],
            message,
            severity: errorMapper.severity
          });
        }
      }
    }
  }
  return Array.from(errors.values());
};

const podErrorMappers = [
  {
    severity: 5,
    errorExplanation: "status-message",
    errorExists: (pod) => {
      var _a;
      return ((_a = pod.status) == null ? void 0 : _a.message) !== void 0;
    },
    messageAccessor: (pod) => {
      var _a, _b;
      return [(_b = (_a = pod.status) == null ? void 0 : _a.message) != null ? _b : ""];
    }
  },
  {
    severity: 4,
    errorExplanation: "containers-restarting",
    errorExists: (pod) => {
      return totalRestarts(pod) > 3;
    },
    messageAccessor: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : []).filter((cs) => cs.restartCount > 0).map((cs) => `container=${cs.name} restarted ${cs.restartCount} times`);
    }
  },
  {
    severity: 5,
    errorExplanation: "condition-message-present",
    errorExists: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.conditions) != null ? _b : []).some((c) => c.message !== void 0);
    },
    messageAccessor: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.conditions) != null ? _b : []).filter((c) => c.message !== void 0).map((c) => {
        var _a2;
        return (_a2 = c.message) != null ? _a2 : "";
      });
    }
  },
  {
    severity: 6,
    errorExplanation: "container-waiting",
    errorExists: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : []).some((cs) => {
        var _a2, _b2;
        return ((_b2 = (_a2 = cs.state) == null ? void 0 : _a2.waiting) == null ? void 0 : _b2.message) !== void 0;
      });
    },
    messageAccessor: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : []).filter((cs) => {
        var _a2, _b2;
        return ((_b2 = (_a2 = cs.state) == null ? void 0 : _a2.waiting) == null ? void 0 : _b2.message) !== void 0;
      }).map((cs) => {
        var _a2, _b2, _c;
        return (_c = (_b2 = (_a2 = cs.state) == null ? void 0 : _a2.waiting) == null ? void 0 : _b2.message) != null ? _c : "";
      });
    }
  },
  {
    severity: 4,
    errorExplanation: "container-last-state-error",
    errorExists: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : []).some((cs) => {
        var _a2, _b2, _c;
        return ((_c = (_b2 = (_a2 = cs.lastState) == null ? void 0 : _a2.terminated) == null ? void 0 : _b2.reason) != null ? _c : "") === "Error";
      });
    },
    messageAccessor: (pod) => {
      var _a, _b;
      return ((_b = (_a = pod.status) == null ? void 0 : _a.containerStatuses) != null ? _b : []).filter((cs) => {
        var _a2, _b2, _c;
        return ((_c = (_b2 = (_a2 = cs.lastState) == null ? void 0 : _a2.terminated) == null ? void 0 : _b2.reason) != null ? _c : "") === "Error";
      }).map((cs) => {
        var _a2, _b2;
        return `container=${cs.name} exited with error code (${(_b2 = (_a2 = cs.lastState) == null ? void 0 : _a2.terminated) == null ? void 0 : _b2.exitCode})`;
      });
    }
  }
];
const detectErrorsInPods = (pods, clusterName) => detectErrorsInObjects(pods, "Pod", clusterName, podErrorMappers);

const deploymentErrorMappers = [
  {
    severity: 6,
    errorExplanation: "condition-message-present",
    errorExists: (deployment) => {
      var _a, _b;
      return ((_b = (_a = deployment.status) == null ? void 0 : _a.conditions) != null ? _b : []).filter((c) => c.status === "False").some((c) => c.message !== void 0);
    },
    messageAccessor: (deployment) => {
      var _a, _b;
      return ((_b = (_a = deployment.status) == null ? void 0 : _a.conditions) != null ? _b : []).filter((c) => c.status === "False").filter((c) => c.message !== void 0).map((c) => {
        var _a2;
        return (_a2 = c.message) != null ? _a2 : "";
      });
    }
  }
];
const detectErrorsInDeployments = (deployments, clusterName) => detectErrorsInObjects(deployments, "Deployment", clusterName, deploymentErrorMappers);

const hpaErrorMappers = [
  {
    severity: 8,
    errorExplanation: "hpa-max-current-replicas",
    errorExists: (hpa) => {
      var _a, _b, _c;
      return ((_b = (_a = hpa.spec) == null ? void 0 : _a.maxReplicas) != null ? _b : -1) === ((_c = hpa.status) == null ? void 0 : _c.currentReplicas);
    },
    messageAccessor: (hpa) => {
      var _a, _b, _c;
      return [
        `Current number of replicas (${(_a = hpa.status) == null ? void 0 : _a.currentReplicas}) is equal to the configured max number of replicas (${(_c = (_b = hpa.spec) == null ? void 0 : _b.maxReplicas) != null ? _c : -1})`
      ];
    }
  }
];
const detectErrorsInHpa = (hpas, clusterName) => detectErrorsInObjects(hpas, "HorizontalPodAutoscaler", clusterName, hpaErrorMappers);

const detectErrors = (objects) => {
  const errors = /* @__PURE__ */ new Map();
  for (const clusterResponse of objects.items) {
    let clusterErrors = [];
    const groupedResponses = groupResponses(clusterResponse.resources);
    clusterErrors = clusterErrors.concat(detectErrorsInPods(groupedResponses.pods, clusterResponse.cluster.name));
    clusterErrors = clusterErrors.concat(detectErrorsInDeployments(groupedResponses.deployments, clusterResponse.cluster.name));
    clusterErrors = clusterErrors.concat(detectErrorsInHpa(groupedResponses.horizontalPodAutoscalers, clusterResponse.cluster.name));
    errors.set(clusterResponse.cluster.name, clusterErrors);
  }
  return errors;
};

const useKubernetesObjects = (entity, intervalMs = 1e4) => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);
  const [kubernetesObjects, setKubernetesObjects] = useState(void 0);
  const [error, setError] = useState(void 0);
  const getObjects = async () => {
    let clusters = [];
    try {
      clusters = await kubernetesApi.getClusters();
    } catch (e) {
      setError(e.message);
      return;
    }
    const authProviders = [
      ...new Set(clusters.map((c) => `${c.authProvider}${c.oidcTokenProvider ? `.${c.oidcTokenProvider}` : ""}`))
    ];
    let requestBody = {
      entity
    };
    for (const authProviderStr of authProviders) {
      try {
        requestBody = await kubernetesAuthProvidersApi.decorateRequestBodyForAuth(authProviderStr, requestBody);
      } catch (e) {
        setError(e.message);
        return;
      }
    }
    try {
      setKubernetesObjects(await kubernetesApi.getObjectsByEntity(requestBody));
    } catch (e) {
      setError(e.message);
      return;
    }
  };
  useEffect(() => {
    getObjects();
  }, [entity.metadata.name, kubernetesApi, kubernetesAuthProvidersApi]);
  useInterval(() => {
    getObjects();
  }, intervalMs);
  return {
    kubernetesObjects,
    error
  };
};

const PodNamesWithErrorsContext = React__default.createContext(/* @__PURE__ */ new Set());

const PodNamesWithMetricsContext = React__default.createContext(/* @__PURE__ */ new Map());

const GroupedResponsesContext = React__default.createContext({
  pods: [],
  replicaSets: [],
  deployments: [],
  services: [],
  configMaps: [],
  horizontalPodAutoscalers: [],
  ingresses: [],
  jobs: [],
  cronJobs: [],
  customResources: [],
  statefulsets: []
});

const ClusterContext = React__default.createContext({
  name: ""
});

const kindMappings$3 = {
  deployment: "deployment",
  pod: "pod",
  ingress: "ingress",
  service: "service",
  horizontalpodautoscaler: "deployment",
  statefulset: "statefulset"
};
function standardFormatter(options) {
  var _a, _b, _c, _d;
  if (!options.dashboardUrl) {
    throw new Error("standard dashboard requires a dashboardUrl option");
  }
  const result = new URL(options.dashboardUrl.href);
  const name = encodeURIComponent((_b = (_a = options.object.metadata) == null ? void 0 : _a.name) != null ? _b : "");
  const namespace = encodeURIComponent((_d = (_c = options.object.metadata) == null ? void 0 : _c.namespace) != null ? _d : "");
  const validKind = kindMappings$3[options.kind.toLocaleLowerCase("en-US")];
  if (!result.pathname.endsWith("/")) {
    result.pathname += "/";
  }
  if (validKind && name && namespace) {
    result.hash = `/${validKind}/${namespace}/${name}`;
  } else if (namespace) {
    result.hash = "/workloads";
  }
  if (namespace) {
    result.hash += `?namespace=${namespace}`;
  }
  return result;
}

const kindMappings$2 = {
  deployment: "apps.deployment",
  ingress: "networking.k8s.io.ingress",
  service: "service",
  horizontalpodautoscaler: "autoscaling.horizontalpodautoscaler"
};
function rancherFormatter(options) {
  var _a, _b, _c, _d;
  if (!options.dashboardUrl) {
    throw new Error("Rancher dashboard requires a dashboardUrl option");
  }
  const basePath = new URL(options.dashboardUrl.href);
  const name = encodeURIComponent((_b = (_a = options.object.metadata) == null ? void 0 : _a.name) != null ? _b : "");
  const namespace = encodeURIComponent((_d = (_c = options.object.metadata) == null ? void 0 : _c.namespace) != null ? _d : "");
  const validKind = kindMappings$2[options.kind.toLocaleLowerCase("en-US")];
  if (!basePath.pathname.endsWith("/")) {
    basePath.pathname += "/";
  }
  let path = "";
  if (validKind && name && namespace) {
    path = `explorer/${validKind}/${namespace}/${name}`;
  } else if (namespace) {
    path = "explorer/workload";
  }
  return new URL(path, basePath);
}

const kindMappings$1 = {
  deployment: "deployments",
  ingress: "ingresses",
  service: "services",
  horizontalpodautoscaler: "horizontalpodautoscalers",
  persistentvolume: "persistentvolumes"
};
function openshiftFormatter(options) {
  var _a, _b, _c, _d;
  if (!options.dashboardUrl) {
    throw new Error("OpenShift dashboard requires a dashboardUrl option");
  }
  const basePath = new URL(options.dashboardUrl.href);
  const name = encodeURIComponent((_b = (_a = options.object.metadata) == null ? void 0 : _a.name) != null ? _b : "");
  const namespace = encodeURIComponent((_d = (_c = options.object.metadata) == null ? void 0 : _c.namespace) != null ? _d : "");
  const validKind = kindMappings$1[options.kind.toLocaleLowerCase("en-US")];
  if (!basePath.pathname.endsWith("/")) {
    basePath.pathname += "/";
  }
  let path = "";
  if (namespace) {
    if (name && validKind) {
      path = `k8s/ns/${namespace}/${validKind}/${name}`;
    } else {
      path = `k8s/cluster/projects/${namespace}`;
    }
  } else if (validKind) {
    path = `k8s/cluster/${validKind}`;
    if (name) {
      path += `/${name}`;
    }
  }
  return new URL(path, basePath);
}

const basePath = "https://portal.azure.com/#blade/Microsoft_Azure_ContainerService/AksK8ResourceMenuBlade/overview-Deployment/aksClusterId";
const requiredParams = ["subscriptionId", "resourceGroup", "clusterName"];
function aksFormatter(options) {
  if (!options.dashboardParameters) {
    throw new Error("AKS dashboard requires a dashboardParameters option");
  }
  const args = options.dashboardParameters;
  for (const param of requiredParams) {
    if (typeof args[param] !== "string") {
      throw new Error(`AKS dashboard requires a "${param}" of type string in the dashboardParameters option`);
    }
  }
  const path = `/subscriptions/${args.subscriptionId}/resourceGroups/${args.resourceGroup}/providers/Microsoft.ContainerService/managedClusters/${args.clusterName}`;
  const { name, namespace, uid } = options.object.metadata;
  const { selector } = options.object.spec;
  const params = {
    kind: options.kind,
    metadata: { name, namespace, uid },
    spec: {
      selector
    }
  };
  return new URL(`${basePath}/${encodeURIComponent(path)}/resource/${encodeURIComponent(JSON.stringify(params))}`);
}

function eksFormatter(_options) {
  throw new Error("EKS formatter is not yet implemented. Please, contribute!");
}

const kindMappings = {
  deployment: "deployment",
  pod: "pod",
  ingress: "ingress",
  service: "service",
  horizontalpodautoscaler: "deployment"
};
function gkeFormatter(options) {
  var _a, _b, _c, _d;
  if (!options.dashboardParameters) {
    throw new Error("GKE dashboard requires a dashboardParameters option");
  }
  const args = options.dashboardParameters;
  if (typeof args.projectId !== "string") {
    throw new Error('GKE dashboard requires a "projectId" of type string in the dashboardParameters option');
  }
  if (typeof args.region !== "string") {
    throw new Error('GKE dashboard requires a "region" of type string in the dashboardParameters option');
  }
  if (typeof args.clusterName !== "string") {
    throw new Error('GKE dashboard requires a "clusterName" of type string in the dashboardParameters option');
  }
  const basePath = new URL("https://console.cloud.google.com/");
  const region = encodeURIComponent(args.region);
  const clusterName = encodeURIComponent(args.clusterName);
  const name = encodeURIComponent((_b = (_a = options.object.metadata) == null ? void 0 : _a.name) != null ? _b : "");
  const namespace = encodeURIComponent((_d = (_c = options.object.metadata) == null ? void 0 : _c.namespace) != null ? _d : "");
  const validKind = kindMappings[options.kind.toLocaleLowerCase("en-US")];
  let path = "";
  if (namespace && name && validKind) {
    const kindsWithDetails = ["ingress", "pod"];
    const landingPage = kindsWithDetails.includes(validKind) ? "details" : "overview";
    path = `kubernetes/${validKind}/${region}/${clusterName}/${namespace}/${name}/${landingPage}`;
  } else {
    path = `kubernetes/clusters/details/${region}/${clusterName}/details`;
  }
  const result = new URL(path, basePath);
  result.searchParams.set("project", args.projectId);
  return result;
}

const clusterLinksFormatters = {
  standard: standardFormatter,
  rancher: rancherFormatter,
  openshift: openshiftFormatter,
  aks: aksFormatter,
  eks: eksFormatter,
  gke: gkeFormatter
};
const defaultFormatterName = "standard";

function formatClusterLink(options) {
  if (!options.dashboardUrl && !options.dashboardParameters) {
    return void 0;
  }
  if (options.dashboardUrl && !options.object) {
    return options.dashboardUrl;
  }
  const app = options.dashboardApp || defaultFormatterName;
  const formatter = clusterLinksFormatters[app];
  if (!formatter) {
    throw new Error(`Could not find Kubernetes dashboard app named '${app}'`);
  }
  const url = formatter({
    dashboardUrl: options.dashboardUrl ? new URL(options.dashboardUrl) : void 0,
    dashboardParameters: options.dashboardParameters,
    object: options.object,
    kind: options.kind
  });
  return url.toString();
}

const useDrawerStyles = makeStyles((theme) => createStyles({
  paper: {
    width: "50%",
    justifyContent: "space-between",
    padding: theme.spacing(2.5)
  }
}));
const useDrawerContentStyles = makeStyles((_) => createStyles({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  errorMessage: {
    marginTop: "1em",
    marginBottom: "1em"
  },
  options: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icon: {
    fontSize: 20
  },
  content: {
    height: "80%"
  }
}));
const PodDrawerButton = withStyles({
  root: {
    padding: "6px 5px"
  },
  label: {
    textTransform: "none"
  }
})(Button);
const ErrorPanel = ({ cluster, errorMessage }) => /* @__PURE__ */ React__default.createElement(WarningPanel, {
  title: "There was a problem formatting the link to the Kubernetes dashboard",
  message: `Could not format the link to the dashboard of your cluster named '${cluster.name}'. Its dashboardApp property has been set to '${cluster.dashboardApp || "standard"}.'`
}, errorMessage && /* @__PURE__ */ React__default.createElement(Typography, {
  variant: "body2"
}, "Errors: ", errorMessage));
function replaceNullsWithUndefined(someObj) {
  const replacer = (_, value) => String(value) === "null" || String(value) === "undefined" ? void 0 : value;
  return JSON.parse(JSON.stringify(someObj, replacer));
}
function tryFormatClusterLink(options) {
  try {
    return {
      clusterLink: formatClusterLink(options),
      errorMessage: ""
    };
  } catch (err) {
    return {
      clusterLink: "",
      errorMessage: err.message || err.toString()
    };
  }
}
const KubernetesDrawerContent = ({
  toggleDrawer,
  object,
  renderObject,
  kind
}) => {
  var _a, _b;
  const [isYaml, setIsYaml] = useState(false);
  const classes = useDrawerContentStyles();
  const cluster = useContext(ClusterContext);
  const { clusterLink, errorMessage } = tryFormatClusterLink({
    dashboardUrl: cluster.dashboardUrl,
    dashboardApp: cluster.dashboardApp,
    dashboardParameters: cluster.dashboardParameters,
    object,
    kind
  });
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("div", {
    className: classes.header
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_b = (_a = object.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown name")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, kind))), /* @__PURE__ */ React__default.createElement(IconButton, {
    key: "dismiss",
    title: "Close the drawer",
    onClick: (e) => toggleDrawer(e, false),
    color: "inherit"
  }, /* @__PURE__ */ React__default.createElement(Close, {
    className: classes.icon
  }))), errorMessage && /* @__PURE__ */ React__default.createElement("div", {
    className: classes.errorMessage
  }, /* @__PURE__ */ React__default.createElement(ErrorPanel, {
    cluster,
    errorMessage
  })), /* @__PURE__ */ React__default.createElement("div", {
    className: classes.options
  }, /* @__PURE__ */ React__default.createElement("div", null, clusterLink && /* @__PURE__ */ React__default.createElement(Button$1, {
    variant: "outlined",
    color: "primary",
    size: "small",
    to: clusterLink,
    endIcon: /* @__PURE__ */ React__default.createElement(OpenInNewIcon, null)
  }, "Open Kubernetes Dashboard")), /* @__PURE__ */ React__default.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React__default.createElement(Switch, {
      checked: isYaml,
      onChange: (event) => {
        setIsYaml(event.target.checked);
      },
      name: "YAML"
    }),
    label: "YAML"
  })), /* @__PURE__ */ React__default.createElement("div", {
    className: classes.content
  }, isYaml && /* @__PURE__ */ React__default.createElement(CodeSnippet, {
    language: "yaml",
    text: jsYaml.dump(object)
  }), !isYaml && /* @__PURE__ */ React__default.createElement(StructuredMetadataTable, {
    metadata: renderObject(replaceNullsWithUndefined(object))
  })));
};
const KubernetesDrawer = ({
  object,
  renderObject,
  kind,
  buttonVariant = "subtitle2",
  expanded = false,
  children
}) => {
  var _a, _b;
  const [isOpen, setIsOpen] = useState(expanded);
  const classes = useDrawerStyles();
  const toggleDrawer = (e, newValue) => {
    e.stopPropagation();
    setIsOpen(newValue);
  };
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(PodDrawerButton, {
    onClick: (e) => toggleDrawer(e, true),
    onFocus: (event) => event.stopPropagation()
  }, children === void 0 ? /* @__PURE__ */ React__default.createElement(Typography, {
    variant: buttonVariant
  }, (_b = (_a = object.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown object") : children), /* @__PURE__ */ React__default.createElement(Drawer, {
    classes: {
      paper: classes.paper
    },
    anchor: "right",
    open: isOpen,
    onClose: (e) => toggleDrawer(e, false),
    onClick: (event) => event.stopPropagation()
  }, /* @__PURE__ */ React__default.createElement(KubernetesDrawerContent, {
    kind,
    toggleDrawer,
    object,
    renderObject
  })));
};

const PodDrawer = ({
  pod,
  expanded
}) => {
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: pod,
    expanded,
    kind: "Pod",
    renderObject: (podObject) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const phase = (_b = (_a = podObject.status) == null ? void 0 : _a.phase) != null ? _b : "unknown";
      const ports = (_e = (_d = (_c = podObject.spec) == null ? void 0 : _c.containers) == null ? void 0 : _d.map((c) => {
        return {
          [c.name]: c.ports
        };
      })) != null ? _e : "N/A";
      const conditions = ((_g = (_f = podObject.status) == null ? void 0 : _f.conditions) != null ? _g : []).map(renderCondition).reduce((accum, next) => {
        accum[next[0]] = next[1];
        return accum;
      }, {});
      return {
        images: imageChips(podObject),
        phase,
        "Containers Ready": containersReady(podObject),
        "Total Restarts": totalRestarts(podObject),
        "Container Statuses": containerStatuses(podObject),
        ...conditions,
        "Exposed ports": ports
      };
    }
  });
};

const READY_COLUMNS = "READY";
const RESOURCE_COLUMNS = "RESOURCE";
const DEFAULT_COLUMNS = [
  {
    title: "name",
    highlight: true,
    render: (pod) => /* @__PURE__ */ React__default.createElement(PodDrawer, {
      pod
    })
  },
  {
    title: "phase",
    render: (pod) => {
      var _a, _b;
      return (_b = (_a = pod.status) == null ? void 0 : _a.phase) != null ? _b : "unknown";
    }
  },
  {
    title: "status",
    render: containerStatuses
  }
];
const READY = [
  {
    title: "containers ready",
    align: "center",
    render: containersReady
  },
  {
    title: "total restarts",
    align: "center",
    render: totalRestarts,
    type: "numeric"
  }
];
const PodsTable = ({ pods, extraColumns = [] }) => {
  const podNamesWithMetrics = useContext(PodNamesWithMetricsContext);
  const columns = [...DEFAULT_COLUMNS];
  if (extraColumns.includes(READY_COLUMNS)) {
    columns.push(...READY);
  }
  if (extraColumns.includes(RESOURCE_COLUMNS)) {
    const resourceColumns = [
      {
        title: "CPU usage %",
        render: (pod) => {
          var _a, _b;
          const metrics = podNamesWithMetrics.get((_b = (_a = pod.metadata) == null ? void 0 : _a.name) != null ? _b : "");
          if (!metrics) {
            return "unknown";
          }
          return podStatusToCpuUtil(metrics);
        }
      },
      {
        title: "Memory usage %",
        render: (pod) => {
          var _a, _b;
          const metrics = podNamesWithMetrics.get((_b = (_a = pod.metadata) == null ? void 0 : _a.name) != null ? _b : "");
          if (!metrics) {
            return "unknown";
          }
          return podStatusToMemoryUtil(metrics);
        }
      }
    ];
    columns.push(...resourceColumns);
  }
  const tableStyle = {
    minWidth: "0",
    width: "100%"
  };
  return /* @__PURE__ */ React__default.createElement("div", {
    style: tableStyle
  }, /* @__PURE__ */ React__default.createElement(Table, {
    options: { paging: true, search: false },
    data: pods,
    columns
  }));
};

const DeploymentDrawer = ({
  deployment,
  expanded
}) => {
  var _a, _b, _c;
  const namespace = (_a = deployment.metadata) == null ? void 0 : _a.namespace;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: deployment,
    expanded,
    kind: "Deployment",
    renderObject: (deploymentObj) => {
      var _a2, _b2, _c2, _d, _e, _f, _g, _h;
      const conditions = ((_b2 = (_a2 = deploymentObj.status) == null ? void 0 : _a2.conditions) != null ? _b2 : []).map(renderCondition).reduce((accum, next) => {
        accum[next[0]] = next[1];
        return accum;
      }, {});
      return {
        strategy: (_d = (_c2 = deploymentObj.spec) == null ? void 0 : _c2.strategy) != null ? _d : "???",
        minReadySeconds: (_f = (_e = deploymentObj.spec) == null ? void 0 : _e.minReadySeconds) != null ? _f : "???",
        progressDeadlineSeconds: (_h = (_g = deploymentObj.spec) == null ? void 0 : _g.progressDeadlineSeconds) != null ? _h : "???",
        ...conditions
      };
    }
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_c = (_b = deployment.metadata) == null ? void 0 : _b.name) != null ? _c : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Deployment")), namespace && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Chip, {
    size: "small",
    label: `namespace: ${namespace}`
  }))));
};

const HorizontalPodAutoscalerDrawer = ({
  hpa,
  expanded,
  children
}) => {
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    kind: "HorizontalPodAutoscaler",
    object: hpa,
    expanded,
    renderObject: (hpaObject) => {
      var _a, _b, _c, _d, _e, _f;
      return {
        targetCPUUtilizationPercentage: (_a = hpaObject.spec) == null ? void 0 : _a.targetCPUUtilizationPercentage,
        currentCPUUtilizationPercentage: (_b = hpaObject.status) == null ? void 0 : _b.currentCPUUtilizationPercentage,
        minReplicas: (_c = hpaObject.spec) == null ? void 0 : _c.minReplicas,
        maxReplicas: (_d = hpaObject.spec) == null ? void 0 : _d.maxReplicas,
        currentReplicas: (_e = hpaObject.status) == null ? void 0 : _e.currentReplicas,
        desiredReplicas: (_f = hpaObject.status) == null ? void 0 : _f.desiredReplicas
      };
    }
  }, children);
};

function getOwnedResources(potentialOwner, possiblyOwned) {
  return possiblyOwned.filter((p) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = p.metadata) == null ? void 0 : _a.ownerReferences) == null ? void 0 : _b.some((o) => {
      var _a2;
      return o.uid === ((_a2 = potentialOwner.metadata) == null ? void 0 : _a2.uid);
    })) != null ? _c : false;
  });
}
const getOwnedPodsThroughReplicaSets = (potentialOwner, replicaSets, pods) => {
  return getOwnedResources(potentialOwner, replicaSets.filter((rs) => rs.status && rs.status.replicas > 0)).reduce((accum, rs) => {
    return accum.concat(getOwnedResources(rs, pods));
  }, []);
};
const getMatchingHpa = (owner, hpas) => {
  return hpas.find((hpa) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return ((_c = (_b = (_a = hpa.spec) == null ? void 0 : _a.scaleTargetRef) == null ? void 0 : _b.kind) != null ? _c : "").toLocaleLowerCase("en-US") === owner.kind.toLocaleLowerCase("en-US") && ((_e = (_d = hpa.metadata) == null ? void 0 : _d.namespace) != null ? _e : "") === ((_f = owner.namespace) != null ? _f : "unknown-namespace") && ((_i = (_h = (_g = hpa.spec) == null ? void 0 : _g.scaleTargetRef) == null ? void 0 : _h.name) != null ? _i : "") === ((_j = owner.name) != null ? _j : "unknown-deployment");
  });
};

const DeploymentSummary = ({
  deployment,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(DeploymentDrawer, {
    deployment
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })), hpa && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React__default.createElement(HorizontalPodAutoscalerDrawer, {
    hpa
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "min replicas ", (_b = (_a = hpa.spec) == null ? void 0 : _a.minReplicas) != null ? _b : "?", " / max replicas", " ", (_d = (_c = hpa.spec) == null ? void 0 : _c.maxReplicas) != null ? _d : "?")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "current CPU usage:", " ", (_f = (_e = hpa.status) == null ? void 0 : _e.currentCPUUtilizationPercentage) != null ? _f : "?", "%")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "target CPU usage:", " ", (_h = (_g = hpa.spec) == null ? void 0 : _g.targetCPUUtilizationPercentage) != null ? _h : "?", "%"))))), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    xs: 3,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(StatusOK, null, numberOfCurrentPods, " pods")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, numberOfPodsWithErrors > 0 ? /* @__PURE__ */ React__default.createElement(StatusError, null, numberOfPodsWithErrors, " pod", numberOfPodsWithErrors > 1 ? "s" : "", " with errors") : /* @__PURE__ */ React__default.createElement(StatusOK, null, "No pods with errors"))));
};
const DeploymentAccordion = ({
  deployment,
  ownedPods,
  matchingHpa
}) => {
  const podNamesWithErrors = useContext(PodNamesWithErrorsContext);
  const podsWithErrors = ownedPods.filter((p) => {
    var _a, _b;
    return podNamesWithErrors.has((_b = (_a = p.metadata) == null ? void 0 : _a.name) != null ? _b : "");
  });
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(DeploymentSummary, {
    deployment,
    numberOfCurrentPods: ownedPods.length,
    numberOfPodsWithErrors: podsWithErrors.length,
    hpa: matchingHpa
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(PodsTable, {
    pods: ownedPods,
    extraColumns: [READY_COLUMNS, RESOURCE_COLUMNS]
  })));
};
const DeploymentsAccordions = ({}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, groupedResponses.deployments.map((deployment, i) => {
    var _a, _b;
    return /* @__PURE__ */ React__default.createElement(Grid, {
      container: true,
      item: true,
      key: i,
      xs: true
    }, /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      xs: true
    }, /* @__PURE__ */ React__default.createElement(DeploymentAccordion, {
      matchingHpa: getMatchingHpa({
        name: (_a = deployment.metadata) == null ? void 0 : _a.name,
        namespace: (_b = deployment.metadata) == null ? void 0 : _b.namespace,
        kind: "deployment"
      }, groupedResponses.horizontalPodAutoscalers),
      ownedPods: getOwnedPodsThroughReplicaSets(deployment, groupedResponses.replicaSets, groupedResponses.pods),
      deployment
    })));
  }));
};

const StatefulSetDrawer = ({
  statefulset,
  expanded
}) => {
  var _a, _b, _c;
  const namespace = (_a = statefulset.metadata) == null ? void 0 : _a.namespace;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: statefulset,
    expanded,
    kind: "StatefulSet",
    renderObject: (statefulsetObj) => {
      var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      const conditions = ((_b2 = (_a2 = statefulsetObj.status) == null ? void 0 : _a2.conditions) != null ? _b2 : []).map(renderCondition).reduce((accum, next) => {
        accum[next[0]] = next[1];
        return accum;
      }, {});
      return {
        updateStrategy: (_d = (_c2 = statefulset.spec) == null ? void 0 : _c2.updateStrategy) != null ? _d : "???",
        podManagementPolicy: (_f = (_e = statefulset.spec) == null ? void 0 : _e.podManagementPolicy) != null ? _f : "???",
        serviceName: (_h = (_g = statefulset.spec) == null ? void 0 : _g.serviceName) != null ? _h : "???",
        selector: (_j = (_i = statefulset.spec) == null ? void 0 : _i.selector) != null ? _j : "???",
        revisionHistoryLimit: (_l = (_k = statefulset.spec) == null ? void 0 : _k.revisionHistoryLimit) != null ? _l : "???",
        ...conditions
      };
    }
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_c = (_b = statefulset.metadata) == null ? void 0 : _b.name) != null ? _c : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Stateful Set")), namespace && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Chip, {
    size: "small",
    label: `namespace: ${namespace}`
  }))));
};

const StatefulSetSummary = ({
  statefulset,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(StatefulSetDrawer, {
    statefulset
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })), hpa && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React__default.createElement(HorizontalPodAutoscalerDrawer, {
    hpa
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "min replicas ", (_b = (_a = hpa.spec) == null ? void 0 : _a.minReplicas) != null ? _b : "?", " / max replicas", " ", (_d = (_c = hpa.spec) == null ? void 0 : _c.maxReplicas) != null ? _d : "?")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "current CPU usage:", " ", (_f = (_e = hpa.status) == null ? void 0 : _e.currentCPUUtilizationPercentage) != null ? _f : "?", "%")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "target CPU usage:", " ", (_h = (_g = hpa.spec) == null ? void 0 : _g.targetCPUUtilizationPercentage) != null ? _h : "?", "%"))))), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    xs: 3,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(StatusOK, null, numberOfCurrentPods, " pods")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, numberOfPodsWithErrors > 0 ? /* @__PURE__ */ React__default.createElement(StatusError, null, numberOfPodsWithErrors, " pod", numberOfPodsWithErrors > 1 ? "s" : "", " with errors") : /* @__PURE__ */ React__default.createElement(StatusOK, null, "No pods with errors"))));
};
const StatefulSetAccordion = ({
  statefulset,
  ownedPods,
  matchingHpa
}) => {
  const podNamesWithErrors = useContext(PodNamesWithErrorsContext);
  const podsWithErrors = ownedPods.filter((p) => {
    var _a, _b;
    return podNamesWithErrors.has((_b = (_a = p.metadata) == null ? void 0 : _a.name) != null ? _b : "");
  });
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(StatefulSetSummary, {
    statefulset,
    numberOfCurrentPods: ownedPods.length,
    numberOfPodsWithErrors: podsWithErrors.length,
    hpa: matchingHpa
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(PodsTable, {
    pods: ownedPods,
    extraColumns: [READY_COLUMNS, RESOURCE_COLUMNS]
  })));
};
const StatefulSetsAccordions = ({}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, groupedResponses.statefulsets.map((statefulset, i) => {
    var _a, _b;
    return /* @__PURE__ */ React__default.createElement(Grid, {
      container: true,
      item: true,
      key: i,
      xs: true
    }, /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      xs: true
    }, /* @__PURE__ */ React__default.createElement(StatefulSetAccordion, {
      matchingHpa: getMatchingHpa({
        name: (_a = statefulset.metadata) == null ? void 0 : _a.name,
        namespace: (_b = statefulset.metadata) == null ? void 0 : _b.namespace,
        kind: "statefulset"
      }, groupedResponses.horizontalPodAutoscalers),
      ownedPods: getOwnedResources(statefulset, groupedResponses.pods),
      statefulset
    })));
  }));
};

const IngressDrawer = ({
  ingress,
  expanded
}) => {
  var _a, _b;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: ingress,
    expanded,
    kind: "Ingress",
    renderObject: (ingressObject) => {
      return ingressObject.spec || {};
    }
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_b = (_a = ingress.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Ingress"))));
};

const IngressSummary = ({ ingress }) => {
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(IngressDrawer, {
    ingress
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })));
};
const IngressCard = ({ ingress }) => {
  return /* @__PURE__ */ React__default.createElement(StructuredMetadataTable, {
    metadata: {
      ...ingress.spec
    }
  });
};
const IngressAccordion = ({ ingress }) => {
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(IngressSummary, {
    ingress
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(IngressCard, {
    ingress
  })));
};
const IngressesAccordions = ({}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, groupedResponses.ingresses.map((ingress, i) => /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    key: i,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(IngressAccordion, {
    ingress
  }))));
};

const ServiceDrawer = ({
  service,
  expanded
}) => {
  var _a, _b;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: service,
    expanded,
    kind: "Service",
    renderObject: (serviceObject) => {
      return serviceObject.spec || {};
    }
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_b = (_a = service.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Service"))));
};

const ServiceSummary = ({ service }) => {
  var _a, _b;
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(ServiceDrawer, {
    service
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "Type: ", (_b = (_a = service.spec) == null ? void 0 : _a.type) != null ? _b : "?")));
};
const ServiceCard = ({ service }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const metadata = {};
  if ((_d = (_c = (_b = (_a = service.status) == null ? void 0 : _a.loadBalancer) == null ? void 0 : _b.ingress) == null ? void 0 : _c.length) != null ? _d : -1 > 0) {
    metadata.loadbalancer = (_e = service.status) == null ? void 0 : _e.loadBalancer;
  }
  if (((_f = service.spec) == null ? void 0 : _f.type) === "ClusterIP") {
    metadata.clusterIP = service.spec.clusterIP;
  }
  if (((_g = service.spec) == null ? void 0 : _g.type) === "ExternalName") {
    metadata.externalName = service.spec.externalName;
  }
  return /* @__PURE__ */ React__default.createElement(StructuredMetadataTable, {
    metadata: {
      type: (_h = service.spec) == null ? void 0 : _h.type,
      ports: (_i = service.spec) == null ? void 0 : _i.ports,
      ...metadata
    }
  });
};
const ServiceAccordion = ({ service }) => {
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(ServiceSummary, {
    service
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(ServiceCard, {
    service
  })));
};
const ServicesAccordions = ({}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, groupedResponses.services.map((service, i) => /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    key: i,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(ServiceAccordion, {
    service
  }))));
};

const JobDrawer = ({
  job,
  expanded
}) => {
  var _a, _b;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: job,
    expanded,
    kind: "Job",
    renderObject: (jobObj) => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      return {
        parallelism: (_b2 = (_a2 = jobObj.spec) == null ? void 0 : _a2.parallelism) != null ? _b2 : "???",
        completions: (_d = (_c = jobObj.spec) == null ? void 0 : _c.completions) != null ? _d : "???",
        backoffLimit: (_f = (_e = jobObj.spec) == null ? void 0 : _e.backoffLimit) != null ? _f : "???",
        startTime: (_h = (_g = jobObj.status) == null ? void 0 : _g.startTime) != null ? _h : "???"
      };
    }
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h6"
  }, (_b = (_a = job.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Job"))));
};

const JobSummary = ({ job }) => {
  var _a, _b, _c, _d, _e, _f;
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(JobDrawer, {
    job
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    xs: 8,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, ((_a = job.status) == null ? void 0 : _a.succeeded) && /* @__PURE__ */ React__default.createElement(StatusOK, null, "Succeeded"), ((_b = job.status) == null ? void 0 : _b.active) && /* @__PURE__ */ React__default.createElement(StatusPending, null, "Running"), ((_c = job.status) == null ? void 0 : _c.failed) && /* @__PURE__ */ React__default.createElement(StatusError, null, "Failed")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, "Start time: ", (_e = (_d = job.status) == null ? void 0 : _d.startTime) == null ? void 0 : _e.toString()), ((_f = job.status) == null ? void 0 : _f.completionTime) && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, "Completion time: ", job.status.completionTime.toString())));
};
const JobAccordion = ({ job, ownedPods }) => {
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(JobSummary, {
    job
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(PodsTable, {
    pods: ownedPods
  })));
};
const JobsAccordions = ({ jobs }) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, jobs.map((job, i) => /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    item: true,
    key: i,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(JobAccordion, {
    ownedPods: getOwnedResources(job, groupedResponses.pods),
    job
  })))));
};

const CronJobDrawer = ({
  cronJob,
  expanded
}) => {
  var _a, _b, _c;
  const namespace = (_a = cronJob.metadata) == null ? void 0 : _a.namespace;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: cronJob,
    expanded,
    kind: "CronJob",
    renderObject: (cronJobObj) => {
      var _a2, _b2, _c2, _d, _e, _f, _g, _h;
      return {
        schedule: (_b2 = (_a2 = cronJobObj.spec) == null ? void 0 : _a2.schedule) != null ? _b2 : "???",
        startingDeadlineSeconds: (_d = (_c2 = cronJobObj.spec) == null ? void 0 : _c2.startingDeadlineSeconds) != null ? _d : "???",
        concurrencyPolicy: (_f = (_e = cronJobObj.spec) == null ? void 0 : _e.concurrencyPolicy) != null ? _f : "???",
        lastScheduleTime: (_h = (_g = cronJobObj.status) == null ? void 0 : _g.lastScheduleTime) != null ? _h : "???"
      };
    }
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_c = (_b = cronJob.metadata) == null ? void 0 : _b.name) != null ? _c : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "CronJob")), namespace && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Chip, {
    size: "small",
    label: `namespace: ${namespace}`
  }))));
};

const CronJobSummary = ({ cronJob }) => {
  var _a, _b;
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(CronJobDrawer, {
    cronJob
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    xs: 5,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, ((_a = cronJob.spec) == null ? void 0 : _a.suspend) ? /* @__PURE__ */ React__default.createElement(StatusError, null, "Suspended") : /* @__PURE__ */ React__default.createElement(StatusOK, null, "Active")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "body1"
  }, "Schedule:", " ", ((_b = cronJob.spec) == null ? void 0 : _b.schedule) ? `${cronJob.spec.schedule} (${cronstrue.toString(cronJob.spec.schedule)})` : "N/A"))));
};
const CronJobAccordion = ({ cronJob, ownedJobs }) => {
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(CronJobSummary, {
    cronJob
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(JobsAccordions, {
    jobs: ownedJobs.reverse()
  })));
};
const CronJobsAccordions = ({}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, groupedResponses.cronJobs.map((cronJob, i) => /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    item: true,
    key: i,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(CronJobAccordion, {
    ownedJobs: getOwnedResources(cronJob, groupedResponses.jobs),
    cronJob
  })))));
};

const RolloutDrawer = ({
  rollout,
  expanded
}) => {
  var _a, _b;
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: rollout,
    expanded,
    kind: "Rollout",
    renderObject: () => ({})
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_b = (_a = rollout.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Rollout"))));
};

const isSetWeightStep = (step) => step.hasOwnProperty("setWeight");
const isPauseStep = (step) => step.hasOwnProperty("pause");
const isAnalysisStep = (step) => step.hasOwnProperty("analysis");
const createLabelForStep = (step) => {
  if (isSetWeightStep(step)) {
    return `setWeight ${step.setWeight}%`;
  } else if (isPauseStep(step)) {
    return step.pause.duration === void 0 ? "infinite pause" : `pause for ${step.pause.duration}`;
  } else if (isAnalysisStep(step)) {
    return /* @__PURE__ */ React__default.createElement("div", null, /* @__PURE__ */ React__default.createElement("p", null, "analysis templates:"), step.analysis.templates.map((t, i) => /* @__PURE__ */ React__default.createElement("p", {
      key: i
    }, `${t.templateName}${t.clusterScope ? " (cluster scoped)" : ""}`)));
  }
  return "unknown step";
};
const StepsProgress = ({
  currentStepIndex,
  aborted,
  steps
}) => {
  const activeStepIndex = currentStepIndex >= steps.length ? currentStepIndex + 1 : currentStepIndex;
  return /* @__PURE__ */ React__default.createElement(Stepper, {
    activeStep: aborted ? -1 : activeStepIndex,
    alternativeLabel: true
  }, steps.map((step, i) => /* @__PURE__ */ React__default.createElement(Step, {
    key: i
  }, /* @__PURE__ */ React__default.createElement(StepLabel, {
    "data-testid": `step-${i}`
  }, createLabelForStep(step)))).concat(/* @__PURE__ */ React__default.createElement(Step, {
    key: "-1"
  }, /* @__PURE__ */ React__default.createElement(StepLabel, {
    "data-testid": "step--1"
  }, "Canary promoted"))));
};

const AbortedTitle = /* @__PURE__ */ React__default.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  }
}, /* @__PURE__ */ React__default.createElement(ErrorOutlineIcon, null), /* @__PURE__ */ React__default.createElement(Typography, {
  variant: "subtitle1"
}, "Aborted"));
const findAbortedMessage = (rollout) => {
  var _a, _b, _c;
  return (_c = (_b = (_a = rollout.status) == null ? void 0 : _a.conditions) == null ? void 0 : _b.find((c) => c.type === "Progressing" && c.status === "False" && c.reason === "RolloutAborted")) == null ? void 0 : _c.message;
};
const RolloutSummary = ({
  rollout,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const pauseTime = (_c = (_b = (_a = rollout.status) == null ? void 0 : _a.pauseConditions) == null ? void 0 : _b.find((p) => p.reason === "CanaryPauseStep")) == null ? void 0 : _c.startTime;
  const abortedMessage = findAbortedMessage(rollout);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(RolloutDrawer, {
    rollout
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })), hpa && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React__default.createElement(HorizontalPodAutoscalerDrawer, {
    hpa
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "min replicas ", (_e = (_d = hpa.spec) == null ? void 0 : _d.minReplicas) != null ? _e : "?", " / max replicas", " ", (_g = (_f = hpa.spec) == null ? void 0 : _f.maxReplicas) != null ? _g : "?")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "current CPU usage:", " ", (_i = (_h = hpa.status) == null ? void 0 : _h.currentCPUUtilizationPercentage) != null ? _i : "?", "%")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, "target CPU usage:", " ", (_k = (_j = hpa.spec) == null ? void 0 : _j.targetCPUUtilizationPercentage) != null ? _k : "?", "%"))))), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    xs: 3,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(StatusOK, null, numberOfCurrentPods, " pods")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, numberOfPodsWithErrors > 0 ? /* @__PURE__ */ React__default.createElement(StatusError, null, numberOfPodsWithErrors, " pod", numberOfPodsWithErrors > 1 ? "s" : "", " with errors") : /* @__PURE__ */ React__default.createElement(StatusOK, null, "No pods with errors"))), pauseTime && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React__default.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /* @__PURE__ */ React__default.createElement(PauseIcon, null), /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle1"
  }, "Paused (", DateTime.fromISO(pauseTime).toRelative({ locale: "en" }), ")"))), abortedMessage && /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 3
  }, AbortedTitle));
};
const RolloutAccordion = ({
  rollout,
  ownedPods,
  matchingHpa,
  defaultExpanded
}) => {
  var _a, _b, _c, _d, _e, _f;
  const podNamesWithErrors = useContext(PodNamesWithErrorsContext);
  const podsWithErrors = ownedPods.filter((p) => {
    var _a2, _b2;
    return podNamesWithErrors.has((_b2 = (_a2 = p.metadata) == null ? void 0 : _a2.name) != null ? _b2 : "");
  });
  const currentStepIndex = (_b = (_a = rollout.status) == null ? void 0 : _a.currentStepIndex) != null ? _b : 0;
  const abortedMessage = findAbortedMessage(rollout);
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    defaultExpanded,
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(RolloutSummary, {
    rollout,
    numberOfCurrentPods: ownedPods.length,
    numberOfPodsWithErrors: podsWithErrors.length,
    hpa: matchingHpa
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement("div", {
    style: { width: "100%" }
  }, /* @__PURE__ */ React__default.createElement("div", null, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h6"
  }, "Rollout status")), /* @__PURE__ */ React__default.createElement("div", {
    style: { margin: "1rem" }
  }, abortedMessage && /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, AbortedTitle, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2"
  }, abortedMessage)), /* @__PURE__ */ React__default.createElement(StepsProgress, {
    aborted: abortedMessage !== void 0,
    steps: (_f = (_e = (_d = (_c = rollout.spec) == null ? void 0 : _c.strategy) == null ? void 0 : _d.canary) == null ? void 0 : _e.steps) != null ? _f : [],
    currentStepIndex
  })), /* @__PURE__ */ React__default.createElement("div", null, /* @__PURE__ */ React__default.createElement(PodsTable, {
    pods: ownedPods,
    extraColumns: [READY_COLUMNS, RESOURCE_COLUMNS]
  })))));
};
const RolloutAccordions = ({
  rollouts,
  defaultExpanded = false
}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, rollouts.map((rollout, i) => {
    var _a, _b;
    return /* @__PURE__ */ React__default.createElement(Grid, {
      container: true,
      item: true,
      key: i,
      xs: true
    }, /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      xs: true
    }, /* @__PURE__ */ React__default.createElement(RolloutAccordion, {
      defaultExpanded,
      matchingHpa: getMatchingHpa({
        name: (_a = rollout.metadata) == null ? void 0 : _a.name,
        namespace: (_b = rollout.metadata) == null ? void 0 : _b.namespace,
        kind: "rollout"
      }, groupedResponses.horizontalPodAutoscalers),
      ownedPods: getOwnedPodsThroughReplicaSets(rollout, groupedResponses.replicaSets, groupedResponses.pods),
      rollout
    })));
  }));
};

const capitalize = (str) => str.charAt(0).toLocaleUpperCase("en-US") + str.slice(1);
const DefaultCustomResourceDrawer = ({
  customResource,
  customResourceName,
  expanded
}) => {
  var _a, _b;
  const capitalizedName = capitalize(customResourceName);
  return /* @__PURE__ */ React__default.createElement(KubernetesDrawer, {
    object: customResource,
    expanded,
    kind: capitalizedName,
    renderObject: (cr) => cr
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, (_b = (_a = customResource.metadata) == null ? void 0 : _a.name) != null ? _b : "unknown object")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, capitalizedName))));
};

const DefaultCustomResourceSummary = ({
  customResource,
  customResourceName
}) => {
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 3,
    item: true
  }, /* @__PURE__ */ React__default.createElement(DefaultCustomResourceDrawer, {
    customResource,
    customResourceName
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "5em" },
    orientation: "vertical"
  })));
};
const DefaultCustomResourceAccordion = ({
  customResource,
  customResourceName,
  defaultExpanded
}) => {
  return /* @__PURE__ */ React__default.createElement(Accordion, {
    defaultExpanded,
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(DefaultCustomResourceSummary, {
    customResource,
    customResourceName
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, customResource.hasOwnProperty("status") && /* @__PURE__ */ React__default.createElement(StructuredMetadataTable, {
    metadata: customResource.status
  })));
};
const DefaultCustomResourceAccordions = ({
  customResources,
  customResourceName,
  defaultExpanded = false
}) => {
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, customResources.map((cr, i) => /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    item: true,
    key: i,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(DefaultCustomResourceAccordion, {
    defaultExpanded,
    customResource: cr,
    customResourceName
  })))));
};

const kindToResource = (customResources) => {
  return lodash.groupBy(customResources, (value) => {
    return value.kind;
  });
};
const CustomResources = ({}) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  const kindToResourceMap = kindToResource(groupedResponses.customResources);
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, Object.entries(kindToResourceMap).map(([kind, resources], i) => {
    switch (kind) {
      case "Rollout":
        return /* @__PURE__ */ React__default.createElement(RolloutAccordions, {
          key: i,
          rollouts: resources
        });
      default:
        return /* @__PURE__ */ React__default.createElement(DefaultCustomResourceAccordions, {
          key: i,
          customResources: resources,
          customResourceName: kind
        });
    }
  }));
};

const ClusterSummary = ({
  clusterName,
  totalNumberOfPods,
  numberOfPodsWithErrors
}) => {
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    xs: 4,
    item: true,
    container: true,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h3"
  }, clusterName), /* @__PURE__ */ React__default.createElement(Typography, {
    color: "textSecondary",
    variant: "body1"
  }, "Cluster"))), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 1
  }, /* @__PURE__ */ React__default.createElement(Divider, {
    style: { height: "4em" },
    orientation: "vertical"
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    xs: 3,
    direction: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(StatusOK, null, totalNumberOfPods, " pods")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, numberOfPodsWithErrors > 0 ? /* @__PURE__ */ React__default.createElement(StatusError, null, numberOfPodsWithErrors, " pods with errors") : /* @__PURE__ */ React__default.createElement(StatusOK, null, "No pods with errors"))));
};
const Cluster = ({ clusterObjects, podsWithErrors }) => {
  const groupedResponses = groupResponses(clusterObjects.resources);
  const podNameToMetrics = clusterObjects.podMetrics.flat().reduce((accum, next) => {
    var _a;
    const name = (_a = next.pod.metadata) == null ? void 0 : _a.name;
    if (name !== void 0) {
      accum.set(name, next);
    }
    return accum;
  }, /* @__PURE__ */ new Map());
  return /* @__PURE__ */ React__default.createElement(ClusterContext.Provider, {
    value: clusterObjects.cluster
  }, /* @__PURE__ */ React__default.createElement(GroupedResponsesContext.Provider, {
    value: groupedResponses
  }, /* @__PURE__ */ React__default.createElement(PodNamesWithMetricsContext.Provider, {
    value: podNameToMetrics
  }, /* @__PURE__ */ React__default.createElement(PodNamesWithErrorsContext.Provider, {
    value: podsWithErrors
  }, /* @__PURE__ */ React__default.createElement(Accordion, {
    TransitionProps: { unmountOnExit: true }
  }, /* @__PURE__ */ React__default.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React__default.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React__default.createElement(ClusterSummary, {
    clusterName: clusterObjects.cluster.name,
    totalNumberOfPods: groupedResponses.pods.length,
    numberOfPodsWithErrors: podsWithErrors.size
  })), /* @__PURE__ */ React__default.createElement(AccordionDetails, null, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    direction: "column"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(CustomResources, null)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(DeploymentsAccordions, null)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(StatefulSetsAccordions, null)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(IngressesAccordions, null)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(ServicesAccordions, null)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(CronJobsAccordions, null)))))))));
};

const KubernetesContent = ({
  entity,
  refreshIntervalMs
}) => {
  var _a;
  const { kubernetesObjects, error } = useKubernetesObjects(entity, refreshIntervalMs);
  const clustersWithErrors = (_a = kubernetesObjects == null ? void 0 : kubernetesObjects.items.filter((r) => r.errors.length > 0)) != null ? _a : [];
  const detectedErrors = kubernetesObjects !== void 0 ? detectErrors(kubernetesObjects) : /* @__PURE__ */ new Map();
  return /* @__PURE__ */ React__default.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React__default.createElement(Content, null, kubernetesObjects === void 0 && error === void 0 && /* @__PURE__ */ React__default.createElement(Progress, null), clustersWithErrors.length > 0 && /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(ErrorPanel$1, {
    entityName: entity.metadata.name,
    clustersWithErrors
  }))), error !== void 0 && /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(ErrorPanel$1, {
    entityName: entity.metadata.name,
    errorMessage: error
  }))), kubernetesObjects && /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(ErrorReporting, {
    detectedErrors
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Divider, null)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h3"
  }, "Your Clusters")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true
  }, (kubernetesObjects == null ? void 0 : kubernetesObjects.items.length) <= 0 && /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    justifyContent: "space-around",
    direction: "row",
    alignItems: "center",
    spacing: 2
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "h5"
  }, "No resources on any known clusters for", " ", entity.metadata.name)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React__default.createElement("img", {
    src: EmptyStateImage,
    alt: "EmptyState",
    "data-testid": "emptyStateImg"
  }))), (kubernetesObjects == null ? void 0 : kubernetesObjects.items.length) > 0 && (kubernetesObjects == null ? void 0 : kubernetesObjects.items.map((item, i) => {
    var _a2, _b;
    const podsWithErrors = new Set((_b = (_a2 = detectedErrors.get(item.cluster.name)) == null ? void 0 : _a2.filter((de) => de.kind === "Pod").map((de) => de.names).flat()) != null ? _b : []);
    return /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      key: i,
      xs: 12
    }, /* @__PURE__ */ React__default.createElement(Cluster, {
      clusterObjects: item,
      podsWithErrors
    }));
  }))))));
};

const KUBERNETES_ANNOTATION = "backstage.io/kubernetes-id";
const KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION = "backstage.io/kubernetes-label-selector";
const isKubernetesAvailable = (entity) => {
  var _a, _b;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[KUBERNETES_ANNOTATION]) || Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION]);
};
const Router = (props) => {
  var _a, _b;
  const { entity } = useEntity();
  const kubernetesAnnotationValue = (_a = entity.metadata.annotations) == null ? void 0 : _a[KUBERNETES_ANNOTATION];
  const kubernetesLabelSelectorQueryAnnotationValue = (_b = entity.metadata.annotations) == null ? void 0 : _b[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION];
  if (kubernetesAnnotationValue || kubernetesLabelSelectorQueryAnnotationValue) {
    return /* @__PURE__ */ React__default.createElement(Routes, null, /* @__PURE__ */ React__default.createElement(Route, {
      path: "/",
      element: /* @__PURE__ */ React__default.createElement(KubernetesContent, {
        entity,
        refreshIntervalMs: props.refreshIntervalMs
      })
    }));
  }
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(MissingAnnotationEmptyState, {
    annotation: KUBERNETES_ANNOTATION
  }), /* @__PURE__ */ React__default.createElement("h1", null, "Or use a label selector query, which takes precedence over the previous annotation."), /* @__PURE__ */ React__default.createElement(Button, {
    variant: "contained",
    color: "primary",
    href: "https://backstage.io/docs/features/kubernetes/configuration#surfacing-your-kubernetes-components-as-part-of-an-entity"
  }, "Read Kubernetes Plugin Docs"));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isKubernetesAvailable: isKubernetesAvailable,
  Router: Router
});

export { AwsKubernetesAuthProvider, Cluster, ClusterContext, CronJobsAccordions, CustomResources, EntityKubernetesContent, ErrorPanel$1 as ErrorPanel, ErrorReporting, GoogleKubernetesAuthProvider, GoogleServiceAccountAuthProvider, GroupedResponsesContext, HorizontalPodAutoscalerDrawer, IngressesAccordions, JobsAccordions, KubernetesAuthProviders, KubernetesBackendClient, KubernetesContent, KubernetesDrawer, PodDrawer, PodNamesWithErrorsContext, PodNamesWithMetricsContext, PodsTable, Router, ServiceAccountKubernetesAuthProvider, ServicesAccordions, clusterLinksFormatters, formatClusterLink, isKubernetesAvailable, kubernetesApiRef, kubernetesAuthProvidersApiRef, kubernetesPlugin, kubernetesPlugin as plugin, useKubernetesObjects };
//# sourceMappingURL=index.esm.js.map
