import { Link, MarkdownContent, Progress, Page, Header, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import { createApiRef, useApi, errorApiRef, createRouteRef, createPlugin, createApiFactory, createRoutableExtension } from '@backstage/core-plugin-api';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { makeStyles, DialogContent, DialogActions, Button, Input, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinkIcon from '@material-ui/icons/Link';
import color from 'color';
import { forceSimulation, forceCollide } from 'd3-force';

const techRadarApiRef = createApiRef({
  id: "plugin.techradar.service"
});
var MovedState = /* @__PURE__ */ ((MovedState2) => {
  MovedState2[MovedState2["Down"] = -1] = "Down";
  MovedState2[MovedState2["NoChange"] = 0] = "NoChange";
  MovedState2[MovedState2["Up"] = 1] = "Up";
  return MovedState2;
})(MovedState || {});

const useStyles$5 = makeStyles((theme) => ({
  ring: {
    fill: "none",
    stroke: "#bbb",
    strokeWidth: "1px"
  },
  axis: {
    fill: "none",
    stroke: "#bbb",
    strokeWidth: "1px"
  },
  text: {
    pointerEvents: "none",
    userSelect: "none",
    fill: theme.palette.text.primary,
    fontSize: "25px",
    fontWeight: 800
  }
}));
const RadarGrid = (props) => {
  const { radius, rings } = props;
  const classes = useStyles$5(props);
  const makeRingNode = (ringIndex, ringRadius) => [
    /* @__PURE__ */ React.createElement("circle", {
      key: `c${ringIndex}`,
      cx: 0,
      cy: 0,
      r: ringRadius,
      className: classes.ring
    }),
    /* @__PURE__ */ React.createElement("text", {
      key: `t${ringIndex}`,
      y: ringRadius !== void 0 ? -ringRadius + 42 : void 0,
      textAnchor: "middle",
      className: classes.text
    }, rings[ringIndex].name)
  ];
  const axisNodes = [
    /* @__PURE__ */ React.createElement("line", {
      key: "x",
      x1: 0,
      y1: -radius,
      x2: 0,
      y2: radius,
      className: classes.axis,
      "data-testid": "radar-grid-x-line"
    }),
    /* @__PURE__ */ React.createElement("line", {
      key: "y",
      x1: -radius,
      y1: 0,
      x2: radius,
      y2: 0,
      className: classes.axis,
      "data-testid": "radar-grid-y-line"
    })
  ];
  const ringNodes = rings.map((r) => r.outerRadius).map((ringRadius, ringIndex) => makeRingNode(ringIndex, ringRadius));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, axisNodes.concat(...ringNodes));
};

function isValidUrl(url) {
  return Boolean(url && url !== "#" && url.length > 0);
}
const WithLink = ({
  url,
  className,
  children
}) => isValidUrl(url) ? /* @__PURE__ */ React.createElement(Link, {
  className,
  to: url
}, children) : /* @__PURE__ */ React.createElement(React.Fragment, null, children);

const RadarDescription = (props) => {
  const { open, onClose, title, description, url } = props;
  return /* @__PURE__ */ React.createElement(Dialog, {
    "data-testid": "radar-description",
    open,
    onClose
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    "data-testid": "radar-description-dialog-title"
  }, title), /* @__PURE__ */ React.createElement(DialogContent, {
    dividers: true
  }, /* @__PURE__ */ React.createElement(MarkdownContent, {
    content: description
  })), isValidUrl(url) && /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    component: Link,
    to: url,
    onClick: onClose,
    color: "primary",
    startIcon: /* @__PURE__ */ React.createElement(LinkIcon, null)
  }, "LEARN MORE")));
};

const useStyles$4 = makeStyles(() => ({
  text: {
    pointerEvents: "none",
    userSelect: "none",
    fontSize: "9px",
    fill: "#fff",
    textAnchor: "middle"
  },
  link: {
    cursor: "pointer"
  }
}));
const makeBlip = (color, moved) => {
  const style = { fill: color };
  let blip = /* @__PURE__ */ React.createElement("circle", {
    r: 9,
    style
  });
  if (moved && moved > 0) {
    blip = /* @__PURE__ */ React.createElement("path", {
      d: "M -11,5 11,5 0,-13 z",
      style
    });
  } else if (moved && moved < 0) {
    blip = /* @__PURE__ */ React.createElement("path", {
      d: "M -11,-5 11,-5 0,13 z",
      style
    });
  }
  return blip;
};
const RadarEntry = (props) => {
  const classes = useStyles$4(props);
  const [open, setOpen] = React.useState(false);
  const {
    moved,
    description,
    title,
    color,
    url,
    value,
    x,
    y,
    onMouseEnter,
    onMouseLeave,
    onClick
  } = props;
  const blip = makeBlip(color, moved);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const toggle = () => {
    setOpen(!open);
  };
  return /* @__PURE__ */ React.createElement("g", {
    transform: `translate(${x}, ${y})`,
    onMouseEnter,
    onMouseLeave,
    onClick,
    "data-testid": "radar-entry"
  }, " ", open && /* @__PURE__ */ React.createElement(RadarDescription, {
    open,
    onClose: handleClose,
    title: title ? title : "no title",
    description: description ? description : "no description",
    url
  }), description ? /* @__PURE__ */ React.createElement("a", {
    className: classes.link,
    onClick: handleClickOpen,
    role: "button",
    href: "#",
    tabIndex: 0,
    onKeyPress: toggle
  }, blip) : /* @__PURE__ */ React.createElement(WithLink, {
    url,
    className: classes.link
  }, blip), /* @__PURE__ */ React.createElement("text", {
    y: 3,
    className: classes.text
  }, value));
};

const useStyles$3 = makeStyles(() => ({
  bubble: {
    pointerEvents: "none",
    userSelect: "none",
    opacity: 0
  },
  visibleBubble: {
    pointerEvents: "none",
    userSelect: "none",
    opacity: 0.8
  },
  background: {
    fill: "#333"
  },
  text: {
    pointerEvents: "none",
    userSelect: "none",
    fontSize: "10px",
    fill: "#fff"
  }
}));
const RadarBubble = (props) => {
  const classes = useStyles$3(props);
  const { visible, text } = props;
  const textElem = useRef(null);
  const svgElem = useRef(null);
  const rectElem = useRef(null);
  const pathElem = useRef(null);
  const updatePosition = () => {
    if (textElem.current) {
      const { x, y } = props;
      const bbox = textElem.current.getBBox();
      const marginX = 5;
      const marginY = 4;
      if (svgElem.current) {
        svgElem.current.setAttribute("transform", `translate(${x - bbox.width / 2}, ${y - bbox.height - marginY})`);
      }
      if (rectElem.current) {
        rectElem.current.setAttribute("x", String(-marginX));
        rectElem.current.setAttribute("y", String(-bbox.height));
        rectElem.current.setAttribute("width", String(bbox.width + 2 * marginX));
        rectElem.current.setAttribute("height", String(bbox.height + marginY));
      }
      if (pathElem.current) {
        pathElem.current.setAttribute("transform", `translate(${bbox.width / 2 - marginX}, ${marginY - 1})`);
      }
    }
  };
  useLayoutEffect(() => {
    updatePosition();
  });
  return /* @__PURE__ */ React.createElement("g", {
    ref: svgElem,
    x: 0,
    y: 0,
    className: visible ? classes.visibleBubble : classes.bubble,
    "data-testid": "radar-bubble"
  }, /* @__PURE__ */ React.createElement("rect", {
    ref: rectElem,
    rx: 4,
    ry: 4,
    className: classes.background
  }), /* @__PURE__ */ React.createElement("text", {
    ref: textElem,
    className: classes.text
  }, text), /* @__PURE__ */ React.createElement("path", {
    ref: pathElem,
    d: "M 0,0 10,0 5,8 z",
    className: classes.background
  }));
};

const useStyles$2 = makeStyles((theme) => ({
  text: {
    pointerEvents: "none",
    userSelect: "none",
    fontSize: "10px",
    fill: theme.palette.text.secondary
  }
}));
const RadarFooter = (props) => {
  const { x, y } = props;
  const classes = useStyles$2(props);
  return /* @__PURE__ */ React.createElement("text", {
    "data-testid": "radar-footer",
    transform: `translate(${x}, ${y})`,
    className: classes.text
  }, "\u25B2 moved up\xA0\xA0\xA0\xA0\xA0\u25BC moved down");
};

const useStyles$1 = makeStyles((theme) => ({
  quadrantLegend: {
    overflowY: "auto",
    scrollbarWidth: "thin"
  },
  quadrant: {
    height: "100%",
    width: "100%",
    scrollbarWidth: "thin",
    pointerEvents: "none"
  },
  quadrantHeading: {
    pointerEvents: "none",
    userSelect: "none",
    marginTop: 0,
    marginBottom: theme.spacing(2),
    fontSize: "18px"
  },
  rings: {
    columns: 3
  },
  ring: {
    breakInside: "avoid-column",
    pageBreakInside: "avoid",
    "-webkit-column-break-inside": "avoid",
    fontSize: "12px",
    marginBottom: theme.spacing(2)
  },
  ringEmpty: {
    color: theme.palette.text.secondary
  },
  ringHeading: {
    pointerEvents: "none",
    userSelect: "none",
    marginTop: 0,
    marginBottom: theme.spacing(1),
    fontSize: "12px",
    fontWeight: 800
  },
  ringList: {
    listStylePosition: "inside",
    marginTop: 0,
    paddingLeft: 0,
    fontVariantNumeric: "proportional-nums",
    "-moz-font-feature-settings": "pnum",
    "-webkit-font-feature-settings": "pnum",
    "font-feature-settings": "pnum"
  },
  entry: {
    pointerEvents: "visiblePainted",
    userSelect: "none",
    fontSize: "11px"
  },
  entryLink: {
    pointerEvents: "visiblePainted"
  }
}));
const RadarLegend = (props) => {
  const classes = useStyles$1(props);
  const getSegment = (segmented, quadrant, ring, ringOffset = 0) => {
    const quadrantIndex = quadrant.index;
    const ringIndex = ring.index;
    const segmentedData = quadrantIndex === void 0 ? {} : segmented[quadrantIndex] || {};
    return ringIndex === void 0 ? [] : segmentedData[ringIndex + ringOffset] || [];
  };
  const RadarLegendLink = ({
    url,
    description,
    title
  }) => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const toggle = () => {
      setOpen(!open);
    };
    if (description) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
        className: classes.entryLink,
        onClick: handleClickOpen,
        role: "button",
        tabIndex: 0,
        onKeyPress: toggle
      }, /* @__PURE__ */ React.createElement("span", {
        className: classes.entry
      }, title)), open && /* @__PURE__ */ React.createElement(RadarDescription, {
        open,
        onClose: handleClose,
        title: title ? title : "no title",
        url,
        description
      }));
    }
    return /* @__PURE__ */ React.createElement(WithLink, {
      url,
      className: classes.entryLink
    }, /* @__PURE__ */ React.createElement("span", {
      className: classes.entry
    }, title));
  };
  const RadarLegendRing = ({
    ring,
    entries: entries2,
    onEntryMouseEnter: onEntryMouseEnter2,
    onEntryMouseLeave: onEntryMouseLeave2
  }) => {
    return /* @__PURE__ */ React.createElement("div", {
      "data-testid": "radar-ring",
      key: ring.id,
      className: classes.ring
    }, /* @__PURE__ */ React.createElement("h3", {
      className: classes.ringHeading
    }, ring.name), entries2.length === 0 ? /* @__PURE__ */ React.createElement("p", {
      className: classes.ringEmpty
    }, "(empty)") : /* @__PURE__ */ React.createElement("ol", {
      className: classes.ringList
    }, entries2.map((entry) => /* @__PURE__ */ React.createElement("li", {
      key: entry.id,
      value: (entry.index || 0) + 1,
      onMouseEnter: onEntryMouseEnter2 && (() => onEntryMouseEnter2(entry)),
      onMouseLeave: onEntryMouseLeave2 && (() => onEntryMouseLeave2(entry))
    }, /* @__PURE__ */ React.createElement(RadarLegendLink, {
      url: entry.url,
      title: entry.title,
      description: entry.description
    })))));
  };
  const RadarLegendQuadrant = ({
    segments: segments2,
    quadrant,
    rings: rings2,
    onEntryMouseEnter: onEntryMouseEnter2,
    onEntryMouseLeave: onEntryMouseLeave2
  }) => {
    return /* @__PURE__ */ React.createElement("foreignObject", {
      key: quadrant.id,
      x: quadrant.legendX,
      y: quadrant.legendY,
      width: quadrant.legendWidth,
      height: quadrant.legendHeight,
      className: classes.quadrantLegend,
      "data-testid": "radar-quadrant"
    }, /* @__PURE__ */ React.createElement("div", {
      className: classes.quadrant
    }, /* @__PURE__ */ React.createElement("h2", {
      className: classes.quadrantHeading
    }, quadrant.name), /* @__PURE__ */ React.createElement("div", {
      className: classes.rings
    }, rings2.map((ring) => /* @__PURE__ */ React.createElement(RadarLegendRing, {
      key: ring.id,
      ring,
      entries: getSegment(segments2, quadrant, ring),
      onEntryMouseEnter: onEntryMouseEnter2,
      onEntryMouseLeave: onEntryMouseLeave2
    })))));
  };
  const setupSegments = (entries2) => {
    const segments2 = {};
    for (const entry of entries2) {
      const quadrantIndex = entry.quadrant.index;
      const ringIndex = entry.ring.index;
      let quadrantData = {};
      if (quadrantIndex !== void 0) {
        if (segments2[quadrantIndex] === void 0) {
          segments2[quadrantIndex] = {};
        }
        quadrantData = segments2[quadrantIndex];
      }
      let ringData = [];
      if (ringIndex !== void 0) {
        if (quadrantData[ringIndex] === void 0) {
          quadrantData[ringIndex] = [];
        }
        ringData = quadrantData[ringIndex];
      }
      ringData.push(entry);
    }
    return segments2;
  };
  const { quadrants, rings, entries, onEntryMouseEnter, onEntryMouseLeave } = props;
  const segments = setupSegments(entries);
  return /* @__PURE__ */ React.createElement("g", {
    "data-testid": "radar-legend"
  }, quadrants.map((quadrant) => /* @__PURE__ */ React.createElement(RadarLegendQuadrant, {
    key: quadrant.id,
    segments,
    quadrant,
    rings,
    onEntryMouseEnter,
    onEntryMouseLeave
  })));
};

const RadarPlot = (props) => {
  const {
    width,
    height,
    radius,
    quadrants,
    rings,
    entries,
    activeEntry,
    onEntryMouseEnter,
    onEntryMouseLeave
  } = props;
  return /* @__PURE__ */ React.createElement("g", {
    "data-testid": "radar-plot"
  }, /* @__PURE__ */ React.createElement(RadarLegend, {
    quadrants,
    rings,
    entries,
    onEntryMouseEnter: onEntryMouseEnter && ((entry) => onEntryMouseEnter(entry)),
    onEntryMouseLeave: onEntryMouseLeave && ((entry) => onEntryMouseLeave(entry))
  }), /* @__PURE__ */ React.createElement("g", {
    transform: `translate(${width / 2}, ${height / 2})`
  }, /* @__PURE__ */ React.createElement(RadarGrid, {
    radius,
    rings
  }), /* @__PURE__ */ React.createElement(RadarFooter, {
    x: -0.5 * width,
    y: 0.5 * height
  }), entries.map((entry) => /* @__PURE__ */ React.createElement(RadarEntry, {
    key: entry.id,
    x: entry.x || 0,
    y: entry.y || 0,
    color: entry.color || "",
    value: ((entry == null ? void 0 : entry.index) || 0) + 1,
    url: entry.url,
    description: entry.description,
    moved: entry.moved,
    title: entry.title,
    onMouseEnter: onEntryMouseEnter && (() => onEntryMouseEnter(entry)),
    onMouseLeave: onEntryMouseLeave && (() => onEntryMouseLeave(entry))
  })), /* @__PURE__ */ React.createElement(RadarBubble, {
    visible: !!activeEntry,
    text: (activeEntry == null ? void 0 : activeEntry.title) || "",
    x: (activeEntry == null ? void 0 : activeEntry.x) || 0,
    y: (activeEntry == null ? void 0 : activeEntry.y) || 0
  })));
};

class Segment {
  constructor(quadrant, ring, radius, nextSeed) {
    this.nextSeed = nextSeed;
    this.polarMin = {
      t: quadrant.radialMin,
      r: ring.innerRadius
    };
    this.polarMax = {
      t: quadrant.radialMax,
      r: ring.outerRadius
    };
    this.cartesianMin = {
      x: 15 * quadrant.offsetX,
      y: 15 * quadrant.offsetY
    };
    this.cartesianMax = {
      x: radius * quadrant.offsetX,
      y: radius * quadrant.offsetY
    };
  }
  clipx(d) {
    const c = boundedBox(d, this.cartesianMin, this.cartesianMax);
    const p = boundedRing(polar(c), this.polarMin.r + 15, this.polarMax.r - 15);
    d.x = cartesian(p).x;
    return d.x;
  }
  clipy(d) {
    const c = boundedBox(d, this.cartesianMin, this.cartesianMax);
    const p = boundedRing(polar(c), this.polarMin.r + 15, this.polarMax.r - 15);
    d.y = cartesian(p).y;
    return d.y;
  }
  random() {
    return cartesian({
      t: this._randomBetween(this.polarMin.t, this.polarMax.t),
      r: this._normalBetween(this.polarMin.r, this.polarMax.r)
    });
  }
  _random() {
    const x = Math.sin(this.nextSeed()) * 1e4;
    return x - Math.floor(x);
  }
  _randomBetween(min, max) {
    return min + this._random() * (max - min);
  }
  _normalBetween(min, max) {
    return min + (this._random() + this._random()) * 0.5 * (max - min);
  }
}
function polar({ x, y }) {
  return {
    t: Math.atan2(y, x),
    r: Math.sqrt(x * x + y * y)
  };
}
function cartesian({ r, t }) {
  return {
    x: r * Math.cos(t),
    y: r * Math.sin(t)
  };
}
function boundedInterval(value, min, max) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}
function boundedRing(polarValue, rMin, rMax) {
  return {
    t: polarValue.t,
    r: boundedInterval(polarValue.r, rMin, rMax)
  };
}
function boundedBox(point, min, max) {
  return {
    x: boundedInterval(point.x, min.x, max.x),
    y: boundedInterval(point.y, min.y, max.y)
  };
}

const adjustQuadrants = (quadrants, radius, width, height) => {
  const margin = 16;
  const xStops = [
    margin,
    width / 2 - radius - margin,
    width / 2 + radius + margin,
    width - margin
  ];
  const yStops = [margin, height / 2 - margin, height / 2, height - margin];
  const legendParams = [
    {
      x: xStops[2],
      y: yStops[2],
      width: xStops[3] - xStops[2],
      height: yStops[3] - yStops[2]
    },
    {
      x: xStops[0],
      y: yStops[2],
      width: xStops[1] - xStops[0],
      height: yStops[3] - yStops[2]
    },
    {
      x: xStops[0],
      y: yStops[0],
      width: xStops[1] - xStops[0],
      height: yStops[1] - yStops[0]
    },
    {
      x: xStops[2],
      y: yStops[0],
      width: xStops[3] - xStops[2],
      height: yStops[1] - yStops[0]
    }
  ];
  quadrants.forEach((quadrant, index) => {
    const legendParam = legendParams[index % 4];
    quadrant.index = index;
    quadrant.radialMin = index * Math.PI / 2;
    quadrant.radialMax = (index + 1) * Math.PI / 2;
    quadrant.offsetX = index % 4 === 0 || index % 4 === 3 ? 1 : -1;
    quadrant.offsetY = index % 4 === 0 || index % 4 === 1 ? 1 : -1;
    quadrant.legendX = legendParam.x;
    quadrant.legendY = legendParam.y;
    quadrant.legendWidth = legendParam.width;
    quadrant.legendHeight = legendParam.height;
  });
};
const adjustEntries = (entries, quadrants, rings, radius, activeEntry) => {
  let seed = 42;
  entries.forEach((entry, index) => {
    const quadrant = quadrants.find((q) => {
      const match = typeof entry.quadrant === "object" ? entry.quadrant.id : entry.quadrant;
      return q.id === match;
    });
    const ring = rings.find((r) => {
      const match = typeof entry.ring === "object" ? entry.ring.id : entry.ring;
      return r.id === match;
    });
    if (!quadrant) {
      throw new Error(`Unknown quadrant ${entry.quadrant} for entry ${entry.id}!`);
    }
    if (!ring) {
      throw new Error(`Unknown ring ${entry.ring} for entry ${entry.id}!`);
    }
    entry.index = index;
    entry.quadrant = quadrant;
    entry.ring = ring;
    entry.segment = new Segment(quadrant, ring, radius, () => seed++);
    const point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.active = activeEntry ? entry.id === activeEntry.id : false;
    entry.color = entry.active ? entry.ring.color : color(entry.ring.color).desaturate(0.5).lighten(0.1).string();
  });
  const simulation = forceSimulation().nodes(entries).velocityDecay(0.19).force("collision", forceCollide().radius(12).strength(0.85)).stop();
  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick();
    for (const entry of entries) {
      if (entry.segment) {
        entry.x = entry.segment.clipx(entry);
        entry.y = entry.segment.clipy(entry);
      }
    }
  }
};
const adjustRings = (rings, radius) => {
  rings.forEach((ring, index) => {
    ring.index = index;
    ring.outerRadius = (index + 2) / (rings.length + 1) * radius;
    ring.innerRadius = (index === 0 ? 0 : index + 1) / (rings.length + 1) * radius;
  });
};

const Radar = (props) => {
  const { width, height, quadrants, rings, entries } = props;
  const radius = Math.min(width, height) / 2;
  const [activeEntry, setActiveEntry] = useState();
  const node = useRef(null);
  adjustQuadrants(quadrants, radius, width, height);
  adjustRings(rings, radius);
  adjustEntries(entries, quadrants, rings, radius, activeEntry);
  return /* @__PURE__ */ React.createElement("svg", {
    ref: node,
    width,
    height,
    ...props.svgProps
  }, /* @__PURE__ */ React.createElement(RadarPlot, {
    width,
    height,
    radius,
    entries,
    quadrants,
    rings,
    activeEntry,
    onEntryMouseEnter: (entry) => setActiveEntry(entry),
    onEntryMouseLeave: () => setActiveEntry(void 0)
  }));
};

const useTechRadarLoader = (id) => {
  const errorApi = useApi(errorApiRef);
  const techRadarApi = useApi(techRadarApiRef);
  const { error, value, loading } = useAsync(async () => techRadarApi.load(id), [techRadarApi, id]);
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);
  return { loading, value, error };
};
function matchFilter(filter) {
  const terms = filter == null ? void 0 : filter.toLocaleLowerCase("en-US").split(/\s/).map((e) => e.trim()).filter(Boolean);
  if (!(terms == null ? void 0 : terms.length)) {
    return () => true;
  }
  return (entry) => {
    var _a;
    const text = `${entry.title} ${((_a = entry.timeline[0]) == null ? void 0 : _a.description) || ""}`.toLocaleLowerCase("en-US");
    return terms.every((term) => text.includes(term));
  };
}
function RadarComponent(props) {
  const { loading, error, value: data } = useTechRadarLoader(props.id);
  const mapToEntries = (loaderResponse) => {
    return loaderResponse.entries.filter(matchFilter(props.searchText)).map((entry) => ({
      id: entry.key,
      quadrant: loaderResponse.quadrants.find((q) => q.id === entry.quadrant),
      title: entry.title,
      ring: loaderResponse.rings.find((r) => r.id === entry.timeline[0].ringId),
      timeline: entry.timeline.map((e) => {
        return {
          date: e.date,
          ring: loaderResponse.rings.find((a) => a.id === e.ringId),
          description: e.description,
          moved: e.moved
        };
      }),
      moved: entry.timeline[0].moved,
      description: entry.description || entry.timeline[0].description,
      url: entry.url
    }));
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, loading && /* @__PURE__ */ React.createElement(Progress, null), !loading && !error && data && /* @__PURE__ */ React.createElement(Radar, {
    ...props,
    rings: data.rings,
    quadrants: data.quadrants,
    entries: mapToEntries(data)
  }));
}

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: "scroll"
  }
}));
function RadarPage(props) {
  const {
    title = "Tech Radar",
    subtitle = "Pick the recommended technologies for your projects",
    pageTitle = "Company Radar",
    ...componentProps
  } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = React.useState("");
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title,
    subtitle
  }), /* @__PURE__ */ React.createElement(Content, {
    className: classes.overflowXScroll
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: pageTitle
  }, /* @__PURE__ */ React.createElement(Input, {
    id: "tech-radar-filter",
    type: "search",
    placeholder: "Filter",
    onChange: (e) => setSearchText(e.target.value)
  }), /* @__PURE__ */ React.createElement(SupportButton, null, /* @__PURE__ */ React.createElement("p", null, "This is used for visualizing the official guidelines of different areas of software development such as languages, frameworks, infrastructure and processes. You can find an explanation for the radar at", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://opensource.zalando.com/tech-radar/"
  }, "Zalando Tech Radar"), "."))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 6,
    md: 4
  }, /* @__PURE__ */ React.createElement(RadarComponent, {
    searchText,
    ...componentProps
  })))));
}

var RadarPage$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  RadarPage: RadarPage
});

const rings = new Array();
rings.push({ id: "adopt", name: "ADOPT", color: "#93c47d" });
rings.push({ id: "trial", name: "TRIAL", color: "#93d2c2" });
rings.push({ id: "assess", name: "ASSESS", color: "#fbdb84" });
rings.push({ id: "hold", name: "HOLD", color: "#efafa9" });
const quadrants = new Array();
quadrants.push({ id: "infrastructure", name: "Infrastructure" });
quadrants.push({ id: "frameworks", name: "Frameworks" });
quadrants.push({ id: "languages", name: "Languages" });
quadrants.push({ id: "process", name: "Process" });
const entries = new Array();
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: "adopt",
      date: new Date("2020-08-06"),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
    }
  ],
  url: "#",
  key: "javascript",
  id: "javascript",
  title: "JavaScript",
  quadrant: "languages",
  description: 'Excepteur **sint** occaecat *cupidatat* non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n```ts\nconst x = "3";\n```\n'
});
entries.push({
  timeline: [
    {
      moved: -1,
      ringId: "adopt",
      date: new Date("2020-08-06"),
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
    }
  ],
  url: "#",
  key: "typescript",
  id: "typescript",
  title: "TypeScript",
  quadrant: "languages",
  description: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat"
});
entries.push({
  timeline: [
    {
      moved: 1,
      ringId: "adopt",
      date: new Date("2020-08-06"),
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
    }
  ],
  url: "https://webpack.js.org/",
  key: "webpack",
  id: "webpack",
  title: "Webpack",
  quadrant: "frameworks"
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: "adopt",
      date: new Date("2020-08-06")
    }
  ],
  url: "https://reactjs.org/",
  key: "react",
  id: "react",
  title: "React",
  quadrant: "frameworks"
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: "adopt",
      date: new Date("2020-08-06")
    }
  ],
  url: "#",
  key: "code-reviews",
  id: "code-reviews",
  title: "Code Reviews",
  quadrant: "process"
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: "assess",
      date: new Date("2020-08-06")
    }
  ],
  url: "#",
  key: "mob-programming",
  id: "mob-programming",
  title: "Mob Programming",
  quadrant: "process"
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: "adopt",
      date: new Date("2020-08-06")
    }
  ],
  url: "#",
  key: "docs-like-code",
  id: "docs-like-code",
  title: "Docs-like-code",
  quadrant: "process"
});
entries.push({
  timeline: [
    {
      ringId: "hold",
      date: new Date("2020-08-06")
    }
  ],
  url: "#",
  key: "force-push",
  id: "force-push",
  title: "Force push to master",
  quadrant: "process"
});
entries.push({
  timeline: [
    {
      ringId: "adopt",
      date: new Date("2020-08-06"),
      description: "long description"
    }
  ],
  url: "https://github.com",
  key: "github-actions",
  id: "github-actions",
  title: "GitHub Actions",
  quadrant: "infrastructure"
});
const mock = {
  entries,
  quadrants,
  rings
};
class SampleTechRadarApi {
  async load() {
    return mock;
  }
}

const rootRouteRef = createRouteRef({
  id: "tech-radar"
});
const techRadarPlugin = createPlugin({
  id: "tech-radar",
  routes: {
    root: rootRouteRef
  },
  apis: [createApiFactory(techRadarApiRef, new SampleTechRadarApi())]
});
const TechRadarPage = techRadarPlugin.provide(createRoutableExtension({
  name: "TechRadarPage",
  component: () => Promise.resolve().then(function () { return RadarPage$1; }).then((m) => m.RadarPage),
  mountPoint: rootRouteRef
}));

const Router = RadarPage;

export { MovedState, RadarPage, Router, RadarComponent as TechRadarComponent, TechRadarPage, techRadarPlugin as plugin, techRadarApiRef, techRadarPlugin };
//# sourceMappingURL=index.esm.js.map
