import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { r as rootRouteRef, b as SearchBarBase } from './index-c59424ea.esm.js';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useRouteRef } from '@backstage/core-plugin-api';
import '@material-ui/icons/FilterList';
import '@material-ui/core';
import 'react-use/lib/useDebounce';
import '@material-ui/icons/Search';
import '@material-ui/icons/Clear';
import '@backstage/plugin-search-react';
import '@material-ui/lab';
import 'react-use/lib/useAsyncFn';
import '@material-ui/icons/Launch';
import '@backstage/core-components';
import '@material-ui/icons/ArrowBackIos';
import '@material-ui/icons/ArrowForwardIos';
import '@backstage/errors';
import '@backstage/version-bridge';
import 'react-use/lib/usePrevious';
import 'react-router';
import '@material-ui/core/InputBase';
import '@material-ui/core/IconButton';
import 'react-use/lib/useAsync';
import '@backstage/plugin-catalog-react';
import '@backstage/catalog-model';
import 'react-use/lib/useEffectOnce';
import '@material-ui/icons/ExpandMore';
import '@material-ui/icons/FontDownload';

const useNavigateToQuery = () => {
  const searchRoute = useRouteRef(rootRouteRef);
  const navigate = useNavigate();
  return useCallback(({ query }) => {
    const queryString = qs.stringify({ query }, { addQueryPrefix: true });
    navigate(`${searchRoute()}${queryString}`);
  }, [navigate, searchRoute]);
};

const useStyles = makeStyles({
  root: {
    border: "1px solid #555",
    borderRadius: "6px",
    fontSize: "1.5em"
  }
});
const HomePageSearchBar = ({ ...props }) => {
  const classes = useStyles(props);
  const [query, setQuery] = useState("");
  const handleSearch = useNavigateToQuery();
  const handleSubmit = () => {
    handleSearch({ query });
  };
  const handleChange = useCallback((value) => {
    setQuery(value);
  }, [setQuery]);
  return /* @__PURE__ */ React.createElement(SearchBarBase, {
    classes: { root: classes.root },
    value: query,
    onSubmit: handleSubmit,
    onChange: handleChange,
    ...props
  });
};

export { HomePageSearchBar };
//# sourceMappingURL=index-c08cd99a.esm.js.map
