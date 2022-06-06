import { createApiRef, useApi, AnalyticsContext } from '@backstage/core-plugin-api';
import React, { useMemo, useContext, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { createVersionedContext, createVersionedValueMap } from '@backstage/version-bridge';
import useAsync from 'react-use/lib/useAsync';
import usePrevious from 'react-use/lib/usePrevious';

const searchApiRef = createApiRef({
  id: "plugin.search.queryservice"
});
class MockSearchApi {
  constructor(mockedResults) {
    this.mockedResults = mockedResults;
  }
  query() {
    return Promise.resolve(this.mockedResults || { results: [] });
  }
}

const useStyles = makeStyles(() => ({
  highlight: {}
}), { name: "BackstageHighlightedSearchResultText" });
const HighlightedSearchResultText = ({
  text,
  preTag,
  postTag
}) => {
  const classes = useStyles();
  const terms = useMemo(() => text.split(new RegExp(`(${preTag}.+?${postTag})`)), [postTag, preTag, text]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, terms.map((t, idx) => t.includes(preTag) ? /* @__PURE__ */ React.createElement("mark", {
    className: classes.highlight,
    key: idx
  }, t.replace(new RegExp(`${preTag}|${postTag}`, "g"), "")) : t));
};

const SearchContext = createVersionedContext("search-context");
const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchContextProvider");
  }
  const value = context.atVersion(1);
  if (!value) {
    throw new Error("No SearchContext v1 found");
  }
  return value;
};
const useSearchContextCheck = () => {
  const context = useContext(SearchContext);
  return context !== void 0;
};
const searchInitialState = {
  term: "",
  pageCursor: void 0,
  filters: {},
  types: []
};
const SearchContextProvider = (props) => {
  var _a, _b, _c, _d;
  const { initialState = searchInitialState, children } = props;
  const searchApi = useApi(searchApiRef);
  const [pageCursor, setPageCursor] = useState(initialState.pageCursor);
  const [filters, setFilters] = useState(initialState.filters);
  const [term, setTerm] = useState(initialState.term);
  const [types, setTypes] = useState(initialState.types);
  const prevTerm = usePrevious(term);
  const result = useAsync(() => searchApi.query({
    term,
    filters,
    pageCursor,
    types
  }), [term, filters, types, pageCursor]);
  const hasNextPage = !result.loading && !result.error && ((_a = result.value) == null ? void 0 : _a.nextPageCursor);
  const hasPreviousPage = !result.loading && !result.error && ((_b = result.value) == null ? void 0 : _b.previousPageCursor);
  const fetchNextPage = useCallback(() => {
    var _a2;
    setPageCursor((_a2 = result.value) == null ? void 0 : _a2.nextPageCursor);
  }, [(_c = result.value) == null ? void 0 : _c.nextPageCursor]);
  const fetchPreviousPage = useCallback(() => {
    var _a2;
    setPageCursor((_a2 = result.value) == null ? void 0 : _a2.previousPageCursor);
  }, [(_d = result.value) == null ? void 0 : _d.previousPageCursor]);
  useEffect(() => {
    if (term && prevTerm && term !== prevTerm) {
      setPageCursor(void 0);
    }
  }, [term, prevTerm, initialState.pageCursor]);
  const value = {
    result,
    filters,
    setFilters,
    term,
    setTerm,
    types,
    setTypes,
    pageCursor,
    setPageCursor,
    fetchNextPage: hasNextPage ? fetchNextPage : void 0,
    fetchPreviousPage: hasPreviousPage ? fetchPreviousPage : void 0
  };
  const versionedValue = createVersionedValueMap({ 1: value });
  return /* @__PURE__ */ React.createElement(AnalyticsContext, {
    attributes: { searchTypes: types.sort().join(",") }
  }, /* @__PURE__ */ React.createElement(SearchContext.Provider, {
    value: versionedValue,
    children
  }));
};

export { HighlightedSearchResultText, MockSearchApi, SearchContextProvider, searchApiRef, useSearch, useSearchContextCheck };
//# sourceMappingURL=index.esm.js.map
