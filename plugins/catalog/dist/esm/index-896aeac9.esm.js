import { useEntity } from '@backstage/plugin-catalog-react';
import LanguageIcon from '@material-ui/icons/Language';
import React from 'react';
import { makeStyles, Typography, Button, Box, useMediaQuery, ImageList, ImageListItem } from '@material-ui/core';
import { CodeSnippet, Link, InfoCard } from '@backstage/core-components';
import { useApp } from '@backstage/core-plugin-api';

const ENTITY_YAML = `metadata:
  name: example
  links:
    - url: https://dashboard.example.com
      title: My Dashboard
      icon: dashboard`;
const useStyles$1 = makeStyles((theme) => ({
  code: {
    borderRadius: 6,
    margin: `${theme.spacing(2)}px 0px`,
    background: theme.palette.type === "dark" ? "#444" : "#fff"
  }
}), { name: "PluginCatalogEntityLinksEmptyState" });
function EntityLinksEmptyState() {
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, "No links defined for this entity. You can add links to your entity YAML as shown in the highlighted example below:"), /* @__PURE__ */ React.createElement("div", {
    className: classes.code
  }, /* @__PURE__ */ React.createElement(CodeSnippet, {
    text: ENTITY_YAML,
    language: "yaml",
    showLineNumbers: true,
    highlightedNumbers: [3, 4, 5, 6],
    customStyle: { background: "inherit", fontSize: "115%" }
  })), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    target: "_blank",
    href: "https://backstage.io/docs/features/software-catalog/descriptor-format#links-optional"
  }, "Read more"));
}

const useStyles = makeStyles({
  svgIcon: {
    display: "inline-block",
    "& svg": {
      display: "inline-block",
      fontSize: "inherit",
      verticalAlign: "baseline"
    }
  }
});
function IconLink(props) {
  const { href, text, Icon } = props;
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex"
  }, /* @__PURE__ */ React.createElement(Box, {
    mr: 1,
    className: classes.svgIcon
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "div"
  }, Icon ? /* @__PURE__ */ React.createElement(Icon, null) : /* @__PURE__ */ React.createElement(LanguageIcon, null))), /* @__PURE__ */ React.createElement(Box, {
    flexGrow: "1"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: href,
    target: "_blank",
    rel: "noopener"
  }, text || href)));
}

const colDefaults = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 3
};
function useDynamicColumns(cols) {
  var _a, _b;
  const matches = [
    useMediaQuery((theme) => theme.breakpoints.up("xl")) ? "xl" : null,
    useMediaQuery((theme) => theme.breakpoints.up("lg")) ? "lg" : null,
    useMediaQuery((theme) => theme.breakpoints.up("md")) ? "md" : null,
    useMediaQuery((theme) => theme.breakpoints.up("sm")) ? "sm" : null,
    useMediaQuery((theme) => theme.breakpoints.up("xs")) ? "xs" : null
  ];
  let numOfCols = 1;
  if (typeof cols === "number") {
    numOfCols = cols;
  } else {
    const breakpoint = (_a = matches.find((k) => k !== null)) != null ? _a : "xs";
    numOfCols = (_b = cols == null ? void 0 : cols[breakpoint]) != null ? _b : colDefaults[breakpoint];
  }
  return numOfCols;
}

function LinksGridList(props) {
  const { items, cols = void 0 } = props;
  const numOfCols = useDynamicColumns(cols);
  return /* @__PURE__ */ React.createElement(ImageList, {
    rowHeight: "auto",
    cols: numOfCols
  }, items.map(({ text, href, Icon }, i) => /* @__PURE__ */ React.createElement(ImageListItem, {
    key: i
  }, /* @__PURE__ */ React.createElement(IconLink, {
    href,
    text: text != null ? text : href,
    Icon
  }))));
}

function EntityLinksCard(props) {
  var _a;
  const { cols = void 0, variant } = props;
  const { entity } = useEntity();
  const app = useApp();
  const iconResolver = (key) => {
    var _a2;
    return key ? (_a2 = app.getSystemIcon(key)) != null ? _a2 : LanguageIcon : LanguageIcon;
  };
  const links = (_a = entity == null ? void 0 : entity.metadata) == null ? void 0 : _a.links;
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Links",
    variant
  }, !links || links.length === 0 ? /* @__PURE__ */ React.createElement(EntityLinksEmptyState, null) : /* @__PURE__ */ React.createElement(LinksGridList, {
    cols,
    items: links.map(({ url, title, icon }) => ({
      text: title != null ? title : url,
      href: url,
      Icon: iconResolver(icon)
    }))
  }));
}

export { EntityLinksCard };
//# sourceMappingURL=index-896aeac9.esm.js.map
