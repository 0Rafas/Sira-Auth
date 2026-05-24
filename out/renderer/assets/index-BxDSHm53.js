import { n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, C as Card, d as Search, K as Key, A as AnimatePresence, m as motion, x as EyeOff, y as Eye, s as formatDistanceToNow, X, I as Input, e as clsx } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { B as Badge } from "./Badge-BPQFuK_4.js";
import { S as SearchBar } from "./SearchBar-POxbfUeO.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { C as Check } from "./check-V-0X9BuP.js";
import { C as Copy } from "./copy-C3WXQPHT.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
const tokensApi = {
  getAll: async (appId) => {
    const res = await api.get(`/dashboard/apps/${appId}/tokens`);
    return res.data;
  },
  create: async (appId, payload) => {
    const res = await api.post(`/dashboard/apps/${appId}/tokens`, payload);
    return res.data;
  },
  delete: async (appId, tokenId) => {
    const res = await api.delete(`/dashboard/apps/${appId}/tokens/${tokenId}`);
    return res.data;
  }
};
const PERMISSION_GROUPS = [
  {
    label: "Auth & Validation",
    color: "text-emerald",
    items: [
      { id: "validate", label: "Validate", desc: "Verify license / user auth" },
      { id: "session.create", label: "Session Create", desc: "Open a new session" },
      { id: "session.kill", label: "Session Kill", desc: "Terminate an active session" }
    ]
  },
  {
    label: "User Management",
    color: "text-cyan",
    items: [
      { id: "users.read", label: "Users Read", desc: "Read user data" },
      { id: "users.write", label: "Users Write", desc: "Create & update users" },
      { id: "users.ban", label: "Users Ban", desc: "Ban / unban users" },
      { id: "users.delete", label: "Users Delete", desc: "Delete users" },
      { id: "users.hwid_reset", label: "HWID Reset", desc: "Reset hardware IDs" }
    ]
  },
  {
    label: "License Management",
    color: "text-purple-light",
    items: [
      { id: "licenses.read", label: "Licenses Read", desc: "Read license data" },
      { id: "licenses.write", label: "Licenses Write", desc: "Create & update licenses" },
      { id: "licenses.delete", label: "Licenses Delete", desc: "Delete licenses" }
    ]
  },
  {
    label: "Data",
    color: "text-amber",
    items: [
      { id: "data.read", label: "Data Read", desc: "Read variables & files" },
      { id: "data.write", label: "Data Write", desc: "Edit variables & files" }
    ]
  }
];
PERMISSION_GROUPS.flatMap(
  (g) => g.items.map((item) => ({ ...item, group: g.label, color: g.color }))
);
function PermissionPicker({ selected, onChange }) {
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]);
  };
  const toggleGroup = (items) => {
    const ids = items.map((i) => i.id);
    const allSelected = ids.every((id) => selected.includes(id));
    if (allSelected) {
      onChange(selected.filter((p) => !ids.includes(p)));
    } else {
      const toAdd = ids.filter((id) => !selected.includes(id));
      onChange([...selected, ...toAdd]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: PERMISSION_GROUPS.map((group) => {
    const groupIds = group.items.map((i) => i.id);
    const allSelected = groupIds.every((id) => selected.includes(id));
    const someSelected = groupIds.some((id) => selected.includes(id));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("text-[11px] font-bold uppercase tracking-wider", group.color), children: group.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleGroup(group.items),
            className: "text-[10px] text-text-muted hover:text-text-primary transition-colors",
            children: allSelected ? "Deselect all" : someSelected ? "Select all" : "Select all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: group.items.map((p) => {
        const active = selected.includes(p.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggle(p.id),
            className: clsx(
              "flex flex-col items-start gap-0.5 p-2 rounded-xl border text-left transition-all",
              active ? "border-purple/50 bg-purple/10 ring-1 ring-purple/25" : "border-border-default bg-bg-card hover:border-border-accent"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("text-[11px] font-semibold", active ? group.color : "text-text-primary"), children: p.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-text-muted leading-tight", children: p.desc })
            ]
          },
          p.id
        );
      }) })
    ] }, group.label);
  }) });
}
function CreateTokenModal({ onClose, onCreate }) {
  const [name, setName] = reactExports.useState("");
  const [perms, setPerms] = reactExports.useState(["validate", "users.read", "licenses.read"]);
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-lg mx-4 max-h-[90vh] flex flex-col",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4 text-purple-light" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Create Token" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-5 overflow-y-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "Token Name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. Production API"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-text-secondary mb-2", children: [
                "Permissions ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionPicker, { selected: perms, onChange: setPerms }),
              perms.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-rose mt-1.5", children: "Select at least one permission." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                disabled: !name.trim() || perms.length === 0,
                onClick: () => {
                  onCreate(name.trim(), perms);
                  onClose();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4" }),
                  " Generate Token"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function TokenRow({ token, onDelete }) {
  const [copied, setCopied] = reactExports.useState(false);
  const [visible, setVisible] = reactExports.useState(false);
  const copyToken = () => {
    navigator.clipboard.writeText(token.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const permColor = (p) => {
    if (p.startsWith("validate") || p.startsWith("session")) return "active";
    if (p.startsWith("users.read") || p.startsWith("data.read")) return "info";
    if (p.startsWith("users.write") || p.startsWith("licenses.write") || p.startsWith("data.write")) return "default";
    if (p.startsWith("users.ban")) return "expired";
    if (p.startsWith("users.hwid") || p.startsWith("licenses.read")) return "inactive";
    if (p.includes("delete")) return "banned";
    return "default";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: 20 },
      className: "border-b border-border-default last:border-0 hover:bg-white/3 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-text-primary", children: token.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-text-secondary", children: visible ? token.token : "•".repeat(24) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setVisible((v) => !v), className: "p-1 rounded text-text-muted hover:text-text-primary transition-colors", children: visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: copyToken, className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors", children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-emerald" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: token.permissions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: permColor(p), className: "text-[10px]", children: p }, p)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: token.lastUsed ? formatDistanceToNow(new Date(token.lastUsed), { addSuffix: true }) : "Never" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: formatDistanceToNow(new Date(token.createdAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onDelete,
            className: "p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
          }
        ) })
      ]
    }
  );
}
function Tokens() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const { data: tokensData } = useQuery({
    queryKey: ["tokens", appId],
    queryFn: () => tokensApi.getAll(appId),
    enabled: !isDemoMode && !!appId
  });
  const tokens = isDemoMode ? [] : tokensData?.data ?? [];
  const createMutation = useMutation({
    mutationFn: ({ name, permissions }) => tokensApi.create(appId, { name, permissions }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tokens", appId] });
      setCreateOpen(false);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => tokensApi.delete(appId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tokens", appId] })
  });
  const filtered = tokens.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.permissions.some((p) => p.includes(search.toLowerCase()))
  );
  const handleCreate = reactExports.useCallback((name, perms) => {
    createMutation.mutate({ name, permissions: perms });
  }, [createMutation]);
  const handleDelete = reactExports.useCallback((id) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Tokens" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "API tokens grant programmatic access to your application. Assign granular permissions to each token." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Create Token"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
      { label: "Total", value: tokens.length, color: "text-text-primary" },
      { label: "Write Access", value: tokens.filter((t) => t.permissions.some((p) => p.includes("write"))).length, color: "text-purple-light" },
      { label: "Delete Access", value: tokens.filter((t) => t.permissions.some((p) => p.includes("delete"))).length, color: "text-rose" }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold text-base ${s.color}`, children: s.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: s.label })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { padding: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { value: search, onChange: setSearch, placeholder: "Search by name or permission...", className: "w-72" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { padding: "none", className: "overflow-hidden", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: search ? Search : Key,
        title: "No tokens found",
        description: search ? "No tokens match your search." : "Create your first API token to get started.",
        className: "py-20"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border-default bg-white/2", children: ["Name", "Token", "Permissions", "Last Used", "Created", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TokenRow, { token: t, onDelete: () => handleDelete(t.id) }, t.id)) }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateTokenModal, { onClose: () => setCreateOpen(false), onCreate: handleCreate }) })
  ] });
}
export {
  Tokens as default
};
