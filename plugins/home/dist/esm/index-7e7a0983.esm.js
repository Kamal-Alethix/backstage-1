import React from 'react';
import { Accordion, AccordionSummary, IconButton, Typography, AccordionDetails, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import 'react-router';
import { SettingsModal } from '../index.esm.js';
import { InfoCard } from '@backstage/core-components';
import '@backstage/core-plugin-api';

const useStyles = makeStyles((theme) => ({
  settingsIconButton: {
    padding: theme.spacing(0, 1, 0, 0)
  },
  contentContainer: {
    width: "100%"
  }
}));
const ComponentAccordion = (props) => {
  const {
    title,
    expanded = false,
    Content,
    Actions,
    Settings,
    ContextProvider,
    ...childProps
  } = props;
  const classes = useStyles();
  const [settingsIsExpanded, setSettingsIsExpanded] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  const handleOpenSettings = (e) => {
    e.stopPropagation();
    setSettingsIsExpanded((prevState) => !prevState);
  };
  const innerContent = /* @__PURE__ */ React.createElement(React.Fragment, null, Settings && /* @__PURE__ */ React.createElement(SettingsModal, {
    open: settingsIsExpanded,
    close: () => setSettingsIsExpanded(false),
    componentName: title
  }, /* @__PURE__ */ React.createElement(Settings, null)), /* @__PURE__ */ React.createElement(Accordion, {
    expanded: isExpanded,
    onChange: (_e, expandedValue) => setIsExpanded(expandedValue)
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null)
  }, Settings && /* @__PURE__ */ React.createElement(IconButton, {
    onClick: handleOpenSettings,
    className: classes.settingsIconButton
  }, /* @__PURE__ */ React.createElement(SettingsIcon, null)), /* @__PURE__ */ React.createElement(Typography, null, title)), /* @__PURE__ */ React.createElement(AccordionDetails, null, /* @__PURE__ */ React.createElement("div", {
    className: classes.contentContainer
  }, /* @__PURE__ */ React.createElement(Content, null), Actions && /* @__PURE__ */ React.createElement(Actions, null)))));
  return ContextProvider ? /* @__PURE__ */ React.createElement(ContextProvider, {
    ...childProps
  }, innerContent) : innerContent;
};

const ComponentTabs = (props) => {
  const { title, tabs } = props;
  const [value, setValue] = React.useState(0);
  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title
  }, /* @__PURE__ */ React.createElement(Tabs, {
    value,
    onChange: handleChange
  }, tabs.map((t) => /* @__PURE__ */ React.createElement(Tab, {
    key: t.label,
    label: t.label
  }))), tabs.map(({ Component }, idx) => /* @__PURE__ */ React.createElement("div", {
    key: idx,
    ...idx !== value ? { style: { display: "none" } } : {}
  }, /* @__PURE__ */ React.createElement(Component, null))));
};

const ComponentTab = (props) => {
  const { title, Content, ContextProvider, ...childProps } = props;
  return ContextProvider ? /* @__PURE__ */ React.createElement(ContextProvider, {
    ...childProps
  }, /* @__PURE__ */ React.createElement(Content, null)) : /* @__PURE__ */ React.createElement(Content, null);
};

export { ComponentAccordion, ComponentTab, ComponentTabs };
//# sourceMappingURL=index-7e7a0983.esm.js.map
