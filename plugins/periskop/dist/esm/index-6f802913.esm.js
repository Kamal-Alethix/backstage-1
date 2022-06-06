import { createApiRef, createPlugin, createApiFactory, configApiRef, discoveryApiRef, createComponentExtension, useApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import React from 'react';
import { DateTime } from 'luxon';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Progress, ResponseErrorPanel, Select, Content, EmptyState, Table, Link, ContentHeader, StatusWarning, StatusError, StatusPending } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';

class PeriskopClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.instances = options.configApi.getConfigArray("periskop.instances").flatMap((locConf) => {
      const name = locConf.getString("name");
      const url = locConf.getString("url");
      return { name, url };
    });
  }
  getApiUrl(instanceName) {
    var _a;
    return (_a = this.instances.find((instance) => instance.name === instanceName)) == null ? void 0 : _a.url;
  }
  getInstanceNames() {
    return this.instances.map((e) => e.name);
  }
  getErrorInstanceUrl(instanceName, serviceName, error) {
    return `${this.getApiUrl(instanceName)}/#/${serviceName}/errors/${encodeURIComponent(error.aggregation_key)}`;
  }
  async getErrors(instanceName, serviceName) {
    const apiUrl = `${await this.discoveryApi.getBaseUrl("periskop")}/${instanceName}/${serviceName}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      if (response.status === 404) {
        return {
          body: await response.text()
        };
      }
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
}

const periskopApiRef = createApiRef({
  id: "plugin.periskop.service"
});
const periskopPlugin = createPlugin({
  id: "periskop",
  apis: [
    createApiFactory({
      api: periskopApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) => new PeriskopClient({ configApi, discoveryApi })
    })
  ]
});

const EntityPeriskopErrorsCard$1 = periskopPlugin.provide(createComponentExtension({
  name: "EntityPeriskopErrorsCard",
  component: {
    lazy: () => import('./index-59bf81a5.esm.js').then((m) => m.EntityPeriskopErrorsCard)
  }
}));

const PERISKOP_NAME_ANNOTATION = "periskop.io/service-name";
const isPeriskopAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[PERISKOP_NAME_ANNOTATION]);
};
const renderKey = (error, linkTarget) => {
  return /* @__PURE__ */ React.createElement(Link, {
    to: linkTarget
  }, error.aggregation_key);
};
const renderSeverity = (severity) => {
  if (severity.toLocaleLowerCase("en-US") === "warning") {
    return /* @__PURE__ */ React.createElement(StatusWarning, null, severity);
  } else if (severity.toLocaleLowerCase("en-US") === "error") {
    return /* @__PURE__ */ React.createElement(StatusError, null, severity);
  }
  return /* @__PURE__ */ React.createElement(StatusPending, null, severity);
};
const renderLastOccurrence = (error) => {
  return DateTime.fromMillis(error.latest_errors[0].timestamp * 1e3).toRelative();
};
function isNotFoundInInstance(apiResult) {
  return (apiResult == null ? void 0 : apiResult.body) !== void 0;
}
const EntityPeriskopErrorsCard = () => {
  var _a, _b;
  const { entity } = useEntity();
  const entityPeriskopName = (_b = (_a = entity.metadata.annotations) == null ? void 0 : _a[PERISKOP_NAME_ANNOTATION]) != null ? _b : entity.metadata.name;
  const periskopApi = useApi(periskopApiRef);
  const instanceNames = periskopApi.getInstanceNames();
  const [instanceOption, setInstanceOption] = React.useState(instanceNames[0]);
  const {
    value: aggregatedErrors,
    loading,
    error
  } = useAsync(async () => {
    return periskopApi.getErrors(instanceOption, entityPeriskopName);
  }, [instanceOption]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  const columns = [
    {
      title: "Key",
      field: "aggregation_key",
      highlight: true,
      sorting: false,
      render: (aggregatedError) => {
        const errorUrl = periskopApi.getErrorInstanceUrl(instanceOption, entityPeriskopName, aggregatedError);
        return renderKey(aggregatedError, errorUrl);
      }
    },
    { title: "Occurrences", field: "total_count", sorting: true },
    {
      title: "Last Occurrence",
      render: (aggregatedError) => renderLastOccurrence(aggregatedError),
      defaultSort: "asc",
      customSort: (a, b) => b.latest_errors[0].timestamp - a.latest_errors[0].timestamp,
      type: "datetime"
    },
    {
      title: "Severity",
      field: "severity",
      render: (aggregatedError) => renderSeverity(aggregatedError.severity),
      sorting: false
    }
  ];
  const sortingSelect = /* @__PURE__ */ React.createElement(Select, {
    selected: instanceOption,
    label: "Instance",
    items: instanceNames.map((e) => ({
      label: e,
      value: e
    })),
    onChange: (el) => setInstanceOption(el.toString())
  });
  const contentHeader = /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Periskop",
    description: entityPeriskopName
  }, sortingSelect);
  if (isNotFoundInInstance(aggregatedErrors)) {
    return /* @__PURE__ */ React.createElement(Content, {
      noPadding: true
    }, contentHeader, /* @__PURE__ */ React.createElement(EmptyState, {
      title: "Periskop returned an error",
      description: aggregatedErrors.body,
      missing: "data"
    }));
  }
  return /* @__PURE__ */ React.createElement(Content, {
    noPadding: true
  }, contentHeader, /* @__PURE__ */ React.createElement(Table, {
    options: {
      search: false,
      paging: false,
      filtering: true,
      padding: "dense",
      toolbar: false
    },
    columns,
    data: aggregatedErrors || []
  }));
};

export { EntityPeriskopErrorsCard as E, PERISKOP_NAME_ANNOTATION as P, periskopApiRef as a, EntityPeriskopErrorsCard$1 as b, PeriskopClient as c, isPeriskopAvailable as i, periskopPlugin as p };
//# sourceMappingURL=index-6f802913.esm.js.map
