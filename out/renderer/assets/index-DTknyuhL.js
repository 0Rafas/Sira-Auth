import { D as create, F as persist, n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, m as motion, d as Search, V as Variable, A as AnimatePresence, e as clsx, L as Lock, x as EyeOff, y as Eye, J as User, G as Globe, s as formatDistanceToNow, X, N as ChevronDown, f as AlertTriangle } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { P as Pencil } from "./pencil-BK1B2uTj.js";
const useVariableStore = create()(
  persist(
    (set, get) => ({
      variables: {},
      addVariable: (appId, variable) => set({
        variables: {
          ...get().variables,
          [appId]: [...get().variables[appId] ?? [], variable]
        }
      }),
      updateVariable: (appId, id, patch) => set({
        variables: {
          ...get().variables,
          [appId]: (get().variables[appId] ?? []).map(
            (v) => v.id === id ? { ...v, ...patch } : v
          )
        }
      }),
      deleteVariable: (appId, id) => set({
        variables: {
          ...get().variables,
          [appId]: (get().variables[appId] ?? []).filter((v) => v.id !== id)
        }
      }),
      deleteSelected: (appId, ids) => set({
        variables: {
          ...get().variables,
          [appId]: (get().variables[appId] ?? []).filter((v) => !ids.includes(v.id))
        }
      })
    }),
    { name: "sira_variable_store", partialize: (s) => ({ variables: s.variables }) }
  )
);
const variablesApi = {
  getAll: async (appId) => {
    const res = await api.get(`/dashboard/apps/${appId}/variables`);
    return res.data;
  },
  upsert: async (appId, payload) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/variables`,
      payload
    );
    return res.data;
  },
  delete: async (appId, varId) => {
    const res = await api.delete(`/dashboard/apps/${appId}/variables/${varId}`);
    return res.data;
  }
};
function randomId() {
  return Math.random().toString(36).slice(2, 12);
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
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-md mx-4",
        onClick: (e) => e.stopPropagation(),
        children
      }
    )
  ] });
}
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
function VariableModal({ appId, existing, onClose, onSave }) {
  const { isDemoMode } = useAuthStore();
  const [name, setName] = reactExports.useState(existing?.name ?? "");
  const [value, setValue] = reactExports.useState(existing?.value ?? "");
  const [isSecret, setIsSecret] = reactExports.useState(existing?.isSecret ?? false);
  const [isGlobal, setIsGlobal] = reactExports.useState(existing?.userId == null);
  const [userId, setUserId] = reactExports.useState(existing?.userId ?? "");
  const [userSearch, setUserSearch] = reactExports.useState("");
  const [userDropdownOpen, setUserDropdownOpen] = reactExports.useState(false);
  const availableUsers = isDemoMode ? DEMO_USERS.filter((u) => u.appId === appId || u.appId === "demo-app-001") : [];
  const filteredUsers = availableUsers.filter(
    (u) => u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const selectedUser = availableUsers.find((u) => u.id === userId);
  const isEdit = !!existing;
  const valid = name.trim().length > 0 && value.trim().length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Variable, { className: "w-4 h-4 text-emerald-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: isEdit ? "Edit Variable" : "Create Variable" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Variable Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g. api_endpoint, max_retries",
            className: inputCls,
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1", children: "Use lowercase with underscores. Accessible via SDK." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Value ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value,
            onChange: (e) => setValue(e.target.value),
            placeholder: "Variable value...",
            rows: 3,
            className: "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all resize-none font-mono"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Scope" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsGlobal(true),
              className: clsx(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-all",
                isGlobal ? "border-purple/60 bg-purple/10 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5" }),
                " Global (all users)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsGlobal(false),
              className: clsx(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-all",
                !isGlobal ? "border-purple/60 bg-purple/10 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
                " Per-user"
              ]
            }
          )
        ] }),
        !isGlobal && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, className: "mt-2 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setUserDropdownOpen((v) => !v),
              className: clsx(inputCls, "flex items-center justify-between text-left"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: selectedUser ? "text-text-primary" : "text-text-muted", children: selectedUser ? `${selectedUser.username}${selectedUser.email ? ` — ${selectedUser.email}` : ""}` : "Select a user…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-text-muted shrink-0 ml-2" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: userDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -4 },
              className: "absolute top-full left-0 right-0 mt-1 bg-bg-card border border-border-accent rounded-xl shadow-card z-20 overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-b border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: userSearch,
                    onChange: (e) => setUserSearch(e.target.value),
                    placeholder: "Search users...",
                    className: "w-full px-2.5 py-1.5 text-xs bg-bg-secondary border border-border-default rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none",
                    autoFocus: true
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-40 overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setUserId("");
                        setUserDropdownOpen(false);
                      },
                      className: "w-full flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:bg-white/5 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: "None (assign later)" })
                    }
                  ),
                  filteredUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setUserId(u.id);
                        setUserDropdownOpen(false);
                        setUserSearch("");
                      },
                      className: clsx(
                        "w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors",
                        userId === u.id ? "bg-purple/10 text-purple-light" : "text-text-secondary hover:bg-white/5"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-white text-[9px] font-bold shrink-0", children: u.username[0].toUpperCase() }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: u.username }),
                        u.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-text-muted ml-1", children: [
                          "— ",
                          u.email
                        ] })
                      ]
                    },
                    u.id
                  )),
                  filteredUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-3 text-xs text-text-muted text-center", children: "No users found" })
                ] })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-3 rounded-xl border border-border-default bg-bg-secondary/30 cursor-pointer hover:border-border-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-text-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-text-secondary", children: "Mark as Secret" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted", children: "Value will be masked in the dashboard" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setIsSecret((v) => !v),
            className: clsx(
              "w-9 h-5 rounded-full transition-colors relative shrink-0",
              isSecret ? "bg-purple" : "bg-white/10"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
              isSecret ? "translate-x-4" : "translate-x-0.5"
            ) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !valid, onClick: () => {
        onSave({
          id: existing?.id ?? randomId(),
          appId,
          name: name.trim(),
          value: value.trim(),
          isSecret,
          userId: isGlobal ? void 0 : userId.trim() || void 0,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Variable, { className: "w-4 h-4" }),
        isEdit ? "Save Changes" : "Create Variable"
      ] })
    ] })
  ] });
}
function DeleteModal({ count, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete Variable(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary mb-3", children: [
        "Delete ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text-primary", children: count }),
        " variable",
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
function VariableRow({ variable, selected, onToggle, onEdit, onDelete }) {
  const [visible, setVisible] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: clsx(
        "border-b border-border-default last:border-0 hover:bg-white/3 transition-colors cursor-pointer",
        selected && "bg-purple/5"
      ),
      onClick: onEdit,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 w-8", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selected, onChange: onToggle, className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-medium text-text-primary", children: variable.name }),
          variable.isSecret && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 text-amber shrink-0" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-text-secondary max-w-[200px] truncate", children: variable.isSecret && !visible ? "•".repeat(Math.min(variable.value.length, 20)) : variable.value }),
          variable.isSecret && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                setVisible((v) => !v);
              },
              className: "p-1 rounded text-text-muted hover:text-text-primary transition-colors shrink-0",
              children: visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium border",
          variable.userId ? "bg-cyan/10 border-cyan/20 text-cyan" : "bg-purple/10 border-purple/20 text-purple-light"
        ), children: [
          variable.userId ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
          variable.userId ? `User: ${variable.userId.slice(0, 8)}…` : "Global"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: formatDistanceToNow(new Date(variable.updatedAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
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
function Variables() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const { variables: allVars, addVariable, updateVariable, deleteVariable, deleteSelected } = useVariableStore();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [scopeFilter, setScopeFilter] = reactExports.useState("all");
  const [modal, setModal] = reactExports.useState(null);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const { data: apiVars } = useQuery({
    queryKey: ["variables", appId],
    queryFn: () => variablesApi.getAll(appId),
    enabled: !isDemoMode && !!appId
  });
  reactExports.useEffect(() => {
    if (!isDemoMode && apiVars?.data) {
      const current = allVars[appId] ?? [];
      apiVars.data.forEach((v) => {
        if (!current.find((c) => c.id === v.id)) addVariable(appId, v);
      });
    }
  }, [apiVars, isDemoMode, appId]);
  const vars = isDemoMode ? allVars[appId] ?? [] : apiVars?.data ?? allVars[appId] ?? [];
  useMutation({
    mutationFn: (payload) => variablesApi.upsert(appId, payload),
    onSuccess: (res) => {
      if (res.data) updateVariable(appId, res.data.id, res.data);
      qc.invalidateQueries({ queryKey: ["variables", appId] });
      setModal(null);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => variablesApi.delete(appId, id),
    onSuccess: (_, id) => {
      deleteVariable(appId, id);
      qc.invalidateQueries({ queryKey: ["variables", appId] });
    }
  });
  const filtered = reactExports.useMemo(() => vars.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.value.toLowerCase().includes(search.toLowerCase());
    const matchScope = scopeFilter === "all" || (scopeFilter === "global" ? !v.userId : !!v.userId);
    return matchSearch && matchScope;
  }), [vars, search, scopeFilter]);
  const toggleAll = () => setSelected(selected.size === filtered.length ? /* @__PURE__ */ new Set() : new Set(filtered.map((v) => v.id)));
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      if (isDemoMode) deleteVariable(appId, deleteTarget);
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Variables" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Store key-value data accessible by your application via the SDK. Global or per-user scope." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditTarget(null);
        setModal("create");
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Create Variable"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search variables...",
            className: "h-9 w-56 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: scopeFilter,
            onChange: (e) => setScopeFilter(e.target.value),
            className: "h-9 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary focus:outline-none focus:border-purple/60 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Scopes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "global", children: "Global" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "user", children: "Per-User" })
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
            label: "Create Variable",
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
          icon: search ? Search : Variable,
          title: "No variables found",
          description: search ? `No results for "${search}"` : "Create your first variable to store app-wide or per-user data.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8" }),
          ["Name", "Value", "Scope", "Updated", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          VariableRow,
          {
            variable: v,
            selected: selected.has(v.id),
            onToggle: () => toggleOne(v.id),
            onEdit: () => {
              setEditTarget(v);
              setModal("create");
            },
            onDelete: () => {
              setDeleteTarget(v.id);
              setModal("delete");
            }
          },
          v.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center px-4 py-3 border-t border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
        filtered.length,
        " variable",
        filtered.length !== 1 ? "s" : ""
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        VariableModal,
        {
          appId,
          existing: editTarget,
          onClose: () => {
            setModal(null);
            setEditTarget(null);
          },
          onSave: (v) => {
            if (editTarget) updateVariable(appId, v.id, v);
            else addVariable(appId, v);
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
  Variables as default
};
