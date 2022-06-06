import { getAdrLocationUrl } from '@backstage/plugin-adr-common';
import React, { useMemo } from 'react';
import { InfoCard, Progress, WarningPanel, MarkdownContent, Link } from '@backstage/core-components';
import { useApi, createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { scmAuthApiRef, scmIntegrationsApiRef } from '@backstage/integration-react';
import { useEntity } from '@backstage/plugin-catalog-react';
import parseGitUrl from 'git-url-parse';
import useAsync from 'react-use/lib/useAsync';
import { Octokit } from 'octokit';
import { makeStyles, ListItem, ListItemText, Box, Chip, Divider } from '@material-ui/core';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';

const useOctokitRequest = (request) => {
  var _a;
  const authApi = useApi(scmAuthApiRef);
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const { owner, name, ref, filepath } = parseGitUrl(request);
  const path = filepath.replace(/^\//, "");
  const baseUrl = (_a = scmIntegrations.github.byUrl(request)) == null ? void 0 : _a.config.apiBaseUrl;
  return useAsync(async () => {
    const { token } = await authApi.getCredentials({
      url: request,
      additionalScope: {
        customScopes: {
          github: ["repo"]
        }
      }
    });
    const octokit = new Octokit({
      auth: token,
      baseUrl
    });
    return octokit.request(`GET /repos/${owner}/${name}/contents/${path}?ref=${ref}`, {
      headers: { Accept: "application/vnd.github.v3.raw" }
    });
  }, [request]);
};

const adrDecoratorFactories = Object.freeze({
  createRewriteRelativeLinksDecorator() {
    return ({ baseUrl, content }) => ({
      content: content.replace(/\[([^\[\]]*)\]\((?!https?:\/\/)(.*?)(\.md)\)/gim, `[$1](${baseUrl}/$2$3)`)
    });
  },
  createRewriteRelativeEmbedsDecorator() {
    return ({ baseUrl, content }) => ({
      content: content.replace(/!\[([^\[\]]*)\]\((?!https?:\/\/)(.*?)(\.png|\.jpg|\.jpeg|\.gif|\.webp)(.*)\)/gim, `![$1](${baseUrl}/$2$3$4)`)
    });
  }
});

const AdrReader = ({
  adr,
  decorators
}) => {
  const { entity } = useEntity();
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const adrLocationUrl = getAdrLocationUrl(entity, scmIntegrations);
  const { value, loading, error } = useOctokitRequest(`${adrLocationUrl}/${adr}`);
  const adrContent = useMemo(() => {
    if (!(value == null ? void 0 : value.data)) {
      return "";
    }
    const adrDecorators = decorators != null ? decorators : [
      adrDecoratorFactories.createRewriteRelativeLinksDecorator(),
      adrDecoratorFactories.createRewriteRelativeEmbedsDecorator()
    ];
    return adrDecorators.reduce((content, decorator) => decorator({ baseUrl: adrLocationUrl, content }).content, value.data);
  }, [adrLocationUrl, decorators, value]);
  return /* @__PURE__ */ React.createElement(InfoCard, null, loading && /* @__PURE__ */ React.createElement(Progress, null), !loading && error && /* @__PURE__ */ React.createElement(WarningPanel, {
    title: "Failed to fetch ADR",
    message: error == null ? void 0 : error.message
  }), !loading && !error && (value == null ? void 0 : value.data) && /* @__PURE__ */ React.createElement(MarkdownContent, {
    content: adrContent,
    linkTarget: "_blank"
  }));
};
AdrReader.decorators = adrDecoratorFactories;

const rootRouteRef = createRouteRef({
  id: "adr"
});

const adrPlugin = createPlugin({
  id: "adr",
  routes: {
    root: rootRouteRef
  }
});
const EntityAdrContent = adrPlugin.provide(createRoutableExtension({
  name: "EntityAdrContent",
  component: () => import('./index-49c85f51.esm.js').then((m) => m.EntityAdrContent),
  mountPoint: rootRouteRef
}));

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: "wrap"
  },
  itemText: {
    width: "100%",
    wordBreak: "break-all",
    marginBottom: "1rem"
  }
});
const AdrSearchResultListItem = ({
  lineClamp = 5,
  highlight,
  result
}) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Link, {
    to: result.location
  }, /* @__PURE__ */ React.createElement(ListItem, {
    alignItems: "flex-start",
    className: classes.flexContainer
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    className: classes.itemText,
    primaryTypographyProps: { variant: "h6" },
    primary: (highlight == null ? void 0 : highlight.fields.title) ? /* @__PURE__ */ React.createElement(HighlightedSearchResultText, {
      text: highlight.fields.title,
      preTag: highlight.preTag,
      postTag: highlight.postTag
    }) : result.title,
    secondary: /* @__PURE__ */ React.createElement("span", {
      style: {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lineClamp,
        overflow: "hidden"
      }
    }, (highlight == null ? void 0 : highlight.fields.text) ? /* @__PURE__ */ React.createElement(HighlightedSearchResultText, {
      text: highlight.fields.text,
      preTag: highlight.preTag,
      postTag: highlight.postTag
    }) : result.text)
  }), /* @__PURE__ */ React.createElement(Box, null, result.status && /* @__PURE__ */ React.createElement(Chip, {
    label: `Status: ${result.status}`,
    size: "small"
  }), result.date && /* @__PURE__ */ React.createElement(Chip, {
    label: `Date: ${result.date}`,
    size: "small"
  }))), /* @__PURE__ */ React.createElement(Divider, {
    component: "li"
  }));
};

export { AdrReader as A, EntityAdrContent as E, adrPlugin as a, AdrSearchResultListItem as b, rootRouteRef as r, useOctokitRequest as u };
//# sourceMappingURL=index-28df527c.esm.js.map
