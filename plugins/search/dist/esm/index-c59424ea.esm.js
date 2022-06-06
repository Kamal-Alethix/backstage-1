import React, { useEffect, useState, useCallback, useRef, useContext, Fragment, cloneElement } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles, IconButton, Typography, Card, CardHeader, Button, Divider, CardContent, Select, MenuItem, List, ListItem, Checkbox, ListItemText, InputBase, InputAdornment, TextField, Chip, FormControl, FormLabel, FormControlLabel, InputLabel, ListItemIcon, Box, Dialog, useTheme, DialogTitle, Paper, DialogContent, Grid, DialogActions, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab } from '@material-ui/core';
import useDebounce from 'react-use/lib/useDebounce';
import { useAnalytics, useApi, configApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension, createComponentExtension, useRouteRef } from '@backstage/core-plugin-api';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';
import { useSearch, useSearchContextCheck, SearchContextProvider, HighlightedSearchResultText, searchApiRef } from '@backstage/plugin-search-react';
import { Autocomplete, Alert } from '@material-ui/lab';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import LaunchIcon from '@material-ui/icons/Launch';
import { makeStyles as makeStyles$1 } from '@material-ui/core/styles';
import { Link, Progress, ResponseErrorPanel, EmptyState, useContent, Table, useQueryParamState, Page, Header, Content, SidebarSearchField } from '@backstage/core-components';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ResponseError } from '@backstage/errors';
import qs from 'qs';
import { createVersionedContext, createVersionedValueMap } from '@backstage/version-bridge';
import usePrevious from 'react-use/lib/usePrevious';
import { useOutlet, useLocation } from 'react-router';
import InputBase$1 from '@material-ui/core/InputBase';
import IconButton$1 from '@material-ui/core/IconButton';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AllIcon from '@material-ui/icons/FontDownload';
import { useNavigate } from 'react-router-dom';

const useStyles$b = makeStyles((theme) => ({
  filters: {
    width: "250px",
    display: "flex"
  },
  icon: {
    margin: theme.spacing(-1, 0, 0, 0)
  }
}));
const FiltersButton$1 = ({
  numberOfSelectedFilters,
  handleToggleFilters
}) => {
  const classes = useStyles$b();
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.filters
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.icon,
    "aria-label": "settings",
    onClick: handleToggleFilters
  }, /* @__PURE__ */ React.createElement(FilterListIcon, null)), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Filters (", numberOfSelectedFilters ? numberOfSelectedFilters : 0, ")"));
};

const useStyles$a = makeStyles((theme) => ({
  filters: {
    background: "transparent",
    boxShadow: "0px 0px 0px 0px"
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1)
  },
  dropdown: {
    width: "100%"
  }
}));
const Filters$1 = ({
  filters,
  filterOptions,
  resetFilters,
  updateSelected,
  updateChecked
}) => {
  const classes = useStyles$a();
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.filters
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, "Filters"),
    action: /* @__PURE__ */ React.createElement(Button, {
      color: "primary",
      onClick: () => resetFilters()
    }, "CLEAR ALL")
  }), /* @__PURE__ */ React.createElement(Divider, null), filterOptions.kind.length === 0 && filterOptions.lifecycle.length === 0 && /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Filters cannot be applied to available results")), filterOptions.kind.length > 0 && /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Kind"), /* @__PURE__ */ React.createElement(Select, {
    id: "outlined-select",
    onChange: (e) => {
      var _a;
      return updateSelected((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value);
    },
    variant: "outlined",
    className: classes.dropdown,
    value: filters.selected
  }, filterOptions.kind.map((filter) => /* @__PURE__ */ React.createElement(MenuItem, {
    selected: filter === "",
    dense: true,
    key: filter,
    value: filter
  }, filter)))), filterOptions.lifecycle.length > 0 && /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Lifecycle"), /* @__PURE__ */ React.createElement(List, {
    disablePadding: true,
    dense: true
  }, filterOptions.lifecycle.map((filter) => /* @__PURE__ */ React.createElement(ListItem, {
    key: filter,
    dense: true,
    button: true,
    onClick: () => updateChecked(filter)
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    edge: "start",
    disableRipple: true,
    className: classes.checkbox,
    color: "primary",
    checked: filters.checked.includes(filter),
    tabIndex: -1,
    value: filter,
    name: filter
  }), /* @__PURE__ */ React.createElement(ListItemText, {
    id: filter,
    primary: filter
  }))))));
};

const TrackSearch = ({ children }) => {
  const analytics = useAnalytics();
  const { term } = useSearch();
  useEffect(() => {
    if (term) {
      analytics.captureEvent("search", term);
    }
  }, [analytics, term]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
};

const SearchBarBase = ({
  onChange,
  onKeyDown,
  onSubmit,
  debounceTime = 200,
  clearButton = true,
  fullWidth = true,
  value: defaultValue,
  inputProps: defaultInputProps = {},
  endAdornment: defaultEndAdornment,
  ...props
}) => {
  const configApi = useApi(configApiRef);
  const [value, setValue] = useState(defaultValue);
  const hasSearchContext = useSearchContextCheck();
  useEffect(() => {
    setValue((prevValue) => prevValue !== defaultValue ? defaultValue : prevValue);
  }, [defaultValue]);
  useDebounce(() => onChange(value), debounceTime, [value]);
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);
  const handleKeyDown = useCallback((e) => {
    if (onKeyDown)
      onKeyDown(e);
    if (onSubmit && e.key === "Enter") {
      onSubmit();
    }
  }, [onKeyDown, onSubmit]);
  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);
  const placeholder = `Search in ${configApi.getOptionalString("app.title") || "Backstage"}`;
  const startAdornment = /* @__PURE__ */ React.createElement(InputAdornment, {
    position: "start"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Query",
    disabled: true
  }, /* @__PURE__ */ React.createElement(SearchIcon, null)));
  const endAdornment = /* @__PURE__ */ React.createElement(InputAdornment, {
    position: "end"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Clear",
    onClick: handleClear
  }, /* @__PURE__ */ React.createElement(ClearButton, null)));
  const searchBar = /* @__PURE__ */ React.createElement(TrackSearch, null, /* @__PURE__ */ React.createElement(InputBase, {
    "data-testid": "search-bar-next",
    value,
    placeholder,
    startAdornment,
    endAdornment: clearButton ? endAdornment : defaultEndAdornment,
    inputProps: { "aria-label": "Search", ...defaultInputProps },
    fullWidth,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    ...props
  }));
  return hasSearchContext ? searchBar : /* @__PURE__ */ React.createElement(SearchContextProvider, null, searchBar);
};
const SearchBar$1 = ({ onChange, ...props }) => {
  const { term, setTerm } = useSearch();
  const handleChange = useCallback((newValue) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setTerm(newValue);
    }
  }, [onChange, setTerm]);
  return /* @__PURE__ */ React.createElement(SearchBarBase, {
    value: term,
    onChange: handleChange,
    ...props
  });
};

const useAsyncFilterValues = (fn, inputValue, defaultValues = [], debounce = 250) => {
  const valuesMemo = useRef({});
  const definiteFn = fn || (() => Promise.resolve([]));
  const [state, callback] = useAsyncFn(definiteFn, [inputValue], {
    loading: true
  });
  useDebounce(() => {
    if (valuesMemo.current[inputValue] === void 0) {
      valuesMemo.current[inputValue] = callback(inputValue).then((values) => {
        valuesMemo.current[inputValue] = values;
        return values;
      });
    }
  }, debounce, [callback, inputValue]);
  if (defaultValues.length) {
    return {
      loading: false,
      value: defaultValues
    };
  }
  const possibleValue = valuesMemo.current[inputValue];
  if (Array.isArray(possibleValue)) {
    return {
      loading: false,
      value: possibleValue
    };
  }
  return state;
};
const useDefaultFilterValue = (name, defaultValue) => {
  const { setFilters } = useSearch();
  useEffect(() => {
    if (defaultValue && [defaultValue].flat().length > 0) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: defaultValue
      }));
    }
  }, []);
};

const AutocompleteFilter = (props) => {
  const {
    className,
    defaultValue,
    name,
    values: givenValues,
    valuesDebounceMs,
    label,
    filterSelectedOptions,
    limitTags,
    multiple
  } = props;
  const [inputValue, setInputValue] = useState("");
  useDefaultFilterValue(name, defaultValue);
  const asyncValues = typeof givenValues === "function" ? givenValues : void 0;
  const defaultValues = typeof givenValues === "function" ? void 0 : givenValues;
  const { value: values, loading } = useAsyncFilterValues(asyncValues, inputValue, defaultValues, valuesDebounceMs);
  const { filters, setFilters } = useSearch();
  const filterValue = filters[name] || (multiple ? [] : null);
  const handleChange = (_, newValue) => {
    setFilters((prevState) => {
      const { [name]: filter, ...others } = prevState;
      if (newValue) {
        return { ...others, [name]: newValue };
      }
      return { ...others };
    });
  };
  const renderInput = (params) => /* @__PURE__ */ React.createElement(TextField, {
    ...params,
    name: "search",
    variant: "outlined",
    label,
    fullWidth: true
  });
  const renderTags = (tagValue, getTagProps) => tagValue.map((option, index) => /* @__PURE__ */ React.createElement(Chip, {
    label: option,
    color: "primary",
    ...getTagProps({ index })
  }));
  return /* @__PURE__ */ React.createElement(Autocomplete, {
    filterSelectedOptions,
    limitTags,
    multiple,
    className,
    id: `${multiple ? "multi-" : ""}select-filter-${name}--select`,
    options: values || [],
    loading,
    value: filterValue,
    onChange: handleChange,
    onInputChange: (_, newValue) => setInputValue(newValue),
    renderInput,
    renderTags
  });
};

const useStyles$9 = makeStyles({
  label: {
    textTransform: "capitalize"
  }
});
const CheckboxFilter = (props) => {
  const {
    className,
    defaultValue,
    label,
    name,
    values: givenValues = [],
    valuesDebounceMs
  } = props;
  const classes = useStyles$9();
  const { filters, setFilters } = useSearch();
  useDefaultFilterValue(name, defaultValue);
  const asyncValues = typeof givenValues === "function" ? givenValues : void 0;
  const defaultValues = typeof givenValues === "function" ? void 0 : givenValues;
  const { value: values = [], loading } = useAsyncFilterValues(asyncValues, "", defaultValues, valuesDebounceMs);
  const handleChange = (e) => {
    const {
      target: { value, checked }
    } = e;
    setFilters((prevFilters) => {
      const { [name]: filter, ...others } = prevFilters;
      const rest = (filter || []).filter((i) => i !== value);
      const items = checked ? [...rest, value] : rest;
      return items.length ? { ...others, [name]: items } : others;
    });
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    className,
    disabled: loading,
    fullWidth: true,
    "data-testid": "search-checkboxfilter-next"
  }, label ? /* @__PURE__ */ React.createElement(FormLabel, {
    className: classes.label
  }, label) : null, values.map((value) => {
    var _a;
    return /* @__PURE__ */ React.createElement(FormControlLabel, {
      key: value,
      control: /* @__PURE__ */ React.createElement(Checkbox, {
        color: "primary",
        tabIndex: -1,
        inputProps: { "aria-labelledby": value },
        value,
        name: value,
        onChange: handleChange,
        checked: ((_a = filters[name]) != null ? _a : []).includes(value)
      }),
      label: value
    });
  }));
};
const SelectFilter = (props) => {
  const {
    className,
    defaultValue,
    label,
    name,
    values: givenValues,
    valuesDebounceMs
  } = props;
  const classes = useStyles$9();
  useDefaultFilterValue(name, defaultValue);
  const asyncValues = typeof givenValues === "function" ? givenValues : void 0;
  const defaultValues = typeof givenValues === "function" ? void 0 : givenValues;
  const { value: values = [], loading } = useAsyncFilterValues(asyncValues, "", defaultValues, valuesDebounceMs);
  const { filters, setFilters } = useSearch();
  const handleChange = (e) => {
    const {
      target: { value }
    } = e;
    setFilters((prevFilters) => {
      const { [name]: filter, ...others } = prevFilters;
      return value ? { ...others, [name]: value } : others;
    });
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    disabled: loading,
    className,
    variant: "filled",
    fullWidth: true,
    "data-testid": "search-selectfilter-next"
  }, label ? /* @__PURE__ */ React.createElement(InputLabel, {
    className: classes.label,
    margin: "dense"
  }, label) : null, /* @__PURE__ */ React.createElement(Select, {
    variant: "outlined",
    value: filters[name] || "",
    onChange: handleChange
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: ""
  }, /* @__PURE__ */ React.createElement("em", null, "All")), values.map((value) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: value,
    value
  }, value))));
};
const SearchFilter = ({
  component: Element,
  ...props
}) => /* @__PURE__ */ React.createElement(Element, {
  ...props
});
SearchFilter.Checkbox = (props) => /* @__PURE__ */ React.createElement(SearchFilter, {
  ...props,
  component: CheckboxFilter
});
SearchFilter.Select = (props) => /* @__PURE__ */ React.createElement(SearchFilter, {
  ...props,
  component: SelectFilter
});
SearchFilter.Autocomplete = (props) => /* @__PURE__ */ React.createElement(SearchFilter, {
  ...props,
  component: AutocompleteFilter
});
const SearchFilterNext = SearchFilter;

const DefaultResultListItem$1 = ({
  result,
  highlight,
  icon,
  secondaryAction,
  lineClamp = 5
}) => {
  return /* @__PURE__ */ React.createElement(Link, {
    to: result.location
  }, /* @__PURE__ */ React.createElement(ListItem, {
    alignItems: "center"
  }, icon && /* @__PURE__ */ React.createElement(ListItemIcon, null, icon), /* @__PURE__ */ React.createElement(ListItemText, {
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
  }), secondaryAction && /* @__PURE__ */ React.createElement(Box, {
    alignItems: "flex-end"
  }, secondaryAction)), /* @__PURE__ */ React.createElement(Divider, null));
};

const SearchResultComponent = ({ children }) => {
  const {
    result: { loading, error, value }
  } = useSearch();
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      title: "Error encountered while fetching search results",
      error
    });
  }
  if (!(value == null ? void 0 : value.results.length)) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "data",
      title: "Sorry, no results were found"
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children({ results: value.results }));
};

const useStyles$8 = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    margin: theme.spacing(2, 0)
  }
}));
const SearchResultPager = () => {
  const { fetchNextPage, fetchPreviousPage } = useSearch();
  const classes = useStyles$8();
  if (!fetchNextPage && !fetchPreviousPage) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  }
  return /* @__PURE__ */ React.createElement("nav", {
    "arial-label": "pagination navigation",
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Button, {
    "aria-label": "previous page",
    disabled: !fetchPreviousPage,
    onClick: fetchPreviousPage,
    startIcon: /* @__PURE__ */ React.createElement(ArrowBackIosIcon, null)
  }, "Previous"), /* @__PURE__ */ React.createElement(Button, {
    "aria-label": "next page",
    disabled: !fetchNextPage,
    onClick: fetchNextPage,
    endIcon: /* @__PURE__ */ React.createElement(ArrowForwardIosIcon, null)
  }, "Next"));
};

class SearchClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async query(query) {
    const { token } = await this.identityApi.getCredentials();
    const queryString = qs.stringify(query);
    const url = `${await this.discoveryApi.getBaseUrl("search/query")}?${queryString}`;
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
}

const rootRouteRef = createRouteRef({
  id: "search"
});
const rootNextRouteRef = createRouteRef({
  id: "search:next"
});
const searchPlugin = createPlugin({
  id: "search",
  apis: [
    createApiFactory({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new SearchClient({ discoveryApi, identityApi });
      }
    })
  ],
  routes: {
    root: rootRouteRef,
    nextRoot: rootNextRouteRef
  }
});
const SearchPage$1 = searchPlugin.provide(createRoutableExtension({
  name: "SearchPage",
  component: () => import('./index-b9062edb.esm.js').then((m) => m.SearchPage),
  mountPoint: rootRouteRef
}));
const SearchPageNext = searchPlugin.provide(createRoutableExtension({
  name: "SearchPageNext",
  component: () => import('./index-b9062edb.esm.js').then((m) => m.SearchPage),
  mountPoint: rootNextRouteRef
}));
searchPlugin.provide(createComponentExtension({
  name: "SearchBar",
  component: {
    lazy: () => import('./index-b4559d0a.esm.js').then((m) => m.SearchBar)
  }
}));
const SearchBarNext = searchPlugin.provide(createComponentExtension({
  name: "SearchBarNext",
  component: {
    lazy: () => import('./index-b4559d0a.esm.js').then((m) => m.SearchBar)
  }
}));
const SearchResult$1 = searchPlugin.provide(createComponentExtension({
  name: "SearchResult",
  component: {
    lazy: () => import('./index-ff98c685.esm.js').then((m) => m.SearchResult)
  }
}));
searchPlugin.provide(createComponentExtension({
  name: "SearchResultNext",
  component: {
    lazy: () => import('./index-ff98c685.esm.js').then((m) => m.SearchResult)
  }
}));
const SidebarSearchModal = searchPlugin.provide(createComponentExtension({
  name: "SidebarSearchModal",
  component: {
    lazy: () => import('./index-1c96b52b.esm.js').then((m) => m.SidebarSearchModal)
  }
}));
const DefaultResultListItem = searchPlugin.provide(createComponentExtension({
  name: "DefaultResultListItem",
  component: {
    lazy: () => import('./index-763c3ecb.esm.js').then((m) => m.DefaultResultListItem)
  }
}));
const HomePageSearchBar = searchPlugin.provide(createComponentExtension({
  name: "HomePageSearchBar",
  component: {
    lazy: () => import('./index-c08cd99a.esm.js').then((m) => m.HomePageSearchBar)
  }
}));

const useStyles$7 = makeStyles$1((theme) => ({
  container: {
    borderRadius: 30,
    display: "flex",
    height: "2.4em"
  },
  input: {
    flex: 1
  },
  paperFullWidth: { height: "calc(100% - 128px)" },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: "0.5em" }
}));
const Modal = ({ toggleModal }) => {
  const getSearchLink = useRouteRef(rootRouteRef);
  const classes = useStyles$7();
  const { term } = useSearch();
  const { focusContent } = useContent();
  const { transitions } = useTheme();
  const handleResultClick = () => {
    toggleModal();
    setTimeout(focusContent, transitions.duration.leavingScreen);
  };
  const handleKeyPress = () => {
    handleResultClick();
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogTitle, null, /* @__PURE__ */ React.createElement(Paper, {
    className: classes.container
  }, /* @__PURE__ */ React.createElement(SearchBar$1, {
    className: classes.input
  }))), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Link, {
    onClick: () => {
      toggleModal();
      setTimeout(focusContent, transitions.duration.leavingScreen);
    },
    to: `${getSearchLink()}?query=${term}`
  }, /* @__PURE__ */ React.createElement("span", {
    className: classes.viewResultsLink
  }, "View Full Results"), /* @__PURE__ */ React.createElement(LaunchIcon, {
    color: "primary"
  })))), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(SearchResultComponent, null, ({ results }) => /* @__PURE__ */ React.createElement(List, null, results.map(({ document, highlight }) => /* @__PURE__ */ React.createElement("div", {
    role: "button",
    tabIndex: 0,
    key: `${document.location}-btn`,
    onClick: handleResultClick,
    onKeyPress: handleKeyPress
  }, /* @__PURE__ */ React.createElement(DefaultResultListItem$1, {
    key: document.location,
    result: document,
    highlight
  })))))), /* @__PURE__ */ React.createElement(DialogActions, {
    className: classes.dialogActionsContainer
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(SearchResultPager, null)))));
};
const SearchModal = ({
  open = true,
  hidden,
  toggleModal,
  children
}) => {
  var _a;
  const classes = useStyles$7();
  return /* @__PURE__ */ React.createElement(Dialog, {
    classes: {
      paperFullWidth: classes.paperFullWidth
    },
    onClose: toggleModal,
    "aria-labelledby": "search-modal-title",
    fullWidth: true,
    maxWidth: "lg",
    open,
    hidden
  }, open && /* @__PURE__ */ React.createElement(SearchContextProvider, null, (_a = children && children({ toggleModal })) != null ? _a : /* @__PURE__ */ React.createElement(Modal, {
    toggleModal
  })));
};

const SearchModalContext = createVersionedContext("search-modal-context");
const SearchModalProvider = ({
  children,
  showInitially
}) => {
  const value = useSearchModal(showInitially);
  const versionedValue = createVersionedValueMap({ 1: value });
  return /* @__PURE__ */ React.createElement(SearchModalContext.Provider, {
    value: versionedValue
  }, children);
};
function useSearchModal(initialState = false) {
  const parentContext = useContext(SearchModalContext);
  const parentContextValue = parentContext == null ? void 0 : parentContext.atVersion(1);
  const [state, setState] = useState({
    hidden: !initialState,
    open: initialState
  });
  const toggleModal = useCallback(() => setState((prevState) => ({
    open: true,
    hidden: !prevState.hidden
  })), []);
  const setOpen = useCallback((open) => setState((prevState) => ({
    open: prevState.open || open,
    hidden: !open
  })), []);
  return (parentContextValue == null ? void 0 : parentContextValue.state) ? parentContextValue : { state, toggleModal, setOpen };
}

const useStyles$6 = makeStyles$1(() => ({
  root: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    flex: 1
  }
}));
const SearchBar = ({
  searchQuery,
  handleSearch,
  handleClearSearchBar
}) => {
  const classes = useStyles$6();
  return /* @__PURE__ */ React.createElement(Paper, {
    component: "form",
    onSubmit: (e) => handleSearch(e),
    className: classes.root
  }, /* @__PURE__ */ React.createElement(IconButton$1, {
    disabled: true,
    type: "submit",
    "aria-label": "search"
  }, /* @__PURE__ */ React.createElement(SearchIcon, null)), /* @__PURE__ */ React.createElement(InputBase$1, {
    className: classes.input,
    placeholder: "Search in Backstage",
    value: searchQuery,
    onChange: (e) => handleSearch(e),
    inputProps: { "aria-label": "search backstage" }
  }), /* @__PURE__ */ React.createElement(IconButton$1, {
    "aria-label": "search",
    onClick: () => handleClearSearchBar()
  }, /* @__PURE__ */ React.createElement(ClearButton, null)));
};

const useStyles$5 = makeStyles((theme) => ({
  filters: {
    width: "250px",
    display: "flex"
  },
  icon: {
    margin: theme.spacing(-1, 0, 0, 0)
  }
}));
const FiltersButton = ({
  numberOfSelectedFilters,
  handleToggleFilters
}) => {
  const classes = useStyles$5();
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.filters
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.icon,
    "aria-label": "settings",
    onClick: handleToggleFilters
  }, /* @__PURE__ */ React.createElement(FilterListIcon, null)), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Filters (", numberOfSelectedFilters ? numberOfSelectedFilters : 0, ")"));
};

const useStyles$4 = makeStyles((theme) => ({
  filters: {
    background: "transparent",
    boxShadow: "0px 0px 0px 0px"
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1)
  },
  dropdown: {
    width: "100%"
  }
}));
const Filters = ({
  filters,
  filterOptions,
  resetFilters,
  updateSelected,
  updateChecked
}) => {
  const classes = useStyles$4();
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.filters
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, "Filters"),
    action: /* @__PURE__ */ React.createElement(Button, {
      color: "primary",
      onClick: () => resetFilters()
    }, "CLEAR ALL")
  }), /* @__PURE__ */ React.createElement(Divider, null), filterOptions.kind.length === 0 && filterOptions.lifecycle.length === 0 && /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Filters cannot be applied to available results")), filterOptions.kind.length > 0 && /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Kind"), /* @__PURE__ */ React.createElement(Select, {
    id: "outlined-select",
    onChange: (e) => {
      var _a;
      return updateSelected((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value);
    },
    variant: "outlined",
    className: classes.dropdown,
    value: filters.selected
  }, filterOptions.kind.map((filter) => /* @__PURE__ */ React.createElement(MenuItem, {
    selected: filter === "",
    dense: true,
    key: filter,
    value: filter
  }, filter)))), filterOptions.lifecycle.length > 0 && /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Lifecycle"), /* @__PURE__ */ React.createElement(List, {
    disablePadding: true,
    dense: true
  }, filterOptions.lifecycle.map((filter) => /* @__PURE__ */ React.createElement(ListItem, {
    key: filter,
    dense: true,
    button: true,
    onClick: () => updateChecked(filter)
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    edge: "start",
    disableRipple: true,
    className: classes.checkbox,
    color: "primary",
    checked: filters.checked.includes(filter),
    tabIndex: -1,
    value: filter,
    name: filter
  }), /* @__PURE__ */ React.createElement(ListItemText, {
    id: filter,
    primary: filter
  }))))));
};

const useStyles$3 = makeStyles((theme) => ({
  searchQuery: {
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    borderRadius: "10%"
  },
  tableHeader: {
    margin: theme.spacing(1, 0, 0, 0),
    display: "flex"
  },
  divider: {
    width: "1px",
    margin: theme.spacing(0, 2),
    padding: theme.spacing(2, 0)
  }
}));
const columns = [
  {
    title: "Name",
    field: "name",
    highlight: true,
    render: (result) => /* @__PURE__ */ React.createElement(Link, {
      to: result.url || ""
    }, result.name)
  },
  {
    title: "Description",
    field: "description"
  },
  {
    title: "Owner",
    field: "owner"
  },
  {
    title: "Kind",
    field: "kind"
  },
  {
    title: "LifeCycle",
    field: "lifecycle"
  }
];
const TableHeader = ({
  searchQuery,
  numberOfSelectedFilters,
  numberOfResults,
  handleToggleFilters
}) => {
  const classes = useStyles$3();
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.tableHeader
  }, /* @__PURE__ */ React.createElement(FiltersButton, {
    numberOfSelectedFilters,
    handleToggleFilters
  }), /* @__PURE__ */ React.createElement(Divider, {
    className: classes.divider,
    orientation: "vertical"
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, searchQuery ? /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, `${numberOfResults} `, numberOfResults > 1 ? `results for ` : `result for `, /* @__PURE__ */ React.createElement("span", {
    className: classes.searchQuery
  }, '"', searchQuery, '"'), " ") : /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, `${numberOfResults} results`)));
};
const SearchResult = ({ searchQuery }) => {
  const catalogApi = useApi(catalogApiRef);
  const [showFilters, toggleFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    selected: "",
    checked: []
  });
  const [filteredResults, setFilteredResults] = useState([]);
  const {
    loading,
    error,
    value: results
  } = useAsync(async () => {
    const entities = await catalogApi.getEntities();
    return entities.items.map((entity) => {
      var _a, _b, _c, _d, _e;
      return {
        name: entity.metadata.name,
        description: entity.metadata.description,
        owner: typeof ((_a = entity.spec) == null ? void 0 : _a.owner) === "string" ? (_b = entity.spec) == null ? void 0 : _b.owner : void 0,
        kind: entity.kind,
        lifecycle: typeof ((_c = entity.spec) == null ? void 0 : _c.lifecycle) === "string" ? (_d = entity.spec) == null ? void 0 : _d.lifecycle : void 0,
        url: `/catalog/${((_e = entity.metadata.namespace) == null ? void 0 : _e.toLocaleLowerCase("en-US")) || DEFAULT_NAMESPACE}/${entity.kind.toLocaleLowerCase("en-US")}/${entity.metadata.name}`
      };
    });
  }, []);
  useEffect(() => {
    if (results) {
      let withFilters = results;
      if (selectedFilters.selected !== "") {
        withFilters = results.filter((result) => selectedFilters.selected.includes(result.kind));
      }
      if (selectedFilters.checked.length > 0) {
        withFilters = withFilters.filter((result) => result.lifecycle && selectedFilters.checked.includes(result.lifecycle));
      }
      if (searchQuery) {
        withFilters = withFilters.filter((result) => {
          var _a, _b, _c;
          return ((_a = result.name) == null ? void 0 : _a.toLocaleLowerCase("en-US").includes(searchQuery)) || ((_b = result.name) == null ? void 0 : _b.toLocaleLowerCase("en-US").includes(searchQuery.split(" ").join("-"))) || ((_c = result.description) == null ? void 0 : _c.toLocaleLowerCase("en-US").includes(searchQuery));
        });
      }
      setFilteredResults(withFilters);
    }
  }, [selectedFilters, searchQuery, results]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching search results. ", error.toString());
  }
  if (!results || results.length === 0) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "data",
      title: "Sorry, no results were found"
    });
  }
  const resetFilters = () => {
    setSelectedFilters({
      selected: "",
      checked: []
    });
  };
  const updateSelected = (filter) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      selected: filter
    }));
  };
  const updateChecked = (filter) => {
    if (selectedFilters.checked.includes(filter)) {
      setSelectedFilters((prevState) => ({
        ...prevState,
        checked: prevState.checked.filter((item) => item !== filter)
      }));
      return;
    }
    setSelectedFilters((prevState) => ({
      ...prevState,
      checked: [...prevState.checked, filter]
    }));
  };
  const filterOptions = results.reduce((acc, curr) => {
    if (curr.kind && acc.kind.indexOf(curr.kind) < 0) {
      acc.kind.push(curr.kind);
    }
    if (curr.lifecycle && acc.lifecycle.indexOf(curr.lifecycle) < 0) {
      acc.lifecycle.push(curr.lifecycle);
    }
    return acc;
  }, {
    kind: [],
    lifecycle: []
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, showFilters && /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Filters, {
    filters: selectedFilters,
    filterOptions,
    resetFilters,
    updateSelected,
    updateChecked
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: showFilters ? 9 : 12
  }, /* @__PURE__ */ React.createElement(Table, {
    options: { paging: true, pageSize: 20, search: false },
    data: filteredResults,
    columns,
    title: /* @__PURE__ */ React.createElement(TableHeader, {
      searchQuery,
      numberOfResults: filteredResults.length,
      numberOfSelectedFilters: (selectedFilters.selected !== "" ? 1 : 0) + selectedFilters.checked.length,
      handleToggleFilters: () => toggleFilters(!showFilters)
    })
  }))));
};

const LegacySearchPage = () => {
  const [queryString, setQueryString] = useQueryParamState("query");
  const [searchQuery, setSearchQuery] = useState(queryString != null ? queryString : "");
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };
  useEffect(() => setSearchQuery(queryString != null ? queryString : ""), [queryString]);
  useDebounce(() => {
    setQueryString(searchQuery);
  }, 200, [searchQuery]);
  const handleClearSearchBar = () => {
    setSearchQuery("");
  };
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Search"
  }), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(SearchBar, {
    handleSearch,
    handleClearSearchBar,
    searchQuery
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(SearchResult, {
    searchQuery: (queryString != null ? queryString : "").toLocaleLowerCase("en-US")
  })))));
};

const UrlUpdater = () => {
  const location = useLocation();
  const {
    term,
    setTerm,
    types,
    setTypes,
    pageCursor,
    setPageCursor,
    filters,
    setFilters
  } = useSearch();
  const prevQueryParams = usePrevious(location.search);
  useEffect(() => {
    if (location.search === prevQueryParams) {
      return;
    }
    const query = qs.parse(location.search.substring(1), { arrayLimit: 0 }) || {};
    if (query.filters) {
      setFilters(query.filters);
    }
    if (query.query) {
      setTerm(query.query);
    }
    if (query.pageCursor) {
      setPageCursor(query.pageCursor);
    }
    if (query.types) {
      setTypes(query.types);
    }
  }, [prevQueryParams, location, setTerm, setTypes, setPageCursor, setFilters]);
  useEffect(() => {
    const newParams = qs.stringify({
      query: term,
      types,
      pageCursor,
      filters
    }, { arrayFormat: "brackets" });
    const newUrl = `${window.location.pathname}?${newParams}`;
    window.history.replaceState(null, document.title, newUrl);
  }, [term, types, pageCursor, filters]);
  return null;
};
const SearchPage = () => {
  const outlet = useOutlet();
  return /* @__PURE__ */ React.createElement(SearchContextProvider, null, /* @__PURE__ */ React.createElement(UrlUpdater, null), outlet || /* @__PURE__ */ React.createElement(LegacySearchPage, null));
};

const useStyles$2 = makeStyles((theme) => ({
  card: {
    backgroundColor: "rgba(0, 0, 0, .11)"
  },
  cardContent: {
    paddingTop: theme.spacing(1)
  },
  icon: {
    color: theme.palette.common.black
  },
  list: {
    width: "100%"
  },
  listItemIcon: {
    width: "24px",
    height: "24px"
  },
  accordion: {
    backgroundColor: theme.palette.background.paper
  },
  accordionSummary: {
    minHeight: "auto",
    "&.Mui-expanded": {
      minHeight: "auto"
    }
  },
  accordionSummaryContent: {
    margin: theme.spacing(2, 0),
    "&.Mui-expanded": {
      margin: theme.spacing(2, 0)
    }
  },
  accordionDetails: {
    padding: theme.spacing(0, 0, 1)
  }
}));
const SearchTypeAccordion = (props) => {
  const classes = useStyles$2();
  const { setPageCursor, setTypes, types } = useSearch();
  const [expanded, setExpanded] = useState(true);
  const { defaultValue, name, types: givenTypes } = props;
  const toggleExpanded = () => setExpanded((prevState) => !prevState);
  const handleClick = (type) => {
    return () => {
      setTypes(type !== "" ? [type] : []);
      setPageCursor(void 0);
      setExpanded(false);
    };
  };
  useEffect(() => {
    if (defaultValue) {
      setTypes([defaultValue]);
    }
  }, []);
  const definedTypes = [
    {
      value: "",
      name: "All",
      icon: /* @__PURE__ */ React.createElement(AllIcon, null)
    },
    ...givenTypes
  ];
  const selected = types[0] || "";
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.card
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: name,
    titleTypographyProps: { variant: "overline" }
  }), /* @__PURE__ */ React.createElement(CardContent, {
    className: classes.cardContent
  }, /* @__PURE__ */ React.createElement(Accordion, {
    className: classes.accordion,
    expanded,
    onChange: toggleExpanded
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    classes: {
      root: classes.accordionSummary,
      content: classes.accordionSummaryContent
    },
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
      className: classes.icon
    }),
    IconButtonProps: { size: "small" }
  }, expanded ? "Collapse" : definedTypes.filter((t) => t.value === selected)[0].name), /* @__PURE__ */ React.createElement(AccordionDetails, {
    classes: { root: classes.accordionDetails }
  }, /* @__PURE__ */ React.createElement(List, {
    className: classes.list,
    component: "nav",
    "aria-label": "filter by type",
    disablePadding: true,
    dense: true
  }, definedTypes.map((type) => /* @__PURE__ */ React.createElement(Fragment, {
    key: type.value
  }, /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(ListItem, {
    selected: types[0] === type.value || types.length === 0 && type.value === "",
    onClick: handleClick(type.value),
    button: true
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, cloneElement(type.icon, {
    className: classes.listItemIcon
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: type.name
  })))))))));
};

const useStyles$1 = makeStyles((theme) => ({
  tabs: {
    borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
    padding: theme.spacing(0, 4)
  },
  tab: {
    height: "50px",
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(13),
    color: theme.palette.textSubtle,
    minWidth: "130px"
  }
}));
const SearchTypeTabs = (props) => {
  const classes = useStyles$1();
  const { setPageCursor, setTypes, types } = useSearch();
  const { defaultValue, types: givenTypes } = props;
  const changeTab = (_, newType) => {
    setTypes(newType !== "" ? [newType] : []);
    setPageCursor(void 0);
  };
  useEffect(() => {
    if (defaultValue) {
      setTypes([defaultValue]);
    }
  }, []);
  const definedTypes = [
    {
      value: "",
      name: "All"
    },
    ...givenTypes
  ];
  return /* @__PURE__ */ React.createElement(Tabs, {
    className: classes.tabs,
    indicatorColor: "primary",
    value: types.length === 0 ? "" : types[0],
    onChange: changeTab
  }, definedTypes.map((type, idx) => /* @__PURE__ */ React.createElement(Tab, {
    key: idx,
    className: classes.tab,
    disableRipple: true,
    label: type.name,
    value: type.value
  })));
};

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: "capitalize"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(1)
  },
  chip: {
    margin: 2
  }
}));
const SearchType = (props) => {
  const { className, defaultValue, name, values = [] } = props;
  const classes = useStyles();
  const { types, setTypes } = useSearch();
  useEffectOnce(() => {
    if (!types.length) {
      if (defaultValue && Array.isArray(defaultValue)) {
        setTypes(defaultValue);
      } else if (defaultValue) {
        setTypes([defaultValue]);
      }
    }
  });
  const handleChange = (e) => {
    const value = e.target.value;
    setTypes(value);
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    className,
    variant: "filled",
    fullWidth: true,
    "data-testid": "search-typefilter-next"
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    className: classes.label,
    margin: "dense"
  }, name), /* @__PURE__ */ React.createElement(Select, {
    multiple: true,
    variant: "outlined",
    value: types,
    onChange: handleChange,
    placeholder: "All Results",
    renderValue: (selected) => /* @__PURE__ */ React.createElement("div", {
      className: classes.chips
    }, selected.map((value) => /* @__PURE__ */ React.createElement(Chip, {
      key: value,
      label: value,
      className: classes.chip,
      size: "small"
    })))
  }, values.map((value) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: value,
    value
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    checked: types.indexOf(value) > -1
  }), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: value
  })))));
};
SearchType.Accordion = (props) => {
  return /* @__PURE__ */ React.createElement(SearchTypeAccordion, {
    ...props
  });
};
SearchType.Tabs = (props) => {
  return /* @__PURE__ */ React.createElement(SearchTypeTabs, {
    ...props
  });
};

const SidebarSearch = (props) => {
  const searchRoute = useRouteRef(rootRouteRef);
  const { focusContent } = useContent();
  const navigate = useNavigate();
  const handleSearch = useCallback((query) => {
    const queryString = qs.stringify({ query }, { addQueryPrefix: true });
    focusContent();
    navigate(`${searchRoute()}${queryString}`);
  }, [focusContent, navigate, searchRoute]);
  return /* @__PURE__ */ React.createElement(SidebarSearchField, {
    icon: props.icon,
    onSearch: handleSearch,
    to: "/search"
  });
};

export { DefaultResultListItem$1 as D, Filters$1 as F, HomePageSearchBar as H, SearchPage as S, SearchBar$1 as a, SearchBarBase as b, SearchResultComponent as c, SearchModalProvider as d, SearchModal as e, FiltersButton$1 as f, SearchFilter as g, SearchFilterNext as h, SearchResultPager as i, SearchType as j, SidebarSearch as k, DefaultResultListItem as l, SearchBarNext as m, SearchPage$1 as n, SearchPageNext as o, SearchResult$1 as p, SidebarSearchModal as q, rootRouteRef as r, searchPlugin as s, useSearchModal as u };
//# sourceMappingURL=index-c59424ea.esm.js.map
