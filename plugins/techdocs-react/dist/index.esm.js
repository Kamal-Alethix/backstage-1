import React, { useCallback, memo, useState, useContext, useEffect, useMemo } from 'react';
import { useOutlet } from 'react-router-dom';
import { attachComponentData, createReactExtension, useElementFilter, createApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { createVersionedContext, createVersionedValueMap } from '@backstage/version-bridge';
import { create } from 'jss';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import { Progress } from '@backstage/core-components';
import debounce from 'lodash/debounce';

const TECHDOCS_ADDONS_KEY = "techdocs.addons.addon.v1";
const TECHDOCS_ADDONS_WRAPPER_KEY = "techdocs.addons.wrapper.v1";
const TechDocsAddons = () => null;
attachComponentData(TechDocsAddons, TECHDOCS_ADDONS_WRAPPER_KEY, true);
const getDataKeyByName = (name) => {
  return `${TECHDOCS_ADDONS_KEY}.${name.toLocaleLowerCase("en-US")}`;
};
function createTechDocsAddonExtension(options) {
  const { name, component: TechDocsAddon } = options;
  return createReactExtension({
    name,
    component: {
      sync: (props) => /* @__PURE__ */ React.createElement(TechDocsAddon, {
        ...props
      })
    },
    data: {
      [TECHDOCS_ADDONS_KEY]: options,
      [getDataKeyByName(name)]: true
    }
  });
}
const getTechDocsAddonByName = (collection, key) => {
  return collection.selectByComponentData({ key }).getElements()[0];
};
const getAllTechDocsAddons = (collection) => {
  return collection.selectByComponentData({
    key: TECHDOCS_ADDONS_WRAPPER_KEY
  }).selectByComponentData({
    key: TECHDOCS_ADDONS_KEY
  });
};
const getAllTechDocsAddonsData = (collection) => {
  return collection.selectByComponentData({
    key: TECHDOCS_ADDONS_WRAPPER_KEY
  }).findComponentData({
    key: TECHDOCS_ADDONS_KEY
  });
};
const useTechDocsAddons = () => {
  const node = useOutlet();
  const collection = useElementFilter(node, getAllTechDocsAddons);
  const options = useElementFilter(node, getAllTechDocsAddonsData);
  const findAddonByData = useCallback((data) => {
    var _a;
    if (!collection || !data)
      return null;
    const nameKey = getDataKeyByName(data.name);
    return (_a = getTechDocsAddonByName(collection, nameKey)) != null ? _a : null;
  }, [collection]);
  const renderComponentByName = useCallback((name) => {
    const data = options.find((option) => option.name === name);
    return data ? findAddonByData(data) : null;
  }, [options, findAddonByData]);
  const renderComponentsByLocation = useCallback((location) => {
    const data = options.filter((option) => option.location === location);
    return data.length ? data.map(findAddonByData) : null;
  }, [options, findAddonByData]);
  return { renderComponentByName, renderComponentsByLocation };
};

const techdocsApiRef = createApiRef({
  id: "plugin.techdocs.service"
});
const techdocsStorageApiRef = createApiRef({
  id: "plugin.techdocs.storageservice"
});

const areEntityRefsEqual = (prevEntityRef, nextEntityRef) => {
  return stringifyEntityRef(prevEntityRef) === stringifyEntityRef(nextEntityRef);
};
const defaultTechDocsReaderPageValue = {
  title: "",
  subtitle: "",
  setTitle: () => {
  },
  setSubtitle: () => {
  },
  setShadowRoot: () => {
  },
  metadata: { loading: true },
  entityMetadata: { loading: true },
  entityRef: { kind: "", name: "", namespace: "" }
};
const TechDocsReaderPageContext = createVersionedContext("techdocs-reader-page-context");
const TechDocsReaderPageProvider = memo(({ entityRef, children }) => {
  const techdocsApi = useApi(techdocsApiRef);
  const metadata = useAsync(async () => {
    return techdocsApi.getTechDocsMetadata(entityRef);
  }, [entityRef]);
  const entityMetadata = useAsync(async () => {
    return techdocsApi.getEntityMetadata(entityRef);
  }, [entityRef]);
  const [title, setTitle] = useState(defaultTechDocsReaderPageValue.title);
  const [subtitle, setSubtitle] = useState(defaultTechDocsReaderPageValue.subtitle);
  const [shadowRoot, setShadowRoot] = useState(defaultTechDocsReaderPageValue.shadowRoot);
  const value = {
    metadata,
    entityRef,
    entityMetadata,
    shadowRoot,
    setShadowRoot,
    title,
    setTitle,
    subtitle,
    setSubtitle
  };
  const versionedValue = createVersionedValueMap({ 1: value });
  return /* @__PURE__ */ React.createElement(TechDocsReaderPageContext.Provider, {
    value: versionedValue
  }, children instanceof Function ? children(value) : children);
}, (prevProps, nextProps) => {
  return areEntityRefsEqual(prevProps.entityRef, nextProps.entityRef);
});
const useTechDocsReaderPage = () => {
  const versionedContext = useContext(TechDocsReaderPageContext);
  if (versionedContext === void 0) {
    return defaultTechDocsReaderPageValue;
  }
  const context = versionedContext.atVersion(1);
  if (context === void 0) {
    throw new Error("No context found for version 1.");
  }
  return context;
};

const TechDocsAddonLocations = Object.freeze({
  Header: "Header",
  Subheader: "Subheader",
  Settings: "Settings",
  PrimarySidebar: "PrimarySidebar",
  SecondarySidebar: "SecondarySidebar",
  Content: "Content"
});

const SHADOW_DOM_STYLE_LOAD_EVENT = "TECH_DOCS_SHADOW_DOM_STYLE_LOAD";
const useShadowDomStylesEvents = (element) => {
  useEffect(() => {
    var _a;
    if (!element) {
      return () => {
      };
    }
    const styles = element.querySelectorAll('head > link[rel="stylesheet"]');
    let count = (_a = styles == null ? void 0 : styles.length) != null ? _a : 0;
    const event = new CustomEvent(SHADOW_DOM_STYLE_LOAD_EVENT);
    if (!count) {
      element.dispatchEvent(event);
      return () => {
      };
    }
    const handleLoad = () => {
      if (--count === 0) {
        element.dispatchEvent(event);
      }
    };
    styles == null ? void 0 : styles.forEach((style) => {
      style.addEventListener("load", handleLoad);
    });
    return () => {
      styles == null ? void 0 : styles.forEach((style) => {
        style.removeEventListener("load", handleLoad);
      });
    };
  }, [element]);
};
const useShadowDomStylesLoading = (element) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!element)
      return () => {
      };
    setLoading(true);
    const style = element.style;
    style.setProperty("opacity", "0");
    const handleLoad = () => {
      setLoading(false);
      style.setProperty("opacity", "1");
    };
    element.addEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, handleLoad);
    return () => {
      element.removeEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, handleLoad);
    };
  }, [element]);
  return loading;
};
const TechDocsShadowDom = ({
  element,
  onAppend,
  children
}) => {
  const [jss, setJss] = useState(create({
    ...jssPreset(),
    insertionPoint: void 0
  }));
  useShadowDomStylesEvents(element);
  const loading = useShadowDomStylesLoading(element);
  const ref = useCallback((shadowHost) => {
    if (!element || !shadowHost)
      return;
    setJss(create({
      ...jssPreset(),
      insertionPoint: element.querySelector("head") || void 0
    }));
    let shadowRoot = shadowHost.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = shadowHost.attachShadow({ mode: "open" });
    }
    shadowRoot.replaceChildren(element);
    if (typeof onAppend === "function") {
      onAppend(shadowRoot);
    }
  }, [element, onAppend]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, loading && /* @__PURE__ */ React.createElement(Progress, null), /* @__PURE__ */ React.createElement(StylesProvider, {
    jss,
    sheetsManager: /* @__PURE__ */ new Map()
  }, /* @__PURE__ */ React.createElement("div", {
    ref,
    "data-testid": "techdocs-native-shadowroot"
  }), children));
};

const useShadowRoot = () => {
  const { shadowRoot } = useTechDocsReaderPage();
  return shadowRoot;
};
const useShadowRootElements = (selectors) => {
  const shadowRoot = useShadowRoot();
  if (!shadowRoot)
    return [];
  return selectors.map((selector) => shadowRoot == null ? void 0 : shadowRoot.querySelectorAll(selector)).filter((nodeList) => nodeList.length).map((nodeList) => Array.from(nodeList)).flat();
};
const isValidSelection = (newSelection) => {
  return newSelection.toString() && newSelection.rangeCount && newSelection.getRangeAt(0).getBoundingClientRect().top;
};
const useShadowRootSelection = (wait = 0) => {
  const shadowRoot = useShadowRoot();
  const [selection, setSelection] = useState(null);
  const handleSelectionChange = useMemo(() => debounce(() => {
    const shadowDocument = shadowRoot;
    const newSelection = shadowDocument.getSelection ? shadowDocument.getSelection() : document.getSelection();
    if (newSelection && isValidSelection(newSelection)) {
      setSelection(newSelection);
    } else {
      setSelection(null);
    }
  }, wait), [shadowRoot, setSelection, wait]);
  useEffect(() => {
    window.document.addEventListener("selectionchange", handleSelectionChange);
    return () => window.document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);
  return selection;
};

export { SHADOW_DOM_STYLE_LOAD_EVENT, TECHDOCS_ADDONS_WRAPPER_KEY, TechDocsAddonLocations, TechDocsAddons, TechDocsReaderPageProvider, TechDocsShadowDom, createTechDocsAddonExtension, techdocsApiRef, techdocsStorageApiRef, useShadowDomStylesLoading, useShadowRoot, useShadowRootElements, useShadowRootSelection, useTechDocsAddons, useTechDocsReaderPage };
//# sourceMappingURL=index.esm.js.map
