import { w as createLucideIcon, n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, m as motion, t as Shield, P as Plus, d as Search, z as ChevronRight, A as AnimatePresence, e as clsx, U as Users, i as Activity, X, B as Button, f as AlertTriangle } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { u as useSubStore } from "./sub.store-BORt4PCU.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { S as Select } from "./Select-DZNnueCT.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { M as MoreHorizontal } from "./more-horizontal-gQQt4mcb.js";
import { P as Pencil } from "./pencil-BK1B2uTj.js";
import "./check-V-0X9BuP.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookOpen = createLucideIcon("BookOpen", [
  ["path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", key: "vv98re" }],
  ["path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", key: "1cyq3y" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronLeft = createLucideIcon("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PauseCircle = createLucideIcon("PauseCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9", key: "c1nkhi" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9", key: "h65svq" }]
]);
const subscriptionsApi = {
  getAll: async (appId) => {
    const res = await api.get(`/dashboard/apps/${appId}/subscriptions`);
    return res.data;
  },
  create: async (appId, payload) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/subscriptions`,
      payload
    );
    return res.data;
  },
  delete: async (appId, subId) => {
    const res = await api.delete(`/dashboard/apps/${appId}/subscriptions/${subId}`);
    return res.data;
  }
};
const ITEMS_PER_PAGE = 15;
function randomId() {
  return Math.random().toString(36).slice(2, 10);
}
function ModalWrap({ onClose, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "absolute inset-0 bg-black/65 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-md mx-4 overflow-hidden",
        onClick: (e) => e.stopPropagation(),
        children
      }
    )
  ] });
}
const LEVEL_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}${i === 0 ? " (default)" : ""}`
}));
function SubModal({
  appId,
  existing,
  onClose,
  onSave
}) {
  const [name, setName] = reactExports.useState(existing?.name ?? "");
  const [level, setLevel] = reactExports.useState(String(existing?.level ?? 1));
  const [duration, setDuration] = reactExports.useState(String(existing?.duration ?? 30));
  const [price, setPrice] = reactExports.useState(String(existing?.price ?? 0));
  const [desc, setDesc] = reactExports.useState(existing?.description ?? "");
  const isEdit = !!existing;
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
  const submit = () => {
    if (!name.trim()) return;
    onSave({
      id: existing?.id ?? randomId(),
      appId,
      name: name.trim(),
      level: parseInt(level),
      duration: parseInt(duration),
      price: parseFloat(price) || 0,
      description: desc.trim() || void 0,
      createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
    });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-purple-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: isEdit ? "Edit Subscription" : "Create Subscription" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g. Premium, Basic, VIP...",
            className: inputCls,
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Level ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: level,
            onChange: setLevel,
            options: LEVEL_OPTIONS
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1", children: "Licenses with this level will be linked to this subscription tier." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Duration (days) ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: duration,
            onChange: (e) => setDuration(e.target.value),
            placeholder: "30",
            min: 1,
            className: inputCls
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Price ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: price,
            onChange: (e) => setPrice(e.target.value),
            placeholder: "0.00",
            min: 0,
            step: "0.01",
            className: inputCls
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: desc,
            onChange: (e) => setDesc(e.target.value),
            placeholder: "Optional description...",
            rows: 2,
            className: "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all resize-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: submit, disabled: !name.trim(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
        isEdit ? "Save Changes" : "Create Subscription"
      ] })
    ] })
  ] });
}
function DeleteModal({ count, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete Subscription(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary", children: [
        "You are about to delete ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text-primary", children: count }),
        " subscription",
        count !== 1 ? "s" : "",
        ". Licenses linked to ",
        count !== 1 ? "these levels" : "this level",
        " will not be deleted."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-rose/8 border border-rose/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-rose shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose", children: "This action cannot be undone." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", onClick: () => {
        onConfirm();
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
        " Delete"
      ] })
    ] })
  ] });
}
function SubCard({
  sub,
  selected,
  onToggle,
  onEdit,
  onDelete,
  userCount,
  activeCount,
  pausedCount
}) {
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const menuRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      className: clsx(
        "flex items-center gap-4 px-4 py-3.5 border-b border-border-default last:border-0 transition-colors hover:bg-white/3",
        selected && "bg-purple/5"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: selected,
            onChange: onToggle,
            className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer shrink-0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-text-primary", children: sub.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded-md bg-purple/12 border border-purple/25 text-[10px] font-medium text-purple-light", children: [
              "Level ",
              sub.level
            ] }),
            sub.price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded-md bg-emerald/10 border border-emerald/25 text-[10px] font-medium text-emerald-400", children: [
              "$",
              sub.price
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mt-0.5", children: sub.description || `${sub.duration} day${sub.duration !== 1 ? "s" : ""} duration` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-secondary border border-border-default text-xs text-text-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
          userCount === 0 ? "No Users" : `${userCount} Users`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3 text-[11px] text-text-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3 text-emerald-400" }),
            " ",
            activeCount,
            " active"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PauseCircle, { className: "w-3 h-3 text-amber-400" }),
            " ",
            pausedCount,
            " paused"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: menuRef, className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setMenuOpen((v) => !v),
              className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoreHorizontal, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -6, scale: 0.97 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: -6, scale: 0.97 },
              transition: { duration: 0.14 },
              className: "absolute right-0 top-full mt-1 w-40 glass rounded-xl border border-border-accent shadow-card overflow-hidden z-20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      onEdit();
                      setMenuOpen(false);
                    },
                    className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                      " Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      onDelete();
                      setMenuOpen(false);
                    },
                    className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-rose hover:bg-rose/8 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                      " Delete"
                    ]
                  }
                )
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
function ToolBtn({ icon: Icon, label, color, onClick, active }) {
  const [tip, setTip] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onMouseEnter: () => setTip(true), onMouseLeave: () => setTip(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick,
        className: clsx(
          "w-9 h-9 rounded-xl border flex items-center justify-center transition-all",
          active ? `${color} ring-2 ring-white/10` : color
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
      }
    ),
    tip && label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-bg-card border border-border-accent text-[10px] text-text-secondary whitespace-nowrap shadow-card z-20", children: label })
  ] });
}
function Subscriptions() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const { subscriptions: allSubs, addSub, updateSub, deleteSub, deleteSelected } = useSubStore();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [page, setPage] = reactExports.useState(1);
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [modal, setModal] = reactExports.useState(null);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const { data: apiSubs } = useQuery({
    queryKey: ["subscriptions", appId],
    queryFn: () => subscriptionsApi.getAll(appId),
    enabled: !isDemoMode && !!appId
  });
  reactExports.useEffect(() => {
    if (!isDemoMode && apiSubs?.data) {
      const current = allSubs[appId] ?? [];
      if (JSON.stringify(current.map((s) => s.id)) !== JSON.stringify(apiSubs.data.map((s) => s.id))) {
        apiSubs.data.forEach((sub) => {
          if (!current.find((s) => s.id === sub.id)) addSub(appId, sub);
        });
      }
    }
  }, [apiSubs, isDemoMode, appId]);
  const subs = isDemoMode ? allSubs[appId] ?? [] : apiSubs?.data ?? allSubs[appId] ?? [];
  const createMutation = useMutation({
    mutationFn: (payload) => subscriptionsApi.create(appId, payload),
    onSuccess: (res) => {
      if (res.data) {
        addSub(appId, res.data);
        qc.invalidateQueries({ queryKey: ["subscriptions", appId] });
      }
      setModal(null);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (subId) => subscriptionsApi.delete(appId, subId),
    onSuccess: (_, subId) => {
      deleteSub(appId, subId);
      qc.invalidateQueries({ queryKey: ["subscriptions", appId] });
    }
  });
  const getUserStats = (_level) => ({
    userCount: 0,
    activeCount: 0,
    pausedCount: 0
  });
  const filtered = reactExports.useMemo(() => subs.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || String(s.level).includes(search)
  ), [subs, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const toggleAll = () => setSelected(selected.size === filtered.length ? /* @__PURE__ */ new Set() : new Set(filtered.map((s) => s.id)));
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const handleDeleteSelected = () => {
    if (isDemoMode) {
      deleteSelected(appId, [...selected]);
    } else {
      selected.forEach((id) => deleteMutation.mutate(id));
    }
    setSelected(/* @__PURE__ */ new Set());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Subscriptions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Subscriptions act as levels/tiers. Each subscription is linked to licenses via their level number." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search subscriptions...",
            className: "h-9 w-56 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -8 },
            animate: { opacity: 1, x: 0 },
            className: "text-xs text-text-muted",
            children: [
              filtered.length,
              " result",
              filtered.length !== 1 ? "s" : ""
            ]
          }
        )
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
            icon: Shield,
            label: "Create Subscription",
            color: "bg-emerald/10 border-border-default text-emerald-400 hover:border-emerald/40",
            onClick: () => {
              setEditTarget(null);
              setModal("create");
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: Trash2,
            label: "Delete Selected",
            color: "bg-rose/10 border-border-default text-rose hover:border-rose/40",
            onClick: () => selected.size > 0 && setModal("delete")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl border border-border-default relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-2.5 border-b border-border-default bg-bg-secondary/30 rounded-t-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: selected.size === filtered.length && filtered.length > 0,
            onChange: toggleAll,
            className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-muted", children: selected.size > 0 ? `${selected.size} selected` : "Select All" }),
        selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            onClick: () => setSelected(/* @__PURE__ */ new Set()),
            className: "text-xs text-text-muted hover:text-text-primary transition-colors",
            children: "Clear"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setEditTarget(null);
              setModal("create");
            },
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple/10 border border-purple/25 text-xs font-medium text-purple-light hover:bg-purple/15 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              " New Subscription"
            ]
          }
        ) })
      ] }),
      paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: search ? Search : Shield,
          title: "No subscriptions yet",
          description: search ? `No results for "${search}"` : "Create your first subscription tier to link with licenses.",
          className: "py-16"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: paginated.map((sub) => {
        const stats = getUserStats(sub.level);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubCard,
          {
            sub,
            selected: selected.has(sub.id),
            userCount: stats.userCount,
            activeCount: stats.activeCount,
            pausedCount: stats.pausedCount,
            onToggle: () => toggleOne(sub.id),
            onEdit: () => {
              setEditTarget(sub);
              setModal("create");
            },
            onDelete: () => {
              setSelected(/* @__PURE__ */ new Set([sub.id]));
              setModal("delete");
            }
          },
          sub.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border-default rounded-b-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setPage((p) => Math.max(1, p - 1)),
            disabled: page === 1,
            className: "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border-default text-text-secondary hover:border-border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }),
              " Previous"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
          "Showing page ",
          page,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
            disabled: page === totalPages,
            className: "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border-default text-text-secondary hover:border-border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
            children: [
              "Next ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.3 },
        className: "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-purple/5 border border-purple/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-purple-light shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-purple-light", children: "How it works: " }),
            "Each subscription tier corresponds to a license level. When you create a license with",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Level 2" }),
            ", it automatically links to any subscription with ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Level 2" }),
            ". Users gain access according to the level on their license key."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SubModal,
        {
          appId,
          existing: editTarget,
          onClose: () => {
            setModal(null);
            setEditTarget(null);
          },
          onSave: (s) => {
            if (editTarget) {
              updateSub(appId, s.id, s);
            } else if (isDemoMode) {
              addSub(appId, s);
            } else {
              createMutation.mutate({
                name: s.name,
                level: s.level,
                price: s.price,
                duration: s.duration,
                description: s.description
              });
            }
          }
        }
      ),
      modal === "delete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteModal,
        {
          count: selected.size,
          onClose: () => setModal(null),
          onConfirm: handleDeleteSelected
        }
      )
    ] })
  ] });
}
export {
  Subscriptions as default
};
