import { u as useNavigate, a as useQueryClient, b as useAppStore, c as useToast, r as reactExports, j as jsxRuntimeExports, B as Button, P as Plus, C as Card, S as SquareStack, d as Search, A as AnimatePresence, m as motion, E as ExternalLink, e as clsx, f as AlertTriangle, I as Input, g as CheckCircle2, h as appsApi, K as Key, U as Users, Z as Zap, i as Activity, k as Settings } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { B as Badge } from "./Badge-BPQFuK_4.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { P as Pencil } from "./pencil-BK1B2uTj.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { M as MoreHorizontal } from "./more-horizontal-gQQt4mcb.js";
import { C as Copy } from "./copy-C3WXQPHT.js";
import { P as PowerOff, a as Power } from "./power-YpXDVOhT.js";
function StatCard({ label, value, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "text-center py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-4xl font-bold ${color}`, children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-2", children: label })
  ] });
}
function DeleteConfirmModal({ app, onConfirm, onClose }) {
  const [typed, setTyped] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 8 },
        transition: { duration: 0.2 },
        className: "relative z-10 glass rounded-2xl p-6 w-full max-w-md shadow-card border border-rose/30",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-5 h-5 text-rose" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-text-primary", children: "Delete Application" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "This action cannot be undone." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-rose/5 border border-rose/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-rose", children: [
            "⚠️ Deleting ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: app.name }),
            " will permanently remove all its licenses, users, sessions, and data."
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted mb-3", children: [
            "Type ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-text-primary", children: app.name }),
            " to confirm:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: typed, onChange: (e) => setTyped(e.target.value), placeholder: app.name, autoFocus: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-5 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", disabled: typed !== app.name, onClick: onConfirm, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
              " Delete Forever"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function RenameModal({ app, onConfirm, onClose }) {
  const [name, setName] = reactExports.useState(app.name);
  const [version, setVersion] = reactExports.useState(app.version);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 8 },
        transition: { duration: 0.2 },
        className: "relative z-10 glass rounded-2xl p-6 w-full max-w-sm shadow-card border border-border-accent",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-5 h-5 text-purple-light" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-text-primary", children: "Edit Application" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "Update the application details." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "Application Name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "My App",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "Version",
                value: version,
                onChange: (e) => setVersion(e.target.value),
                placeholder: "1.0.0",
                hint: "e.g. 1.2.3"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-5 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !name.trim(), onClick: () => onConfirm(name.trim(), version.trim() || "1.0.0"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { className: "w-4 h-4" }),
              " Save Changes"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function AppOptionsMenu({ app, onRename, onDelete, onToggleStatus, onCopySecret, onClose }) {
  const navigate = useNavigate();
  const ref = reactExports.useRef(null);
  const { setSelectedApp } = useAppStore();
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  const sections = [
    [
      {
        icon: ExternalLink,
        label: "Open App",
        action: () => {
          setSelectedApp(app);
          navigate(`/apps/${app.id}/licenses`);
          onClose();
        }
      },
      {
        icon: Pencil,
        label: "Edit Name & Version",
        action: () => {
          onRename();
          onClose();
        }
      },
      {
        icon: Copy,
        label: "Copy Secret Key",
        action: () => {
          onCopySecret();
          onClose();
        }
      }
    ],
    [
      {
        icon: Key,
        label: "View Licenses",
        action: () => {
          setSelectedApp(app);
          navigate(`/apps/${app.id}/licenses`);
          onClose();
        }
      },
      {
        icon: Users,
        label: "View Users",
        action: () => {
          setSelectedApp(app);
          navigate(`/apps/${app.id}/users`);
          onClose();
        }
      },
      {
        icon: Zap,
        label: "View Tokens",
        action: () => {
          setSelectedApp(app);
          navigate(`/apps/${app.id}/tokens`);
          onClose();
        }
      },
      {
        icon: Activity,
        label: "View Sessions",
        action: () => {
          setSelectedApp(app);
          navigate(`/apps/${app.id}/sessions`);
          onClose();
        }
      },
      {
        icon: Settings,
        label: "App Settings",
        action: () => {
          setSelectedApp(app);
          navigate(`/apps/${app.id}/settings`);
          onClose();
        }
      }
    ],
    [
      {
        icon: app.status === "active" ? PowerOff : Power,
        label: app.status === "active" ? "Pause Application" : "Resume Application",
        action: () => {
          onToggleStatus();
          onClose();
        },
        className: app.status === "active" ? "text-amber hover:bg-amber/5" : "text-emerald hover:bg-emerald/5"
      },
      {
        icon: Trash2,
        label: "Delete Application",
        action: () => {
          onDelete();
          onClose();
        },
        danger: true
      }
    ]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref,
      initial: { opacity: 0, scale: 0.95, y: -4 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -4 },
      transition: { duration: 0.15 },
      className: "absolute right-0 top-full mt-1 w-56 glass rounded-xl shadow-card border border-border-accent overflow-hidden z-30",
      children: sections.map((group, gi) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(gi < sections.length - 1 && "border-b border-border-default"), children: group.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: item.action,
          className: clsx(
            "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors",
            item.danger ? "text-rose hover:bg-rose/5" : item.className ?? "text-text-secondary hover:text-text-primary hover:bg-white/5"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4 h-4 shrink-0 opacity-80" }),
            item.label
          ]
        },
        item.label
      )) }, gi))
    }
  );
}
function AppCard({ app, onDelete, onRename, onToggleStatus }) {
  const navigate = useNavigate();
  const { setSelectedApp } = useAppStore();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const handleCopySecret = () => {
    navigator.clipboard.writeText(app.secret ?? "");
    toast.success("Copied!", "Secret key copied to clipboard.");
  };
  const handleOpen = () => {
    setSelectedApp(app);
    navigate(`/apps/${app.id}/licenses`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      className: "glass rounded-xl p-4 flex items-center gap-4 hover:border-border-accent transition-all group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: handleOpen,
            className: "w-10 h-10 rounded-xl bg-gradient-to-br from-purple/30 to-cyan/20 border border-border-accent flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-purple-light", children: app.name[0].toUpperCase() })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 cursor-pointer", onClick: handleOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary truncate", children: app.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: app.status === "active" ? "active" : "inactive", dot: true, children: app.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted mt-0.5", children: [
            "v",
            app.version,
            " · ",
            app.totalUsers,
            " users · ",
            app.activeSessions,
            " sessions"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleOpen,
                  title: "Open",
                  className: "p-2 rounded-lg text-text-muted hover:text-cyan hover:bg-cyan/5 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onRename(app),
                  title: "Edit",
                  className: "p-2 rounded-lg text-text-muted hover:text-purple-light hover:bg-purple/5 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onDelete(app),
                  title: "Delete",
                  className: "p-2 rounded-lg text-text-muted hover:text-rose hover:bg-rose/5 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setMenuOpen((v) => !v),
              className: clsx(
                "p-2 rounded-lg transition-colors",
                menuOpen ? "text-text-primary bg-white/8" : "text-text-muted hover:text-text-primary hover:bg-white/5"
              ),
              title: "More options",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoreHorizontal, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            AppOptionsMenu,
            {
              app,
              onRename: () => onRename(app),
              onDelete: () => onDelete(app),
              onToggleStatus: () => onToggleStatus(app),
              onCopySecret: handleCopySecret,
              onClose: () => setMenuOpen(false)
            }
          ) })
        ] })
      ]
    }
  );
}
function Apps() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { apps, setSelectedApp, deleteApp, updateApp } = useAppStore();
  const toast = useToast();
  const [search, setSearch] = reactExports.useState("");
  const [appToDelete, setAppToDelete] = reactExports.useState(null);
  const [appToRename, setAppToRename] = reactExports.useState(null);
  const deleteMutation = useMutation({
    mutationFn: (id) => appsApi.delete(id),
    onSuccess: (_, id) => {
      deleteApp(id);
      qc.invalidateQueries({ queryKey: ["apps"] });
    }
  });
  const renameMutation = useMutation({
    mutationFn: ({ id, ...payload }) => appsApi.update(id, payload),
    onSuccess: (res) => {
      if (res.data) updateApp(res.data.id, res.data);
      qc.invalidateQueries({ queryKey: ["apps"] });
    }
  });
  const toggleMutation = useMutation({
    mutationFn: (id) => appsApi.pause(id),
    onSuccess: (res) => {
      if (res.data) updateApp(res.data.id, res.data);
      qc.invalidateQueries({ queryKey: ["apps"] });
    }
  });
  const filtered = apps.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
  const stats = {
    total: apps.length,
    active: apps.filter((a) => a.status === "active").length,
    paused: apps.filter((a) => a.status === "paused").length,
    sessions: apps.reduce((s, a) => s + a.activeSessions, 0)
  };
  const handleDelete = () => {
    if (!appToDelete) return;
    deleteMutation.mutate(appToDelete.id);
    toast.success("Application deleted", `"${appToDelete.name}" has been permanently deleted.`);
    setAppToDelete(null);
  };
  const handleRename = (name, version) => {
    if (!appToRename) return;
    renameMutation.mutate({ id: appToRename.id, name, version });
    toast.success("Application updated", `Renamed to "${name}" v${version}.`);
    setAppToRename(null);
  };
  const handleToggleStatus = (app) => {
    toggleMutation.mutate(app.id);
    const next = app.status === "active" ? "paused" : "active";
    toast.info(
      next === "active" ? "Application resumed" : "Application paused",
      `"${app.name}" is now ${next}.`
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Manage Applications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Applications are the backbone of all the data." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/apps/new"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Create Application"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Apps", value: stats.total, color: "text-text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active", value: stats.active, color: "text-emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Paused", value: stats.paused, color: "text-amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active Sessions", value: stats.sessions, color: "text-cyan" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: "My Applications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search applications...",
            className: "h-8 w-56 pl-3 pr-3 rounded-lg border border-border-default bg-bg-secondary text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        )
      ] }),
      apps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: SquareStack,
          title: "No applications yet",
          description: "Create your first application to start managing licenses and users."
        }
      ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Search, title: "No results", description: `No applications match "${search}"` }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: filtered.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        AppCard,
        {
          app,
          onDelete: setAppToDelete,
          onRename: setAppToRename,
          onToggleStatus: handleToggleStatus
        },
        app.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      appToDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteConfirmModal,
        {
          app: appToDelete,
          onConfirm: handleDelete,
          onClose: () => setAppToDelete(null)
        }
      ),
      appToRename && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RenameModal,
        {
          app: appToRename,
          onConfirm: handleRename,
          onClose: () => setAppToRename(null)
        }
      )
    ] })
  ] });
}
export {
  Apps as default
};
