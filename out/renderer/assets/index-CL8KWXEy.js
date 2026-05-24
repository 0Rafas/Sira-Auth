import { w as createLucideIcon, n as api, o as useParams, l as useAuthStore, r as reactExports, p as useQuery, j as jsxRuntimeExports, m as motion, a1 as LogOut, a2 as CheckCircle, K as Key, k as Settings, v as Info, X, d as Search, a3 as ScrollText, e as clsx, G as Globe, s as formatDistanceToNow, A as AnimatePresence } from "./index-Bnbhtkos.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { S as Select } from "./Select-DZNnueCT.js";
import { D as Download } from "./download-CZh5SlAX.js";
import { B as Ban, R as RefreshCcw } from "./refresh-ccw-B-0zOUte.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { f as format } from "./format-DQaPZ8iA.js";
import "./check-V-0X9BuP.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlertCircle = createLucideIcon("AlertCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LogIn = createLucideIcon("LogIn", [
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }],
  ["polyline", { points: "10 17 15 12 10 7", key: "1ail0h" }],
  ["line", { x1: "15", x2: "3", y1: "12", y2: "12", key: "v6grx8" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldAlert = createLucideIcon("ShieldAlert", [
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10", key: "1irkt0" }],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
]);
const eventLogsApi = {
  getAll: async (appId, page = 1, limit = 50) => {
    const res = await api.get(
      `/dashboard/apps/${appId}/event-logs`,
      { params: { page, limit } }
    );
    return res.data;
  }
};
const EVENT_TYPES = [
  { value: "user.login", label: "Login", icon: LogIn, color: "text-emerald-400", bgColor: "bg-emerald/10 border-emerald/20" },
  { value: "user.logout", label: "Logout", icon: LogOut, color: "text-text-muted", bgColor: "bg-white/5 border-border-default" },
  { value: "user.register", label: "Register", icon: CheckCircle, color: "text-cyan", bgColor: "bg-cyan/10 border-cyan/20" },
  { value: "user.ban", label: "User Ban", icon: Ban, color: "text-rose", bgColor: "bg-rose/10 border-rose/20" },
  { value: "license.activate", label: "License Used", icon: Key, color: "text-purple-light", bgColor: "bg-purple/10 border-purple/20" },
  { value: "license.expire", label: "License Expire", icon: AlertCircle, color: "text-amber", bgColor: "bg-amber/10 border-amber/20" },
  { value: "license.ban", label: "License Ban", icon: ShieldAlert, color: "text-rose", bgColor: "bg-rose/10 border-rose/20" },
  { value: "app.pause", label: "App Paused", icon: Settings, color: "text-amber", bgColor: "bg-amber/10 border-amber/20" },
  { value: "app.update", label: "App Updated", icon: Settings, color: "text-cyan", bgColor: "bg-cyan/10 border-cyan/20" },
  { value: "info", label: "Info", icon: Info, color: "text-text-secondary", bgColor: "bg-white/5 border-border-default" }
];
function getEventTypeConfig(type) {
  return EVENT_TYPES.find((e) => e.value === type) ?? {
    value: type,
    label: type,
    icon: Info,
    color: "text-text-secondary",
    bgColor: "bg-white/5 border-border-default"
  };
}
const ITEMS_PER_PAGE = 20;
function LogRow({ log }) {
  const cfg = getEventTypeConfig(log.type);
  const Icon = cfg.icon;
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.tr,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        onClick: () => setExpanded((v) => !v),
        className: "border-b border-border-default last:border-0 hover:bg-white/3 transition-colors cursor-pointer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("w-6 h-6 rounded-lg border flex items-center justify-center shrink-0", cfg.bgColor), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: clsx("w-3 h-3", cfg.color) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("text-[10px] font-semibold px-1.5 py-0.5 rounded border", cfg.bgColor, cfg.color), children: cfg.label })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-primary max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate", children: log.message }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-secondary font-mono", children: log.userId ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 text-text-muted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-text-muted", children: log.ip ?? "—" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", title: format(new Date(log.timestamp), "PPPpp"), children: formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.tr,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-6 py-3 bg-white/3 border-b border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: "Event ID: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-text-secondary", children: log.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: "Timestamp: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-text-secondary", children: format(new Date(log.timestamp), "PPPpp") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: "Type: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-text-secondary", children: log.type })
          ] }),
          log.metadata && Object.keys(log.metadata).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: "Metadata: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-text-secondary", children: JSON.stringify(log.metadata) })
          ] })
        ] }) })
      }
    ) })
  ] });
}
function ToolBtn({ icon: Icon, label, color, onClick, active }) {
  const [tip, setTip] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onMouseEnter: () => setTip(true), onMouseLeave: () => setTip(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: clsx("w-9 h-9 rounded-xl border flex items-center justify-center transition-all", active ? `${color} ring-2 ring-white/10` : color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) }),
    tip && label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-bg-card border border-border-accent text-[10px] text-text-secondary whitespace-nowrap shadow-card z-20", children: label })
  ] });
}
function EventLogs() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const { data: logsData, refetch } = useQuery({
    queryKey: ["event-logs", appId],
    queryFn: () => eventLogsApi.getAll(appId, page, 200),
    enabled: !isDemoMode && !!appId,
    refetchInterval: 2e4
  });
  const allLogs = isDemoMode ? [] : logsData?.data ?? [];
  const filtered = reactExports.useMemo(() => allLogs.filter((l) => {
    const matchSearch = l.message.toLowerCase().includes(search.toLowerCase()) || l.userId?.toLowerCase().includes(search.toLowerCase()) || l.ip?.includes(search);
    const matchType = typeFilter === "all" || l.type === typeFilter;
    return matchSearch && matchType;
  }), [allLogs, search, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event_logs.json";
    a.click();
  };
  const exportCSV = () => {
    const header = "ID,Type,Message,UserID,IP,Timestamp";
    const rows = filtered.map((l) => `${l.id},${l.type},"${l.message}",${l.userId ?? ""},${l.ip ?? ""},${l.timestamp}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event_logs.csv";
    a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Event Logs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Audit trail of all events that have occurred in your application." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: exportJSON,
            className: "flex items-center gap-1.5 h-8 px-3 rounded-xl border border-border-default bg-white/5 text-xs text-text-secondary hover:text-text-primary hover:border-border-accent transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              " JSON"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: exportCSV,
            className: "flex items-center gap-1.5 h-8 px-3 rounded-xl border border-border-default bg-white/5 text-xs text-text-secondary hover:text-text-primary hover:border-border-accent transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              " CSV"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: [
      { label: "Total Events", value: allLogs.length, color: "text-text-primary" },
      { label: "Logins", value: allLogs.filter((l) => l.type === "user.login").length, color: "text-emerald-400" },
      { label: "License Activations", value: allLogs.filter((l) => l.type === "license.activate").length, color: "text-purple-light" },
      { label: "Bans", value: allLogs.filter((l) => l.type === "user.ban" || l.type === "license.ban").length, color: "text-rose" }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl border border-border-default px-4 py-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${stat.color}`, children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-0.5", children: stat.label })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(1);
            },
            placeholder: "Search logs, users, IP...",
            className: "h-9 w-64 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: typeFilter,
            onChange: (v) => {
              setTypeFilter(v);
              setPage(1);
            },
            size: "sm",
            options: [
              { value: "all", label: "All Types" },
              ...EVENT_TYPES.map((e) => ({ value: e.value, label: e.label }))
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: Filter,
            label: "Filter",
            active: showFilter,
            color: "bg-white/5 border-border-default text-text-muted hover:text-text-primary hover:bg-white/10",
            onClick: () => setShowFilter((v) => !v)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: RefreshCcw,
            label: "Refresh",
            color: "bg-cyan/10 border-border-default text-cyan hover:border-cyan/40",
            onClick: () => {
              refetch();
              setPage(1);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: X,
            label: "Clear filters",
            color: "bg-white/5 border-border-default text-text-muted hover:text-text-primary hover:bg-white/10",
            onClick: () => {
              setSearch("");
              setTypeFilter("all");
              setPage(1);
            }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl border border-border-default overflow-hidden", children: [
      paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: search || typeFilter !== "all" ? Search : ScrollText,
          title: "No logs found",
          description: search || typeFilter !== "all" ? "No events match your filters." : "No events recorded yet.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border-default bg-white/2", children: ["Type", "Message", "User", "IP Address", "Time"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: paginated.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsx(LogRow, { log }, log.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border-default", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
          filtered.length,
          " event",
          filtered.length !== 1 ? "s" : "",
          filtered.length > 0 && ` · Page ${page} of ${totalPages}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page === 1,
              className: "px-3 py-1.5 text-xs rounded-lg border border-border-default text-text-secondary hover:border-border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage(p),
              className: clsx("w-7 h-7 rounded-lg text-xs transition-colors", p === page ? "bg-purple text-white" : "text-text-muted hover:text-text-primary hover:bg-white/5"),
              children: p
            },
            p
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
              disabled: page === totalPages,
              className: "px-3 py-1.5 text-xs rounded-lg border border-border-default text-text-secondary hover:border-border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              children: "Next"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted text-center", children: "Click any row to expand event details · Demo data shown (real logs require backend connection)" })
  ] });
}
export {
  EventLogs as default
};
