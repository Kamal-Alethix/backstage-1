import { EntityProvider } from '@backstage/plugin-catalog-react';
import { makeStyles, Grid, Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@material-ui/core';
import React, { useState, useCallback, cloneElement } from 'react';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import { SidebarItem, AlertDisplay, OAuthRequestDialog, SidebarPage, Sidebar, SidebarSpacer, SidebarSpace, SidebarDivider } from '@backstage/core-components';
import { useApi, appThemeApiRef, attachComponentData, createRouteRef, createApiFactory, configApiRef } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef, ScmIntegrationsApi } from '@backstage/integration-react';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { Route } from 'react-router';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import useObservable from 'react-use/lib/useObservable';

const useStyles = makeStyles((theme) => ({
  root: ({ entity }) => ({
    position: "relative",
    "&::before": {
      content: `"${entity.metadata.name}"`,
      top: -theme.typography.fontSize + 4,
      display: "block",
      position: "absolute",
      color: theme.palette.textSubtle
    }
  })
}));
const EntityGridItem = (props) => {
  const { entity, classes, ...rest } = props;
  const itemClasses = useStyles({ entity });
  return /* @__PURE__ */ React.createElement(EntityProvider, {
    entity
  }, /* @__PURE__ */ React.createElement(Grid, {
    classes: { root: itemClasses.root, ...classes },
    ...rest,
    item: true
  }));
};

const ThemeIcon = ({ active, icon }) => icon ? cloneElement(icon, {
  color: active ? "primary" : void 0
}) : /* @__PURE__ */ React.createElement(AutoIcon, {
  color: active ? "primary" : void 0
});
const SidebarThemeSwitcher = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(appThemeApi.activeThemeId$(), appThemeApi.getActiveThemeId());
  const themeIds = appThemeApi.getInstalledThemes();
  const activeTheme = themeIds.find((t) => t.id === themeId);
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelectTheme = (newThemeId) => {
    if (themeIds.some((t) => t.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(void 0);
    }
    setAnchorEl(void 0);
  };
  const handleClose = () => {
    setAnchorEl(void 0);
  };
  const ActiveIcon = useCallback(() => /* @__PURE__ */ React.createElement(ThemeIcon, {
    icon: activeTheme == null ? void 0 : activeTheme.icon
  }), [activeTheme]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SidebarItem, {
    icon: ActiveIcon,
    text: "Switch Theme",
    id: "theme-button",
    "aria-haspopup": "listbox",
    "aria-controls": "theme-menu",
    "aria-label": "switch theme",
    "aria-expanded": open ? "true" : void 0,
    onClick: handleOpen
  }), /* @__PURE__ */ React.createElement(Menu, {
    id: "theme-menu",
    anchorEl,
    open,
    onClose: handleClose,
    MenuListProps: {
      "aria-labelledby": "theme-button",
      role: "listbox"
    }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    disabled: true
  }, "Choose a theme"), /* @__PURE__ */ React.createElement(MenuItem, {
    selected: themeId === void 0,
    onClick: () => handleSelectTheme(void 0)
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(ThemeIcon, {
    icon: void 0,
    active: themeId === void 0
  })), /* @__PURE__ */ React.createElement(ListItemText, null, "Auto")), themeIds.map((theme) => {
    const active = theme.id === themeId;
    return /* @__PURE__ */ React.createElement(MenuItem, {
      key: theme.id,
      selected: active,
      "aria-selected": active,
      onClick: () => handleSelectTheme(theme.id)
    }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(ThemeIcon, {
      icon: theme.icon,
      active
    })), /* @__PURE__ */ React.createElement(ListItemText, null, theme.title));
  })));
};

const GatheringRoute = ({ element }) => element;
attachComponentData(GatheringRoute, "core.gatherMountPoints", true);
class DevAppBuilder {
  constructor() {
    this.plugins = new Array();
    this.apis = new Array();
    this.rootChildren = new Array();
    this.routes = new Array();
    this.sidebarItems = new Array();
  }
  registerPlugin(...plugins) {
    this.plugins.push(...plugins);
    return this;
  }
  registerApi(factory) {
    this.apis.push(factory);
    return this;
  }
  addRootChild(node) {
    this.rootChildren.push(node);
    return this;
  }
  addPage(opts) {
    var _a, _b;
    const path = (_a = opts.path) != null ? _a : `/page-${this.routes.length + 1}`;
    if (!this.defaultPage || path === "/") {
      this.defaultPage = path;
    }
    if (opts.title) {
      this.sidebarItems.push(/* @__PURE__ */ React.createElement(SidebarItem, {
        key: path,
        to: path,
        text: opts.title,
        icon: (_b = opts.icon) != null ? _b : BookmarkIcon
      }));
    }
    this.routes.push(/* @__PURE__ */ React.createElement(GatheringRoute, {
      key: path,
      path,
      element: opts.element,
      children: opts.children
    }));
    return this;
  }
  addThemes(themes) {
    this.themes = themes;
    return this;
  }
  build() {
    const dummyRouteRef = createRouteRef({ id: "dummy" });
    const DummyPage = () => /* @__PURE__ */ React.createElement(Box, {
      p: 3
    }, "Page belonging to another plugin.");
    attachComponentData(DummyPage, "core.mountPoint", dummyRouteRef);
    const apis = [...this.apis];
    if (!apis.some((api) => api.api.id === scmIntegrationsApiRef.id)) {
      apis.push(createApiFactory({
        api: scmIntegrationsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi)
      }));
    }
    const app = createApp({
      apis,
      plugins: this.plugins,
      themes: this.themes,
      bindRoutes: ({ bind }) => {
        var _a;
        for (const plugin of (_a = this.plugins) != null ? _a : []) {
          const targets = {};
          for (const routeKey of Object.keys(plugin.externalRoutes)) {
            targets[routeKey] = dummyRouteRef;
          }
          bind(plugin.externalRoutes, targets);
        }
      }
    });
    const AppProvider = app.getProvider();
    const AppRouter = app.getRouter();
    const DevApp = () => {
      return /* @__PURE__ */ React.createElement(AppProvider, null, /* @__PURE__ */ React.createElement(AlertDisplay, null), /* @__PURE__ */ React.createElement(OAuthRequestDialog, null), this.rootChildren, /* @__PURE__ */ React.createElement(AppRouter, null, /* @__PURE__ */ React.createElement(SidebarPage, null, /* @__PURE__ */ React.createElement(Sidebar, null, /* @__PURE__ */ React.createElement(SidebarSpacer, null), this.sidebarItems, /* @__PURE__ */ React.createElement(SidebarSpace, null), /* @__PURE__ */ React.createElement(SidebarDivider, null), /* @__PURE__ */ React.createElement(SidebarThemeSwitcher, null)), /* @__PURE__ */ React.createElement(FlatRoutes, null, this.routes, /* @__PURE__ */ React.createElement(Route, {
        path: "/_external_route",
        element: /* @__PURE__ */ React.createElement(DummyPage, null)
      })))));
    };
    return DevApp;
  }
  render() {
    var _a, _b;
    const hotModule = (_b = (_a = require.cache["./dev/index.tsx"]) != null ? _a : require.cache["./dev/index.ts"]) != null ? _b : module;
    const DevApp = hot(hotModule)(this.build());
    if (window.location.pathname === "/" && this.defaultPage && this.defaultPage !== "/") {
      window.location.pathname = this.defaultPage;
    }
    ReactDOM.render(/* @__PURE__ */ React.createElement(DevApp, null), document.getElementById("root"));
  }
}
function createDevApp() {
  return new DevAppBuilder();
}

export { EntityGridItem, createDevApp };
//# sourceMappingURL=index.esm.js.map
