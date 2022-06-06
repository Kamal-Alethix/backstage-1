import React from 'react';
import { useOutlet } from 'react-router';
export { HeaderWorldClock, SettingsModal } from '../index.esm.js';
import '@backstage/core-plugin-api';
import '@material-ui/core';
import '@material-ui/icons/Settings';
import '@backstage/core-components';

const HomepageCompositionRoot = (props) => {
  var _a;
  const outlet = useOutlet();
  const children = (_a = props.children) != null ? _a : outlet;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
};

export { HomepageCompositionRoot };
//# sourceMappingURL=index-94b4f48a.esm.js.map
