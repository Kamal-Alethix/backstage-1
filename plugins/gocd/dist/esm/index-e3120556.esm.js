import { ResponseError } from '@backstage/errors';
import { createApiRef, createPlugin, createApiFactory, discoveryApiRef, createComponentExtension, useApi, configApiRef } from '@backstage/core-plugin-api';
import React, { useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Table, SubvalueCell, Link, StatusWarning, StatusPending, StatusAborted, StatusRunning, StatusError, StatusOK, MissingAnnotationEmptyState, EmptyState, Page, Content, ContentHeader } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { getEntitySourceLocation } from '@backstage/catalog-model';
import { Alert } from '@material-ui/lab';
import { Button, Box, Grid, Tooltip, Card, CardContent, Typography } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { DateTime, Duration } from 'luxon';
import { mean, groupBy } from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const DEFAULT_PAGE_SIZE = 100;
class GoCdClientApi {
  constructor(discoveryApi) {
    this.discoveryApi = discoveryApi;
  }
  async getPipelineHistory(pipelineName) {
    const baseUrl = await this.discoveryApi.getBaseUrl("proxy");
    const pipelineHistoryResponse = await fetch(`${baseUrl}/gocd/pipelines/${pipelineName}/history?page_size=${DEFAULT_PAGE_SIZE}`, {
      headers: {
        Accept: "application/vnd.go.cd+json"
      }
    });
    if (!pipelineHistoryResponse.ok) {
      throw await ResponseError.fromResponse(pipelineHistoryResponse);
    }
    return await pipelineHistoryResponse.json();
  }
}

const gocdApiRef = createApiRef({
  id: "plugin.gocd.service"
});
const gocdPlugin = createPlugin({
  id: "gocd",
  apis: [
    createApiFactory({
      api: gocdApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => {
        return new GoCdClientApi(discoveryApi);
      }
    })
  ]
});

const EntityGoCdContent = gocdPlugin.provide(createComponentExtension({
  name: "EntityGoCdContent",
  component: {
    lazy: () => import('./index-37d8332b.esm.js').then((m) => m.GoCdBuildsComponent)
  }
}));

var GoCdBuildResultStatus = /* @__PURE__ */ ((GoCdBuildResultStatus2) => {
  GoCdBuildResultStatus2[GoCdBuildResultStatus2["running"] = 0] = "running";
  GoCdBuildResultStatus2[GoCdBuildResultStatus2["successful"] = 1] = "successful";
  GoCdBuildResultStatus2[GoCdBuildResultStatus2["warning"] = 2] = "warning";
  GoCdBuildResultStatus2[GoCdBuildResultStatus2["aborted"] = 3] = "aborted";
  GoCdBuildResultStatus2[GoCdBuildResultStatus2["error"] = 4] = "error";
  GoCdBuildResultStatus2[GoCdBuildResultStatus2["pending"] = 5] = "pending";
  return GoCdBuildResultStatus2;
})(GoCdBuildResultStatus || {});
const toBuildResultStatus = (status) => {
  switch (status.toLocaleLowerCase("en-US")) {
    case "passed":
      return 1 /* successful */;
    case "failed":
      return 4 /* error */;
    case "aborted":
      return 3 /* aborted */;
    case "building":
      return 0 /* running */;
    case "pending":
      return 5 /* pending */;
    default:
      return 3 /* aborted */;
  }
};

const renderTrigger = (build) => {
  const subvalue = /* @__PURE__ */ React.createElement(React.Fragment, null, build.pipeline, /* @__PURE__ */ React.createElement("br", null), build.author);
  return /* @__PURE__ */ React.createElement(SubvalueCell, {
    value: build.message,
    subvalue
  });
};
const renderStages = (build) => {
  return build.stages.map((s) => {
    switch (s.status) {
      case GoCdBuildResultStatus.successful: {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusOK, null, s.text), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
      }
      case GoCdBuildResultStatus.error: {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusError, null, s.text), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
      }
      case GoCdBuildResultStatus.running: {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusRunning, null, s.text), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
      }
      case GoCdBuildResultStatus.aborted: {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusAborted, null, s.text), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
      }
      case GoCdBuildResultStatus.pending: {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusPending, null, s.text), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
      }
      default: {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusWarning, null, s.text), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
      }
    }
  });
};
const renderSource = (build) => {
  return /* @__PURE__ */ React.createElement(Button, {
    href: build.source,
    target: "_blank",
    rel: "noreferrer",
    startIcon: /* @__PURE__ */ React.createElement(GitHubIcon, null)
  }, build.commitHash);
};
const renderId = (goCdBaseUrl, build) => {
  const goCdBuildUrl = `${goCdBaseUrl}/go/pipelines/value_stream_map/${build.buildSlug}`;
  return /* @__PURE__ */ React.createElement(SubvalueCell, {
    value: /* @__PURE__ */ React.createElement(Link, {
      to: goCdBuildUrl,
      target: "_blank",
      rel: "noreferrer"
    }, build.id),
    subvalue: build.triggerTime && DateTime.fromMillis(build.triggerTime).toLocaleString(DateTime.DATETIME_MED)
  });
};
const renderError = (error) => {
  return /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, error.message);
};
const toBuildResults = (entity, builds) => {
  const entitySourceLocation = getEntitySourceLocation(entity).target.split("/tree")[0];
  return builds.map((build) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
      id: build.counter,
      source: `${entitySourceLocation}/commit/${(_b = (_a = build.build_cause) == null ? void 0 : _a.material_revisions[0]) == null ? void 0 : _b.modifications[0].revision}`,
      stages: build.stages.map((s) => ({
        status: toBuildResultStatus(s.status),
        text: s.name
      })),
      buildSlug: `${build.name}/${build.counter}`,
      message: (_e = (_d = (_c = build.build_cause) == null ? void 0 : _c.material_revisions[0]) == null ? void 0 : _d.modifications[0].comment) != null ? _e : "",
      pipeline: build.name,
      author: (_g = (_f = build.build_cause) == null ? void 0 : _f.material_revisions[0]) == null ? void 0 : _g.modifications[0].user_name,
      commitHash: build.label,
      triggerTime: build.scheduled_date
    };
  });
};
const GoCdBuildsTable = (props) => {
  const { pipelineHistory, loading, error } = props;
  const { entity } = useEntity();
  const [, setSelectedSearchTerm] = useState("");
  const columns = [
    {
      title: "ID",
      field: "id",
      highlight: true,
      render: (build) => renderId(props.goCdBaseUrl, build)
    },
    {
      title: "Trigger",
      customFilterAndSearch: (query, row) => `${row.message} ${row.pipeline} ${row.author}`.toLocaleUpperCase("en-US").includes(query.toLocaleUpperCase("en-US")),
      field: "message",
      highlight: true,
      render: (build) => renderTrigger(build)
    },
    {
      title: "Stages",
      field: "status",
      render: (build) => renderStages(build)
    },
    {
      title: "Source",
      field: "source",
      render: (build) => renderSource(build)
    }
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, error && renderError(error), !error && /* @__PURE__ */ React.createElement(Table, {
    title: "GoCD builds",
    isLoading: loading,
    options: {
      search: true,
      searchAutoFocus: true,
      debounceInterval: 800,
      paging: true,
      padding: "dense",
      pageSizeOptions: [5, 10, 20, 50],
      showFirstLastPageButtons: false,
      pageSize: 20
    },
    columns,
    data: pipelineHistory ? toBuildResults(entity, pipelineHistory.pipelines) || [] : [],
    onSearchChange: (searchTerm) => setSelectedSearchTerm(searchTerm)
  }));
};

function runFrequency(pipelineHistory) {
  const lastMonth = DateTime.now().minus({ month: 1 });
  const buildLastMonth = pipelineHistory.pipelines.map((p) => p.scheduled_date).filter((d) => !!d).map((d) => DateTime.fromMillis(d)).filter((d) => d > lastMonth).length;
  return `${buildLastMonth} last month`;
}
function meanTimeBetweenFailures(jobs) {
  const timeBetweenFailures = [];
  for (let index = 1; index < jobs.length; index++) {
    const job = jobs[index];
    if (!job.result) {
      continue;
    }
    if (toBuildResultStatus(job.result) === GoCdBuildResultStatus.error) {
      let previousFailedJob = null;
      for (let j = index - 1; j >= 0; j--) {
        const candidateJob = jobs[j];
        if (!candidateJob.result) {
          continue;
        }
        if (toBuildResultStatus(candidateJob.result) === GoCdBuildResultStatus.error) {
          previousFailedJob = candidateJob;
          break;
        }
      }
      if (!previousFailedJob || !job.scheduled_date || !previousFailedJob.scheduled_date) {
        continue;
      }
      const failedJobDate = DateTime.fromMillis(job.scheduled_date);
      const previousFailedJobDate = DateTime.fromMillis(previousFailedJob.scheduled_date);
      const timeBetweenFailure = failedJobDate.diff(previousFailedJobDate);
      timeBetweenFailures.push(timeBetweenFailure);
    }
  }
  return formatMean(timeBetweenFailures);
}
function meanTimeToRecovery(jobs) {
  const timeToRecoverIntervals = [];
  for (let index = 0; index < jobs.length; index++) {
    const job = jobs[index];
    if (!job.result) {
      continue;
    }
    if (toBuildResultStatus(job.result) === GoCdBuildResultStatus.error) {
      let nextSuccessfulJob = null;
      for (let j = index + 1; j < jobs.length; j++) {
        const candidateJob = jobs[j];
        if (!candidateJob.result) {
          continue;
        }
        if (toBuildResultStatus(candidateJob.result) === GoCdBuildResultStatus.successful) {
          nextSuccessfulJob = candidateJob;
          break;
        }
      }
      if (!nextSuccessfulJob || !job.scheduled_date || !nextSuccessfulJob.scheduled_date) {
        continue;
      }
      const failedJobDate = DateTime.fromMillis(job.scheduled_date);
      const successfulJobDate = DateTime.fromMillis(nextSuccessfulJob.scheduled_date);
      const timeToRecovery = successfulJobDate.diff(failedJobDate);
      timeToRecoverIntervals.push(timeToRecovery);
    }
  }
  return formatMean(timeToRecoverIntervals);
}
function formatMean(durations) {
  if (durations.length === 0) {
    return "N/A";
  }
  const mttr = Duration.fromMillis(mean(durations.map((i) => i.milliseconds)));
  return mttr.toFormat("d'd' h'h' m'm' s's'");
}
function failureRate(jobs) {
  const resultGroups = new Map(Object.entries(groupBy(jobs, "result")).map(([key, value]) => [
    toBuildResultStatus(key),
    value.flat()
  ]));
  const failedJobs = resultGroups.get(GoCdBuildResultStatus.error);
  if (!failedJobs) {
    return {
      title: "0",
      subtitle: "(no failed jobs found)"
    };
  }
  resultGroups.delete(GoCdBuildResultStatus.error);
  const nonFailedJobs = Array.from(resultGroups.values()).flat();
  const totalJobs = failedJobs.length + nonFailedJobs.length;
  const percentage = failedJobs.length / totalJobs * 100;
  const decimalPercentage = (Math.round(percentage * 100) / 100).toFixed(2);
  return {
    title: `${decimalPercentage}%`,
    subtitle: `(${failedJobs.length} out of ${totalJobs} jobs)`
  };
}
const GoCdBuildsInsights = (props) => {
  const { pipelineHistory, loading, error } = props;
  if (loading || error || !pipelineHistory) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  }
  const stages = pipelineHistory.pipelines.slice().reverse().map((p) => p.stages).flat();
  const jobs = stages.map((s) => s.jobs).flat();
  const failureRateObj = failureRate(jobs);
  return /* @__PURE__ */ React.createElement(Box, {
    "data-testid": "GoCdBuildsInsightsBox",
    sx: { mb: 1 }
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 1
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    sm: 3
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "What is your deployment frequency?"
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, "Run Frequency"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, runFrequency(pipelineHistory)))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    sm: 3
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "How long does it take to fix a failure?"
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, "Mean Time to Recovery"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, meanTimeToRecovery(jobs)))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    sm: 3
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "How often do changes fail?"
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, "Mean Time Between Failures"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, meanTimeBetweenFailures(jobs)))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    sm: 3
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "What percentage of changes result in a failure?"
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, "Failure Rate"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, failureRateObj.title), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, failureRateObj.subtitle)))))));
};

const useStyles = makeStyles((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
const renderItems = (items) => {
  return items.map((item) => {
    return /* @__PURE__ */ React.createElement(MenuItem, {
      value: item.value,
      key: item.label
    }, item.label);
  });
};
const SelectComponent = ({
  value,
  items,
  label,
  onChange
}) => {
  const classes = useStyles();
  const handleChange = (event) => {
    const val = event.target.value;
    onChange(val);
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    className: classes.formControl,
    disabled: items.length === 0
  }, /* @__PURE__ */ React.createElement(InputLabel, null, label), /* @__PURE__ */ React.createElement(Select, {
    label,
    value,
    onChange: handleChange
  }, renderItems(items)));
};

const GOCD_PIPELINES_ANNOTATION = "gocd.org/pipelines";
const isGoCdAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[GOCD_PIPELINES_ANNOTATION]);
};
const GoCdBuildsComponent = () => {
  var _a, _b;
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const rawPipelines = (_b = (_a = entity.metadata.annotations) == null ? void 0 : _a[GOCD_PIPELINES_ANNOTATION]) == null ? void 0 : _b.split(",").map((p) => p.trim());
  const gocdApi = useApi(gocdApiRef);
  const [selectedPipeline, setSelectedPipeline] = useState(rawPipelines ? rawPipelines[0] : "");
  const {
    value: pipelineHistory,
    loading,
    error
  } = useAsync(async () => {
    return await gocdApi.getPipelineHistory(selectedPipeline);
  }, [selectedPipeline]);
  const onSelectedPipelineChanged = (pipeline) => {
    setSelectedPipeline(pipeline);
  };
  const getSelectionItems = (pipelines) => {
    return pipelines.map((p) => ({ label: p, value: p }));
  };
  function isError(apiResult) {
    return (apiResult == null ? void 0 : apiResult.message) !== void 0;
  }
  if (!rawPipelines) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: GOCD_PIPELINES_ANNOTATION
    });
  }
  if (isError(pipelineHistory)) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      title: "GoCD pipelines",
      description: `Could not fetch pipelines defined for entity ${entity.metadata.name}. Error: ${pipelineHistory.message}`,
      missing: "content"
    });
  }
  if (!loading && !pipelineHistory) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      title: "GoCD pipelines",
      description: `We could not find pipelines defined for entity ${entity.metadata.name}.`,
      missing: "data"
    });
  }
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Content, {
    noPadding: true
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: entity.metadata.name
  }, /* @__PURE__ */ React.createElement(SelectComponent, {
    value: selectedPipeline,
    onChange: (pipeline) => onSelectedPipelineChanged(pipeline),
    label: "Pipeline",
    items: getSelectionItems(rawPipelines)
  })), /* @__PURE__ */ React.createElement(GoCdBuildsInsights, {
    pipelineHistory,
    loading,
    error
  }), /* @__PURE__ */ React.createElement(GoCdBuildsTable, {
    goCdBaseUrl: config.getString("gocd.baseUrl"),
    pipelineHistory,
    loading,
    error
  })));
};

export { EntityGoCdContent as E, GoCdBuildsComponent as G, GOCD_PIPELINES_ANNOTATION as a, gocdPlugin as g, isGoCdAvailable as i };
//# sourceMappingURL=index-e3120556.esm.js.map
