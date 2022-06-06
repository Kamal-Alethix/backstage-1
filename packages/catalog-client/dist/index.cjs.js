'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var catalogModel = require('@backstage/catalog-model');
var errors = require('@backstage/errors');
var crossFetch = require('cross-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var crossFetch__default = /*#__PURE__*/_interopDefaultLegacy(crossFetch);

const CATALOG_FILTER_EXISTS = Symbol.for("CATALOG_FILTER_EXISTS_0e15b590c0b343a2bae3e787e84c2111");

class CatalogClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi || { fetch: crossFetch__default["default"] };
  }
  async getEntityAncestors(request, options) {
    const { kind, namespace, name } = catalogModel.parseEntityRef(request.entityRef);
    return await this.requestRequired("GET", `/entities/by-name/${encodeURIComponent(kind)}/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/ancestry`, options);
  }
  async getLocationById(id, options) {
    return await this.requestOptional("GET", `/locations/${encodeURIComponent(id)}`, options);
  }
  async getEntities(request, options) {
    const { filter = [], fields = [], offset, limit, after } = request != null ? request : {};
    const params = [];
    for (const filterItem of [filter].flat()) {
      const filterParts = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(encodeURIComponent(key));
          } else if (typeof v === "string") {
            filterParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
          }
        }
      }
      if (filterParts.length) {
        params.push(`filter=${filterParts.join(",")}`);
      }
    }
    if (fields.length) {
      params.push(`fields=${fields.map(encodeURIComponent).join(",")}`);
    }
    if (offset !== void 0) {
      params.push(`offset=${offset}`);
    }
    if (limit !== void 0) {
      params.push(`limit=${limit}`);
    }
    if (after !== void 0) {
      params.push(`after=${encodeURIComponent(after)}`);
    }
    const query = params.length ? `?${params.join("&")}` : "";
    const entities = await this.requestRequired("GET", `/entities${query}`, options);
    const refCompare = (a, b) => {
      var _a, _b;
      if (((_a = a.metadata) == null ? void 0 : _a.name) === void 0 || a.kind === void 0 || ((_b = b.metadata) == null ? void 0 : _b.name) === void 0 || b.kind === void 0) {
        return 0;
      }
      const aRef = catalogModel.stringifyEntityRef(a);
      const bRef = catalogModel.stringifyEntityRef(b);
      if (aRef < bRef) {
        return -1;
      }
      if (aRef > bRef) {
        return 1;
      }
      return 0;
    };
    return { items: entities.sort(refCompare) };
  }
  async getEntityByRef(entityRef, options) {
    const { kind, namespace, name } = catalogModel.parseEntityRef(entityRef);
    return this.requestOptional("GET", `/entities/by-name/${encodeURIComponent(kind)}/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`, options);
  }
  async getEntityByName(compoundName, options) {
    const { kind, namespace = "default", name } = compoundName;
    return this.requestOptional("GET", `/entities/by-name/${encodeURIComponent(kind)}/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`, options);
  }
  async refreshEntity(entityRef, options) {
    const response = await this.fetchApi.fetch(`${await this.discoveryApi.getBaseUrl("catalog")}/refresh`, {
      headers: {
        "Content-Type": "application/json",
        ...(options == null ? void 0 : options.token) && { Authorization: `Bearer ${options == null ? void 0 : options.token}` }
      },
      method: "POST",
      body: JSON.stringify({ entityRef })
    });
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
  }
  async getEntityFacets(request, options) {
    const { filter = [], facets } = request;
    const params = [];
    for (const filterItem of [filter].flat()) {
      const filterParts = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(encodeURIComponent(key));
          } else if (typeof v === "string") {
            filterParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
          }
        }
      }
      if (filterParts.length) {
        params.push(`filter=${filterParts.join(",")}`);
      }
    }
    for (const facet of facets) {
      params.push(`facet=${encodeURIComponent(facet)}`);
    }
    const query = params.length ? `?${params.join("&")}` : "";
    return await this.requestOptional("GET", `/entity-facets${query}`, options);
  }
  async addLocation({ type = "url", target, dryRun }, options) {
    const response = await this.fetchApi.fetch(`${await this.discoveryApi.getBaseUrl("catalog")}/locations${dryRun ? "?dryRun=true" : ""}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options == null ? void 0 : options.token) && { Authorization: `Bearer ${options == null ? void 0 : options.token}` }
      },
      method: "POST",
      body: JSON.stringify({ type, target })
    });
    if (response.status !== 201) {
      throw new Error(await response.text());
    }
    const { location, entities, exists } = await response.json();
    if (!location) {
      throw new Error(`Location wasn't added: ${target}`);
    }
    return {
      location,
      entities,
      exists
    };
  }
  async getLocationByRef(locationRef, options) {
    const all = await this.requestRequired("GET", "/locations", options);
    return all.map((r) => r.data).find((l) => locationRef === catalogModel.stringifyLocationRef(l));
  }
  async removeLocationById(id, options) {
    await this.requestIgnored("DELETE", `/locations/${encodeURIComponent(id)}`, options);
  }
  async removeEntityByUid(uid, options) {
    await this.requestIgnored("DELETE", `/entities/by-uid/${encodeURIComponent(uid)}`, options);
  }
  async requestIgnored(method, path, options) {
    const url = `${await this.discoveryApi.getBaseUrl("catalog")}${path}`;
    const headers = (options == null ? void 0 : options.token) ? { Authorization: `Bearer ${options.token}` } : {};
    const response = await this.fetchApi.fetch(url, { method, headers });
    if (!response.ok) {
      throw await errors.ResponseError.fromResponse(response);
    }
  }
  async requestRequired(method, path, options) {
    const url = `${await this.discoveryApi.getBaseUrl("catalog")}${path}`;
    const headers = (options == null ? void 0 : options.token) ? { Authorization: `Bearer ${options.token}` } : {};
    const response = await this.fetchApi.fetch(url, { method, headers });
    if (!response.ok) {
      throw await errors.ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async requestOptional(method, path, options) {
    const url = `${await this.discoveryApi.getBaseUrl("catalog")}${path}`;
    const headers = (options == null ? void 0 : options.token) ? { Authorization: `Bearer ${options.token}` } : {};
    const response = await this.fetchApi.fetch(url, { method, headers });
    if (!response.ok) {
      if (response.status === 404) {
        return void 0;
      }
      throw await errors.ResponseError.fromResponse(response);
    }
    return await response.json();
  }
}

const ENTITY_STATUS_CATALOG_PROCESSING_TYPE = "backstage.io/catalog-processing";

exports.CATALOG_FILTER_EXISTS = CATALOG_FILTER_EXISTS;
exports.CatalogClient = CatalogClient;
exports.ENTITY_STATUS_CATALOG_PROCESSING_TYPE = ENTITY_STATUS_CATALOG_PROCESSING_TYPE;
//# sourceMappingURL=index.cjs.js.map
