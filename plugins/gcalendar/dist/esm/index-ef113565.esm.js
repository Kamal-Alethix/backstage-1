import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useQuery, useQueries, QueryClient, QueryClientProvider } from 'react-query';
import { unescape, compact, sortBy } from 'lodash';
import { DateTime } from 'luxon';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, errorApiRef, googleAuthApiRef, storageApiRef, useAnalytics } from '@backstage/core-plugin-api';
import { makeStyles, Badge, Chip, Box, Typography, Tooltip, Link, IconButton, Divider, Paper, Popover, FormControl, Select, Input, MenuItem, Checkbox, ListItemText, styled, Button } from '@material-ui/core';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';
import { gcalendarApiRef, gcalendarPlugin, ResponseStatus } from '../index.esm.js';
import useObservable from 'react-use/lib/useObservable';
import calendarCardIcon from '../icons/calendarIcon.svg';
import classnames from 'classnames';
import { usePopupState, bindTrigger, bindPopover } from 'material-ui-popup-state/hooks';
import zoomIcon from '../icons/zoomIcon.svg';
import DOMPurify from 'dompurify';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/CheckCircle';
import '@backstage/errors';

const useCalendarsQuery = ({ enabled }) => {
  const calendarApi = useApi(gcalendarApiRef);
  const errorApi = useApi(errorApiRef);
  return useQuery(["calendars"], async () => {
    const calendars = [];
    let token = "";
    do {
      const { nextPageToken = "", items = [] } = await calendarApi.getCalendars({
        maxResults: 100,
        minAccessRole: "reader",
        pageToken: token
      });
      token = nextPageToken;
      calendars.push(...items);
    } while (token);
    return calendars;
  }, {
    enabled,
    keepPreviousData: true,
    refetchInterval: 36e5,
    onError: () => {
      errorApi.post({
        name: "API error",
        message: "Failed to fetch calendars."
      });
    }
  });
};

const useEventsQuery = ({
  selectedCalendars = [],
  calendars = [],
  enabled,
  timeMin,
  timeMax,
  timeZone
}) => {
  const calendarApi = useApi(gcalendarApiRef);
  const eventQueries = useQueries(selectedCalendars.filter((id) => calendars.find((c) => c.id === id)).map((calendarId) => {
    const calendar = calendars.find((c) => c.id === calendarId);
    return {
      queryKey: ["calendarEvents", calendarId, timeMin, timeMax],
      enabled,
      initialData: [],
      refetchInterval: 6e4,
      refetchIntervalInBackground: true,
      queryFn: async () => {
        const data = await calendarApi.getEvents(calendarId, {
          calendarId,
          timeMin,
          timeMax,
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
          orderBy: "startTime",
          timeZone
        });
        return (data.items || []).map((event) => {
          var _a, _b;
          const responseStatus = (_b = (_a = event.attendees) == null ? void 0 : _a.find((a) => !!a.self)) == null ? void 0 : _b.responseStatus;
          return {
            ...event,
            summary: unescape(event.summary || ""),
            calendarId,
            backgroundColor: calendar == null ? void 0 : calendar.backgroundColor,
            primary: !!(calendar == null ? void 0 : calendar.primary),
            responseStatus
          };
        });
      }
    };
  }));
  const events = useMemo(() => compact(eventQueries.map(({ data }) => data).flat()), [eventQueries]);
  const isLoading = !!eventQueries.find((q) => q.isFetching) && events.length === 0;
  return { events, isLoading };
};

const useSignIn = () => {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const authApi = useApi(googleAuthApiRef);
  const signIn = useCallback(async (optional = false) => {
    const token = await authApi.getAccessToken("https://www.googleapis.com/auth/calendar.readonly", {
      optional,
      instantPopup: !optional
    });
    setSignedIn(!!token);
    setInitialized(true);
  }, [authApi, setSignedIn]);
  return { isSignedIn, isInitialized, signIn };
};

function useStoredCalendars(defaultValue) {
  const storageBucket = gcalendarPlugin.getId();
  const storageKey = "google_calendars_selected" /* selectedCalendars */;
  const storageApi = useApi(storageApiRef).forBucket(storageBucket);
  const setValue = (value) => {
    storageApi.set(storageKey, value);
  };
  const snapshot = useObservable(storageApi.observe$(storageKey), storageApi.snapshot(storageKey));
  let result;
  if (snapshot.presence === "absent") {
    result = defaultValue;
  } else {
    result = snapshot.value;
  }
  return [result, setValue];
}

const useStyles$3 = makeStyles((theme) => {
  const getIconColor = (responseStatus) => {
    if (!responseStatus)
      return theme.palette.primary.light;
    return {
      [ResponseStatus.accepted]: theme.palette.status.ok,
      [ResponseStatus.declined]: theme.palette.status.error
    }[responseStatus];
  };
  return {
    responseStatus: {
      color: ({ responseStatus }) => getIconColor(responseStatus)
    },
    badge: {
      right: 10,
      top: 5,
      "& svg": {
        height: 16,
        width: 16,
        background: "#fff"
      }
    }
  };
});
const ResponseIcon = ({ responseStatus }) => {
  if (responseStatus === ResponseStatus.accepted) {
    return /* @__PURE__ */ React.createElement(CheckIcon, {
      "data-testid": "accepted-icon"
    });
  }
  if (responseStatus === ResponseStatus.declined) {
    return /* @__PURE__ */ React.createElement(CancelIcon, {
      "data-testid": "declined-icon"
    });
  }
  return null;
};
const AttendeeChip = ({ user }) => {
  const classes = useStyles$3({ responseStatus: user.responseStatus });
  return /* @__PURE__ */ React.createElement(Badge, {
    classes: {
      root: classes.responseStatus,
      badge: classes.badge
    },
    badgeContent: /* @__PURE__ */ React.createElement(ResponseIcon, {
      responseStatus: user.responseStatus
    })
  }, /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    variant: "outlined",
    label: user.email,
    color: "primary"
  }));
};

function getZoomLink(event) {
  var _a, _b, _c;
  const videoEntrypoint = (_b = (_a = event.conferenceData) == null ? void 0 : _a.entryPoints) == null ? void 0 : _b.find((e) => e.entryPointType === "video");
  return (_c = videoEntrypoint == null ? void 0 : videoEntrypoint.uri) != null ? _c : "";
}
function getTimePeriod(event) {
  var _a, _b;
  if (isAllDay(event)) {
    return getAllDayTimePeriod(event);
  }
  const format = {
    hour: "2-digit",
    minute: "2-digit"
  };
  const startTime = DateTime.fromISO(((_a = event.start) == null ? void 0 : _a.dateTime) || "");
  const endTime = DateTime.fromISO(((_b = event.end) == null ? void 0 : _b.dateTime) || "");
  return `${startTime.toLocaleString(format)} - ${endTime.toLocaleString(format)}`;
}
function getAllDayTimePeriod(event) {
  var _a, _b, _c, _d;
  const format = { month: "long", day: "numeric" };
  const startTime = DateTime.fromISO(((_a = event.start) == null ? void 0 : _a.dateTime) || ((_b = event.start) == null ? void 0 : _b.date) || "");
  const endTime = DateTime.fromISO(((_c = event.end) == null ? void 0 : _c.dateTime) || ((_d = event.end) == null ? void 0 : _d.date) || "").minus({ day: 1 });
  if (startTime.toISO() === endTime.toISO()) {
    return startTime.toLocaleString(format);
  }
  return `${startTime.toLocaleString(format)} - ${endTime.toLocaleString(format)}`;
}
function isPassed(event) {
  var _a, _b, _c, _d;
  if (!((_a = event.end) == null ? void 0 : _a.dateTime) && !((_b = event.end) == null ? void 0 : _b.date))
    return false;
  const eventDate = DateTime.fromISO(((_c = event.end) == null ? void 0 : _c.dateTime) || ((_d = event.end) == null ? void 0 : _d.date));
  return DateTime.now() >= eventDate;
}
function isAllDay(event) {
  var _a, _b, _c, _d;
  if (((_a = event.start) == null ? void 0 : _a.date) || ((_b = event.end) == null ? void 0 : _b.date)) {
    return true;
  }
  const startTime = DateTime.fromISO(((_c = event.start) == null ? void 0 : _c.dateTime) || "");
  const endTime = DateTime.fromISO(((_d = event.end) == null ? void 0 : _d.dateTime) || "");
  return endTime.diff(startTime, "day").days >= 1;
}
function getStartDate(event) {
  var _a, _b;
  return DateTime.fromISO(((_a = event.start) == null ? void 0 : _a.dateTime) || ((_b = event.start) == null ? void 0 : _b.date) || "");
}

const useStyles$2 = makeStyles((theme) => {
  return {
    description: {
      wordBreak: "break-word",
      "& a": {
        color: theme.palette.primary.main,
        fontWeight: 500
      }
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  };
}, {
  name: "GCalendarEventPopoverContent"
});
const CalendarEventPopoverContent = ({
  event
}) => {
  const classes = useStyles$2({ event });
  const analytics = useAnalytics();
  const zoomLink = getZoomLink(event);
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: 400,
    p: 2
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    flex: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, event.summary), /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, getTimePeriod(event))), event.htmlLink && /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Open in Calendar"
  }, /* @__PURE__ */ React.createElement(Link, {
    "data-testid": "open-calendar-link",
    href: event.htmlLink,
    target: "_blank",
    onClick: (_e) => analytics.captureEvent("click", "open in calendar")
  }, /* @__PURE__ */ React.createElement(IconButton, null, /* @__PURE__ */ React.createElement(ArrowForwardIcon, null))))), zoomLink && /* @__PURE__ */ React.createElement(Link, {
    href: zoomLink,
    target: "_blank",
    onClick: (_e) => analytics.captureEvent("click", "zoom link")
  }, "Join Zoom Meeting"), event.description && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, {
    className: classes.divider,
    variant: "fullWidth"
  }), /* @__PURE__ */ React.createElement(Box, {
    className: classes.description,
    dangerouslySetInnerHTML: {
      __html: DOMPurify.sanitize(event.description, {
        USE_PROFILES: { html: true }
      })
    }
  })), event.attendees && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, {
    className: classes.divider,
    variant: "fullWidth"
  }), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, "Attendees"), /* @__PURE__ */ React.createElement(Box, {
    mb: 1
  }), sortBy(event.attendees || [], "email").map((user) => /* @__PURE__ */ React.createElement(AttendeeChip, {
    key: user.email,
    user
  })))));
};

const useStyles$1 = makeStyles((theme) => ({
  event: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    cursor: "pointer",
    paddingRight: 12
  },
  declined: {
    textDecoration: "line-through"
  },
  passed: {
    opacity: 0.6,
    transition: "opacity 0.15s ease-in-out",
    "&:hover": {
      opacity: 1
    }
  },
  link: {
    width: 48,
    height: 48,
    display: "inline-block",
    padding: 8,
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: theme.palette.grey[100]
    }
  },
  calendarColor: ({ event }) => ({
    width: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: event.primary ? theme.palette.primary.light : event.backgroundColor
  })
}), {
  name: "GCalendarEvent"
});
const CalendarEvent = ({ event }) => {
  const classes = useStyles$1({ event });
  const popoverState = usePopupState({
    variant: "popover",
    popupId: event.id,
    disableAutoFocus: true
  });
  const [hovered, setHovered] = useState(false);
  const analytics = useAnalytics();
  const zoomLink = getZoomLink(event);
  const { onClick, ...restBindProps } = bindTrigger(popoverState);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Paper, {
    onClick: (e) => {
      onClick(e);
      analytics.captureEvent("click", "event info");
    },
    ...restBindProps,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    elevation: hovered ? 4 : 1,
    className: classnames(classes.event, {
      [classes.passed]: isPassed(event)
    }),
    "data-testid": "calendar-event"
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.calendarColor,
    mr: 1,
    alignSelf: "stretch"
  }), /* @__PURE__ */ React.createElement(Box, {
    flex: 1,
    pt: 1,
    pb: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: classnames({
      [classes.declined]: event.responseStatus === ResponseStatus.declined
    })
  }, event.summary), !isAllDay(event) && /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    "data-testid": "calendar-event-time"
  }, getTimePeriod(event))), zoomLink && /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Join Zoom Meeting"
  }, /* @__PURE__ */ React.createElement(Link, {
    "data-testid": "calendar-event-zoom-link",
    className: classes.link,
    href: zoomLink,
    target: "_blank",
    onClick: (e) => {
      e.stopPropagation();
      analytics.captureEvent("click", "zoom link");
    }
  }, /* @__PURE__ */ React.createElement("img", {
    src: zoomIcon,
    alt: "Zoom link"
  })))), /* @__PURE__ */ React.createElement(Popover, {
    ...bindPopover(popoverState),
    anchorOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center"
    },
    "data-testid": "calendar-event-popover"
  }, /* @__PURE__ */ React.createElement(CalendarEventPopoverContent, {
    event
  })));
};

const useStyles = makeStyles({
  formControl: {
    width: 120
  },
  selectedCalendars: {
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
}, {
  name: "GCalendarSelect"
});
const CalendarSelect = ({
  disabled,
  selectedCalendars = [],
  setSelectedCalendars,
  calendars
}) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(FormControl, {
    className: classes.formControl
  }, /* @__PURE__ */ React.createElement(Select, {
    labelId: "calendars-label",
    disabled: disabled || calendars.length === 0,
    multiple: true,
    value: selectedCalendars,
    onChange: async (e) => setSelectedCalendars(e.target.value),
    input: /* @__PURE__ */ React.createElement(Input, null),
    renderValue: (selected) => /* @__PURE__ */ React.createElement(Typography, {
      className: classes.selectedCalendars,
      variant: "body2"
    }, calendars.filter((c) => c.id && selected.includes(c.id)).map((c) => c.summary).join(", ")),
    MenuProps: {
      PaperProps: {
        style: {
          width: 350
        }
      }
    }
  }, sortBy(calendars, "summary").map((c) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: c.id,
    value: c.id
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    checked: selectedCalendars.includes(c.id)
  }), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: c.summary
  })))));
};

const eventsMock = [
  {
    id: "1",
    htmlLink: "https://www.google.com/calendar/",
    summary: "Backstage Community Sessions",
    start: {
      dateTime: "2021-12-07T09:00:00+01:00",
      timeZone: "Europe/London"
    },
    end: {
      dateTime: "2021-12-07T10:00:00+01:00",
      timeZone: "Europe/London"
    }
  },
  {
    id: "2",
    htmlLink: "https://www.google.com/calendar/",
    summary: "Backstage Community Sessions",
    start: {
      dateTime: "2021-12-07T10:30:00+01:00",
      timeZone: "Europe/London"
    },
    end: {
      dateTime: "2021-12-07T10:45:00+01:00",
      timeZone: "Europe/London"
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: "video",
          uri: "https://zoom.us"
        }
      ]
    }
  },
  {
    id: "3",
    htmlLink: "https://www.google.com/calendar",
    summary: "Backstage Community Sessions",
    start: {
      dateTime: "2021-12-07T12:00:00+01:00",
      timeZone: "Europe/London"
    },
    end: {
      dateTime: "2021-12-07T13:00:00+01:00",
      timeZone: "Europe/London"
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: "video",
          uri: "https://zoom.us",
          label: "zoom.us"
        }
      ]
    }
  },
  {
    id: "4",
    htmlLink: "https://www.google.com/calendar",
    summary: "Backstage Community Sessions",
    start: {
      dateTime: "2021-12-07T15:00:00+01:00",
      timeZone: "Europe/London"
    },
    end: {
      dateTime: "2021-12-07T16:30:00+01:00",
      timeZone: "Europe/London"
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: "video",
          uri: "https://zoom.us"
        }
      ]
    }
  },
  {
    id: "5",
    htmlLink: "https://www.google.com/calendar",
    summary: "Backstage Community Sessions",
    start: {
      dateTime: "2021-12-07T17:00:00+01:00",
      timeZone: "Europe/London"
    },
    end: {
      dateTime: "2021-12-07T17:30:00+01:00",
      timeZone: "Europe/London"
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: "video",
          uri: "https://zoom.us"
        }
      ]
    }
  }
];

const TransparentBox = styled(Box)({
  opacity: 0.3,
  filter: "blur(1.5px)"
});
const SignInContent = ({
  handleAuthClick,
  events = eventsMock
}) => {
  return /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    height: "100%",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TransparentBox, {
    p: 1
  }, events.map((event) => /* @__PURE__ */ React.createElement(CalendarEvent, {
    key: event.id,
    event
  }))), /* @__PURE__ */ React.createElement(Box, {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    top: 0
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    onClick: handleAuthClick,
    size: "large"
  }, "Sign in")));
};

const CalendarCard = () => {
  var _a;
  const [date, setDate] = useState(DateTime.now());
  const analytics = useAnalytics();
  const changeDay = (offset = 1) => {
    setDate((prev) => prev.plus({ day: offset }));
    analytics.captureEvent("click", "change date");
  };
  const { isSignedIn, isInitialized, signIn } = useSignIn();
  useEffect(() => {
    signIn(true);
  }, [signIn]);
  const { isLoading: isCalendarLoading, data: calendars = [] } = useCalendarsQuery({
    enabled: isSignedIn
  });
  const primaryCalendarId = (_a = calendars.find((c) => c.primary === true)) == null ? void 0 : _a.id;
  const defaultSelectedCalendars = primaryCalendarId ? [primaryCalendarId] : [];
  const [storedCalendars, setStoredCalendars] = useStoredCalendars(defaultSelectedCalendars);
  const { events, isLoading: isEventLoading } = useEventsQuery({
    calendars,
    selectedCalendars: storedCalendars,
    enabled: isSignedIn && calendars.length > 0,
    timeMin: date.startOf("day").toISO(),
    timeMax: date.endOf("day").toISO(),
    timeZone: date.zoneName
  });
  return /* @__PURE__ */ React.createElement(InfoCard, {
    noPadding: true,
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Box, {
      height: 24,
      width: 24,
      mr: 1
    }, /* @__PURE__ */ React.createElement("img", {
      src: calendarCardIcon,
      alt: "Google Calendar"
    })), isSignedIn ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
      onClick: () => changeDay(-1),
      size: "small"
    }, /* @__PURE__ */ React.createElement(PrevIcon, null)), /* @__PURE__ */ React.createElement(IconButton, {
      onClick: () => changeDay(1),
      size: "small"
    }, /* @__PURE__ */ React.createElement(NextIcon, null)), /* @__PURE__ */ React.createElement(Box, {
      mr: 0.5
    }), /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, date.toLocaleString({
      weekday: "short",
      month: "short",
      day: "numeric"
    })), /* @__PURE__ */ React.createElement(Box, {
      flex: 1
    }), /* @__PURE__ */ React.createElement(CalendarSelect, {
      calendars,
      selectedCalendars: storedCalendars,
      setSelectedCalendars: setStoredCalendars,
      disabled: isCalendarLoading || !isSignedIn
    })) : /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, "Agenda")),
    deepLink: {
      link: "https://calendar.google.com/",
      title: "Go to Calendar"
    }
  }, /* @__PURE__ */ React.createElement(Box, null, (isCalendarLoading || isEventLoading || !isInitialized) && /* @__PURE__ */ React.createElement(Box, {
    pt: 2,
    pb: 2
  }, /* @__PURE__ */ React.createElement(Progress, {
    variant: "query"
  })), !isSignedIn && isInitialized && /* @__PURE__ */ React.createElement(SignInContent, {
    handleAuthClick: () => signIn(false)
  }), !isEventLoading && !isCalendarLoading && isSignedIn && /* @__PURE__ */ React.createElement(Box, {
    p: 1,
    pb: 0,
    maxHeight: 602,
    overflow: "auto"
  }, events.length === 0 && /* @__PURE__ */ React.createElement(Box, {
    pt: 2,
    pb: 2
  }, /* @__PURE__ */ React.createElement(Typography, {
    align: "center",
    variant: "h6"
  }, "No events")), sortBy(events, [getStartDate]).map((event) => /* @__PURE__ */ React.createElement(CalendarEvent, {
    key: `${event.calendarId}-${event.id}`,
    event
  })))));
};

const queryClient = new QueryClient();
const HomePageCalendar = () => {
  return /* @__PURE__ */ React.createElement(QueryClientProvider, {
    client: queryClient
  }, /* @__PURE__ */ React.createElement(CalendarCard, null));
};

export { HomePageCalendar };
//# sourceMappingURL=index-ef113565.esm.js.map
