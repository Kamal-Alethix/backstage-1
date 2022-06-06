import { createApiRef, createRouteRef, createPlugin, createApiFactory, configApiRef, createRoutableExtension, createComponentExtension, useApi, errorApiRef } from '@backstage/core-plugin-api';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, generatePath, useNavigate, useParams, Link as Link$1, resolvePath, Routes, Route } from 'react-router-dom';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles, Grid, Button, Tabs, Tab, List, ListItem, ListItemIcon, ListItemText, TextField, MenuItem } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import useAsync from 'react-use/lib/useAsync';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import CloseIcon from '@material-ui/icons/Close';
import { SupportButton, ContentHeader, InfoCard, MarkdownContent, StatusError, StatusOK, StatusPending, TrendLine, Link, Table, WarningPanel, Page, Header, HeaderLabel, Content, Progress, MissingAnnotationEmptyState, StructuredMetadataTable, StatusWarning } from '@backstage/core-components';
import useInterval from 'react-use/lib/useInterval';
import Alert from '@material-ui/lab/Alert';

class FetchError extends Error {
  get name() {
    return this.constructor.name;
  }
  static async forResponse(resp) {
    return new FetchError(`Request failed with status code ${resp.status}.
Reason: ${await resp.text()}`);
  }
}
const lighthouseApiRef = createApiRef({
  id: "plugin.lighthouse.service"
});
class LighthouseRestApi {
  constructor(url) {
    this.url = url;
  }
  static fromConfig(config) {
    return new LighthouseRestApi(config.getString("lighthouse.baseUrl"));
  }
  async fetch(input, init) {
    const resp = await fetch(`${this.url}${input}`, init);
    if (!resp.ok)
      throw await FetchError.forResponse(resp);
    return await resp.json();
  }
  async getWebsiteList({
    limit,
    offset
  } = {}) {
    const params = new URLSearchParams();
    if (typeof limit === "number")
      params.append("limit", limit.toString());
    if (typeof offset === "number")
      params.append("offset", offset.toString());
    return await this.fetch(`/v1/websites?${params.toString()}`);
  }
  async getWebsiteForAuditId(auditId) {
    return await this.fetch(`/v1/audits/${encodeURIComponent(auditId)}/website`);
  }
  async triggerAudit(payload) {
    return await this.fetch("/v1/audits", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  async getWebsiteByUrl(websiteUrl) {
    return this.fetch(`/v1/websites/${encodeURIComponent(websiteUrl)}`);
  }
}

const rootRouteRef = createRouteRef({
  id: "lighthouse"
});
createRouteRef({
  id: "lighthouse:audit"
});
const createAuditRouteRef = createRouteRef({
  id: "lighthouse:create-audit"
});
const entityContentRouteRef = createRouteRef({
  id: "lighthouse:entity-content"
});
const lighthousePlugin = createPlugin({
  id: "lighthouse",
  apis: [
    createApiFactory({
      api: lighthouseApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => LighthouseRestApi.fromConfig(configApi)
    })
  ],
  routes: {
    root: createAuditRouteRef,
    entityContent: entityContentRouteRef
  }
});
const LighthousePage = lighthousePlugin.provide(createRoutableExtension({
  name: "LighthousePage",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootRouteRef
}));
const EntityLighthouseContent = lighthousePlugin.provide(createRoutableExtension({
  name: "EntityLighthouseContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.EmbeddedRouter),
  mountPoint: entityContentRouteRef
}));
const EntityLastLighthouseAuditCard = lighthousePlugin.provide(createComponentExtension({
  name: "EntityLastLighthouseAuditCard",
  component: {
    lazy: () => import('./esm/index-25f68983.esm.js').then((m) => m.LastLighthouseAuditCard)
  }
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function formatTime(timestamp) {
  let date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }
  return date.toUTCString();
}
const CATEGORIES = [
  "accessibility",
  "performance",
  "seo",
  "best-practices"
];
const CATEGORY_LABELS = {
  accessibility: "Accessibility",
  performance: "Performance",
  seo: "SEO",
  "best-practices": "Best Practices",
  pwa: "Progressive Web App"
};
function buildSparklinesDataForItem(item) {
  return item.audits.filter((audit) => audit.status === "COMPLETED").reduce((scores, audit) => {
    Object.values(audit.categories).forEach((category) => {
      scores[category.id] = scores[category.id] || [];
      scores[category.id].unshift(category.score);
    });
    Object.values(scores).forEach((arr) => {
      if (arr.length === 1)
        arr.push(arr[0]);
    });
    return scores;
  }, {});
}

function LighthouseSupportButton() {
  return /* @__PURE__ */ React.createElement(SupportButton, null, "Lighthouse audits run for any web domain, stored over time.");
}

const LIGHTHOUSE_INTRO_LOCAL_STORAGE = "@backstage/lighthouse-plugin/intro-dismissed";
const USE_CASES = `
Google's [Lighthouse](https://developers.google.com/web/tools/lighthouse) auditing tool for websites
is a great open-source resource for benchmarking and improving the accessibility, performance, SEO, and best practices of your site.
At Spotify, we keep track of Lighthouse audit scores over time to look at trends and overall areas for investment.

This plugin allows you to generate on-demand Lighthouse audits for websites, and to track the trends for the
top-level categories of Lighthouse at a glance.

In the future, we hope to add support for scheduling audits (which we do internally), as well as allowing
custom runs of Lighthouse to be ingested (for auditing sites that require authentication or some session state).
`;
const SETUP = `
To get started, you will need a running instance of [lighthouse-audit-service](https://github.com/spotify/lighthouse-audit-service).
_It's likely you will need to enable CORS when running lighthouse-audit-service. Initialize the app
with the environment variable \`LAS_CORS\` set to \`true\`._

When you have an instance running that Backstage can hook into, first install the plugin into your app:

\`\`\`sh
cd packages/app
yarn add @backstage/plugin-lighthouse
\`\`\`

Modify your app routes in \`App.tsx\` to include the \`LighthousePage\` component exported from the plugin, for example:

\`\`\`tsx
// At the top imports
import { LighthousePage } from '@backstage/plugin-lighthouse';

<FlatRoutes>
  // ...
  <Route path="/lighthouse" element={<LighthousePage />} />
  // ...
</FlatRoutes>;
\`\`\`

Then configure the \`lighthouse-audit-service\` URL in your [\`app-config.yaml\`](https://github.com/backstage/backstage/blob/master/app-config.yaml).

\`\`\`yaml
lighthouse:
  baseUrl: http://your-service-url
\`\`\`
`;
const useStyles$2 = makeStyles((theme) => ({
  tabs: { marginBottom: -18 },
  tab: { minWidth: 72, paddingLeft: 1, paddingRight: 1 },
  content: { marginBottom: theme.spacing(2) },
  closeButtonContainer: { height: "100%" },
  closeButtonItem: { paddingBottom: 0 }
}));
function GettingStartedCard() {
  const classes = useStyles$2();
  const [value, setValue] = useState(0);
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Get started",
    subheader: /* @__PURE__ */ React.createElement(Tabs, {
      value,
      indicatorColor: "primary",
      textColor: "primary",
      onChange: (_ev, newValue) => setValue(newValue),
      "aria-label": "get started tabs",
      className: classes.tabs
    }, /* @__PURE__ */ React.createElement(Tab, {
      className: classes.tab,
      label: "Use cases"
    }), /* @__PURE__ */ React.createElement(Tab, {
      className: classes.tab,
      label: "Setup"
    })),
    divider: true,
    actions: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      direction: "row",
      justifyContent: "flex-end"
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true
    }, /* @__PURE__ */ React.createElement(Button, {
      component: "a",
      href: "https://github.com/spotify/lighthouse-audit-service",
      size: "small",
      target: "_blank"
    }, "Check out the README"))))
  }, value === 0 && /* @__PURE__ */ React.createElement(MarkdownContent, {
    content: USE_CASES
  }), value === 1 && /* @__PURE__ */ React.createElement(MarkdownContent, {
    content: SETUP
  }));
}
function LighthouseIntro({ onDismiss = () => {
} }) {
  const classes = useStyles$2();
  const [dismissed, setDismissed] = useLocalStorage(LIGHTHOUSE_INTRO_LOCAL_STORAGE, false);
  if (dismissed)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Welcome to Lighthouse in Backstage!"
  }, /* @__PURE__ */ React.createElement(LighthouseSupportButton, null)), /* @__PURE__ */ React.createElement(Grid, {
    className: classes.content,
    container: true,
    spacing: 3,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 6,
    md: 4
  }, /* @__PURE__ */ React.createElement(GettingStartedCard, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 6,
    md: 8
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    className: classes.closeButtonContainer
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.closeButtonItem
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "text",
    onClick: () => {
      onDismiss();
      setDismissed(true);
    }
  }, /* @__PURE__ */ React.createElement(CloseIcon, null), " Hide intro"))))));
}

const AuditStatusIcon = ({ audit }) => {
  if (audit.status === "FAILED")
    return /* @__PURE__ */ React.createElement(StatusError, null);
  if (audit.status === "COMPLETED")
    return /* @__PURE__ */ React.createElement(StatusOK, null);
  return /* @__PURE__ */ React.createElement(StatusPending, null);
};

const columns = [
  {
    title: "Website URL",
    field: "websiteUrl"
  },
  ...CATEGORIES.map((category) => ({
    title: CATEGORY_LABELS[category],
    field: category
  })),
  {
    title: "Last Report",
    field: "lastReport",
    cellStyle: {
      whiteSpace: "nowrap"
    }
  },
  {
    title: "Last Audit Triggered",
    field: "lastAuditTriggered",
    cellStyle: {
      minWidth: 120
    }
  }
];
const AuditListTable = ({ items }) => {
  const [websiteState, setWebsiteState] = useState(items);
  const lighthouseApi = useApi(lighthouseApiRef);
  useEffect(() => {
    setWebsiteState(items);
  }, [items]);
  const runRefresh = (websites) => {
    websites.forEach(async (website) => {
      const response = await lighthouseApi.getWebsiteForAuditId(website.lastAudit.id);
      const auditStatus = response.lastAudit.status;
      if (auditStatus === "COMPLETED" || auditStatus === "FAILED") {
        const newWebsiteData = websiteState.slice(0);
        newWebsiteData[newWebsiteData.findIndex((w) => w.url === response.url)] = response;
        setWebsiteState(newWebsiteData);
      }
    });
  };
  const runningWebsiteAudits = websiteState ? websiteState.filter((website) => website.lastAudit.status === "RUNNING") : [];
  useInterval(() => runRefresh(runningWebsiteAudits), runningWebsiteAudits.length > 0 ? 5e3 : null);
  const data = websiteState.map((website) => {
    const trendlineData = buildSparklinesDataForItem(website);
    const trendlines = {};
    CATEGORIES.forEach((category) => {
      trendlines[category] = /* @__PURE__ */ React.createElement(TrendLine, {
        title: `trendline for ${CATEGORY_LABELS[category]} category of ${website.url}`,
        data: trendlineData[category] || []
      });
    });
    return {
      websiteUrl: /* @__PURE__ */ React.createElement(Link, {
        to: generatePath("audit/:id", { id: website.lastAudit.id })
      }, website.url),
      ...trendlines,
      lastReport: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AuditStatusIcon, {
        audit: website.lastAudit
      }), " ", /* @__PURE__ */ React.createElement("span", null, website.lastAudit.status.toLocaleUpperCase("en-US"))),
      lastAuditTriggered: formatTime(website.lastAudit.timeCreated)
    };
  });
  return /* @__PURE__ */ React.createElement(Table, {
    options: {
      paging: false,
      toolbar: false
    },
    columns,
    data
  });
};

const LIMIT = 10;
const AuditList = () => {
  const [dismissedStored] = useLocalStorage(LIGHTHOUSE_INTRO_LOCAL_STORAGE);
  const [dismissed, setDismissed] = useState(dismissedStored);
  const query = useQuery();
  const page = query.get("page") ? parseInt(query.get("page"), 10) || 1 : 1;
  const lighthouseApi = useApi(lighthouseApiRef);
  const { value, loading, error } = useAsync(async () => await lighthouseApi.getWebsiteList({
    limit: LIMIT,
    offset: (page - 1) * LIMIT
  }), [page]);
  const pageCount = useMemo(() => {
    if ((value == null ? void 0 : value.total) && (value == null ? void 0 : value.limit))
      return Math.ceil((value == null ? void 0 : value.total) / (value == null ? void 0 : value.limit));
    return 0;
  }, [value == null ? void 0 : value.total, value == null ? void 0 : value.limit]);
  const navigate = useNavigate();
  let content = null;
  if (value) {
    content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AuditListTable, {
      items: (value == null ? void 0 : value.items) || []
    }), pageCount > 1 && /* @__PURE__ */ React.createElement(Pagination, {
      page,
      count: pageCount,
      onChange: (_event, newPage) => {
        navigate(`?page=${newPage}`);
      }
    }));
  } else if (loading) {
    content = /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    content = /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load audit list."
    }, error.message);
  }
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Lighthouse",
    subtitle: "Website audits powered by Lighthouse"
  }, /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Owner",
    value: "Spotify"
  }), /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Lifecycle",
    value: "Alpha"
  })), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(LighthouseIntro, {
    onDismiss: () => setDismissed(true)
  }), /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Audits",
    description: "View all audits run for your website through Backstage here. Track the trend of your most recent audits."
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    onClick: () => navigate("create-audit")
  }, "Create Audit"), dismissed && /* @__PURE__ */ React.createElement(LighthouseSupportButton, null)), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    noPadding: true
  }, content)))));
};

const useStyles$1 = makeStyles({
  contentGrid: {
    height: "100%"
  },
  iframe: {
    border: "0",
    width: "100%",
    height: "100%"
  },
  errorOutput: { whiteSpace: "pre" }
});
const AuditLinkList = ({ audits = [], selectedId }) => /* @__PURE__ */ React.createElement(List, {
  "data-testid": "audit-sidebar",
  component: "nav",
  "aria-label": "lighthouse audit history"
}, audits.map((audit) => /* @__PURE__ */ React.createElement(ListItem, {
  key: audit.id,
  selected: audit.id === selectedId,
  button: true,
  component: Link$1,
  replace: true,
  to: resolvePath(generatePath("audit/:id", { id: audit.id }), "../../")
}, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(AuditStatusIcon, {
  audit
})), /* @__PURE__ */ React.createElement(ListItemText, {
  primary: formatTime(audit.timeCreated)
}))));
const AuditView = ({ audit }) => {
  const classes = useStyles$1();
  const params = useParams();
  const { url: lighthouseUrl } = useApi(lighthouseApiRef);
  if ((audit == null ? void 0 : audit.status) === "RUNNING")
    return /* @__PURE__ */ React.createElement(Progress, null);
  if ((audit == null ? void 0 : audit.status) === "FAILED")
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "This audit failed when attempting to run after several retries. Check that your instance of lighthouse-audit-service can successfully connect to your website and try again.");
  return /* @__PURE__ */ React.createElement(InfoCard, {
    variant: "fullHeight"
  }, /* @__PURE__ */ React.createElement("iframe", {
    className: classes.iframe,
    title: `Lighthouse audit${(audit == null ? void 0 : audit.url) ? ` for ${audit.url}` : ""}`,
    src: `${lighthouseUrl}/v1/audits/${encodeURIComponent(params.id)}`
  }));
};
const AuditViewContent = () => {
  const lighthouseApi = useApi(lighthouseApiRef);
  const params = useParams();
  const classes = useStyles$1();
  const navigate = useNavigate();
  const {
    loading,
    error,
    value: nextValue
  } = useAsync(async () => await lighthouseApi.getWebsiteForAuditId(params.id), [params.id]);
  const [value, setValue] = useState();
  useEffect(() => {
    if (!!nextValue && nextValue.url !== (value == null ? void 0 : value.url)) {
      setValue(nextValue);
    }
  }, [value, nextValue, setValue]);
  let content = null;
  if (value) {
    content = /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      alignItems: "stretch",
      className: classes.contentGrid
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 3
    }, /* @__PURE__ */ React.createElement(AuditLinkList, {
      audits: value == null ? void 0 : value.audits,
      selectedId: params.id
    })), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 9
    }, /* @__PURE__ */ React.createElement(AuditView, {
      audit: value == null ? void 0 : value.audits.find((a) => a.id === params.id)
    })));
  } else if (loading) {
    content = /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    content = /* @__PURE__ */ React.createElement(Alert, {
      "data-testid": "error-message",
      severity: "error",
      className: classes.errorOutput
    }, error.message);
  }
  let createAuditButtonUrl = "create-audit";
  if (value == null ? void 0 : value.url) {
    createAuditButtonUrl += `?url=${encodeURIComponent(value.url)}`;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: (value == null ? void 0 : value.url) || "Audit",
    description: "See a history of all Lighthouse audits for your website run through Backstage."
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    onClick: () => navigate(`../../${createAuditButtonUrl}`)
  }, "Create New Audit"), /* @__PURE__ */ React.createElement(LighthouseSupportButton, null)), content);
};
const ConnectedAuditView = () => /* @__PURE__ */ React.createElement(Page, {
  themeId: "tool"
}, /* @__PURE__ */ React.createElement(Header, {
  title: "Lighthouse",
  subtitle: "Website audits powered by Lighthouse"
}, /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Owner",
  value: "Spotify"
}), /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Lifecycle",
  value: "Alpha"
})), /* @__PURE__ */ React.createElement(Content, {
  stretch: true
}, /* @__PURE__ */ React.createElement(AuditViewContent, null)));

const useStyles = makeStyles((theme) => ({
  input: {
    minWidth: 300,
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%"
    }
  },
  buttonList: {
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    "& > *": {
      margin: theme.spacing(1)
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
      marginRight: 0,
      flexDirection: "column",
      "& > *": {
        width: "100%"
      }
    }
  }
}));
const CreateAuditContent = () => {
  const errorApi = useApi(errorApiRef);
  const lighthouseApi = useApi(lighthouseApiRef);
  const classes = useStyles();
  const query = useQuery();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [url, setUrl] = useState(query.get("url") || "");
  const [emulatedFormFactor, setEmulatedFormFactor] = useState("mobile");
  const triggerAudit = useCallback(async () => {
    setSubmitting(true);
    try {
      await lighthouseApi.triggerAudit({
        url: url.replace(/\/$/, ""),
        options: {
          lighthouseConfig: {
            settings: {
              emulatedFormFactor
            }
          }
        }
      });
      navigate("..");
    } catch (err) {
      errorApi.post(err);
    } finally {
      setSubmitting(false);
    }
  }, [
    url,
    emulatedFormFactor,
    lighthouseApi,
    setSubmitting,
    errorApi,
    navigate
  ]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Trigger a new audit",
    description: "Submitting this form will immediately trigger and store a new Lighthouse audit. Trigger audits to track your website's accessibility, performance, SEO, and best practices over time."
  }, /* @__PURE__ */ React.createElement(LighthouseSupportButton, null)), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 6
  }, /* @__PURE__ */ React.createElement(InfoCard, null, /* @__PURE__ */ React.createElement("form", {
    onSubmit: (ev) => {
      ev.preventDefault();
      triggerAudit();
    }
  }, /* @__PURE__ */ React.createElement(List, null, /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(TextField, {
    name: "lighthouse-create-audit-url-tf",
    className: classes.input,
    label: "URL",
    placeholder: "https://spotify.com",
    helperText: "The target URL for Lighthouse to use.",
    required: true,
    disabled: submitting,
    onChange: (ev) => setUrl(ev.target.value),
    value: url,
    inputProps: { "aria-label": "URL" }
  })), /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(TextField, {
    name: "lighthouse-create-audit-emulated-form-factor-tf",
    className: classes.input,
    label: "Emulated Form Factor",
    helperText: "Device to simulate when auditing",
    select: true,
    required: true,
    disabled: submitting,
    onChange: (ev) => setEmulatedFormFactor(ev.target.value),
    value: emulatedFormFactor,
    inputProps: { "aria-label": "Emulated form factor" }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "mobile"
  }, "Mobile"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "desktop"
  }, "Desktop"))), /* @__PURE__ */ React.createElement(ListItem, {
    className: classes.buttonList
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "outlined",
    color: "primary",
    onClick: () => navigate(".."),
    disabled: submitting
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    type: "submit",
    disabled: submitting
  }, "Create Audit"))))))));
};
const CreateAudit = () => /* @__PURE__ */ React.createElement(Page, {
  themeId: "tool"
}, /* @__PURE__ */ React.createElement(Header, {
  title: "Lighthouse",
  subtitle: "Website audits powered by Lighthouse"
}, /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Owner",
  value: "Spotify"
}), /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Lifecycle",
  value: "Alpha"
})), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(CreateAuditContent, null)));

const LIGHTHOUSE_WEBSITE_URL_ANNOTATION = "lighthouse.com/website-url";

const useWebsiteForEntity = () => {
  var _a, _b;
  const { entity } = useEntity();
  const websiteUrl = (_b = (_a = entity.metadata.annotations) == null ? void 0 : _a[LIGHTHOUSE_WEBSITE_URL_ANNOTATION]) != null ? _b : "";
  const lighthouseApi = useApi(lighthouseApiRef);
  const errorApi = useApi(errorApiRef);
  const response = useAsync(() => lighthouseApi.getWebsiteByUrl(websiteUrl), [websiteUrl]);
  if (response.error) {
    errorApi.post(response.error);
  }
  return response;
};

const AuditListForEntity = () => {
  const { value, loading, error } = useWebsiteForEntity();
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error || !value) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(AuditListTable, {
    "data-test-id": "AuditListTable",
    items: [value]
  });
};

const isLighthouseAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[LIGHTHOUSE_WEBSITE_URL_ANNOTATION]);
};
const Router = () => /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
  path: "/",
  element: /* @__PURE__ */ React.createElement(AuditList, null)
}), /* @__PURE__ */ React.createElement(Route, {
  path: "/audit/:id",
  element: /* @__PURE__ */ React.createElement(ConnectedAuditView, null)
}), /* @__PURE__ */ React.createElement(Route, {
  path: "/create-audit",
  element: /* @__PURE__ */ React.createElement(CreateAudit, null)
}));
const EmbeddedRouter = (_props) => {
  const { entity } = useEntity();
  if (!isLighthouseAvailable(entity)) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: LIGHTHOUSE_WEBSITE_URL_ANNOTATION
    });
  }
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(AuditListForEntity, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "/audit/:id",
    element: /* @__PURE__ */ React.createElement(AuditViewContent, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "/create-audit",
    element: /* @__PURE__ */ React.createElement(CreateAuditContent, null)
  }));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isLighthouseAvailable: isLighthouseAvailable,
  Router: Router,
  EmbeddedRouter: EmbeddedRouter
});

const LighthouseCategoryScoreStatus = ({ score }) => {
  const scoreAsPercentage = Math.round(score * 100);
  switch (true) {
    case scoreAsPercentage >= 90:
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusOK, null), scoreAsPercentage, "%");
    case (scoreAsPercentage >= 50 && scoreAsPercentage < 90):
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusWarning, null), scoreAsPercentage, "%");
    case scoreAsPercentage < 50:
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusError, null), scoreAsPercentage, "%");
    default:
      return /* @__PURE__ */ React.createElement("span", null, "N/A");
  }
};
const LighthouseAuditStatus = ({ audit }) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AuditStatusIcon, {
  audit
}), audit.status.toLocaleUpperCase("en-US"));
const LighthouseAuditSummary = ({
  audit,
  dense = false
}) => {
  const { url } = audit;
  const flattenedCategoryData = {};
  if (audit.status === "COMPLETED") {
    const categories = audit.categories;
    const categoryIds = Object.keys(categories);
    categoryIds.forEach((id) => {
      const { title, score } = categories[id];
      flattenedCategoryData[title] = /* @__PURE__ */ React.createElement(LighthouseCategoryScoreStatus, {
        score
      });
    });
  }
  const tableData = {
    url,
    status: /* @__PURE__ */ React.createElement(LighthouseAuditStatus, {
      audit
    }),
    ...flattenedCategoryData
  };
  return /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    metadata: tableData,
    dense
  });
};
const LastLighthouseAuditCard = ({
  dense = false,
  variant
}) => {
  const { value: website, loading, error } = useWebsiteForEntity();
  let content;
  if (loading) {
    content = /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    content = null;
  }
  if (website) {
    content = /* @__PURE__ */ React.createElement(LighthouseAuditSummary, {
      audit: website.lastAudit,
      dense
    });
  }
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Lighthouse Audit",
    variant
  }, content);
};

export { EmbeddedRouter, EntityLastLighthouseAuditCard, EntityLighthouseContent, FetchError, LastLighthouseAuditCard, LighthousePage, LighthouseRestApi, Router, isLighthouseAvailable, isLighthouseAvailable as isPluginApplicableToEntity, lighthouseApiRef, lighthousePlugin, lighthousePlugin as plugin };
//# sourceMappingURL=index.esm.js.map
