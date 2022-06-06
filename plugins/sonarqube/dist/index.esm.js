import { useEntity } from '@backstage/plugin-catalog-react';
import { useTheme, Avatar, Grid, Typography, Chip } from '@material-ui/core';
import { makeStyles, lighten } from '@material-ui/core/styles';
import BugReport from '@material-ui/icons/BugReport';
import LockOpen from '@material-ui/icons/LockOpen';
import Security from '@material-ui/icons/Security';
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';
import React, { useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { createApiRef, useApi, createPlugin, createApiFactory, configApiRef, discoveryApiRef, identityApiRef, createComponentExtension } from '@backstage/core-plugin-api';
import fetch from 'cross-fetch';
import { Circle } from 'rc-progress';
import { Link, InfoCard, Progress, MissingAnnotationEmptyState, EmptyState } from '@backstage/core-components';

const sonarQubeApiRef = createApiRef({
  id: "plugin.sonarqube.service"
});

class SonarQubeClient {
  constructor({
    discoveryApi,
    identityApi,
    baseUrl = "https://sonarcloud.io/"
  }) {
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  }
  async callApi(path, query) {
    const { token: idToken } = await this.identityApi.getCredentials();
    const apiUrl = `${await this.discoveryApi.getBaseUrl("proxy")}/sonarqube`;
    const response = await fetch(`${apiUrl}/${path}?${new URLSearchParams(query).toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    });
    if (response.status === 200) {
      return await response.json();
    }
    return void 0;
  }
  async getSupportedMetrics() {
    var _a, _b;
    const metrics = [];
    let nextPage = 1;
    for (; ; ) {
      const result = await this.callApi("metrics/search", { ps: 500, p: nextPage });
      metrics.push(...(_b = (_a = result == null ? void 0 : result.metrics) == null ? void 0 : _a.map((m) => m.key)) != null ? _b : []);
      if (result && metrics.length < result.total) {
        nextPage++;
        continue;
      }
      return metrics;
    }
  }
  async getFindingSummary(componentKey) {
    if (!componentKey) {
      return void 0;
    }
    const component = await this.callApi("components/show", {
      component: componentKey
    });
    if (!component) {
      return void 0;
    }
    const metrics = {
      alert_status: void 0,
      bugs: void 0,
      reliability_rating: void 0,
      vulnerabilities: void 0,
      security_rating: void 0,
      security_hotspots_reviewed: void 0,
      security_review_rating: void 0,
      code_smells: void 0,
      sqale_rating: void 0,
      coverage: void 0,
      duplicated_lines_density: void 0
    };
    const supportedMetrics = await this.getSupportedMetrics();
    const metricKeys = Object.keys(metrics).filter((m) => supportedMetrics.includes(m));
    const measures = await this.callApi("measures/search", {
      projectKeys: componentKey,
      metricKeys: metricKeys.join(",")
    });
    if (!measures) {
      return void 0;
    }
    measures.measures.filter((m) => m.component === componentKey).forEach((m) => {
      metrics[m.metric] = m.value;
    });
    return {
      lastAnalysis: component.component.analysisDate,
      metrics,
      projectUrl: `${this.baseUrl}dashboard?id=${encodeURIComponent(componentKey)}`,
      getIssuesUrl: (identifier) => `${this.baseUrl}project/issues?id=${encodeURIComponent(componentKey)}&types=${identifier.toLocaleUpperCase("en-US")}&resolved=false`,
      getComponentMeasuresUrl: (identifier) => `${this.baseUrl}component_measures?id=${encodeURIComponent(componentKey)}&metric=${identifier.toLocaleLowerCase("en-US")}&resolved=false&view=list`,
      getSecurityHotspotsUrl: () => `${this.baseUrl}project/security_hotspots?id=${encodeURIComponent(componentKey)}`
    };
  }
}

const SONARQUBE_PROJECT_KEY_ANNOTATION = "sonarqube.org/project-key";
const isSonarQubeAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[SONARQUBE_PROJECT_KEY_ANNOTATION]);
};
const useProjectKey = (entity) => {
  var _a, _b;
  return (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[SONARQUBE_PROJECT_KEY_ANNOTATION]) != null ? _b : "";
};

const useStyles$4 = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: theme.spacing(3)
  }
}));
const Percentage = ({ value }) => {
  const classes = useStyles$4();
  const theme = useTheme();
  return /* @__PURE__ */ React.createElement(Circle, {
    strokeLinecap: "butt",
    percent: +(value || 0),
    strokeWidth: 16,
    strokeColor: theme.palette.status.ok,
    trailColor: theme.palette.status.error,
    trailWidth: 16,
    className: classes.root
  });
};

const useStyles$3 = makeStyles((theme) => {
  const commonCardRating = {
    height: theme.spacing(3),
    width: theme.spacing(3),
    color: theme.palette.common.white
  };
  return {
    ratingDefault: {
      ...commonCardRating,
      background: theme.palette.status.aborted
    },
    ratingA: {
      ...commonCardRating,
      background: theme.palette.status.ok
    },
    ratingB: {
      ...commonCardRating,
      background: lighten(theme.palette.status.ok, 0.5)
    },
    ratingC: {
      ...commonCardRating,
      background: theme.palette.status.pending
    },
    ratingD: {
      ...commonCardRating,
      background: theme.palette.status.warning
    },
    ratingE: {
      ...commonCardRating,
      background: theme.palette.error.main
    }
  };
});
const Rating = ({
  rating,
  hideValue
}) => {
  const classes = useStyles$3();
  const ratingProp = useMemo(() => {
    switch (rating) {
      case "1.0":
        return {
          name: "A",
          className: classes.ratingA
        };
      case "2.0":
        return {
          name: "B",
          className: classes.ratingB
        };
      case "3.0":
        return {
          name: "C",
          className: classes.ratingC
        };
      case "4.0":
        return {
          name: "D",
          className: classes.ratingD
        };
      case "5.0":
        return {
          name: "E",
          className: classes.ratingE
        };
      default:
        return {
          name: "",
          className: classes.ratingDefault
        };
    }
  }, [classes, rating]);
  return /* @__PURE__ */ React.createElement(Avatar, {
    className: ratingProp.className
  }, !hideValue && ratingProp.name);
};

const useStyles$2 = makeStyles((theme) => {
  return {
    root: {
      margin: theme.spacing(1, 0),
      minWidth: "140px"
    },
    upper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    cardTitle: {
      textAlign: "center"
    },
    wrapIcon: {
      display: "inline-flex",
      verticalAlign: "baseline"
    },
    left: {
      display: "flex"
    },
    right: {
      display: "flex",
      marginLeft: theme.spacing(0.5)
    }
  };
});
const RatingCard = ({
  leftSlot,
  rightSlot,
  title,
  titleIcon,
  link
}) => {
  const classes = useStyles$2();
  return /* @__PURE__ */ React.createElement(Link, {
    to: link,
    color: "inherit",
    underline: "none"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.upper
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.left
  }, leftSlot), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.right
  }, rightSlot)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.cardTitle
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    className: classes.wrapIcon
  }, titleIcon, " ", title))));
};

const useStyles$1 = makeStyles((theme) => {
  return {
    value: {
      fontSize: "1.5rem",
      fontWeight: theme.typography.fontWeightMedium
    }
  };
});
const Value = ({ value }) => {
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement("span", {
    className: classes.value
  }, value);
};

const useStyles = makeStyles((theme) => ({
  badgeLabel: {
    color: theme.palette.common.white
  },
  badgeError: {
    margin: 0,
    backgroundColor: theme.palette.error.main
  },
  badgeSuccess: {
    margin: 0,
    backgroundColor: theme.palette.success.main
  },
  badgeUnknown: {
    backgroundColor: theme.palette.grey[500]
  },
  header: {
    padding: theme.spacing(2, 2, 2, 2.5)
  },
  action: {
    margin: 0
  },
  lastAnalyzed: {
    color: theme.palette.text.secondary
  },
  disabled: {
    backgroundColor: theme.palette.background.default
  }
}));
const defaultDuplicationRatings = [
  { greaterThan: 0, rating: "1.0" },
  { greaterThan: 3, rating: "2.0" },
  { greaterThan: 5, rating: "3.0" },
  { greaterThan: 10, rating: "4.0" },
  { greaterThan: 20, rating: "5.0" }
];
const SonarQubeCard = ({
  variant = "gridItem",
  duplicationRatings = defaultDuplicationRatings
}) => {
  const { entity } = useEntity();
  const sonarQubeApi = useApi(sonarQubeApiRef);
  const projectTitle = useProjectKey(entity);
  const { value, loading } = useAsync(async () => sonarQubeApi.getFindingSummary(projectTitle), [sonarQubeApi, projectTitle]);
  const deepLink = !loading && value ? {
    title: "View more",
    link: value.projectUrl
  } : void 0;
  const classes = useStyles();
  let gateLabel = "Not computed";
  let gateColor = classes.badgeUnknown;
  if (value == null ? void 0 : value.metrics.alert_status) {
    const gatePassed = value.metrics.alert_status === "OK";
    gateLabel = gatePassed ? "Gate passed" : "Gate failed";
    gateColor = gatePassed ? classes.badgeSuccess : classes.badgeError;
  }
  const qualityBadge = !loading && value && /* @__PURE__ */ React.createElement(Chip, {
    label: gateLabel,
    classes: { root: gateColor, label: classes.badgeLabel }
  });
  const duplicationRating = useMemo(() => {
    if (loading || !value || !value.metrics.duplicated_lines_density) {
      return "";
    }
    let rating = "";
    for (const r of duplicationRatings) {
      if (+value.metrics.duplicated_lines_density >= r.greaterThan) {
        rating = r.rating;
      }
    }
    return rating;
  }, [loading, value, duplicationRatings]);
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Code Quality",
    deepLink,
    variant,
    headerProps: {
      action: qualityBadge,
      classes: {
        root: classes.header,
        action: classes.action
      }
    },
    className: !loading && (!projectTitle || !value) ? classes.disabled : void 0
  }, loading && /* @__PURE__ */ React.createElement(Progress, null), !loading && !projectTitle && /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
    annotation: SONARQUBE_PROJECT_KEY_ANNOTATION
  }), !loading && projectTitle && !value && /* @__PURE__ */ React.createElement(EmptyState, {
    missing: "info",
    title: "No information to display",
    description: `There is no SonarQube project with key '${projectTitle}'.`
  }), !loading && value && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    justifyContent: "space-between",
    alignItems: "center",
    style: { height: "100%" },
    spacing: 0
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    justifyContent: "space-around"
  }, /* @__PURE__ */ React.createElement(RatingCard, {
    titleIcon: /* @__PURE__ */ React.createElement(BugReport, null),
    title: "Bugs",
    link: value.getIssuesUrl("BUG"),
    leftSlot: /* @__PURE__ */ React.createElement(Value, {
      value: value.metrics.bugs
    }),
    rightSlot: /* @__PURE__ */ React.createElement(Rating, {
      rating: value.metrics.reliability_rating
    })
  }), /* @__PURE__ */ React.createElement(RatingCard, {
    titleIcon: /* @__PURE__ */ React.createElement(LockOpen, null),
    title: "Vulnerabilities",
    link: value.getIssuesUrl("VULNERABILITY"),
    leftSlot: /* @__PURE__ */ React.createElement(Value, {
      value: value.metrics.vulnerabilities
    }),
    rightSlot: /* @__PURE__ */ React.createElement(Rating, {
      rating: value.metrics.security_rating
    })
  }), /* @__PURE__ */ React.createElement(RatingCard, {
    titleIcon: /* @__PURE__ */ React.createElement(SentimentVeryDissatisfied, null),
    title: "Code Smells",
    link: value.getIssuesUrl("CODE_SMELL"),
    leftSlot: /* @__PURE__ */ React.createElement(Value, {
      value: value.metrics.code_smells
    }),
    rightSlot: /* @__PURE__ */ React.createElement(Rating, {
      rating: value.metrics.sqale_rating
    })
  }), value.metrics.security_review_rating && /* @__PURE__ */ React.createElement(RatingCard, {
    titleIcon: /* @__PURE__ */ React.createElement(Security, null),
    title: "Hotspots Reviewed",
    link: value.getSecurityHotspotsUrl(),
    leftSlot: /* @__PURE__ */ React.createElement(Value, {
      value: value.metrics.security_hotspots_reviewed ? `${value.metrics.security_hotspots_reviewed}%` : "\u2014"
    }),
    rightSlot: /* @__PURE__ */ React.createElement(Rating, {
      rating: value.metrics.security_review_rating
    })
  }), /* @__PURE__ */ React.createElement("div", {
    style: { width: "100%" }
  }), /* @__PURE__ */ React.createElement(RatingCard, {
    link: value.getComponentMeasuresUrl("COVERAGE"),
    title: "Coverage",
    leftSlot: /* @__PURE__ */ React.createElement(Percentage, {
      value: value.metrics.coverage
    }),
    rightSlot: /* @__PURE__ */ React.createElement(Value, {
      value: value.metrics.coverage !== void 0 ? `${value.metrics.coverage}%` : "\u2014"
    })
  }), /* @__PURE__ */ React.createElement(RatingCard, {
    title: "Duplications",
    link: value.getComponentMeasuresUrl("DUPLICATED_LINES_DENSITY"),
    leftSlot: /* @__PURE__ */ React.createElement(Rating, {
      rating: duplicationRating,
      hideValue: true
    }),
    rightSlot: /* @__PURE__ */ React.createElement(Value, {
      value: `${value.metrics.duplicated_lines_density}%`
    })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.lastAnalyzed
  }, "Last analyzed on", " ", new Date(value.lastAnalysis).toLocaleString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })))));
};

const sonarQubePlugin = createPlugin({
  id: "sonarqube",
  apis: [
    createApiFactory({
      api: sonarQubeApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef
      },
      factory: ({ configApi, discoveryApi, identityApi }) => new SonarQubeClient({
        discoveryApi,
        baseUrl: configApi.getOptionalString("sonarQube.baseUrl"),
        identityApi
      })
    })
  ]
});
const EntitySonarQubeCard = sonarQubePlugin.provide(createComponentExtension({
  name: "EntitySonarQubeCard",
  component: {
    lazy: () => import('./esm/index-d203bddd.esm.js').then((m) => m.SonarQubeCard)
  }
}));

export { EntitySonarQubeCard, SonarQubeCard, isSonarQubeAvailable, sonarQubePlugin as plugin, sonarQubePlugin };
//# sourceMappingURL=index.esm.js.map
