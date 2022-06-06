import { createRouteRef, createPlugin, createRoutableExtension, useRouteRef, useApi, SessionState, googleAuthApiRef, microsoftAuthApiRef, githubAuthApiRef, gitlabAuthApiRef, oktaAuthApiRef, bitbucketAuthApiRef, oneloginAuthApiRef, atlassianAuthApiRef, configApiRef, featureFlagsApiRef, FeatureFlagState, identityApiRef, alertApiRef, appThemeApiRef, attachComponentData, useElementFilter } from '@backstage/core-plugin-api';
import React, { useState, useEffect, useCallback, cloneElement } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { SidebarItem, EmptyState, CodeSnippet, InfoCard, sidebarConfig, useSidebarPinState, Page, Header, TabbedLayout } from '@backstage/core-components';
import { useOutlet } from 'react-router';
import { Typography, Button, ListItem, ListItemIcon, ListItemText, Tooltip, ListItemSecondaryAction, List, Switch, Grid, TextField, IconButton, makeStyles, Avatar, Menu, MenuItem } from '@material-ui/core';
import Star from '@material-ui/icons/Star';
import ClearIcon from '@material-ui/icons/Clear';
import useAsync from 'react-use/lib/useAsync';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useObservable from 'react-use/lib/useObservable';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const settingsRouteRef = createRouteRef({
  id: "user-settings"
});
const userSettingsPlugin = createPlugin({
  id: "user-settings",
  routes: {
    settingsPage: settingsRouteRef
  }
});
const UserSettingsPage = userSettingsPlugin.provide(createRoutableExtension({
  name: "UserSettingsPage",
  component: () => Promise.resolve().then(function () { return SettingsPage$1; }).then((m) => m.SettingsPage),
  mountPoint: settingsRouteRef
}));

const Settings = (props) => {
  const routePath = useRouteRef(settingsRouteRef);
  const Icon = props.icon ? props.icon : SettingsIcon;
  return /* @__PURE__ */ React.createElement(SidebarItem, {
    text: "Settings",
    to: routePath(),
    icon: Icon
  });
};

const EXAMPLE$1 = `auth:
  providers:
    google:
      development:
        clientId: \${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: \${AUTH_GOOGLE_CLIENT_SECRET}
`;
const EmptyProviders = () => /* @__PURE__ */ React.createElement(EmptyState, {
  missing: "content",
  title: "No Authentication Providers",
  description: "You can add Authentication Providers to Backstage which allows you to use these providers to authenticate yourself.",
  action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, "Open ", /* @__PURE__ */ React.createElement("code", null, "app-config.yaml"), " and make the changes as highlighted below:"), /* @__PURE__ */ React.createElement(CodeSnippet, {
    text: EXAMPLE$1,
    language: "yaml",
    showLineNumbers: true,
    highlightedNumbers: [3, 4, 5, 6, 7, 8],
    customStyle: { background: "inherit", fontSize: "115%" }
  }), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    href: "https://backstage.io/docs/auth/add-auth-provider"
  }, "Read More"))
});

const ProviderSettingsItem = ({
  title,
  description,
  icon: Icon,
  apiRef
}) => {
  const api = useApi(apiRef);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let didCancel = false;
    const subscription = api.sessionState$().subscribe((sessionState) => {
      if (!didCancel) {
        setSignedIn(sessionState === SessionState.SignedIn);
      }
    });
    return () => {
      didCancel = true;
      subscription.unsubscribe();
    };
  }, [api]);
  return /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Icon, null)), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: title,
    secondary: /* @__PURE__ */ React.createElement(Tooltip, {
      placement: "top",
      arrow: true,
      title: description
    }, /* @__PURE__ */ React.createElement("span", null, description)),
    secondaryTypographyProps: { noWrap: true, style: { width: "80%" } }
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(Tooltip, {
    placement: "top",
    arrow: true,
    title: signedIn ? `Sign out from ${title}` : `Sign in to ${title}`
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "outlined",
    color: "primary",
    onClick: () => signedIn ? api.signOut() : api.signIn()
  }, signedIn ? `Sign out` : `Sign in`))));
};

const DefaultProviderSettings = ({ configuredProviders }) => /* @__PURE__ */ React.createElement(React.Fragment, null, configuredProviders.includes("google") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "Google",
  description: "Provides authentication towards Google APIs and identities",
  apiRef: googleAuthApiRef,
  icon: Star
}), configuredProviders.includes("microsoft") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "Microsoft",
  description: "Provides authentication towards Microsoft APIs and identities",
  apiRef: microsoftAuthApiRef,
  icon: Star
}), configuredProviders.includes("github") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "GitHub",
  description: "Provides authentication towards GitHub APIs",
  apiRef: githubAuthApiRef,
  icon: Star
}), configuredProviders.includes("gitlab") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "GitLab",
  description: "Provides authentication towards GitLab APIs",
  apiRef: gitlabAuthApiRef,
  icon: Star
}), configuredProviders.includes("okta") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "Okta",
  description: "Provides authentication towards Okta APIs",
  apiRef: oktaAuthApiRef,
  icon: Star
}), configuredProviders.includes("bitbucket") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "Bitbucket",
  description: "Provides authentication towards Bitbucket APIs",
  apiRef: bitbucketAuthApiRef,
  icon: Star
}), configuredProviders.includes("onelogin") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "OneLogin",
  description: "Provides authentication towards OneLogin APIs",
  apiRef: oneloginAuthApiRef,
  icon: Star
}), configuredProviders.includes("atlassian") && /* @__PURE__ */ React.createElement(ProviderSettingsItem, {
  title: "Atlassian",
  description: "Provides authentication towards Atlassian APIs",
  apiRef: atlassianAuthApiRef,
  icon: Star
}));

const UserSettingsAuthProviders = ({ providerSettings }) => {
  const configApi = useApi(configApiRef);
  const providersConfig = configApi.getOptionalConfig("auth.providers");
  const configuredProviders = (providersConfig == null ? void 0 : providersConfig.keys()) || [];
  const providers = providerSettings != null ? providerSettings : /* @__PURE__ */ React.createElement(DefaultProviderSettings, {
    configuredProviders
  });
  if (!providerSettings && !(configuredProviders == null ? void 0 : configuredProviders.length)) {
    return /* @__PURE__ */ React.createElement(EmptyProviders, null);
  }
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Available Providers"
  }, /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, providers));
};

const EXAMPLE = `import { createPlugin } from '@backstage/core-plugin-api';

export default createPlugin({
  id: 'plugin-name',
  featureFlags: [{ name: 'enable-example-feature' }],
});
`;
const EmptyFlags = () => /* @__PURE__ */ React.createElement(EmptyState, {
  missing: "content",
  title: "No Feature Flags",
  description: "Feature Flags make it possible for plugins to register features in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc.",
  action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, "An example for how to add a feature flag is highlighted below:"), /* @__PURE__ */ React.createElement(CodeSnippet, {
    text: EXAMPLE,
    language: "typescript",
    showLineNumbers: true,
    highlightedNumbers: [6],
    customStyle: { background: "inherit", fontSize: "115%" }
  }), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    href: "https://backstage.io/docs/api/utility-apis"
  }, "Read More"))
});

const FlagItem = ({ flag, enabled, toggleHandler }) => /* @__PURE__ */ React.createElement(ListItem, {
  divider: true,
  button: true,
  onClick: () => toggleHandler(flag.name)
}, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Tooltip, {
  placement: "top",
  arrow: true,
  title: enabled ? "Disable" : "Enable"
}, /* @__PURE__ */ React.createElement(Switch, {
  color: "primary",
  checked: enabled,
  name: flag.name
}))), /* @__PURE__ */ React.createElement(ListItemText, {
  primary: flag.name,
  secondary: `Registered in ${flag.pluginId} plugin`
}));

const UserSettingsFeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();
  const initialFlagState = Object.fromEntries(featureFlags.map(({ name }) => [name, featureFlagsApi.isActive(name)]));
  const [state, setState] = useState(initialFlagState);
  const [filterInput, setFilterInput] = useState("");
  const inputRef = React.useRef();
  const toggleFlag = useCallback((flagName) => {
    const newState = featureFlagsApi.isActive(flagName) ? FeatureFlagState.None : FeatureFlagState.Active;
    featureFlagsApi.save({
      states: { [flagName]: newState },
      merge: true
    });
    setState((prevState) => ({
      ...prevState,
      [flagName]: newState === FeatureFlagState.Active
    }));
  }, [featureFlagsApi]);
  if (!featureFlags.length) {
    return /* @__PURE__ */ React.createElement(EmptyFlags, null);
  }
  const clearFilterInput = () => {
    var _a;
    setFilterInput("");
    (_a = inputRef == null ? void 0 : inputRef.current) == null ? void 0 : _a.focus();
  };
  let filteredFeatureFlags = Array.from(featureFlags);
  const filterInputParts = filterInput.split(/\s/).map((part) => part.trim().toLocaleLowerCase("en-US"));
  filterInputParts.forEach((part) => filteredFeatureFlags = filteredFeatureFlags.filter((featureFlag) => featureFlag.name.toLocaleLowerCase("en-US").includes(part)));
  const Header = () => /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    style: { justifyContent: "space-between" }
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    md: 8
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Feature Flags")), featureFlags.length >= 10 && /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    md: 4
  }, /* @__PURE__ */ React.createElement(TextField, {
    label: "Filter",
    style: { display: "flex", justifyContent: "flex-end" },
    inputRef: (ref) => ref && ref.focus(),
    InputProps: {
      ...filterInput.length && {
        endAdornment: /* @__PURE__ */ React.createElement(IconButton, {
          "aria-label": "Clear filter",
          onClick: clearFilterInput,
          edge: "end"
        }, /* @__PURE__ */ React.createElement(ClearIcon, null))
      }
    },
    onChange: (e) => setFilterInput(e.target.value),
    value: filterInput
  })));
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: /* @__PURE__ */ React.createElement(Header, null)
  }, /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, filteredFeatureFlags.map((featureFlag) => {
    const enabled = Boolean(state[featureFlag.name]);
    return /* @__PURE__ */ React.createElement(FlagItem, {
      key: featureFlag.name,
      flag: featureFlag,
      enabled,
      toggleHandler: toggleFlag
    });
  })));
};

const useUserProfile = () => {
  var _a;
  const identityApi = useApi(identityApiRef);
  const alertApi = useApi(alertApiRef);
  const { value, loading, error } = useAsync(async () => {
    return {
      profile: await identityApi.getProfileInfo(),
      identity: await identityApi.getBackstageIdentity()
    };
  }, []);
  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load user identity: ${error}`,
        severity: "error"
      });
    }
  }, [error, alertApi]);
  if (loading || error) {
    return {
      profile: {},
      displayName: "",
      loading
    };
  }
  return {
    profile: value.profile,
    displayName: (_a = value.profile.displayName) != null ? _a : value.identity.userEntityRef,
    loading
  };
};

const useStyles$1 = makeStyles((theme) => ({
  avatar: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    fontSize: ({ size }) => size * 0.7,
    border: `1px solid ${theme.palette.textSubtle}`
  }
}));
const UserSettingsSignInAvatar = ({ size }) => {
  const { iconSize } = sidebarConfig;
  const classes = useStyles$1(size ? { size } : { size: iconSize });
  const { profile } = useUserProfile();
  return /* @__PURE__ */ React.createElement(Avatar, {
    src: profile.picture,
    className: classes.avatar,
    alt: "Profile picture"
  });
};

const UserSettingsMenu = () => {
  const identityApi = useApi(identityApiRef);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(void 0);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(void 0);
    setOpen(false);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    "data-testid": "user-settings-menu",
    "aria-label": "more",
    onClick: handleOpen
  }, /* @__PURE__ */ React.createElement(MoreVertIcon, null)), /* @__PURE__ */ React.createElement(Menu, {
    anchorEl,
    open,
    onClose: handleClose
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    "data-testid": "sign-out",
    onClick: () => identityApi.signOut()
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SignOutIcon, null)), "Sign Out")));
};

const UserSettingsProfileCard = () => {
  const { profile, displayName } = useUserProfile();
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Profile",
    variant: "gridItem"
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 6
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(UserSettingsSignInAvatar, {
    size: 96
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: true,
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true,
    container: true,
    direction: "column",
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1",
    gutterBottom: true
  }, displayName), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary"
  }, profile.email))), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(UserSettingsMenu, null)))));
};

const UserSettingsPinToggle = () => {
  const { isPinned, toggleSidebarPinState } = useSidebarPinState();
  return /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Pin Sidebar",
    secondary: "Prevent the sidebar from collapsing"
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(Tooltip, {
    placement: "top",
    arrow: true,
    title: `${isPinned ? "Unpin" : "Pin"} Sidebar`
  }, /* @__PURE__ */ React.createElement(Switch, {
    color: "primary",
    checked: isPinned,
    onChange: () => toggleSidebarPinState(),
    name: "pin",
    inputProps: { "aria-label": "Pin Sidebar Switch" }
  }))));
};

const ThemeIcon = ({ id, activeId, icon }) => icon ? cloneElement(icon, {
  color: activeId === id ? "primary" : void 0
}) : /* @__PURE__ */ React.createElement(AutoIcon, {
  color: activeId === id ? "primary" : void 0
});
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    paddingRight: 16
  },
  list: {
    width: "initial",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: `0 0 12px`
    }
  },
  listItemText: {
    paddingRight: 0,
    paddingLeft: 0
  },
  listItemSecondaryAction: {
    position: "relative",
    transform: "unset",
    top: "auto",
    right: "auto",
    paddingLeft: 16,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0
    }
  }
}));
const TooltipToggleButton = ({
  children,
  title,
  value,
  ...props
}) => /* @__PURE__ */ React.createElement(Tooltip, {
  placement: "top",
  arrow: true,
  title
}, /* @__PURE__ */ React.createElement(ToggleButton, {
  value,
  ...props
}, children));
const UserSettingsThemeToggle = () => {
  const classes = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(appThemeApi.activeThemeId$(), appThemeApi.getActiveThemeId());
  const themeIds = appThemeApi.getInstalledThemes();
  const handleSetTheme = (_event, newThemeId) => {
    if (themeIds.some((t) => t.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(void 0);
    }
  };
  return /* @__PURE__ */ React.createElement(ListItem, {
    className: classes.list,
    classes: { container: classes.container }
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    className: classes.listItemText,
    primary: "Theme",
    secondary: "Change the theme mode"
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, {
    className: classes.listItemSecondaryAction
  }, /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
    exclusive: true,
    size: "small",
    value: themeId != null ? themeId : "auto",
    onChange: handleSetTheme
  }, themeIds.map((theme) => {
    var _a;
    const themeIcon = (_a = themeIds.find((t) => t.id === theme.id)) == null ? void 0 : _a.icon;
    return /* @__PURE__ */ React.createElement(TooltipToggleButton, {
      key: theme.id,
      title: `Select ${theme.title}`,
      value: theme.id
    }, /* @__PURE__ */ React.createElement(React.Fragment, null, theme.title, "\xA0", /* @__PURE__ */ React.createElement(ThemeIcon, {
      id: theme.id,
      icon: themeIcon,
      activeId: themeId
    })));
  }), /* @__PURE__ */ React.createElement(Tooltip, {
    placement: "top",
    arrow: true,
    title: "Select auto theme"
  }, /* @__PURE__ */ React.createElement(ToggleButton, {
    value: "auto",
    selected: themeId === void 0
  }, "Auto\xA0", /* @__PURE__ */ React.createElement(AutoIcon, {
    color: themeId === void 0 ? "primary" : void 0
  }))))));
};

const UserSettingsAppearanceCard = () => {
  const { isMobile } = useSidebarPinState();
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Appearance",
    variant: "gridItem"
  }, /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, /* @__PURE__ */ React.createElement(UserSettingsThemeToggle, null), !isMobile && /* @__PURE__ */ React.createElement(UserSettingsPinToggle, null)));
};

const UserSettingsGeneral = () => {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "row",
    spacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /* @__PURE__ */ React.createElement(UserSettingsProfileCard, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /* @__PURE__ */ React.createElement(UserSettingsAppearanceCard, null)));
};

const USER_SETTINGS_TAB_KEY = "user-settings.tab";
const UserSettingsTab = (props) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, props.children);
};
attachComponentData(UserSettingsTab, USER_SETTINGS_TAB_KEY, "UserSettingsTab");

const SettingsPage = ({ providerSettings }) => {
  const { isMobile } = useSidebarPinState();
  const outlet = useOutlet();
  const tabs = useElementFilter(outlet, (elements) => elements.selectByComponentData({
    key: USER_SETTINGS_TAB_KEY
  }).getElements());
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, !isMobile && /* @__PURE__ */ React.createElement(Header, {
    title: "Settings"
  }), /* @__PURE__ */ React.createElement(TabbedLayout, null, /* @__PURE__ */ React.createElement(TabbedLayout.Route, {
    path: "general",
    title: "General"
  }, /* @__PURE__ */ React.createElement(UserSettingsGeneral, null)), /* @__PURE__ */ React.createElement(TabbedLayout.Route, {
    path: "auth-providers",
    title: "Authentication Providers"
  }, /* @__PURE__ */ React.createElement(UserSettingsAuthProviders, {
    providerSettings
  })), /* @__PURE__ */ React.createElement(TabbedLayout.Route, {
    path: "feature-flags",
    title: "Feature Flags"
  }, /* @__PURE__ */ React.createElement(UserSettingsFeatureFlags, null)), tabs.map((child, i) => /* @__PURE__ */ React.createElement(TabbedLayout.Route, {
    key: i,
    ...child.props
  }, child))));
};

var SettingsPage$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SettingsPage: SettingsPage
});

export { DefaultProviderSettings, ProviderSettingsItem, SettingsPage as Router, Settings, USER_SETTINGS_TAB_KEY, UserSettingsAppearanceCard, UserSettingsAuthProviders, UserSettingsFeatureFlags, UserSettingsGeneral, UserSettingsMenu, UserSettingsPage, UserSettingsPinToggle, UserSettingsProfileCard, UserSettingsSignInAvatar, UserSettingsTab, UserSettingsThemeToggle, userSettingsPlugin as plugin, useUserProfile, userSettingsPlugin };
//# sourceMappingURL=index.esm.js.map
