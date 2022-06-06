import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { SidebarItem } from '@backstage/core-components';
import { d as SearchModalProvider, u as useSearchModal, e as SearchModal } from './index-c59424ea.esm.js';
import '@material-ui/icons/FilterList';
import '@material-ui/core';
import 'react-use/lib/useDebounce';
import '@backstage/core-plugin-api';
import '@material-ui/icons/Clear';
import '@backstage/plugin-search-react';
import '@material-ui/lab';
import 'react-use/lib/useAsyncFn';
import '@material-ui/icons/Launch';
import '@material-ui/core/styles';
import '@material-ui/icons/ArrowBackIos';
import '@material-ui/icons/ArrowForwardIos';
import '@backstage/errors';
import 'qs';
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
import 'react-router-dom';

const SidebarSearchModalContent = (props) => {
  const { state, toggleModal } = useSearchModal();
  const Icon = props.icon ? props.icon : SearchIcon;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SidebarItem, {
    className: "search-icon",
    icon: Icon,
    text: "Search",
    onClick: toggleModal
  }), /* @__PURE__ */ React.createElement(SearchModal, {
    ...state,
    toggleModal,
    children: props.children
  }));
};
const SidebarSearchModal = (props) => {
  return /* @__PURE__ */ React.createElement(SearchModalProvider, null, /* @__PURE__ */ React.createElement(SidebarSearchModalContent, {
    ...props
  }));
};

export { SidebarSearchModal };
//# sourceMappingURL=index-1c96b52b.esm.js.map
