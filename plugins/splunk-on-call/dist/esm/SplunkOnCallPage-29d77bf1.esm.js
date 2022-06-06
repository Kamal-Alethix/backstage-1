import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { E as EntitySplunkOnCallCard } from './index-4741b8ba.esm.js';
import { Page, Header, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import '@backstage/core-plugin-api';
import 'react-use/lib/useAsync';
import '@backstage/plugin-catalog-react';
import '@material-ui/icons/AlarmAdd';
import '@material-ui/icons/Web';
import '@material-ui/lab';
import '@material-ui/core/Avatar';
import '@material-ui/icons/Email';
import '@material-ui/icons/Done';
import '@material-ui/icons/DoneAll';
import 'luxon';
import '@material-ui/icons/OpenInBrowser';
import 'react-use/lib/useAsyncFn';
import '../assets/emptystate.svg';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: "scroll"
  }
}));
const SplunkOnCallPage = ({
  title,
  subtitle,
  pageTitle
}) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title,
    subtitle
  }), /* @__PURE__ */ React.createElement(Content, {
    className: classes.overflowXScroll
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: pageTitle
  }, /* @__PURE__ */ React.createElement(SupportButton, null, "This is used to help you automate incident management.")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 6,
    md: 4
  }, /* @__PURE__ */ React.createElement(EntitySplunkOnCallCard, null)))));
};
SplunkOnCallPage.defaultProps = {
  title: "Splunk On-Call",
  subtitle: "Automate incident management",
  pageTitle: "Dashboard"
};

export { SplunkOnCallPage };
//# sourceMappingURL=SplunkOnCallPage-29d77bf1.esm.js.map
