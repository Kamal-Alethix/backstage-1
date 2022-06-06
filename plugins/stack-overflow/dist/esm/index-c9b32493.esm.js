import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import useAsync from 'react-use/lib/useAsync';
import qs from 'qs';
import React from 'react';

const Content = (props) => {
  const { requestParams } = props;
  const configApi = useApi(configApiRef);
  const baseUrl = configApi.getOptionalString("stackoverflow.baseUrl") || "https://api.stackexchange.com/2.2";
  const { value, loading, error } = useAsync(async () => {
    const params = qs.stringify(requestParams, { addQueryPrefix: true });
    const response = await fetch(`${baseUrl}/questions${params}`);
    const data = await response.json();
    return data.items;
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement("p", null, "loading...");
  }
  if (error || !value || !value.length) {
    return /* @__PURE__ */ React.createElement("p", null, "could not load questions");
  }
  const getSecondaryText = (answer_count) => answer_count > 1 ? `${answer_count} answers` : `${answer_count} answer`;
  return /* @__PURE__ */ React.createElement(List, null, value.map((question) => /* @__PURE__ */ React.createElement(ListItem, {
    key: question.link
  }, /* @__PURE__ */ React.createElement(Link, {
    to: question.link
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: question.title,
    secondary: getSecondaryText(question.answer_count)
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(IconButton, {
    edge: "end",
    "aria-label": "external-link"
  }, /* @__PURE__ */ React.createElement(OpenInNewIcon, null)))))));
};

export { Content };
//# sourceMappingURL=index-c9b32493.esm.js.map
