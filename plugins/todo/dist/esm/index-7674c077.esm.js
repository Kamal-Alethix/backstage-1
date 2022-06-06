import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useState } from 'react';
import '@backstage/catalog-model';
import '@backstage/errors';
import { todoApiRef } from '../index.esm.js';
import { ResponseErrorPanel, Table, OverflowTooltip, Link } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const PAGE_SIZE = 10;
const columns = [
  {
    title: "Tag",
    field: "tag",
    width: "10%",
    filtering: false
  },
  {
    title: "Text",
    field: "text",
    width: "55%",
    highlight: true,
    render: ({ text }) => /* @__PURE__ */ React.createElement(OverflowTooltip, {
      text
    })
  },
  {
    title: "File",
    field: "repoFilePath",
    width: "25%",
    render: ({ viewUrl, repoFilePath }) => viewUrl ? /* @__PURE__ */ React.createElement(Link, {
      to: viewUrl,
      target: "_blank"
    }, /* @__PURE__ */ React.createElement(OverflowTooltip, {
      text: repoFilePath
    })) : /* @__PURE__ */ React.createElement(OverflowTooltip, {
      text: repoFilePath
    })
  },
  {
    title: "Author",
    field: "author",
    width: "10%",
    render: ({ author }) => /* @__PURE__ */ React.createElement(OverflowTooltip, {
      text: author
    })
  }
];
const TodoList = () => {
  const { entity } = useEntity();
  const todoApi = useApi(todoApiRef);
  const [error, setError] = useState();
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(Table, {
    title: "TODOs",
    options: {
      search: false,
      pageSize: PAGE_SIZE,
      padding: "dense",
      sorting: true,
      draggable: false,
      paging: true,
      filtering: true,
      debounceInterval: 500,
      filterCellStyle: { padding: "0 16px 0 20px" }
    },
    columns,
    data: async (query) => {
      var _a, _b, _c;
      try {
        const page = (_a = query == null ? void 0 : query.page) != null ? _a : 0;
        const pageSize = (_b = query == null ? void 0 : query.pageSize) != null ? _b : PAGE_SIZE;
        const result = await todoApi.listTodos({
          entity,
          offset: page * pageSize,
          limit: pageSize,
          orderBy: (query == null ? void 0 : query.orderBy) && {
            field: query.orderBy.field,
            direction: query.orderDirection
          },
          filters: (_c = query == null ? void 0 : query.filters) == null ? void 0 : _c.map((filter) => ({
            field: filter.column.field,
            value: `*${filter.value}*`
          }))
        });
        return {
          data: result.items,
          totalCount: result.totalCount,
          page: Math.floor(result.offset / result.limit)
        };
      } catch (loadingError) {
        setError(loadingError);
        return { data: [], totalCount: 0, page: 0 };
      }
    }
  });
};

export { TodoList };
//# sourceMappingURL=index-7674c077.esm.js.map
