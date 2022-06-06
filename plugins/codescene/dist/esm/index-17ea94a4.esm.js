import React__default from 'react';
import { makeStyles, Chip, Grid, Card, CardActionArea, CardContent, CardActions, Input } from '@material-ui/core';
import { Progress, ItemCardHeader, Content, ContentHeader, Page, Header, SupportButton } from '@backstage/core-components';
import { useRouteRef, useApi } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { Link } from 'react-router-dom';
import { r as rootRouteRef, c as codesceneApiRef } from './index-bdc8477a.esm.js';
import '@backstage/errors';
import '@material-ui/core/SvgIcon';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: "scroll"
  }
}));
function matchFilter(filter) {
  const terms = filter == null ? void 0 : filter.toLocaleLowerCase("en-US").split(/\s/).map((e) => e.trim()).filter(Boolean);
  if (!(terms == null ? void 0 : terms.length)) {
    return () => true;
  }
  return (entry) => {
    const text = `${entry.name} ${entry.description || ""}`.toLocaleLowerCase("en-US");
    return terms.every((term) => text.includes(term));
  };
}
function topLanguages(analysis, coerceAtMost) {
  return analysis.file_summary.sort((a, b) => b.code - a.code).map((fileSummary) => fileSummary.language).slice(0, coerceAtMost);
}
const ProjectsComponent = () => {
  const routeRef = useRouteRef(rootRouteRef);
  const codesceneApi = useApi(codesceneApiRef);
  const classes = useStyles();
  const [searchText, setSearchText] = React__default.useState("");
  const {
    value: projectsWithAnalyses,
    loading,
    error
  } = useAsync(async () => {
    const projects2 = (await codesceneApi.fetchProjects()).projects;
    const promises = projects2.map((project) => codesceneApi.fetchLatestAnalysis(project.id));
    const analyses = await Promise.allSettled(promises).then((results) => {
      return results.filter((result) => result.status === "fulfilled").map((result) => result).map((result) => result.value).reduce((acc, analysis) => ({ ...acc, [analysis.project_id]: analysis }), {});
    });
    return projects2.reduce((acc, project) => ({
      ...acc,
      [project.id]: {
        project,
        analysis: analyses[project.id]
      }
    }), {});
  }, []);
  if (loading) {
    return /* @__PURE__ */ React__default.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React__default.createElement(Alert, {
      severity: "error"
    }, error.message);
  } else if (!projectsWithAnalyses || Object.keys(projectsWithAnalyses).length === 0) {
    return /* @__PURE__ */ React__default.createElement(Alert, {
      severity: "error"
    }, "No projects found!");
  }
  const projects = Object.values(projectsWithAnalyses).map((p) => p.project).sort((a, b) => a.name.localeCompare(b.name));
  const cards = projects.filter(matchFilter(searchText)).map((project) => {
    const analysis = projectsWithAnalyses[project.id].analysis;
    const subtitle = analysis ? `Last analysis: ${analysis.readable_analysis_time} \xB7 Score: ${analysis.high_level_metrics.current_score} \xB7 Active authors: ${analysis.high_level_metrics.active_developers}` : void 0;
    const chips = analysis ? topLanguages(analysis, 3).map((lang) => /* @__PURE__ */ React__default.createElement(Chip, {
      label: lang,
      key: lang,
      size: "small"
    })) : void 0;
    return /* @__PURE__ */ React__default.createElement(Grid, {
      key: project.id,
      item: true,
      xs: 3
    }, /* @__PURE__ */ React__default.createElement(Card, null, /* @__PURE__ */ React__default.createElement(CardActionArea, {
      style: {
        height: "100%",
        overflow: "hidden",
        width: "100%"
      },
      component: Link,
      to: `${routeRef()}/${project.id}`
    }, /* @__PURE__ */ React__default.createElement(ItemCardHeader, {
      title: project.name
    }), /* @__PURE__ */ React__default.createElement(CardContent, null, subtitle), /* @__PURE__ */ React__default.createElement(CardActions, {
      disableSpacing: true
    }, chips))));
  });
  return /* @__PURE__ */ React__default.createElement(Content, {
    className: classes.overflowXScroll
  }, /* @__PURE__ */ React__default.createElement(ContentHeader, {
    title: "Projects"
  }, /* @__PURE__ */ React__default.createElement(Input, {
    id: "projects-filter",
    type: "search",
    placeholder: "Filter",
    onChange: (e) => setSearchText(e.target.value)
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    container: true
  }, cards));
};

const CodeScenePageComponent = () => /* @__PURE__ */ React__default.createElement(Page, {
  themeId: "tool"
}, /* @__PURE__ */ React__default.createElement(Header, {
  title: "CodeScene",
  subtitle: "See hidden risks and social patterns in your code. Prioritize and reduce\n        technical debt."
}, /* @__PURE__ */ React__default.createElement(SupportButton, null)), /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(Grid, {
  container: true,
  spacing: 3,
  direction: "column"
}, /* @__PURE__ */ React__default.createElement(Grid, {
  item: true
}, /* @__PURE__ */ React__default.createElement(ProjectsComponent, null)))));

export { CodeScenePageComponent };
//# sourceMappingURL=index-17ea94a4.esm.js.map
