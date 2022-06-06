import React from 'react';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { n as newRelicApiRef } from './index-0a45db74.esm.js';
import { Progress, Table, Page, Header, HeaderLabel, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const NewRelicAPMTable = ({ applications }) => {
  const columns = [
    { title: "Application", field: "name" },
    { title: "Response Time", field: "responseTime" },
    { title: "Throughput", field: "throughput" },
    { title: "Error Rate", field: "errorRate" },
    { title: "Instance Count", field: "instanceCount" },
    { title: "Apdex", field: "apdexScore" }
  ];
  const data = applications.map((app) => {
    const { name, application_summary: applicationSummary } = app;
    const {
      response_time: responseTime,
      throughput,
      error_rate: errorRate,
      instance_count: instanceCount,
      apdex_score: apdexScore
    } = applicationSummary;
    return {
      name,
      responseTime: `${responseTime} ms`,
      throughput: `${throughput} rpm`,
      errorRate: `${errorRate}%`,
      instanceCount,
      apdexScore
    };
  });
  return /* @__PURE__ */ React.createElement(Table, {
    title: "Application Performance Monitoring",
    options: { search: true, paging: true },
    columns,
    data
  });
};
const NewRelicFetchComponent = () => {
  const api = useApi(newRelicApiRef);
  const { value, loading, error } = useAsync(async () => {
    const data = await api.getApplications();
    return data.applications.filter((application) => {
      return application.hasOwnProperty("application_summary");
    });
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  return /* @__PURE__ */ React.createElement(NewRelicAPMTable, {
    applications: value || []
  });
};

const NewRelicComponent = () => /* @__PURE__ */ React.createElement(Page, {
  themeId: "tool"
}, /* @__PURE__ */ React.createElement(Header, {
  title: "New Relic"
}, /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Owner",
  value: "Engineering"
})), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
  title: "New Relic"
}, /* @__PURE__ */ React.createElement(SupportButton, null, "New Relic Application Performance Monitoring")), /* @__PURE__ */ React.createElement(Grid, {
  container: true,
  spacing: 3,
  direction: "column"
}, /* @__PURE__ */ React.createElement(Grid, {
  item: true
}, /* @__PURE__ */ React.createElement(NewRelicFetchComponent, null)))));
var NewRelicComponent$1 = NewRelicComponent;

export { NewRelicComponent$1 as default };
//# sourceMappingURL=index-22104ae7.esm.js.map
