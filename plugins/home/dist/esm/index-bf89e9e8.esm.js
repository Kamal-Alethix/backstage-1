import { Link } from '@backstage/core-components';
import { makeStyles, List, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { createContext } from 'react';

const Context = createContext(void 0);
const ContextProvider = (props) => {
  const { children, tools } = props;
  const [toolsValue, _setTools] = React.useState(tools);
  const value = {
    tools: toolsValue
  };
  return /* @__PURE__ */ React.createElement(Context.Provider, {
    value
  }, children);
};
const useToolkit = () => {
  const value = React.useContext(Context);
  return value;
};

const useStyles = makeStyles((theme) => ({
  toolkit: {
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center"
  },
  tool: {
    margin: theme.spacing(0.5, 1)
  },
  label: {
    marginTop: theme.spacing(1),
    fontSize: "0.9em",
    lineHeight: "1.25",
    color: theme.palette.text.secondary
  },
  icon: {
    width: "64px",
    height: "64px",
    borderRadius: "50px",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.default
  }
}));
const Content = (props) => {
  var _a;
  const classes = useStyles();
  const toolkit = useToolkit();
  const tools = (_a = toolkit == null ? void 0 : toolkit.tools) != null ? _a : props.tools;
  return /* @__PURE__ */ React.createElement(List, {
    className: classes.toolkit
  }, tools.map((tool) => /* @__PURE__ */ React.createElement(Link, {
    key: tool.url,
    to: tool.url,
    className: classes.tool
  }, /* @__PURE__ */ React.createElement(ListItemIcon, {
    className: classes.icon
  }, tool.icon), /* @__PURE__ */ React.createElement(ListItemText, {
    secondaryTypographyProps: { className: classes.label },
    secondary: tool.label
  }))));
};

export { Content, ContextProvider };
//# sourceMappingURL=index-bf89e9e8.esm.js.map
