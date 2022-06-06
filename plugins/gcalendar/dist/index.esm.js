import { createApiRef, createRouteRef, createPlugin, createApiFactory, googleAuthApiRef, fetchApiRef, createComponentExtension } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

const gcalendarApiRef = createApiRef({
  id: "plugin.gcalendar.service"
});
class GCalendarApiClient {
  constructor(options) {
    this.authApi = options.authApi;
    this.fetchApi = options.fetchApi;
  }
  async get(path, params) {
    const query = new URLSearchParams(params);
    const url = new URL(`${path}?${query.toString()}`, "https://www.googleapis.com");
    const token = await this.authApi.getAccessToken();
    const response = await this.fetchApi.fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
  async getCalendars(params) {
    return this.get("/calendar/v3/users/me/calendarList", params);
  }
  async getEvents(calendarId, params) {
    return this.get(`/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, params);
  }
}

var ResponseStatus = /* @__PURE__ */ ((ResponseStatus2) => {
  ResponseStatus2["needsAction"] = "needsAction";
  ResponseStatus2["accepted"] = "accepted";
  ResponseStatus2["declined"] = "declined";
  ResponseStatus2["maybe"] = "tentative";
  return ResponseStatus2;
})(ResponseStatus || {});

const rootRouteRef = createRouteRef({
  id: "gcalendar"
});

const gcalendarPlugin = createPlugin({
  id: "gcalendar",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: gcalendarApiRef,
      deps: { authApi: googleAuthApiRef, fetchApi: fetchApiRef },
      factory(deps) {
        return new GCalendarApiClient(deps);
      }
    })
  ]
});
const HomePageCalendar = gcalendarPlugin.provide(createComponentExtension({
  name: "HomePageCalendar",
  component: {
    lazy: () => import('./esm/index-ef113565.esm.js').then((m) => m.HomePageCalendar)
  }
}));

export { GCalendarApiClient, HomePageCalendar, ResponseStatus, gcalendarApiRef, gcalendarPlugin };
//# sourceMappingURL=index.esm.js.map
