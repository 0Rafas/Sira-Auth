import { w as createLucideIcon, l as useAuthStore, r as reactExports, j as jsxRuntimeExports, C as Card, J as User, B as Button, f as AlertTriangle, m as motion, a2 as CheckCircle } from "./index-Bnbhtkos.js";
import { S as Save } from "./save-BoMEC2Mm.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Palette = createLucideIcon("Palette", [
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", key: "1xcu5" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", key: "736e4u" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", key: "clrty" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", key: "1s4xz9" }],
  [
    "path",
    {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
      key: "12rzf8"
    }
  ]
]);
function SaveBadge({ visible }) {
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.span,
    {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0 },
      className: "flex items-center gap-1 text-xs text-emerald",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-3.5 h-3.5" }),
        " Saved"
      ]
    }
  );
}
function SettingRow({
  label,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-border-default last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:w-48 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-text-primary", children: label }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mt-0.5", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children })
  ] });
}
function UserSettings() {
  const { user, updateProfile, logout } = useAuthStore();
  const [username, setUsername] = reactExports.useState(user?.username ?? "");
  const [email, setEmail] = reactExports.useState(user?.email ?? "");
  const [savedUsername, setSavedUsername] = reactExports.useState(false);
  const [savedEmail, setSavedEmail] = reactExports.useState(false);
  const [confirmReset, setConfirmReset] = reactExports.useState(false);
  const saveUsername = () => {
    if (!username.trim()) return;
    updateProfile({ username: username.trim() });
    setSavedUsername(true);
    setTimeout(() => setSavedUsername(false), 2e3);
  };
  const saveEmail = () => {
    if (!email.trim()) return;
    updateProfile({ email: email.trim() });
    setSavedEmail(true);
    setTimeout(() => setSavedEmail(false), 2e3);
  };
  const resetAllData = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Manage your personal preferences and account data." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border-default flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-text-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: "Profile" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Display Name", description: "Visible in the header and menus.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: username,
              onChange: (e) => setUsername(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && saveUsername(),
              placeholder: "Your display name",
              className: "flex-1 bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", onClick: saveUsername, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
            " Save"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SaveBadge, { visible: savedUsername })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Email", description: "Used for notifications and login.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: email,
              onChange: (e) => setEmail(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && saveEmail(),
              type: "email",
              placeholder: "your@email.com",
              className: "flex-1 bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", onClick: saveEmail, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
            " Save"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SaveBadge, { visible: savedEmail })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border-default flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-4 h-4 text-text-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: "Appearance" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Theme", description: "Light / dark mode and accent color.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        ["Dark", "Light", "System"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: t !== "Dark",
            className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${t === "Dark" ? "bg-purple/15 border-purple/40 text-purple-light" : "border-border-default text-text-muted opacity-40 cursor-not-allowed"}`,
            children: t
          },
          t
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-text-muted ml-1", children: "More themes coming soon" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", className: "border-rose/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-rose/10 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-rose" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-rose", children: "Danger Zone" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-text-primary", children: "Reset All Local Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Clears all saved settings, apps, and session data from this device. This cannot be undone." })
        ] }),
        !confirmReset ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "danger", size: "sm", onClick: () => setConfirmReset(true), children: "Reset Data" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-rose font-medium", children: "Are you sure?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "danger", size: "sm", onClick: resetAllData, children: "Yes, Reset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setConfirmReset(false), children: "Cancel" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  UserSettings as default
};
