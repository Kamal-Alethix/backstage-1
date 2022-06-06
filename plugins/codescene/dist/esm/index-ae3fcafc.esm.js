import { EmptyState, InfoCard, Progress, Table, Page, Header, SupportButton, Content, GaugeCard } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { makeStyles as makeStyles$1, Button, Grid, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React__default, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { c as codesceneApiRef } from './index-bdc8477a.esm.js';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Circle } from 'rc-progress';
import '@backstage/errors';
import '@material-ui/core/SvgIcon';

const useStyles$1 = makeStyles((theme) => ({
  root: {
    position: "relative",
    lineHeight: 0
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "60%",
    transform: "translate(-50%, -60%)",
    fontSize: 30,
    fontWeight: "bold",
    color: theme.palette.textContrast
  },
  circle: {
    width: "100%",
    transform: "translate(10%, 0)"
  },
  colorUnknown: {}
}), { name: "CodeSceneGauge" });
const getProgressColor = ({
  palette,
  value,
  max
}) => {
  if (isNaN(value)) {
    return "#ddd";
  }
  if (value < max / 3) {
    return palette.status.error;
  } else if (value < max * (2 / 3)) {
    return palette.status.warning;
  }
  return palette.status.ok;
};
function Gauge(props) {
  const classes = useStyles$1(props);
  const { palette } = useTheme();
  const [hoverRef, setHoverRef] = useState(null);
  const [open, setOpen] = useState(false);
  const { value, max, tooltipDelay, tooltipText } = {
    ...props
  };
  useEffect(() => {
    const node = hoverRef;
    const handleMouseOver = () => setOpen(true);
    const handleMouseOut = () => setOpen(false);
    if (node && tooltipText) {
      node.addEventListener("mouseenter", handleMouseOver);
      node.addEventListener("mouseleave", handleMouseOut);
      return () => {
        node.removeEventListener("mouseenter", handleMouseOver);
        node.removeEventListener("mouseleave", handleMouseOut);
      };
    }
    return () => {
      setOpen(false);
    };
  }, [tooltipText, hoverRef]);
  const asPercentage = value * 100 / max;
  return /* @__PURE__ */ React__default.createElement("div", {
    ref: setHoverRef,
    className: classes.root
  }, /* @__PURE__ */ React__default.createElement(Tooltip, {
    id: "gauge-tooltip",
    title: tooltipText,
    placement: "top",
    leaveDelay: tooltipDelay,
    onClose: () => setOpen(false),
    open
  }, /* @__PURE__ */ React__default.createElement("div", null, /* @__PURE__ */ React__default.createElement(Circle, {
    strokeLinecap: "butt",
    percent: asPercentage,
    strokeWidth: 12,
    trailWidth: 12,
    strokeColor: getProgressColor({ palette, value, max }),
    className: classes.circle
  }), /* @__PURE__ */ React__default.createElement("div", {
    className: classes.overlay
  }, isNaN(value) ? "N/A" : `${Math.round(value * 10) / 10}`))));
}

const CodeHealthKpiInfoCard = ({ children }) => {
  const linkInfo = {
    title: "What does this mean?",
    link: "https://codescene.com/blog/3-code-health-kpis/"
  };
  return /* @__PURE__ */ React__default.createElement(InfoCard, {
    title: "Code Health KPIs",
    subheader: "The Code Health metric identifies source code that is expensive and risky to maintain.",
    deepLink: linkInfo
  }, children);
};
const useStyles = makeStyles$1({
  root: {
    height: "100%",
    width: 100,
    margin: "12.5px 0px 0px 50px"
  }
});
const CodeHealthKpisCard = ({
  codesceneHost,
  analysis
}) => {
  const classes = useStyles();
  if (!analysis.high_level_metrics.hotspots_code_health_now_weighted_average || !analysis.high_level_metrics.hotspots_code_health_month_weighted_average || !analysis.high_level_metrics.code_health_weighted_average_current || !analysis.high_level_metrics.code_health_weighted_average_last_month || !analysis.high_level_metrics.code_health_now_worst_performer || !analysis.high_level_metrics.code_health_month_worst_performer) {
    return /* @__PURE__ */ React__default.createElement(CodeHealthKpiInfoCard, null, /* @__PURE__ */ React__default.createElement(EmptyState, {
      missing: "data",
      title: "Your project does not expose Code Health KPIs",
      description: "Enable the 'Full Code Health Scan' option and trigger an analysis to scan the health of all code in the project.",
      action: /* @__PURE__ */ React__default.createElement(Button, {
        color: "primary",
        href: `${codesceneHost}/projects/${analysis.project_id}/configuration#hotspots`,
        variant: "contained"
      }, "Configuration")
    }));
  }
  const hotspotCodeHealth = {
    name: "Hotspot Code Health",
    description: "A weighted average of the code health in your hotspots. Generally, this is the most critical metric since low code health in a hotspot will be expensive.",
    value: analysis.high_level_metrics.hotspots_code_health_now_weighted_average,
    oldValue: analysis.high_level_metrics.hotspots_code_health_month_weighted_average
  };
  const averageCodeHealth = {
    name: "Average Code Health",
    description: "A weighted average of all the files in the codebase. This KPI indicates how deep any potential code health issues go.",
    value: analysis.high_level_metrics.code_health_weighted_average_current,
    oldValue: analysis.high_level_metrics.code_health_weighted_average_last_month
  };
  const worstPerformer = {
    name: "Worst Performer",
    description: "A single file code health score representing the lowest code health in any module across the codebase. Points out long-term risks.",
    value: analysis.high_level_metrics.code_health_now_worst_performer,
    oldValue: analysis.high_level_metrics.code_health_month_worst_performer
  };
  const kpis = [hotspotCodeHealth, averageCodeHealth, worstPerformer];
  const cards = kpis.map((kpi) => {
    const lastMonthText = Math.abs(kpi.oldValue - kpi.value) < 0.1 ? void 0 : `(from ${kpi.oldValue} last month)`;
    return /* @__PURE__ */ React__default.createElement("div", {
      key: kpi.name
    }, /* @__PURE__ */ React__default.createElement(Grid, {
      container: true,
      spacing: 2,
      direction: "row",
      wrap: "nowrap",
      justifyContent: "space-between",
      alignItems: "center"
    }, /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      md: 4
    }, /* @__PURE__ */ React__default.createElement("div", {
      className: classes.root
    }, /* @__PURE__ */ React__default.createElement(Gauge, {
      value: kpi.value,
      max: 10,
      tooltipText: kpi.description
    }))), /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      md: 8
    }, /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "body1"
    }, kpi.name), /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "h6"
    }, /* @__PURE__ */ React__default.createElement("b", null, Math.round(kpi.value * 10) / 10), " ", lastMonthText))));
  });
  return /* @__PURE__ */ React__default.createElement(CodeHealthKpiInfoCard, null, cards);
};

const CodeSceneProjectDetailsPage = () => {
  const params = useParams();
  const projectId = Number(params.projectId);
  const codesceneApi = useApi(codesceneApiRef);
  const config = useApi(configApiRef);
  const {
    value: analysis,
    loading,
    error
  } = useAsync(async () => {
    return await codesceneApi.fetchLatestAnalysis(projectId);
  }, []);
  if (loading) {
    return /* @__PURE__ */ React__default.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React__default.createElement(Alert, {
      severity: "error"
    }, error.message);
  } else if (!analysis) {
    return /* @__PURE__ */ React__default.createElement(EmptyState, {
      missing: "content",
      title: "CodeScene analysis",
      description: `No analysis found for project with id ${params.projectId}`
    });
  }
  const columns = [
    {
      title: "Language",
      field: "language",
      highlight: true
    },
    {
      title: "Files",
      field: "number_of_files",
      type: "numeric"
    },
    {
      title: "Code",
      field: "code",
      type: "numeric"
    },
    {
      title: "Comment",
      field: "comment",
      type: "numeric"
    }
  ];
  const fileSummaryTable = /* @__PURE__ */ React__default.createElement(Table, {
    options: { paging: false, padding: "dense" },
    data: analysis.file_summary.sort((a, b) => b.code - a.code),
    columns,
    title: "File Summary"
  });
  const codesceneHost = config.getString("codescene.baseUrl");
  const analysisPath = `${codesceneHost}/${projectId}/analyses/${analysis.id}`;
  const analysisLink = { title: "Check the analysis", link: analysisPath };
  const analysisBody = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "body1"
  }, /* @__PURE__ */ React__default.createElement("b", null, "Active authors"), ": ", analysis.summary.active_authors_count), /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "body1"
  }, /* @__PURE__ */ React__default.createElement("b", null, "Total authors"), ": ", analysis.summary.authors_count), /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "body1"
  }, /* @__PURE__ */ React__default.createElement("b", null, "Commits"), ": ", analysis.summary.commits));
  return /* @__PURE__ */ React__default.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React__default.createElement(Header, {
    title: `CodeScene: ${analysis.name}`,
    subtitle: `Last analysis: ${analysis.readable_analysis_time}`
  }, /* @__PURE__ */ React__default.createElement(SupportButton, null, "See hidden risks and social patterns in your code. Prioritize and reduce technical debt.")), /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 2
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: true,
    sm: true,
    md: true
  }, /* @__PURE__ */ React__default.createElement(CodeHealthKpisCard, {
    codesceneHost,
    analysis
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(GaugeCard, {
    title: "System Mastery",
    progress: analysis.high_level_metrics.system_mastery / 100
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement(GaugeCard, {
    title: "Current Score",
    progress: analysis.high_level_metrics.current_score / 10
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    style: { minWidth: "460px" }
  }, /* @__PURE__ */ React__default.createElement(InfoCard, {
    title: "Analysis",
    deepLink: analysisLink
  }, analysisBody))), /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 2,
    direction: "column"
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, fileSummaryTable))));
};

export { CodeSceneProjectDetailsPage };
//# sourceMappingURL=index-ae3fcafc.esm.js.map
