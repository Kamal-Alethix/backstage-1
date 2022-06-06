import React from 'react';
import { InfoCard, Link, Header, RoutedTabs } from '@backstage/core-components';
import { Route } from 'react-router-dom';
import { SortView } from '../index.esm.js';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import '@backstage/core-plugin-api';
import 'react-use/lib/useAsyncFn';
import '@backstage/catalog-model';
import '@backstage/plugin-catalog-react';
import '@material-ui/icons/Edit';
import '@material-ui/icons/Chat';
import '@material-ui/icons/PersonAdd';
import '@material-ui/icons/Dashboard';
import '@material-ui/icons/LinkOff';
import 'react-hook-form';
import '@material-ui/core/InputLabel';
import '@material-ui/core/MenuItem';
import '@material-ui/core/FormControl';
import '@material-ui/core/Select';
import '@material-ui/pickers';
import '@date-io/luxon';
import '@material-ui/icons/Clear';
import '@material-ui/core/IconButton';
import '@material-ui/icons/Close';
import '@material-ui/core/Typography';
import '@material-ui/core/DialogTitle';
import '@material-ui/core/styles';
import '@material-ui/core/DialogContent';
import '@material-ui/core/DialogActions';
import '@material-ui/core/Button';
import '@material-ui/core/Dialog';
import '@material-ui/lab';
import '@material-ui/icons/ExitToApp';
import '@backstage/plugin-catalog';
import 'luxon';
import '@material-ui/icons/InsertLink';
import 'material-ui-search-bar';

const useStyles = makeStyles({
  subheader: {
    fontWeight: "bold"
  }
});
const About = () => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 4
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 5
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "About Bazaar"
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.subheader,
    variant: "body1"
  }, "What is the Bazaar?"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "The Bazaar is a place where teams can propose projects for cross-functional team development. Essentially a marketplace for internal projects suitable for", " ", /* @__PURE__ */ React.createElement(Link, {
    target: "_blank",
    to: "https://en.wikipedia.org/wiki/Inner_source"
  }, "Inner Sourcing"), '. With "Inner Sourcing", we mean projects that are developed internally within a company, but with Open Source best practices.'), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.subheader,
    variant: "body1"
  }, "Why?"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Many companies today are of high need to increase the ease of cross-team cooperation. In large organizations, engineers often have limited ways of discovering or announcing the projects which could benefit from a wider development effort in terms of different expertise, experiences, and teams spread across the organization. With no good way to find these existing internal projects to join, the possibility of working with Inner Sourcing practices suffers."), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.subheader,
    variant: "body1"
  }, "How?"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "The Bazaar allows engineers and teams to open up and announce their new and exciting projects for transparent cooperation in other parts of larger organizations. The Bazaar ensures that new Inner Sourcing friendly projects gain visibility through Backstage and a way for interested engineers to show their interest and in the future contribute with their specific skill set. The Bazaar also provides an easy way to manage, catalog, and browse these Inner Sourcing friendly projects and components."))));
};

const HomePage = () => {
  const tabContent = [
    {
      path: "/",
      title: "Home",
      children: /* @__PURE__ */ React.createElement(Route, {
        path: "/",
        element: /* @__PURE__ */ React.createElement(SortView, null)
      })
    },
    {
      path: "/about",
      title: "About",
      children: /* @__PURE__ */ React.createElement(Route, {
        path: "/about",
        element: /* @__PURE__ */ React.createElement(About, null)
      })
    }
  ];
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Header, {
    title: "Bazaar",
    subtitle: "Marketplace for inner source projects"
  }), /* @__PURE__ */ React.createElement(RoutedTabs, {
    routes: tabContent
  }));
};

export { HomePage };
//# sourceMappingURL=index-fed672f1.esm.js.map
