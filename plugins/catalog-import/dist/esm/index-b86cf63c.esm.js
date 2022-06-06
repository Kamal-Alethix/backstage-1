import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultImportPage } from '../index.esm.js';
import '@backstage/core-plugin-api';
import '@backstage/integration-react';
import '@backstage/plugin-catalog-react';
import '@octokit/rest';
import 'js-base64';
import 'git-url-parse';
import 'lodash';
import '@backstage/core-components';
import '@material-ui/core';
import '@material-ui/core/styles';
import '@material-ui/icons/LocationOn';
import '@material-ui/icons/ExpandLess';
import '@material-ui/icons/ExpandMore';
import '@material-ui/icons/Work';
import 'lodash/partition';
import 'react-hook-form';
import '@material-ui/lab';
import 'yaml';
import '@backstage/errors';
import 'react-use/lib/useAsync';
import '@backstage/catalog-model';

const ImportPage = () => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultImportPage, null);
};

export { ImportPage };
//# sourceMappingURL=index-b86cf63c.esm.js.map
