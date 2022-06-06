import React from 'react';
import _unescape from 'lodash/unescape';
import { Link } from '@backstage/core-components';
import { ListItem, ListItemIcon, Box, ListItemText, Chip, Divider } from '@material-ui/core';

const StackOverflowSearchResultListItem = (props) => {
  const { location, title, text, answers, tags } = props.result;
  return /* @__PURE__ */ React.createElement(Link, {
    to: location
  }, /* @__PURE__ */ React.createElement(ListItem, {
    alignItems: "center"
  }, props.icon && /* @__PURE__ */ React.createElement(ListItemIcon, null, props.icon), /* @__PURE__ */ React.createElement(Box, {
    flexWrap: "wrap"
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primaryTypographyProps: { variant: "h6" },
    primary: _unescape(title),
    secondary: `Author: ${text}`
  }), /* @__PURE__ */ React.createElement(Chip, {
    label: `Answer(s): ${answers}`,
    size: "small"
  }), tags && tags.map((tag) => /* @__PURE__ */ React.createElement(Chip, {
    key: tag,
    label: `Tag: ${tag}`,
    size: "small"
  })))), /* @__PURE__ */ React.createElement(Divider, null));
};

export { StackOverflowSearchResultListItem };
//# sourceMappingURL=index-767ad4f2.esm.js.map
