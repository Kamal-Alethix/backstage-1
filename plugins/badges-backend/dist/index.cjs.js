'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var catalogModel = require('@backstage/catalog-model');
var errors = require('@backstage/errors');
var badgeMaker = require('badge-maker');
var Router = require('express-promise-router');
var backendCommon = require('@backstage/backend-common');
var catalogClient = require('@backstage/catalog-client');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

function appTitle(context) {
  return context.config.getOptionalString("app.title") || "Backstage";
}
function entityUrl(context) {
  const e = context.entity;
  const entityUri = `${e.metadata.namespace || catalogModel.DEFAULT_NAMESPACE}/${e.kind}/${e.metadata.name}`;
  const catalogUrl = `${context.config.getString("app.baseUrl")}/catalog`;
  return `${catalogUrl}/${entityUri}`.toLowerCase();
}
const createDefaultBadgeFactories = () => ({
  pingback: {
    createBadge: (context) => {
      if (!context.entity) {
        throw new errors.InputError('"pingback" badge only defined for entities');
      }
      return {
        description: `Link to ${context.entity.metadata.name} in ${appTitle(context)}`,
        kind: "entity",
        label: context.entity.kind,
        link: entityUrl(context),
        message: context.entity.metadata.name,
        style: "flat-square"
      };
    }
  },
  lifecycle: {
    createBadge: (context) => {
      var _a;
      if (!context.entity) {
        throw new errors.InputError('"lifecycle" badge only defined for entities');
      }
      return {
        description: "Entity lifecycle badge",
        kind: "entity",
        label: "lifecycle",
        link: entityUrl(context),
        message: `${((_a = context.entity.spec) == null ? void 0 : _a.lifecycle) || "unknown"}`,
        style: "flat-square"
      };
    }
  },
  owner: {
    createBadge: (context) => {
      var _a;
      if (!context.entity) {
        throw new errors.InputError('"owner" badge only defined for entities');
      }
      return {
        description: "Entity owner badge",
        kind: "entity",
        label: "owner",
        link: entityUrl(context),
        message: `${((_a = context.entity.spec) == null ? void 0 : _a.owner) || "unknown"}`,
        style: "flat-square"
      };
    }
  },
  docs: {
    createBadge: (context) => {
      if (!context.entity) {
        throw new errors.InputError('"docs" badge only defined for entities');
      }
      return {
        description: "Entity docs badge",
        kind: "entity",
        label: "docs",
        link: `${entityUrl(context)}/docs`,
        message: context.entity.metadata.name,
        style: "flat-square"
      };
    }
  }
});

class DefaultBadgeBuilder {
  constructor(factories) {
    this.factories = factories;
  }
  async getBadges() {
    return Object.keys(this.factories).map((id) => ({ id }));
  }
  async createBadgeJson(options) {
    const factory = this.factories[options.badgeInfo.id];
    const badge = factory ? factory.createBadge(options.context) : {
      label: "unknown badge",
      message: options.badgeInfo.id,
      color: "red"
    };
    if (!badge) {
      throw new errors.InputError(`The badge factory failed to produce a "${options.badgeInfo.id}" badge with the provided context`);
    }
    return {
      badge,
      id: options.badgeInfo.id,
      url: options.context.badgeUrl,
      markdown: this.getMarkdownCode(badge, options.context.badgeUrl)
    };
  }
  async createBadgeSvg(options) {
    const { badge } = await this.createBadgeJson(options);
    try {
      const format = {
        message: badge.message,
        color: badge.color || "#36BAA2",
        label: badge.label || "",
        labelColor: badge.labelColor || "",
        style: badge.style || "flat-square"
      };
      return badgeMaker.makeBadge(format);
    } catch (err) {
      return badgeMaker.makeBadge({
        label: "invalid badge",
        message: `${err}`,
        color: "red"
      });
    }
  }
  getMarkdownCode(params, badgeUrl) {
    let altText = `${params.label}: ${params.message}`;
    if (params.description && params.description !== params.label) {
      altText = `${params.description}, ${altText}`;
    }
    const tooltip = params.description ? ` "${params.description}"` : "";
    const img = `![${altText}](${badgeUrl}${tooltip})`;
    return params.link ? `[${img}](${params.link})` : img;
  }
}

async function createRouter(options) {
  const catalog = options.catalog || new catalogClient.CatalogClient({ discoveryApi: options.discovery });
  const badgeBuilder = options.badgeBuilder || new DefaultBadgeBuilder(options.badgeFactories || {});
  const router = Router__default["default"]();
  router.get("/entity/:namespace/:kind/:name/badge-specs", async (req, res) => {
    const { namespace, kind, name } = req.params;
    const entity = await catalog.getEntityByRef({ namespace, kind, name }, {
      token: getBearerToken(req.headers.authorization)
    });
    if (!entity) {
      throw new errors.NotFoundError(`No ${kind} entity in ${namespace} named "${name}"`);
    }
    const specs = [];
    for (const badgeInfo of await badgeBuilder.getBadges()) {
      const context = {
        badgeUrl: await getBadgeUrl(namespace, kind, name, badgeInfo.id, options),
        config: options.config,
        entity
      };
      const badge = await badgeBuilder.createBadgeJson({ badgeInfo, context });
      specs.push(badge);
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(specs, null, 2));
  });
  router.get("/entity/:namespace/:kind/:name/badge/:badgeId", async (req, res) => {
    const { namespace, kind, name, badgeId } = req.params;
    const entity = await catalog.getEntityByRef({ namespace, kind, name }, {
      token: getBearerToken(req.headers.authorization)
    });
    if (!entity) {
      throw new errors.NotFoundError(`No ${kind} entity in ${namespace} named "${name}"`);
    }
    let format = req.accepts(["image/svg+xml", "application/json"]) || "image/svg+xml";
    if (req.query.format === "json") {
      format = "application/json";
    }
    const badgeOptions = {
      badgeInfo: { id: badgeId },
      context: {
        badgeUrl: await getBadgeUrl(namespace, kind, name, badgeId, options),
        config: options.config,
        entity
      }
    };
    let data;
    if (format === "application/json") {
      data = JSON.stringify(await badgeBuilder.createBadgeJson(badgeOptions), null, 2);
    } else {
      data = await badgeBuilder.createBadgeSvg(badgeOptions);
    }
    res.setHeader("Content-Type", format);
    res.status(200).send(data);
  });
  router.use(backendCommon.errorHandler());
  return router;
}
async function getBadgeUrl(namespace, kind, name, badgeId, options) {
  const baseUrl = await options.discovery.getExternalBaseUrl("badges");
  return `${baseUrl}/entity/${namespace}/${kind}/${name}/badge/${badgeId}`;
}
function getBearerToken(header) {
  var _a;
  return (_a = header == null ? void 0 : header.match(/Bearer\s+(\S+)/i)) == null ? void 0 : _a[1];
}

const BADGE_STYLES = [
  "plastic",
  "flat",
  "flat-square",
  "for-the-badge",
  "social"
];

exports.BADGE_STYLES = BADGE_STYLES;
exports.DefaultBadgeBuilder = DefaultBadgeBuilder;
exports.createDefaultBadgeFactories = createDefaultBadgeFactories;
exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
