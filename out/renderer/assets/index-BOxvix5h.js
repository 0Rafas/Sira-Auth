import { w as createLucideIcon, D as create, F as persist, n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, m as motion, d as Search, t as Shield, A as AnimatePresence, e as clsx, X, G as Globe, L as Lock, f as AlertTriangle } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { T as ToggleRight, a as ToggleLeft } from "./toggle-right-DOilWeud.js";
import { P as Pencil } from "./pencil-BK1B2uTj.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cpu = createLucideIcon("Cpu", [
  ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" }],
  ["rect", { x: "9", y: "9", width: "6", height: "6", key: "o3kz5p" }],
  ["path", { d: "M15 2v2", key: "13l42r" }],
  ["path", { d: "M15 20v2", key: "15mkzm" }],
  ["path", { d: "M2 15h2", key: "1gxd5l" }],
  ["path", { d: "M2 9h2", key: "1bbxkp" }],
  ["path", { d: "M20 15h2", key: "19e6y8" }],
  ["path", { d: "M20 9h2", key: "19tzq7" }],
  ["path", { d: "M9 2v2", key: "165o2o" }],
  ["path", { d: "M9 20v2", key: "i2bqo8" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Laptop = createLucideIcon("Laptop", [
  [
    "path",
    {
      d: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",
      key: "tarvll"
    }
  ]
]);
const useRuleStore = create()(
  persist(
    (set, get) => ({
      rules: {},
      addRule: (appId, rule) => set({
        rules: {
          ...get().rules,
          [appId]: [...get().rules[appId] ?? [], rule]
        }
      }),
      updateRule: (appId, id, patch) => set({
        rules: {
          ...get().rules,
          [appId]: (get().rules[appId] ?? []).map(
            (r) => r.id === id ? { ...r, ...patch } : r
          )
        }
      }),
      deleteRule: (appId, id) => set({
        rules: {
          ...get().rules,
          [appId]: (get().rules[appId] ?? []).filter((r) => r.id !== id)
        }
      }),
      deleteSelected: (appId, ids) => set({
        rules: {
          ...get().rules,
          [appId]: (get().rules[appId] ?? []).filter((r) => !ids.includes(r.id))
        }
      }),
      toggleEnabled: (appId, id) => set({
        rules: {
          ...get().rules,
          [appId]: (get().rules[appId] ?? []).map(
            (r) => r.id === id ? { ...r, enabled: !r.enabled } : r
          )
        }
      })
    }),
    { name: "sira_rule_store", partialize: (s) => ({ rules: s.rules }) }
  )
);
const rulesApi = {
  getAll: async (appId) => {
    const res = await api.get(`/dashboard/apps/${appId}/rules`);
    return res.data;
  },
  create: async (appId, payload) => {
    const res = await api.post(`/dashboard/apps/${appId}/rules`, payload);
    return res.data;
  },
  toggle: async (appId, ruleId) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/rules/${ruleId}/toggle`
    );
    return res.data;
  },
  delete: async (appId, ruleId) => {
    const res = await api.delete(`/dashboard/apps/${appId}/rules/${ruleId}`);
    return res.data;
  }
};
function randomId() {
  return Math.random().toString(36).slice(2, 12);
}
const RULE_TYPES = [
  {
    value: "country_block",
    label: "Country Block",
    icon: Globe,
    description: "Block or allow users from specific countries (ISO 3166-1 alpha-2 code)",
    placeholder: "e.g. US, RU, CN"
  },
  {
    value: "ip_block",
    label: "IP Block",
    icon: Laptop,
    description: "Block or allow specific IP addresses or CIDR ranges",
    placeholder: "e.g. 192.168.1.1 or 10.0.0.0/24"
  },
  {
    value: "version_lock",
    label: "Version Lock",
    icon: Lock,
    description: "Only allow a specific minimum application version",
    placeholder: "e.g. 2.0.0"
  },
  {
    value: "custom",
    label: "Custom",
    icon: Cpu,
    description: "Custom rule with a user-defined condition value",
    placeholder: "e.g. custom condition value"
  }
];
function getRuleTypeInfo(type) {
  return RULE_TYPES.find((t) => t.value === type) ?? RULE_TYPES[3];
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
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-lg mx-4",
        onClick: (e) => e.stopPropagation(),
        children
      }
    )
  ] });
}
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
function RuleModal({ appId, existing, onClose, onSave }) {
  const [type, setType] = reactExports.useState(existing?.type ?? "country_block");
  const [name, setName] = reactExports.useState(existing?.name ?? "");
  const [value, setValue] = reactExports.useState(existing?.value ?? "");
  const [action, setAction] = reactExports.useState(existing?.action ?? "block");
  const isEdit = !!existing;
  const typeInfo = getRuleTypeInfo(type);
  const valid = name.trim().length > 0 && value.trim().length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-purple-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: isEdit ? "Edit Rule" : "Create Rule" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-2 block", children: [
          "Rule Type ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: RULE_TYPES.map((rt) => {
          const Icon = rt.icon;
          const active = type === rt.value;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setType(rt.value),
              className: clsx(
                "flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all",
                active ? "border-purple/60 bg-purple/10" : "border-border-default bg-bg-card hover:border-border-accent"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", active ? "bg-purple/20" : "bg-white/5"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: clsx("w-3.5 h-3.5", active ? "text-purple-light" : "text-text-muted") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: clsx("text-xs font-semibold", active ? "text-purple-light" : "text-text-primary"), children: rt.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted leading-tight mt-0.5", children: rt.description })
                ] })
              ]
            },
            rt.value
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Rule Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Block Russia", className: inputCls, autoFocus: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Value ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value,
            onChange: (e) => setValue(e.target.value),
            placeholder: typeInfo.placeholder,
            className: inputCls
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1", children: typeInfo.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-2 block", children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["block", "allow"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setAction(a),
            className: clsx(
              "flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all",
              action === a ? a === "block" ? "border-rose/50 bg-rose/10 text-rose" : "border-emerald/50 bg-emerald/10 text-emerald-400" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
            ),
            children: [
              a === "block" ? "🚫" : "✅",
              " ",
              a.charAt(0).toUpperCase() + a.slice(1)
            ]
          },
          a
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !valid, onClick: () => {
        onSave({
          id: existing?.id ?? randomId(),
          appId,
          name: name.trim(),
          type,
          value: value.trim(),
          action,
          enabled: existing?.enabled ?? true
        });
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
        isEdit ? "Save Changes" : "Create Rule"
      ] })
    ] })
  ] });
}
function DeleteModal({ count, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete Rule(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary mb-3", children: [
        "Delete ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text-primary", children: count }),
        " rule",
        count !== 1 ? "s" : "",
        "?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-rose/8 border border-rose/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-rose shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose", children: "This action cannot be undone." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
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
function RuleRow({ rule, selected, onToggle, onToggleEnabled, onEdit, onDelete }) {
  const typeInfo = getRuleTypeInfo(rule.type);
  const Icon = typeInfo.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: clsx(
        "border-b border-border-default last:border-0 hover:bg-white/3 transition-colors cursor-pointer",
        selected && "bg-purple/5",
        !rule.enabled && "opacity-50"
      ),
      onClick: onEdit,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 w-8", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selected, onChange: onToggle, className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-white/5 border border-border-default flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-text-muted" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-text-primary", children: rule.name })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
          "px-2 py-1 rounded-lg text-[10px] font-medium border",
          rule.type === "country_block" ? "bg-cyan/10 border-cyan/20 text-cyan" : rule.type === "ip_block" ? "bg-amber/10 border-amber/20 text-amber" : rule.type === "version_lock" ? "bg-purple/10 border-purple/20 text-purple-light" : "bg-white/5 border-border-default text-text-muted"
        ), children: typeInfo.label }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-text-secondary", children: rule.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
          "px-2 py-1 rounded-lg text-[10px] font-medium border",
          rule.action === "block" ? "bg-rose/10 border-rose/20 text-rose" : "bg-emerald/10 border-emerald/20 text-emerald-400"
        ), children: rule.action === "block" ? "🚫 Block" : "✅ Allow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
          "px-2 py-1 rounded-lg text-[10px] font-medium border",
          rule.enabled ? "bg-emerald/10 border-emerald/20 text-emerald-400" : "bg-white/5 border-border-default text-text-muted"
        ), children: rule.enabled ? "Enabled" : "Disabled" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onToggleEnabled();
              },
              className: clsx("p-1.5 rounded-lg transition-colors", rule.enabled ? "text-emerald hover:text-emerald/70 hover:bg-emerald/5" : "text-text-muted hover:text-emerald hover:bg-emerald/5"),
              title: rule.enabled ? "Disable" : "Enable",
              children: rule.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onEdit();
              },
              className: "p-1.5 rounded-lg text-text-muted hover:text-purple-light hover:bg-purple/5 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onDelete();
              },
              className: "p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/5 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
function ToolBtn({ icon: Icon, label, color, onClick, active }) {
  const [tip, setTip] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onMouseEnter: () => setTip(true), onMouseLeave: () => setTip(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: clsx("w-9 h-9 rounded-xl border flex items-center justify-center transition-all", active ? `${color} ring-2 ring-white/10` : color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) }),
    tip && label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-bg-card border border-border-accent text-[10px] text-text-secondary whitespace-nowrap shadow-card z-20", children: label })
  ] });
}
function Rules() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const { rules: allRules, addRule, updateRule, deleteRule, deleteSelected, toggleEnabled } = useRuleStore();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [modal, setModal] = reactExports.useState(null);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const { data: apiRules } = useQuery({
    queryKey: ["rules", appId],
    queryFn: () => rulesApi.getAll(appId),
    enabled: !isDemoMode && !!appId
  });
  reactExports.useEffect(() => {
    if (!isDemoMode && apiRules?.data) {
      const current = allRules[appId] ?? [];
      apiRules.data.forEach((r) => {
        if (!current.find((c) => c.id === r.id)) addRule(appId, r);
      });
    }
  }, [apiRules, isDemoMode, appId]);
  const rules = isDemoMode ? allRules[appId] ?? [] : apiRules?.data ?? allRules[appId] ?? [];
  const createMutation = useMutation({
    mutationFn: (payload) => rulesApi.create(appId, payload),
    onSuccess: (res) => {
      if (res.data) addRule(appId, res.data);
      qc.invalidateQueries({ queryKey: ["rules", appId] });
      setModal(null);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => rulesApi.delete(appId, id),
    onSuccess: (_, id) => {
      deleteRule(appId, id);
      qc.invalidateQueries({ queryKey: ["rules", appId] });
    }
  });
  const toggleMutation = useMutation({
    mutationFn: (id) => rulesApi.toggle(appId, id),
    onSuccess: (_, id) => {
      toggleEnabled(appId, id);
      qc.invalidateQueries({ queryKey: ["rules", appId] });
    }
  });
  const filtered = reactExports.useMemo(() => rules.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.value.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || r.type === typeFilter;
    return matchSearch && matchType;
  }), [rules, search, typeFilter]);
  const toggleAll = () => setSelected(selected.size === filtered.length ? /* @__PURE__ */ new Set() : new Set(filtered.map((r) => r.id)));
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      if (isDemoMode) deleteRule(appId, deleteTarget);
      else deleteMutation.mutate(deleteTarget);
      setDeleteTarget(null);
    } else {
      if (isDemoMode) deleteSelected(appId, [...selected]);
      else selected.forEach((id) => deleteMutation.mutate(id));
      setSelected(/* @__PURE__ */ new Set());
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Rules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Define security rules to block or allow users based on country, IP, version, or custom conditions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditTarget(null);
        setModal("create");
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Create Rule"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search rules...",
            className: "h-9 w-56 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: typeFilter,
            onChange: (e) => setTypeFilter(e.target.value),
            className: "h-9 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary focus:outline-none focus:border-purple/60 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Types" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "country_block", children: "Country Block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ip_block", children: "IP Block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "version_lock", children: "Version Lock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "custom", children: "Custom" })
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
            icon: Plus,
            label: "Create Rule",
            color: "bg-purple/10 border-border-default text-purple-light hover:border-purple/40",
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl border border-border-default overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-2.5 border-b border-border-default bg-bg-secondary/30", children: [
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
            className: "ml-1 text-xs text-text-muted hover:text-text-primary transition-colors",
            children: "Clear"
          }
        )
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: search ? Search : Shield,
          title: "No rules found",
          description: search ? `No results for "${search}"` : "Create security rules to protect your application.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8" }),
          ["Rule Name", "Type", "Value", "Action", "Status", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          RuleRow,
          {
            rule: r,
            selected: selected.has(r.id),
            onToggle: () => toggleOne(r.id),
            onToggleEnabled: () => isDemoMode ? toggleEnabled(appId, r.id) : toggleMutation.mutate(r.id),
            onEdit: () => {
              setEditTarget(r);
              setModal("create");
            },
            onDelete: () => {
              setDeleteTarget(r.id);
              setModal("delete");
            }
          },
          r.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center px-4 py-3 border-t border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
        filtered.length,
        " rule",
        filtered.length !== 1 ? "s" : ""
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RuleModal,
        {
          appId,
          existing: editTarget,
          onClose: () => {
            setModal(null);
            setEditTarget(null);
          },
          onSave: (r) => {
            if (editTarget) {
              updateRule(appId, r.id, r);
            } else if (isDemoMode) {
              addRule(appId, r);
            } else {
              createMutation.mutate({
                name: r.name,
                type: r.type,
                value: r.value,
                action: r.action
              });
            }
          }
        }
      ),
      modal === "delete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteModal,
        {
          count: deleteTarget ? 1 : selected.size,
          onClose: () => {
            setModal(null);
            setDeleteTarget(null);
          },
          onConfirm: confirmDelete
        }
      )
    ] })
  ] });
}
export {
  Rules as default
};
