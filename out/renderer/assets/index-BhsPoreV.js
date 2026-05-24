import { w as createLucideIcon, n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, B as Button, C as Card, d as Search, i as Activity, A as AnimatePresence, m as motion, G as Globe, s as formatDistanceToNow, q as Clock } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { S as SearchBar } from "./SearchBar-POxbfUeO.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { R as RefreshCw } from "./refresh-cw-Ck3axOlu.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldOff = createLucideIcon("ShieldOff", [
  ["path", { d: "M19.7 14a6.9 6.9 0 0 0 .3-2V5l-8-3-3.2 1.2", key: "342pvf" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M4.7 4.7 4 5v7c0 6 8 10 8 10a20.3 20.3 0 0 0 5.62-4.38", key: "p0ycf4" }]
]);
const sessionsApi = {
  getAll: async (appId, page = 1, limit = 50) => {
    const res = await api.get(
      `/dashboard/apps/${appId}/sessions`,
      { params: { page, limit } }
    );
    return res.data;
  },
  kill: async (appId, sessionId) => {
    const res = await api.delete(
      `/dashboard/apps/${appId}/sessions/${sessionId}`
    );
    return res.data;
  },
  killAll: async (appId) => {
    const res = await api.post(`/dashboard/apps/${appId}/sessions/kill-all`);
    return res.data;
  }
};
const PAGE_SIZE = 10;
function StatusBadge({ expiresAt }) {
  const expired = new Date(expiresAt) < /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${expired ? "bg-rose/10 text-rose border border-rose/20" : "bg-emerald/10 text-emerald border border-emerald/20"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${expired ? "bg-rose" : "bg-emerald animate-pulse"}` }),
    expired ? "Expired" : "Active"
  ] });
}
function SessionRow({
  session,
  selected,
  onToggle,
  onKill
}) {
  const expired = new Date(session.expiresAt) < /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: 20 },
      className: "border-b border-border-default last:border-0 hover:bg-white/3 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: selected,
            onChange: onToggle,
            className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-cyan/30 to-purple/20 flex items-center justify-center text-xs font-bold text-cyan shrink-0", children: session.username[0].toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-text-primary", children: session.username })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5 text-text-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-text-secondary", children: session.ip }),
          session.country && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-text-muted", children: session.country })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: formatDistanceToNow(new Date(session.validatedAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-text-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${expired ? "text-rose" : "text-emerald"}`, children: expired ? `Expired ${formatDistanceToNow(new Date(session.expiresAt), { addSuffix: true })}` : `Expires ${formatDistanceToNow(new Date(session.expiresAt), { addSuffix: true })}` })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { expiresAt: session.expiresAt }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onKill,
            className: "p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-colors",
            title: "Kill session",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
          }
        ) })
      ]
    }
  );
}
function Sessions() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [page, setPage] = reactExports.useState(1);
  const { data: sessionsData, isLoading, refetch } = useQuery({
    queryKey: ["sessions", appId],
    queryFn: () => sessionsApi.getAll(appId, page, 200),
    enabled: !isDemoMode && !!appId,
    refetchInterval: 15e3
  });
  const sessions = isDemoMode ? [] : sessionsData?.data ?? [];
  const killMutation = useMutation({
    mutationFn: (sessionId) => sessionsApi.kill(appId, sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions", appId] })
  });
  const killAllMutation = useMutation({
    mutationFn: () => sessionsApi.killAll(appId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions", appId] });
      setSelected(/* @__PURE__ */ new Set());
    }
  });
  const filtered = reactExports.useMemo(() => sessions.filter(
    (s) => s.username.toLowerCase().includes(search.toLowerCase()) || (s.ip ?? "").includes(search) || (s.country ?? "").toLowerCase().includes(search.toLowerCase())
  ), [sessions, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const toggleAll = () => {
    if (selected.size === paginated.length && paginated.length > 0)
      setSelected(/* @__PURE__ */ new Set());
    else
      setSelected(new Set(paginated.map((s) => s.id)));
  };
  const toggleOne = reactExports.useCallback((id) => {
    setSelected((prev) => {
      const ns = new Set(prev);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns;
    });
  }, []);
  const killSession = reactExports.useCallback((id) => {
    killMutation.mutate(id);
    setSelected((prev) => {
      const ns = new Set(prev);
      ns.delete(id);
      return ns;
    });
  }, [killMutation]);
  const killSelected = () => {
    selected.forEach((id) => killMutation.mutate(id));
    setSelected(/* @__PURE__ */ new Set());
  };
  const killAll = () => {
    killAllMutation.mutate();
  };
  const refresh = () => {
    refetch();
    setSelected(/* @__PURE__ */ new Set());
    setPage(1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Sessions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Active user sessions for this application." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: refresh, title: "Refresh sessions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
          "Refresh"
        ] }),
        selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", size: "sm", onClick: killSelected, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
          " Kill (",
          selected.size,
          ")"
        ] }),
        sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", size: "sm", onClick: killAll, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3.5 h-3.5" }),
          " Kill All"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
      { label: "Total", value: sessions.length, color: "text-text-primary" },
      { label: "Active", value: sessions.filter((s) => new Date(s.expiresAt) >= /* @__PURE__ */ new Date()).length, color: "text-emerald" },
      { label: "Expired", value: sessions.filter((s) => new Date(s.expiresAt) < /* @__PURE__ */ new Date()).length, color: "text-rose" }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold text-base ${stat.color}`, children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: stat.label })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { padding: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { value: search, onChange: setSearch, placeholder: "Search by user, IP, country...", className: "w-72" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
        filtered.length,
        " result",
        filtered.length !== 1 ? "s" : ""
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", className: "overflow-hidden", children: [
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: search ? Search : Activity,
          title: "No sessions found",
          description: search ? "No sessions match your search." : "No active sessions for this application.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: paginated.length > 0 && selected.size === paginated.length,
              onChange: toggleAll,
              className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer"
            }
          ) }),
          ["User", "IP / Country", "Started", "Expires", "Status", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: paginated.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SessionRow,
          {
            session: s,
            selected: selected.has(s.id),
            onToggle: () => toggleOne(s.id),
            onKill: () => killSession(s.id)
          },
          s.id
        )) }) })
      ] }) }),
      filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border-default", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
          "Showing ",
          Math.min((page - 1) * PAGE_SIZE + 1, filtered.length),
          "–",
          Math.min(page * PAGE_SIZE, filtered.length),
          " of ",
          filtered.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page === 1,
              className: "px-3 py-1.5 text-xs rounded-lg border border-border-default text-text-secondary hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted px-2", children: [
            page,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
              disabled: page === totalPages,
              className: "px-3 py-1.5 text-xs rounded-lg border border-border-default text-text-secondary hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  Sessions as default
};
