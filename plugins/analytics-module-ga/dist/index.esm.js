import { createPlugin } from '@backstage/core-plugin-api';
import ReactGA from 'react-ga';

const analyticsModuleGA = createPlugin({
  id: "analytics-provider-ga"
});

class DeferredCapture {
  constructor({ defer = false }) {
    this.queue = defer ? [] : void 0;
  }
  setReady() {
    if (this.queue) {
      this.queue.forEach(this.sendDeferred);
      this.queue = void 0;
    }
  }
  pageview(path, metadata = {}) {
    if (this.queue) {
      this.queue.push({
        timestamp: Date.now(),
        data: {
          hitType: "pageview",
          page: path,
          ...metadata
        }
      });
      return;
    }
    ReactGA.send({
      hitType: "pageview",
      page: path,
      ...metadata
    });
  }
  event(eventDetails) {
    if (this.queue) {
      this.queue.push({
        timestamp: Date.now(),
        data: {
          ...eventDetails,
          hitType: "event"
        }
      });
      return;
    }
    ReactGA.event(eventDetails);
  }
  sendDeferred(hit) {
    ReactGA.send({
      ...hit.data,
      queueTime: Date.now() - hit.timestamp
    });
  }
}

class GoogleAnalytics {
  constructor(options) {
    const {
      cdmConfig,
      identity,
      trackingId,
      identityApi,
      userIdTransform = "sha-256",
      scriptSrc,
      testMode,
      debug
    } = options;
    this.cdmConfig = cdmConfig;
    ReactGA.initialize(trackingId, {
      testMode,
      debug,
      gaAddress: scriptSrc,
      titleCase: false
    });
    this.capture = new DeferredCapture({ defer: identity === "required" });
    this.customUserIdTransform = typeof userIdTransform === "function" ? userIdTransform : void 0;
    if (identity !== "disabled" && identityApi) {
      this.setUserFrom(identityApi);
    }
  }
  static fromConfig(config, options = {}) {
    var _a, _b, _c, _d;
    const trackingId = config.getString("app.analytics.ga.trackingId");
    const scriptSrc = config.getOptionalString("app.analytics.ga.scriptSrc");
    const identity = config.getOptionalString("app.analytics.ga.identity") || "disabled";
    const debug = (_a = config.getOptionalBoolean("app.analytics.ga.debug")) != null ? _a : false;
    const testMode = (_b = config.getOptionalBoolean("app.analytics.ga.testMode")) != null ? _b : false;
    const cdmConfig = (_d = (_c = config.getOptionalConfigArray("app.analytics.ga.customDimensionsMetrics")) == null ? void 0 : _c.map((c) => {
      return {
        type: c.getString("type"),
        index: c.getNumber("index"),
        source: c.getString("source"),
        key: c.getString("key")
      };
    })) != null ? _d : [];
    if (identity === "required" && !options.identityApi) {
      throw new Error("Invalid config: identity API must be provided to deps when ga.identity is required");
    }
    return new GoogleAnalytics({
      ...options,
      identity,
      trackingId,
      scriptSrc,
      cdmConfig,
      testMode,
      debug
    });
  }
  captureEvent(event) {
    const { context, action, subject, value, attributes } = event;
    const customMetadata = this.getCustomDimensionMetrics(context, attributes);
    if (action === "navigate" && context.extension === "App") {
      this.capture.pageview(subject, customMetadata);
      return;
    }
    this.capture.event({
      category: context.extension || "App",
      action,
      label: subject,
      value,
      ...customMetadata
    });
  }
  getCustomDimensionMetrics(context, attributes = {}) {
    const customDimensionsMetrics = {};
    this.cdmConfig.forEach((config) => {
      const value = config.source === "context" ? context[config.key] : attributes[config.key];
      if (config.type === "metric" && typeof value !== "number") {
        return;
      }
      if (value !== void 0) {
        customDimensionsMetrics[`${config.type}${config.index}`] = value;
      }
    });
    return customDimensionsMetrics;
  }
  async setUserFrom(identityApi) {
    const { userEntityRef } = await identityApi.getBackstageIdentity();
    const userId = await this.getPrivateUserId(userEntityRef);
    ReactGA.set({ userId });
    this.capture.setReady();
  }
  getPrivateUserId(userEntityRef) {
    if (this.customUserIdTransform) {
      return this.customUserIdTransform(userEntityRef);
    }
    return this.hash(userEntityRef);
  }
  async hash(value) {
    const digest = await crypto.subtle.digest("sha-256", new TextEncoder().encode(value));
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}

export { GoogleAnalytics, analyticsModuleGA };
//# sourceMappingURL=index.esm.js.map
