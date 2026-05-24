import { w as createLucideIcon, o as useParams, u as useNavigate, b as useAppStore, c as useToast, r as reactExports, j as jsxRuntimeExports, f as AlertTriangle, B as Button, z as ChevronRight, k as Settings, I as Input, L as Lock, x as EyeOff, y as Eye, v as Info, e as clsx, t as Shield, m as motion, A as AnimatePresence } from "./index-Bnbhtkos.js";
import { S as Save } from "./save-BoMEC2Mm.js";
import { C as Check } from "./check-V-0X9BuP.js";
import { C as Copy } from "./copy-C3WXQPHT.js";
import { R as RotateCcw } from "./rotate-ccw-DBxUozMm.js";
import { a as Power, P as PowerOff } from "./power-YpXDVOhT.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Code2 = createLucideIcon("Code2", [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Terminal = createLucideIcon("Terminal", [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
]);
function Section({ title, description, icon: Icon, children, color = "bg-purple/10 border-purple/20 text-purple-light" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      className: "glass rounded-2xl border border-border-default overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("w-8 h-8 rounded-lg border flex items-center justify-center shrink-0", color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children })
      ]
    }
  );
}
function DeleteModal({ appName, onClose, onConfirm }) {
  const [typed, setTyped] = reactExports.useState("");
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
        transition: { duration: 0.2 },
        className: "relative z-10 glass rounded-2xl shadow-card border border-rose/30 w-full max-w-md mx-4 p-6",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-5 h-5 text-rose" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-text-primary", children: "Delete Application" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "This action is permanent and irreversible." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-rose/5 border border-rose/20 mb-4 text-xs text-rose leading-relaxed", children: [
            "Deleting ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: appName }),
            " will permanently remove all its licenses, users, sessions, tokens, variables, webhooks, files, rules, and all associated data."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted mb-2", children: [
            "Type ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-text-primary", children: appName }),
            " to confirm:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: typed,
              onChange: (e) => setTyped(e.target.value),
              placeholder: appName,
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-5 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", disabled: typed !== appName, onClick: onConfirm, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
              " Delete Forever"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function RotateSecretModal({ onClose, onConfirm }) {
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
        transition: { duration: 0.2 },
        className: "relative z-10 glass rounded-2xl shadow-card border border-amber/30 w-full max-w-sm mx-4 p-6",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-5 h-5 text-amber" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-text-primary", children: "Rotate Secret Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "This will invalidate the current secret." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-text-secondary mb-4", children: "All existing SDK integrations using the current secret key will stop working immediately. You will need to update your SDK configuration with the new secret." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 p-3 rounded-xl bg-amber/5 border border-amber/20 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-amber shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber", children: "Make sure to update your SDK before rotating." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-amber hover:bg-amber/80 text-black border-none", onClick: () => {
              onConfirm();
              onClose();
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
              " Rotate Secret"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function AppSettings() {
  const { id: appId } = useParams();
  const navigate = useNavigate();
  const { apps, updateApp, deleteApp } = useAppStore();
  const toast = useToast();
  const app = apps.find((a) => a.id === appId);
  const [name, setName] = reactExports.useState(app?.name ?? "");
  const [version, setVersion] = reactExports.useState(app?.version ?? "1.0.0");
  const [secretVisible, setSecretVisible] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const [modal, setModal] = reactExports.useState(null);
  if (!app) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-rose/10 border border-rose/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-7 h-7 text-rose" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-text-primary", children: "Application not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-text-muted mt-1", children: "This application may have been deleted." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4", onClick: () => navigate("/apps"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 rotate-180" }),
        " Back to Apps"
      ] })
    ] });
  }
  const handleSaveInfo = () => {
    if (!name.trim()) return;
    updateApp(appId, { name: name.trim(), version: version.trim() || "1.0.0", updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    toast.success("Settings saved", "Application info updated successfully.");
  };
  const handleRotateSecret = () => {
    const newSecret = `sk_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 8)}`;
    updateApp(appId, { secret: newSecret, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    toast.success("Secret rotated", "A new secret key has been generated. Update your SDK configuration.");
  };
  const handleToggleStatus = () => {
    const next = app.status === "active" ? "paused" : "active";
    updateApp(appId, { status: next, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    toast.info(
      next === "active" ? "Application resumed" : "Application paused",
      next === "active" ? "Your app is now accepting logins and license activations." : "All login attempts will be rejected until you resume the app."
    );
  };
  const handleDelete = () => {
    deleteApp(appId);
    toast.success("Application deleted", `"${app.name}" has been permanently deleted.`);
    navigate("/apps");
  };
  const copySecret = () => {
    navigator.clipboard.writeText(app.secret ?? "");
    setCopied(true);
    toast.success("Copied!", "Secret key copied to clipboard.");
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "App Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted mt-0.5", children: [
        "Manage configuration and settings for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-secondary font-medium", children: app.name }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Section,
      {
        icon: Settings,
        title: "Application Info",
        description: "Update your app's name and version number.",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Application Name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "My Awesome App"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Version",
              value: version,
              onChange: (e) => setVersion(e.target.value),
              placeholder: "1.0.0",
              hint: "Semantic versioning recommended (e.g. 1.2.3)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSaveInfo, disabled: !name.trim() || name === app.name && version === app.version, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
            " Save Changes"
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Section,
      {
        icon: Lock,
        title: "Secret Key",
        description: "Used by the SDK to authenticate API requests from your application.",
        color: "bg-cyan/10 border-cyan/20 text-cyan",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Current Secret Key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border-default bg-bg-secondary/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-xs font-mono text-text-secondary truncate", children: secretVisible ? app.secret ?? "No secret generated" : "•".repeat(32) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSecretVisible((v) => !v),
                  className: "p-1 rounded text-text-muted hover:text-text-primary transition-colors shrink-0",
                  children: secretVisible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: copySecret,
                  className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors shrink-0",
                  children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-emerald" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1.5", children: "Never share this key publicly. Use it in your backend SDK configuration only." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3.5 rounded-xl bg-amber/5 border border-amber/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-amber shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber leading-relaxed", children: "Rotating the secret key will immediately invalidate all existing SDK connections. Update your application before rotating." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setModal("rotate"),
              className: "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber/30 bg-amber/5 text-xs font-medium text-amber hover:bg-amber/10 hover:border-amber/50 transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }),
                " Rotate Secret Key"
              ]
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Section,
      {
        icon: app.status === "active" ? Power : PowerOff,
        title: "Application Status",
        description: "Control whether your application accepts logins and license activations.",
        color: app.status === "active" ? "bg-emerald/10 border-emerald/20 text-emerald-400" : "bg-amber/10 border-amber/20 text-amber",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
                "w-2 h-2 rounded-full",
                app.status === "active" ? "bg-emerald-400" : "bg-amber"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
                "text-sm font-semibold",
                app.status === "active" ? "text-emerald-400" : "text-amber"
              ), children: app.status === "active" ? "Active" : "Paused" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: app.status === "active" ? "The app is running. Users can log in and activate licenses." : "The app is paused. All authentication attempts will be rejected." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleToggleStatus,
              className: clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all",
                app.status === "active" ? "border-amber/30 bg-amber/5 text-amber hover:bg-amber/10 hover:border-amber/50" : "border-emerald/30 bg-emerald/5 text-emerald-400 hover:bg-emerald/10 hover:border-emerald/50"
              ),
              children: app.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "w-3.5 h-3.5" }),
                " Pause App"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "w-3.5 h-3.5" }),
                " Resume App"
              ] })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Section,
      {
        icon: Shield,
        title: "Application Details",
        description: "Read-only information about this application.",
        color: "bg-white/5 border-border-default text-text-muted",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
          { label: "App ID", value: app.id },
          { label: "Owner ID", value: app.ownerId },
          { label: "Total Users", value: String(app.totalUsers) },
          { label: "Active Sessions", value: String(app.activeSessions) },
          { label: "Created", value: new Date(app.createdAt).toLocaleDateString() },
          { label: "Last Updated", value: new Date(app.updatedAt).toLocaleDateString() }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-bg-secondary/30 border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted font-medium uppercase tracking-wider mb-1", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-text-secondary truncate", children: item.value })
        ] }, item.label)) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Section,
      {
        title: "SDK Integration",
        description: "Use your App ID and API endpoint to connect your software.",
        icon: Code2,
        color: "bg-cyan/10 border-cyan/20 text-cyan",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1.5", children: "App ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-xl bg-bg-secondary border border-border-default font-mono text-xs text-text-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: app.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    navigator.clipboard.writeText(app.id);
                  },
                  className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors shrink-0",
                  title: "Copy App ID",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1.5", children: "API Endpoint" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-xl bg-bg-secondary border border-border-default font-mono text-xs text-text-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: "https://api.sirauth.org/v1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    navigator.clipboard.writeText("https://api.sirauth.org/v1");
                  },
                  className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors shrink-0",
                  title: "Copy endpoint",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-3 h-3" }),
              " C++ Quick Start (SDK placeholder)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "px-4 py-3.5 rounded-xl bg-[#0a0a12] border border-border-default text-[11px] text-emerald-400 font-mono overflow-x-auto leading-relaxed", children: `#include "SiraAuth.hpp"

int main() {
    SiraAuth auth("${app.id}");
    auto result = auth.Login(username, password);
    if (result.success) {
        std::cout << "Welcome, " << result.username;
    }
}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1.5", children: "Full SDK documentation will be available when the backend is connected." })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        className: "glass rounded-2xl border border-rose/25 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-rose/15", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/10 border border-rose/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-rose" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-rose", children: "Danger Zone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "Irreversible and destructive actions." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border border-rose/15 bg-rose/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary", children: "Delete this application" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Once deleted, all data (licenses, users, sessions, etc.) will be permanently removed." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setModal("delete"),
                className: "flex items-center gap-2 ml-4 px-4 py-2.5 rounded-xl border border-rose/40 bg-rose/10 text-xs font-medium text-rose hover:bg-rose/15 hover:border-rose/60 transition-all shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  " Delete App"
                ]
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "delete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteModal,
        {
          appName: app.name,
          onClose: () => setModal(null),
          onConfirm: handleDelete
        }
      ),
      modal === "rotate" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RotateSecretModal,
        {
          onClose: () => setModal(null),
          onConfirm: handleRotateSecret
        }
      )
    ] })
  ] });
}
export {
  AppSettings as default
};
