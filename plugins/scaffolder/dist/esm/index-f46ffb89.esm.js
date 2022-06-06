import React, { createContext, useState } from 'react';
import { useOutlet, Routes, Route } from 'react-router';
import { Progress, ItemCardHeader, MarkdownContent, UserIcon, Button as Button$1, Content, Link as Link$1, ItemCardGrid, ContentHeader, Page, Header, SupportButton } from '@backstage/core-components';
import { useEntityTypeFilter, FavoriteEntity, getEntityRelations, EntityRefLinks, useEntityList, EntityListProvider, CatalogFilterLayout, EntitySearchBar, EntityKindPicker, UserListPicker, EntityTagPicker } from '@backstage/plugin-catalog-react';
import capitalize from 'lodash/capitalize';
import { Box, Typography, FormControlLabel, Checkbox, TextField, makeStyles, useTheme, Card, CardContent, Divider, Chip, CardActions } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import { useApi, alertApiRef, useRouteRef, errorApiRef, useElementFilter } from '@backstage/core-plugin-api';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-router-dom';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';
import { usePermission } from '@backstage/plugin-permission-react';
import { s as selectedTemplateRouteRef, r as registerComponentRouteRef, F as FIELD_EXTENSION_WRAPPER_KEY, i as FIELD_EXTENSION_KEY } from './index-b64713a1.esm.js';
import { RELATION_OWNED_BY, stringifyEntityRef } from '@backstage/catalog-model';
import { D as DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from './default-554cb9ad.esm.js';
import '@backstage/errors';
import 'qs';
import 'zen-observable';
import '@material-ui/core/FormControl';
import '@material-ui/lab/Autocomplete';
import 'react-use/lib/useAsync';
import 'react-use/lib/useEffectOnce';
import '@backstage/integration-react';
import '@material-ui/core/FormHelperText';
import '@material-ui/core/Input';
import '@material-ui/core/InputLabel';
import 'react-use/lib/useDebounce';
import '@material-ui/core/Grid';
import '@material-ui/core/Step';
import '@material-ui/core/StepLabel';
import '@material-ui/core/Stepper';
import '@material-ui/core/styles';
import '@material-ui/core/Typography';
import '@material-ui/icons/Cancel';
import '@material-ui/icons/Check';
import '@material-ui/icons/FiberManualRecord';
import 'classnames';
import 'luxon';
import 'react-use/lib/useInterval';
import 'use-immer';
import '@material-ui/icons/Language';

const icon = /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, {
  fontSize: "small"
});
const checkedIcon = /* @__PURE__ */ React.createElement(CheckBoxIcon, {
  fontSize: "small"
});
const CategoryPicker = () => {
  const alertApi = useApi(alertApiRef);
  const { error, loading, availableTypes, selectedTypes, setSelectedTypes } = useEntityTypeFilter();
  if (loading)
    return /* @__PURE__ */ React.createElement(Progress, null);
  if (error) {
    alertApi.post({
      message: `Failed to load entity types with error: ${error}`,
      severity: "error"
    });
    return null;
  }
  if (!availableTypes)
    return null;
  return /* @__PURE__ */ React.createElement(Box, {
    pb: 1,
    pt: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "button"
  }, "Categories"), /* @__PURE__ */ React.createElement(Autocomplete, {
    multiple: true,
    "aria-label": "Categories",
    options: availableTypes,
    value: selectedTypes,
    onChange: (_, value) => setSelectedTypes(value),
    renderOption: (option, { selected }) => /* @__PURE__ */ React.createElement(FormControlLabel, {
      control: /* @__PURE__ */ React.createElement(Checkbox, {
        icon,
        checkedIcon,
        checked: selected
      }),
      label: capitalize(option)
    }),
    size: "small",
    popupIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null),
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      variant: "outlined"
    })
  }));
};

const RegisterExistingButton = (props) => {
  const { title, to } = props;
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission
  });
  const isXSScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  if (!to || !allowed) {
    return null;
  }
  return isXSScreen ? /* @__PURE__ */ React.createElement(IconButton, {
    component: Link,
    color: "primary",
    title,
    size: "small",
    to
  }, /* @__PURE__ */ React.createElement(AddCircleOutline, null)) : /* @__PURE__ */ React.createElement(Button, {
    component: Link,
    variant: "contained",
    color: "primary",
    to
  }, title);
};

const useStyles$1 = makeStyles(() => ({
  header: {
    backgroundImage: ({ cardBackgroundImage }) => cardBackgroundImage
  },
  subtitleWrapper: {
    display: "flex",
    justifyContent: "space-between"
  }
}));
const CardHeader = (props) => {
  const {
    template: {
      metadata: { title, name },
      spec: { type }
    }
  } = props;
  const { getPageTheme } = useTheme();
  const themeForType = getPageTheme({ themeId: type });
  const styles = useStyles$1({
    cardBackgroundImage: themeForType.backgroundImage
  });
  const SubtitleComponent = /* @__PURE__ */ React.createElement("div", {
    className: styles.subtitleWrapper
  }, /* @__PURE__ */ React.createElement("div", null, type), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FavoriteEntity, {
    entity: props.template,
    style: { padding: 0 }
  })));
  return /* @__PURE__ */ React.createElement(ItemCardHeader, {
    title: title != null ? title : name,
    subtitle: SubtitleComponent,
    classes: { root: styles.header }
  });
};

const useStyles = makeStyles((theme) => ({
  box: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 10,
    "-webkit-box-orient": "vertical",
    "& p:first-child": {
      marginTop: 0,
      marginBottom: theme.spacing(2)
    }
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 0.5,
    lineHeight: 1,
    fontSize: "0.75rem"
  },
  margin: {
    marginBottom: theme.spacing(2)
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center"
  },
  ownedBy: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    color: theme.palette.link
  }
}));
const TemplateCard = (props) => {
  var _a, _b, _c, _d;
  const { template } = props;
  const styles = useStyles();
  const ownedByRelations = getEntityRelations(template, RELATION_OWNED_BY);
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const href = templateRoute({ templateName: template.metadata.name });
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, {
    template
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Box, {
    className: styles.box
  }, /* @__PURE__ */ React.createElement(MarkdownContent, {
    content: (_a = template.metadata.description) != null ? _a : "No description"
  })), ((_c = (_b = template.metadata.tags) == null ? void 0 : _b.length) != null ? _c : 0) > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, {
    className: styles.margin
  }), /* @__PURE__ */ React.createElement(Box, null, (_d = template.metadata.tags) == null ? void 0 : _d.map((tag) => /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    label: tag,
    key: tag
  }))))), /* @__PURE__ */ React.createElement(CardActions, null, /* @__PURE__ */ React.createElement("div", {
    className: styles.footer
  }, /* @__PURE__ */ React.createElement("div", {
    className: styles.ownedBy
  }, ownedByRelations.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(UserIcon, null), /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: ownedByRelations,
    defaultKind: "Group"
  }))), /* @__PURE__ */ React.createElement(Button$1, {
    size: "small",
    variant: "outlined",
    color: "primary",
    to: href
  }, "Choose"))));
};

const TemplateGroup = (props) => {
  const { templates, title, components: { CardComponent } = {} } = props;
  const titleComponent = typeof title === "string" ? /* @__PURE__ */ React.createElement(ContentHeader, {
    title
  }) : title;
  if (templates.length === 0) {
    return /* @__PURE__ */ React.createElement(Content, null, titleComponent, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, "No templates found that match your filter. Learn more about", " ", /* @__PURE__ */ React.createElement(Link$1, {
      to: "https://backstage.io/docs/features/software-templates/adding-templates"
    }, "adding templates"), "."));
  }
  const Card = CardComponent || TemplateCard;
  return /* @__PURE__ */ React.createElement(Content, null, titleComponent, /* @__PURE__ */ React.createElement(ItemCardGrid, null, templates.map((template) => /* @__PURE__ */ React.createElement(Card, {
    key: stringifyEntityRef(template),
    template
  }))));
};

const TemplateGroups = (props) => {
  const { loading, error, entities } = useEntityList();
  const { groups, TemplateCardComponent } = props;
  const errorApi = useApi(errorApiRef);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    errorApi.post(error);
    return null;
  }
  if (!entities || !entities.length) {
    return /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, "No templates found that match your filter. Learn more about", " ", /* @__PURE__ */ React.createElement(Link$1, {
      to: "https://backstage.io/docs/features/software-templates/adding-templates"
    }, "adding templates"), ".");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, groups.map(({ title, filter }, index) => /* @__PURE__ */ React.createElement(TemplateGroup, {
    key: index,
    templates: entities.filter((e) => filter(e)),
    title,
    components: { CardComponent: TemplateCardComponent }
  })));
};

const defaultGroup = {
  title: "All Templates",
  filter: () => true
};
const TemplateListPage = (props) => {
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  const { TemplateCardComponent, groups = [defaultGroup] } = props;
  return /* @__PURE__ */ React.createElement(EntityListProvider, null, /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    pageTitleOverride: "Create a New Component",
    title: "Create a New Component",
    subtitle: "Create new software components using standard templates"
  }), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Available Templates"
  }, /* @__PURE__ */ React.createElement(RegisterExistingButton, {
    title: "Register Existing Component",
    to: registerComponentLink && registerComponentLink()
  }), /* @__PURE__ */ React.createElement(SupportButton, null, "Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).")), /* @__PURE__ */ React.createElement(CatalogFilterLayout, null, /* @__PURE__ */ React.createElement(CatalogFilterLayout.Filters, null, /* @__PURE__ */ React.createElement(EntitySearchBar, null), /* @__PURE__ */ React.createElement(EntityKindPicker, {
    initialFilter: "template",
    hidden: true
  }), /* @__PURE__ */ React.createElement(UserListPicker, {
    initialFilter: "all",
    availableFilters: ["all", "starred"]
  }), /* @__PURE__ */ React.createElement(CategoryPicker, null), /* @__PURE__ */ React.createElement(EntityTagPicker, null)), /* @__PURE__ */ React.createElement(CatalogFilterLayout.Content, null, /* @__PURE__ */ React.createElement(TemplateGroups, {
    groups,
    TemplateCardComponent
  }))))));
};

const SecretsContext = createContext(void 0);
const SecretsContextProvider = ({ children }) => {
  const [secrets, setSecrets] = useState({});
  return /* @__PURE__ */ React.createElement(SecretsContext.Provider, {
    value: { secrets, setSecrets }
  }, children);
};

const TemplateWizardPage = (_props) => {
  return null;
};

const Router = (props) => {
  const { components: { TemplateCardComponent } = {} } = props;
  const outlet = useOutlet() || props.children;
  const customFieldExtensions = useElementFilter(outlet, (elements) => elements.selectByComponentData({
    key: FIELD_EXTENSION_WRAPPER_KEY
  }).findComponentData({
    key: FIELD_EXTENSION_KEY
  }));
  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(({ name }) => !customFieldExtensions.some((customFieldExtension) => customFieldExtension.name === name))
  ];
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    element: /* @__PURE__ */ React.createElement(TemplateListPage, {
      TemplateCardComponent,
      groups: props.groups
    })
  }), /* @__PURE__ */ React.createElement(Route, {
    path: selectedTemplateRouteRef.path,
    element: /* @__PURE__ */ React.createElement(SecretsContextProvider, null, /* @__PURE__ */ React.createElement(TemplateWizardPage, {
      customFieldExtensions: fieldExtensions
    }))
  }));
};

export { Router };
//# sourceMappingURL=index-f46ffb89.esm.js.map
