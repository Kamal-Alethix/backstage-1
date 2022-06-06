import { exploreToolsConfigRef } from '@backstage/plugin-explore-react';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { makeStyles, Card, CardMedia, CardContent, Typography, Chip, Box, CardActions } from '@material-ui/core';
import { Button, Content, ContentHeader, SupportButton, Progress, WarningPanel, EmptyState, ItemCardGrid } from '@backstage/core-components';
import classNames from 'classnames';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 128
  },
  mediaContain: {
    backgroundSize: "contain"
  },
  lifecycle: {
    lineHeight: "0.8em",
    color: "white"
  },
  ga: {
    backgroundColor: theme.palette.status.ok
  },
  alpha: {
    backgroundColor: theme.palette.status.error
  },
  beta: {
    backgroundColor: theme.palette.status.warning
  }
}));
const ToolCard = ({ card, objectFit }) => {
  const classes = useStyles();
  const { title, description, url, image, lifecycle, tags } = card;
  return /* @__PURE__ */ React.createElement(Card, {
    key: title
  }, /* @__PURE__ */ React.createElement(CardMedia, {
    image,
    title,
    className: classNames(classes.media, {
      [classes.mediaContain]: objectFit === "contain"
    })
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true,
    variant: "h5"
  }, title, " ", lifecycle && lifecycle.toLocaleLowerCase("en-US") !== "ga" && /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    label: lifecycle,
    className: classNames(classes.lifecycle, classes[lifecycle.toLocaleLowerCase("en-US")])
  })), /* @__PURE__ */ React.createElement(Typography, null, description || "Description missing"), tags && /* @__PURE__ */ React.createElement(Box, {
    marginTop: 2
  }, tags.map((item, idx) => /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    key: idx,
    label: item
  })))), /* @__PURE__ */ React.createElement(CardActions, null, /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    to: url,
    disabled: !url
  }, "Explore")));
};

const Body = () => {
  const exploreToolsConfigApi = useApi(exploreToolsConfigRef);
  const {
    value: tools,
    loading,
    error
  } = useAsync(async () => {
    return await exploreToolsConfigApi.getTools();
  }, [exploreToolsConfigApi]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(WarningPanel, {
      title: "Failed to load tools"
    });
  }
  if (!(tools == null ? void 0 : tools.length)) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "info",
      title: "No tools to display",
      description: "You haven't added any tools yet."
    });
  }
  return /* @__PURE__ */ React.createElement(ItemCardGrid, null, tools.map((tool, index) => /* @__PURE__ */ React.createElement(ToolCard, {
    key: index,
    card: tool
  })));
};
const ToolExplorerContent = ({ title }) => /* @__PURE__ */ React.createElement(Content, {
  noPadding: true
}, /* @__PURE__ */ React.createElement(ContentHeader, {
  title: title != null ? title : "Tools"
}, /* @__PURE__ */ React.createElement(SupportButton, null, "Discover the tools in your ecosystem.")), /* @__PURE__ */ React.createElement(Body, null));

export { ToolExplorerContent as T };
//# sourceMappingURL=ToolExplorerContent-8de53a9f.esm.js.map
