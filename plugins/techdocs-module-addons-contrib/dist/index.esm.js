import { useApi, createPlugin } from '@backstage/core-plugin-api';
import { useShadowRootElements, useShadowRootSelection, createTechDocsAddonExtension, TechDocsAddonLocations } from '@backstage/plugin-techdocs-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { withStyles, Button, makeStyles, Portal, Paper, Slider, useTheme, MenuItem, ListItemText, Typography, Box, IconButton } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import parseGitUrl from 'git-url-parse';
import { replaceGitHubUrlType, replaceGitLabUrlType } from '@backstage/integration';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import BugReportIcon from '@material-ui/icons/BugReport';
import { Link, GitHubIcon } from '@backstage/core-components';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const NESTED_LIST_TOGGLE = ".md-nav__item--nested .md-toggle";
const EXPANDABLE_NAVIGATION_LOCAL_STORAGE = "@backstage/techdocs-addons/nav-expanded";
const StyledButton = withStyles({
  root: {
    position: "absolute",
    left: "220px",
    top: "19px",
    padding: 0,
    minWidth: 0
  }
})(Button);
const CollapsedIcon = withStyles({
  root: {
    height: "20px",
    width: "20px"
  }
})(ChevronRightIcon);
const ExpandedIcon = withStyles({
  root: {
    height: "20px",
    width: "20px"
  }
})(ExpandMoreIcon);
const ExpandableNavigationAddon = () => {
  const defaultValue = { expandAllNestedNavs: false };
  const [expanded, setExpanded] = useLocalStorageValue(EXPANDABLE_NAVIGATION_LOCAL_STORAGE, defaultValue);
  const [hasNavSubLevels, setHasNavSubLevels] = useState(false);
  const [...checkboxToggles] = useShadowRootElements([
    NESTED_LIST_TOGGLE
  ]);
  const shouldToggle = useCallback((item) => {
    const isExpanded = item.checked;
    const shouldExpand = expanded == null ? void 0 : expanded.expandAllNestedNavs;
    if (shouldExpand && !isExpanded) {
      return true;
    }
    if (!shouldExpand && isExpanded) {
      return true;
    }
    return false;
  }, [expanded]);
  useEffect(() => {
    if (!(checkboxToggles == null ? void 0 : checkboxToggles.length))
      return;
    setHasNavSubLevels(true);
    checkboxToggles.forEach((item) => {
      if (shouldToggle(item))
        item.click();
    });
  }, [expanded, shouldToggle, checkboxToggles]);
  const handleState = () => {
    setExpanded((prevState) => ({
      expandAllNestedNavs: !(prevState == null ? void 0 : prevState.expandAllNestedNavs)
    }));
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, hasNavSubLevels ? /* @__PURE__ */ React.createElement(StyledButton, {
    size: "small",
    onClick: handleState,
    "aria-label": (expanded == null ? void 0 : expanded.expandAllNestedNavs) ? "collapse-nav" : "expand-nav"
  }, (expanded == null ? void 0 : expanded.expandAllNestedNavs) ? /* @__PURE__ */ React.createElement(ExpandedIcon, null) : /* @__PURE__ */ React.createElement(CollapsedIcon, null)) : null);
};

const ADDON_FEEDBACK_CONTAINER_ID = "techdocs-report-issue";
const ADDON_FEEDBACK_CONTAINER_SELECTOR = `#${ADDON_FEEDBACK_CONTAINER_ID}`;
const PAGE_EDIT_LINK_SELECTOR = '[title^="Edit this page"]';
const PAGE_FEEDBACK_LINK_SELECTOR = '[title^="Leave feedback for"]';
const PAGE_MAIN_CONTENT_SELECTOR = '[data-md-component="main"] .md-content';

const resolveBlobUrl = (url, type) => {
  if (type === "github") {
    return replaceGitHubUrlType(url, "blob");
  } else if (type === "gitlab") {
    return replaceGitLabUrlType(url, "blob");
  }
  console.error(`Invalid SCM type ${type} found in ReportIssue addon for URL ${url}!`);
  return url;
};
const getTitle = (selection) => {
  const text = selection.toString().substring(0, 70);
  const ellipsis = text.length === 70 ? "..." : "";
  return `Documentation feedback: ${text}${ellipsis}`;
};
const getBody = (selection, markdownUrl) => {
  const title = "## Documentation Feedback \u{1F4DD}";
  const subheading = "#### The highlighted text:";
  const commentHeading = "#### The comment on the text:";
  const commentPlaceholder = "_>replace this line with your comment<_";
  const highlightedTextAsQuote = selection.toString().trim().split("\n").map((line) => `> ${line.trim()}`).join("\n");
  const facts = [
    `Backstage URL: <${window.location.href}> 
Markdown URL: <${markdownUrl}>`
  ];
  return `${title}

 ${subheading} 

 ${highlightedTextAsQuote}

 ${commentHeading} 
 ${commentPlaceholder}

 ___
${facts}`;
};
const useGitTemplate = (debounceTime) => {
  var _a, _b;
  const initialTemplate = { title: "", body: "" };
  const selection = useShadowRootSelection(debounceTime);
  const [editLink] = useShadowRootElements([PAGE_EDIT_LINK_SELECTOR]);
  const url = (_a = editLink == null ? void 0 : editLink.href) != null ? _a : "";
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  if (!selection || !url)
    return initialTemplate;
  const type = (_b = scmIntegrationsApi.byUrl(url)) == null ? void 0 : _b.type;
  if (!type)
    return initialTemplate;
  return {
    title: getTitle(selection),
    body: getBody(selection, resolveBlobUrl(url, type))
  };
};
const useGitRepository = () => {
  var _a, _b;
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const [editLink] = useShadowRootElements([PAGE_EDIT_LINK_SELECTOR]);
  const url = (_a = editLink == null ? void 0 : editLink.href) != null ? _a : "";
  if (!url)
    return null;
  const type = (_b = scmIntegrationsApi.byUrl(url)) == null ? void 0 : _b.type;
  if (!type)
    return null;
  return { ...parseGitUrl(resolveBlobUrl(url, type)), type };
};

const useStyles$2 = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(1),
    gridAutoFlow: "column",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.common.black,
    fontSize: theme.typography.button.fontSize
  }
}));
const getIcon = ({ type }) => {
  if (type === "github") {
    return GitHubIcon;
  }
  return BugReportIcon;
};
const getName = ({ type }) => {
  if (type === "github") {
    return "Github";
  }
  return "Gitlab";
};
const getUrl = (repository, template) => {
  const { title, body } = template;
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(body);
  const { protocol, resource, owner, name, type } = repository;
  const encodedOwner = encodeURIComponent(owner);
  const encodedName = encodeURIComponent(name);
  const url = `${protocol}://${resource}/${encodedOwner}/${encodedName}`;
  if (type === "github") {
    return `${url}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
  }
  return `${url}/issues/new?issue[title]=${encodedTitle}&issue[description]=${encodedBody}`;
};
const IssueLink = ({ template, repository }) => {
  const classes = useStyles$2();
  const Icon = getIcon(repository);
  const url = getUrl(repository, template);
  return /* @__PURE__ */ React.createElement(Link, {
    className: classes.root,
    to: url,
    target: "_blank"
  }, /* @__PURE__ */ React.createElement(Icon, null), " Open new ", getName(repository), " issue");
};

const useStyles$1 = makeStyles((theme) => ({
  root: {
    transform: "translate(-100%, -100%)",
    position: "absolute",
    padding: theme.spacing(1),
    zIndex: theme.zIndex.tooltip,
    background: theme.palette.common.white
  }
}));
const ReportIssueAddon = ({
  debounceTime = 500,
  templateBuilder: buildTemplate
}) => {
  const classes = useStyles$1();
  const [style, setStyle] = useState();
  const repository = useGitRepository();
  const defaultTemplate = useGitTemplate(debounceTime);
  const selection = useShadowRootSelection(debounceTime);
  const [mainContent, feedbackLink] = useShadowRootElements([
    PAGE_MAIN_CONTENT_SELECTOR,
    PAGE_FEEDBACK_LINK_SELECTOR
  ]);
  let [feedbackContainer] = useShadowRootElements([
    ADDON_FEEDBACK_CONTAINER_SELECTOR
  ]);
  if (feedbackLink) {
    feedbackLink.style.display = "none";
  }
  useEffect(() => {
    if (!repository || !selection || !selection.containsNode(mainContent, true) || (selection == null ? void 0 : selection.containsNode(feedbackContainer, true))) {
      return;
    }
    const mainContentPosition = mainContent.getBoundingClientRect();
    const selectionPosition = selection.getRangeAt(0).getBoundingClientRect();
    setStyle({
      top: `${selectionPosition.top - mainContentPosition.top - 16}px`,
      left: `${selectionPosition.left + selectionPosition.width / 2}px`
    });
  }, [selection, mainContent, feedbackContainer]);
  if (!selection || !repository)
    return null;
  if (!feedbackContainer) {
    feedbackContainer = document.createElement("div");
    feedbackContainer.setAttribute("id", ADDON_FEEDBACK_CONTAINER_ID);
    mainContent.prepend(feedbackContainer);
  }
  return /* @__PURE__ */ React.createElement(Portal, {
    container: feedbackContainer
  }, /* @__PURE__ */ React.createElement(Paper, {
    "data-testid": "report-issue-addon",
    className: classes.root,
    style
  }, /* @__PURE__ */ React.createElement(IssueLink, {
    repository,
    template: buildTemplate ? buildTemplate({ selection }) : defaultTemplate
  })));
};

const boxShadow = "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";
const StyledSlider = withStyles((theme) => ({
  root: {
    height: 2,
    padding: "15px 0"
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: theme.palette.common.white,
    boxShadow,
    marginTop: -9,
    marginLeft: -9,
    "&:focus, &:hover, &$active": {
      boxShadow: "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      "@media (hover: none)": {
        boxShadow
      }
    }
  },
  active: {},
  valueLabel: {
    top: "100%",
    left: "50%",
    transform: "scale(1) translate(-50%, -5px) !important",
    "& *": {
      color: theme.palette.common.black,
      fontSize: theme.typography.caption.fontSize,
      background: "transparent"
    }
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5
  },
  mark: {
    height: 10,
    width: 1,
    marginTop: -4
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor"
  }
}))(Slider);
const settings = {
  key: "techdocs.addons.settings.textsize",
  defaultValue: 100
};
const marks = [
  {
    value: 90
  },
  {
    value: 100
  },
  {
    value: 115
  },
  {
    value: 130
  },
  {
    value: 150
  }
];
const useStyles = makeStyles((theme) => ({
  container: {
    color: theme.palette.textSubtle,
    display: "flex",
    alignItems: "center",
    margin: 0,
    minWidth: 200
  },
  menuItem: {
    "&:hover": {
      background: "transparent"
    }
  },
  decreaseButton: {
    marginRight: theme.spacing(1)
  },
  increaseButton: {
    marginLeft: theme.spacing(1)
  }
}));
const TextSizeAddon = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [body] = useShadowRootElements(["body"]);
  const [value, setValue] = useState(() => {
    const initialValue = localStorage == null ? void 0 : localStorage.getItem(settings.key);
    return initialValue ? parseInt(initialValue, 10) : settings.defaultValue;
  });
  const values = useMemo(() => marks.map((mark) => mark.value), []);
  const index = useMemo(() => values.indexOf(value), [values, value]);
  const min = useMemo(() => values[0], [values]);
  const max = useMemo(() => values[values.length - 1], [values]);
  const getValueText = useCallback(() => `${value}%`, [value]);
  const handleChangeCommitted = useCallback((_event, newValue) => {
    if (!Array.isArray(newValue)) {
      setValue(newValue);
      localStorage == null ? void 0 : localStorage.setItem(settings.key, String(newValue));
    }
  }, [setValue]);
  const handleDecreaseClick = useCallback((event) => {
    handleChangeCommitted(event, values[index - 1]);
  }, [index, values, handleChangeCommitted]);
  const handleIncreaseClick = useCallback((event) => {
    handleChangeCommitted(event, values[index + 1]);
  }, [index, values, handleChangeCommitted]);
  useEffect(() => {
    var _a, _b;
    if (!body)
      return;
    const htmlFontSize = (_b = (_a = theme.typography) == null ? void 0 : _a.htmlFontSize) != null ? _b : 16;
    body.style.setProperty("--md-typeset-font-size", `${htmlFontSize * (value / 100)}px`);
  }, [body, value, theme]);
  return /* @__PURE__ */ React.createElement(MenuItem, {
    className: classes.menuItem,
    button: true,
    disableRipple: true
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(Typography, {
      variant: "subtitle2",
      color: "textPrimary"
    }, "Text size"),
    secondary: /* @__PURE__ */ React.createElement(Box, {
      className: classes.container
    }, /* @__PURE__ */ React.createElement(IconButton, {
      className: classes.decreaseButton,
      size: "small",
      edge: "start",
      disabled: value === min,
      onClick: handleDecreaseClick,
      "aria-label": "Decrease text size"
    }, /* @__PURE__ */ React.createElement(RemoveIcon, null)), /* @__PURE__ */ React.createElement(StyledSlider, {
      value,
      "aria-labelledby": "text-size-slider",
      getAriaValueText: getValueText,
      valueLabelDisplay: "on",
      valueLabelFormat: getValueText,
      marks,
      step: null,
      min,
      max,
      onChangeCommitted: handleChangeCommitted
    }), /* @__PURE__ */ React.createElement(IconButton, {
      className: classes.increaseButton,
      size: "small",
      edge: "end",
      disabled: value === max,
      onClick: handleIncreaseClick,
      "aria-label": "Increase text size"
    }, /* @__PURE__ */ React.createElement(AddIcon, null))),
    disableTypography: true
  }));
};

const techdocsModuleAddonsContribPlugin = createPlugin({
  id: "techdocsModuleAddonsContrib"
});
const ExpandableNavigation = techdocsModuleAddonsContribPlugin.provide(createTechDocsAddonExtension({
  name: "ExpandableNavigation",
  location: TechDocsAddonLocations.PrimarySidebar,
  component: ExpandableNavigationAddon
}));
const ReportIssue = techdocsModuleAddonsContribPlugin.provide(createTechDocsAddonExtension({
  name: "ReportIssue",
  location: TechDocsAddonLocations.Content,
  component: ReportIssueAddon
}));
const TextSize = techdocsModuleAddonsContribPlugin.provide(createTechDocsAddonExtension({
  name: "TextSize",
  location: TechDocsAddonLocations.Settings,
  component: TextSizeAddon
}));

export { ExpandableNavigation, ReportIssue, TextSize, techdocsModuleAddonsContribPlugin };
//# sourceMappingURL=index.esm.js.map
