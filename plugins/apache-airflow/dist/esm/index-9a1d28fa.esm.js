import { Progress, Table, StatusOK, StatusError, InfoCard, StructuredMetadataTable, Page, Header, HeaderLabel, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { a as apacheAirflowApiRef } from './index-41db7896.esm.js';
import 'cross-fetch';
import 'qs';

const timeDeltaToLabel = (delta) => {
  let label = "";
  const date = new Date(0);
  date.setSeconds(delta.seconds);
  const time = date.toISOString().substr(11, 8);
  if (delta.days === 0) {
    label = `${time}`;
  } else if (delta.days === 1) {
    label = `1 day ${time}`;
  } else {
    label = `${delta.days} days ${time}`;
  }
  return label;
};
const relativeDeltaToLabel = (delta) => {
  const params = Object.entries(delta).filter((o) => o[0] !== "__type" && o[1] !== null && o[1] !== 0).map((o) => o[1] > 0 ? `${o[0]}=+${o[1]}` : `${o[0]}=-${o[1]}`);
  return `relativedelta(${params})`;
};
const ScheduleIntervalLabel = ({ interval }) => {
  let label = "";
  switch (interval == null ? void 0 : interval.__type) {
    case "TimeDelta":
      label = timeDeltaToLabel(interval);
      break;
    case "RelativeDelta":
      label = relativeDeltaToLabel(interval);
      break;
    case "CronExpression":
      label = interval.value;
      break;
    default:
      label = "None";
  }
  return /* @__PURE__ */ React.createElement(Chip, {
    label,
    size: "small"
  });
};

const columns = [
  {
    title: "Paused",
    field: "is_paused",
    render: (row) => /* @__PURE__ */ React.createElement(Tooltip, {
      title: "Pause/Unpause DAG"
    }, /* @__PURE__ */ React.createElement(Switch, {
      checked: !row.is_paused,
      disabled: true
    })),
    width: "5%"
  },
  {
    title: "DAG",
    field: "id",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, {
        variant: "subtitle2",
        gutterBottom: true,
        noWrap: true
      }, row.id), /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        alignItems: "center"
      }, (_a = row.tags) == null ? void 0 : _a.map((tag, ix) => /* @__PURE__ */ React.createElement(Chip, {
        label: tag.name,
        key: ix,
        size: "small"
      }))));
    },
    width: "60%"
  },
  {
    title: "Owner",
    field: "owners",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        alignItems: "center"
      }, (_a = row.owners) == null ? void 0 : _a.map((owner, ix) => /* @__PURE__ */ React.createElement(Chip, {
        label: owner,
        key: ix,
        size: "small"
      })));
    },
    width: "10%"
  },
  {
    title: "Active",
    render: (row) => /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, row.is_active ? /* @__PURE__ */ React.createElement(StatusOK, null) : /* @__PURE__ */ React.createElement(StatusError, null), /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, row.is_active ? "Active" : "Inactive")),
    width: "10%"
  },
  {
    title: "Schedule",
    render: (row) => /* @__PURE__ */ React.createElement(ScheduleIntervalLabel, {
      interval: row.schedule_interval
    }),
    width: "10%"
  },
  {
    title: "Link",
    field: "dagUrl",
    render: (row) => /* @__PURE__ */ React.createElement("a", {
      href: row.dagUrl
    }, /* @__PURE__ */ React.createElement(IconButton, {
      "aria-label": "details"
    }, /* @__PURE__ */ React.createElement(OpenInBrowserIcon, null))),
    width: "5%"
  }
];
const DenseTable = ({ dags }) => {
  return /* @__PURE__ */ React.createElement(Table, {
    title: "DAGs",
    options: { pageSize: 5 },
    columns,
    data: dags
  });
};
const DagTableComponent = () => {
  const apiClient = useApi(apacheAirflowApiRef);
  const { value, loading, error } = useAsync(async () => {
    return await apiClient.listDags();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  const data = value == null ? void 0 : value.map((el) => ({
    ...el,
    id: el.dag_id,
    dagUrl: `${apiClient.baseUrl}dag_details?dag_id=${el.dag_id}`
  }));
  return /* @__PURE__ */ React.createElement(DenseTable, {
    dags: data || []
  });
};

const StatusComponent = () => {
  const apiClient = useApi(apacheAirflowApiRef);
  const { value, loading, error } = useAsync(async () => {
    return await apiClient.getInstanceStatus();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (value) {
    const metadata = {
      "Metadatabase Status": value.metadatabase.status,
      "Scheduler Status": value.scheduler.status,
      "Latest Scheduler Heartbeat": value.scheduler.latest_scheduler_heartbeat
    };
    return /* @__PURE__ */ React.createElement(InfoCard, {
      title: "Instance Status",
      subheader: "Scheduler and Metadatabase Status",
      variant: "fullHeight"
    }, /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
      metadata
    }));
  }
  return /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning"
  }, "No status information found...");
};

const VersionComponent = () => {
  const apiClient = useApi(apacheAirflowApiRef);
  const { value, loading, error } = useAsync(async () => {
    return await apiClient.getInstanceVersion();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (value) {
    const metadata = {
      Version: value.version,
      "Git Version": value.git_version
    };
    return /* @__PURE__ */ React.createElement(InfoCard, {
      title: "Instance Version",
      variant: "fullHeight"
    }, /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
      metadata
    }));
  }
  return /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning"
  }, "No status information found...");
};

const HomePage = () => /* @__PURE__ */ React.createElement(Page, {
  themeId: "tool"
}, /* @__PURE__ */ React.createElement(Header, {
  title: "Apache Airflow",
  subtitle: "Workflow management platform"
}, /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Lifecycle",
  value: "Alpha"
})), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
  title: "Overview"
}, /* @__PURE__ */ React.createElement(SupportButton, null, "See an overview of your Apache Airflow instance, and manage workflows")), /* @__PURE__ */ React.createElement(Grid, {
  container: true,
  spacing: 3,
  direction: "row"
}, /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  sm: 12,
  lg: 6
}, /* @__PURE__ */ React.createElement(VersionComponent, null)), /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  sm: 12,
  lg: 6
}, /* @__PURE__ */ React.createElement(StatusComponent, null)), /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  sm: 12
}, /* @__PURE__ */ React.createElement(DagTableComponent, null)))));

export { HomePage };
//# sourceMappingURL=index-9a1d28fa.esm.js.map
