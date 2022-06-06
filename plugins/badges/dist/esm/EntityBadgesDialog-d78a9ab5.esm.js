import { useAsyncEntity } from '@backstage/plugin-catalog-react';
import { useTheme, useMediaQuery, Box, DialogContentText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import 'react-router';
import '@backstage/errors';
import '@backstage/catalog-model';
import { b as badgesApiRef } from './index-d686cb1a.esm.js';
import { CodeSnippet, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const EntityBadgesDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const { entity } = useAsyncEntity();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const badgesApi = useApi(badgesApiRef);
  const {
    value: badges,
    loading,
    error
  } = useAsync(async () => {
    if (open && entity) {
      return await badgesApi.getEntityBadgeSpecs(entity);
    }
    return [];
  }, [badgesApi, entity, open]);
  const content = (badges || []).map(({ badge: { description }, id, url, markdown }) => /* @__PURE__ */ React.createElement(Box, {
    marginTop: 4,
    key: id
  }, /* @__PURE__ */ React.createElement(DialogContentText, {
    component: "div"
  }, /* @__PURE__ */ React.createElement("img", {
    alt: description || id,
    src: url
  }), /* @__PURE__ */ React.createElement(CodeSnippet, {
    language: "markdown",
    text: markdown,
    showCopyCodeButton: true
  }))));
  return /* @__PURE__ */ React.createElement(Dialog, {
    fullScreen,
    open,
    onClose
  }, /* @__PURE__ */ React.createElement(DialogTitle, null, "Entity Badges"), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogContentText, null, "Embed badges in other web sites that link back to this entity. Copy the relevant snippet of Markdown code to use the badge."), loading && /* @__PURE__ */ React.createElement(Progress, null), error && /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
    error
  }), content), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: onClose,
    color: "primary"
  }, "Close")));
};

export { EntityBadgesDialog };
//# sourceMappingURL=EntityBadgesDialog-d78a9ab5.esm.js.map
