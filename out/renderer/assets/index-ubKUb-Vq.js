import { w as createLucideIcon, n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, m as motion, q as Clock, M as Minus, d as Search, U as Users$1, e as clsx, A as AnimatePresence, B as Button, s as formatDistanceToNow, X, f as AlertTriangle, t as Shield, P as Plus, v as Info } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { u as useSubStore } from "./sub.store-BORt4PCU.js";
import { B as Badge } from "./Badge-BPQFuK_4.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { S as Select } from "./Select-DZNnueCT.js";
import { S as SearchBar } from "./SearchBar-POxbfUeO.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { R as RefreshCcw, B as Ban } from "./refresh-ccw-B-0zOUte.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { D as Download } from "./download-CZh5SlAX.js";
import { F as FileText } from "./file-text-BcgJvZIP.js";
import { M as Monitor } from "./monitor-iLMrg7zS.js";
import { R as RotateCcw } from "./rotate-ccw-DBxUozMm.js";
import "./check-V-0X9BuP.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileJson = createLucideIcon("FileJson", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutGrid = createLucideIcon("LayoutGrid", [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserPlus = createLucideIcon("UserPlus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);
const usersApi = {
  getAll: async (appId, page = 1, limit = 50) => {
    const res = await api.get(
      `/dashboard/apps/${appId}/users`,
      { params: { page, limit } }
    );
    return res.data;
  },
  ban: async (appId, userId, reason) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/users/${userId}/ban`,
      { reason }
    );
    return res.data;
  },
  resetHwid: async (appId, userId) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/users/${userId}/reset-hwid`
    );
    return res.data;
  },
  delete: async (appId, userId) => {
    const res = await api.delete(
      `/dashboard/apps/${appId}/users/${userId}`
    );
    return res.data;
  }
};
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
const TIME_UNITS = ["Hours", "Days", "Weeks", "Months", "Years", "Lifetime"];
function ModalWrap({ children, onClose }) {
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
function FieldLabel({ label, required, tip }) {
  const [show, setShow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-text-secondary", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose ml-0.5", children: "*" })
    ] }),
    tip && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Info,
        {
          className: "w-3.5 h-3.5 text-text-muted hover:text-cyan cursor-pointer transition-colors",
          onMouseEnter: () => setShow(true),
          onMouseLeave: () => setShow(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: show && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 2 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 2 },
          className: "absolute left-5 top-0 z-10 w-48 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border-accent text-[11px] text-text-secondary shadow-card",
          children: tip
        }
      ) })
    ] })
  ] });
}
function CreateUserModal({ onClose, onCreate }) {
  const { id: appId } = useParams();
  const { subscriptions } = useSubStore();
  const subs = subscriptions[appId] || [];
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [subId, setSubId] = reactExports.useState("");
  const [expiryPath, setExpiryPath] = reactExports.useState("");
  const [hwidAffected, setHwidAffected] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4 text-emerald-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Create User" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Username", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: inputCls, placeholder: "e.g. JohnDoe" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Password", required: true, tip: "Generate and store secure passwords safely" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: inputCls, placeholder: "••••••••" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: inputCls, placeholder: "johndoe@example.com" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Subscription Tier", required: true, tip: "User subscription level assigned." }),
        subs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3.5 py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No subscription tiers created yet. Users will be given default access." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: subs.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSubId(sub.id),
            className: clsx(
              "flex flex-col items-start p-3 gap-1 rounded-xl border transition-all text-left relative overflow-hidden",
              subId === sub.id ? "border-emerald/60 bg-emerald/10 ring-1 ring-emerald/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "border-border-default bg-bg-card hover:border-border-accent"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: clsx("w-3.5 h-3.5", subId === sub.id ? "text-emerald-400" : "text-text-muted") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("text-sm font-semibold truncate", subId === sub.id ? "text-emerald-400" : "text-text-primary"), children: sub.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-text-muted z-10 truncate w-full", children: [
                "Level ",
                sub.level,
                " • ",
                sub.duration,
                " Days"
              ] }),
              subId === sub.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-emerald/10 to-transparent pointer-events-none" })
            ]
          },
          sub.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Expiration", required: true, tip: "When does their subscription logic expire?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: expiryPath, onChange: (e) => setExpiryPath(e.target.value), className: inputCls })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2.5 mt-1 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: hwidAffected,
            onChange: (e) => setHwidAffected(e.target.checked),
            className: "w-4 h-4 rounded accent-emerald cursor-pointer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-secondary", children: "HWID Affected (Restricts logins to device)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !username || !password || !subId && subs.length > 0 || !expiryPath, onClick: () => {
        onCreate({ username, password, email, subId, expiryPath, hwidAffected });
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
        " Create User"
      ] })
    ] })
  ] });
}
function TimeModifierModal({ action, count, onClose, onConfirm }) {
  const { id: appId } = useParams();
  const { subscriptions } = useSubStore();
  const subs = subscriptions[appId] || [];
  const [subId, setSubId] = reactExports.useState(subs[0]?.id || "");
  const [unit, setUnit] = reactExports.useState("Days");
  const [duration, setDuration] = reactExports.useState("1");
  const isAdd = action === "add";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(`w-8 h-8 rounded-lg flex items-center justify-center`, isAdd ? "bg-amber-400/15 text-amber-400" : "bg-cyan/15 text-cyan"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: isAdd ? "Add Time to User(s)" : "Subtract Time from User(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("px-3 py-2 rounded-xl border", isAdd ? "bg-amber-400/5 border-amber-400/20" : "bg-cyan/5 border-cyan/20"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: clsx("text-xs", isAdd ? "text-amber-400" : "text-cyan"), children: [
        "Applying to ",
        count,
        " selected user",
        count !== 1 ? "s" : ""
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("px-3 py-2 rounded-xl border", isAdd ? "bg-amber-400/5 border-amber-400/20" : "bg-cyan/5 border-cyan/20"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: clsx("text-xs", isAdd ? "text-amber-400" : "text-cyan"), children: "Applying to all registered users in app" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Subscription", required: true, tip: "Which subscription pool to modify" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: subId,
            onChange: setSubId,
            options: subs.map((s) => ({ value: s.id, label: s.name })),
            placeholder: "Select subscription"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Expiry Unit", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { value: unit, onChange: setUnit, options: TIME_UNITS.filter((u) => u !== "Lifetime").map((u) => ({ value: u, label: u })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: `Duration to ${action}`, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: duration, onChange: (e) => setDuration(e.target.value), className: inputCls, placeholder: "e.g. 5", min: "1" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !duration || !subId, onClick: () => {
        onConfirm(subId, unit, duration);
        onClose();
      }, className: clsx(isAdd ? "bg-amber-500 hover:bg-amber-600" : "bg-cyan hover:bg-cyan-600", "text-white border-none"), children: [
        isAdd ? /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" }),
        isAdd ? "Add Time" : "Subtract Time"
      ] })
    ] })
  ] });
}
function ResetHwidModal({ count, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-4 h-4 text-orange-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Reset HWIDs" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary", children: [
        "Are you sure you want to reset Hardware IDs for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-text-primary", children: count }),
        " selected user(s)?"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary", children: [
        "Are you sure you want to completely wipe and reset Hardware IDs for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-text-primary", children: "ALL" }),
        " users in this app?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-orange-500 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-500", children: "Users will bind to whichever completely new device they log in with next." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        onConfirm();
        onClose();
      }, className: "bg-orange-500 hover:bg-orange-600 text-white border-none", children: "Reset HWID(s)" })
    ] })
  ] });
}
function ExportDropdown({ users }) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const exportData = (format) => {
    let payload = "";
    let mime = "application/json";
    if (format === "json") {
      payload = JSON.stringify(users, null, 2);
    } else {
      mime = "text/csv";
      const header = "ID,Username,Email,Status,HWID,CreatedAt";
      const rows = users.map((u) => `${u.id},${u.username},${u.email || ""},${u.status},${u.hwid || ""},${u.createdAt}`);
      payload = [header, ...rows].join("\n");
    }
    const blob = new Blob([payload], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export.${format}`;
    a.click();
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: Download, color: "bg-purple-dark/30 border-border-default text-purple-light hover:border-purple/40 hover:bg-purple-dark/50", onClick: () => setOpen((v) => !v), active: open }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -6, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, scale: 0.97 },
        transition: { duration: 0.15 },
        className: "absolute right-0 top-full mt-1.5 w-40 bg-bg-secondary rounded-xl border border-border-accent shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-30",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => exportData("json"), className: "w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { className: "w-3.5 h-3.5" }),
            " JSON Format"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => exportData("csv"), className: "w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5" }),
            " CSV Format"
          ] })
        ]
      }
    ) })
  ] });
}
function ToolBtn({ icon: Icon, color, onClick, active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      className: clsx("w-9 h-9 flex items-center justify-center rounded-xl border transition-all", color, active && "ring-1"),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
    }
  );
}
function UserRow({ user, selected, onToggle, onToggleBan, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, x: 20 },
      onClick: onToggle,
      className: `border-b border-border-default last:border-0 hover:bg-white/4 transition-colors cursor-pointer select-none ${selected ? "bg-purple/5" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 w-8", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selected, onChange: onToggle, className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center text-xs font-bold text-purple-light shrink-0", children: user.username.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-text-primary", children: user.username }),
            user.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted", children: user.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: user.status === "active" ? "active" : "banned", dot: true, children: user.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-secondary font-mono", children: user.ip ?? "—" }),
          user.hwid && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-text-muted", title: `HWID: ${user.hwid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "w-3 h-3" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted whitespace-nowrap", children: user.subscriptionExpiry ? formatDistanceToNow(new Date(user.subscriptionExpiry), { addSuffix: true }) : "Lifetime" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted whitespace-nowrap", children: user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : "Never" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted whitespace-nowrap", children: formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
          user.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onToggleBan, title: "Ban user", className: "p-1.5 rounded-lg text-text-muted hover:text-amber-400 hover:bg-amber-400/10 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3.5 h-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onToggleBan, title: "Unban user", className: "p-1.5 rounded-lg text-text-muted hover:text-emerald-400 hover:bg-emerald/10 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, title: "Delete user", className: "p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
        ] }) })
      ]
    }
  );
}
const USERS_PER_PAGE = 20;
function Users() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const [viewMode, setViewMode] = reactExports.useState("table");
  const [modal, setModal] = reactExports.useState(null);
  const { data: usersData } = useQuery({
    queryKey: ["users", appId],
    queryFn: () => usersApi.getAll(appId, 1, 200),
    enabled: !isDemoMode && !!appId
  });
  const localUsers = isDemoMode ? [] : usersData?.data ?? [];
  const banMutation = useMutation({
    mutationFn: ({ id, reason }) => usersApi.ban(appId, id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users", appId] })
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.delete(appId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users", appId] })
  });
  const resetHwidMutation = useMutation({
    mutationFn: (id) => usersApi.resetHwid(appId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users", appId] })
  });
  const filtered = reactExports.useMemo(() => localUsers.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.hwid?.includes(search) || u.ip?.includes(search);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  }), [localUsers, search, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);
  const toggleAll = () => {
    if (selected.size === paginated.length && paginated.length > 0) setSelected(/* @__PURE__ */ new Set());
    else setSelected(new Set(paginated.map((u) => u.id)));
  };
  const toggleOne = reactExports.useCallback((id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }, []);
  const handleCreateUser = (_data) => {
  };
  const handleToggleBan = reactExports.useCallback((id) => {
    const user = localUsers.find((u) => u.id === id);
    if (user?.status === "active") {
      banMutation.mutate({ id });
    }
  }, [localUsers, banMutation]);
  const handleDeleteUser = reactExports.useCallback((id) => {
    deleteMutation.mutate(id);
    setSelected((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  }, [deleteMutation]);
  const handleDeleteSelected = () => {
    selected.forEach((id) => deleteMutation.mutate(id));
    setSelected(/* @__PURE__ */ new Set());
    setPage(1);
  };
  const handleAddTime = (_subId, _unit, _val) => {
  };
  const handleSubtractTime = (_subId, _unit, _val) => {
  };
  const handleResetHwid = () => {
    const targetIds = selected.size > 0 ? selected : new Set(localUsers.map((u) => u.id));
    targetIds.forEach((id) => resetHwidMutation.mutate(id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Users" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Manage and organize end-users accessing your applications." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { value: search, onChange: setSearch, placeholder: "Search users by name, email, IP...", className: "w-64" }),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: statusFilter,
            onChange: (v) => setStatusFilter(v),
            options: [{ value: "all", label: "All Statuses" }, { value: "active", label: "Active" }, { value: "banned", label: "Banned" }],
            size: "sm"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: Filter, color: "bg-white/5 border-border-default text-text-muted hover:text-text-primary hover:bg-white/10", active: showFilter, onClick: () => setShowFilter((v) => !v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: LayoutGrid,
            label: viewMode === "table" ? "Card View" : "Table View",
            color: viewMode === "card" ? "bg-teal-500/20 border-teal-400/40 text-teal-300 ring-1 ring-teal-400/20" : "bg-teal-500/10 border-border-default text-teal-400 hover:border-teal-400/40",
            active: viewMode === "card",
            onClick: () => setViewMode((v) => v === "table" ? "card" : "table")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-border-default mx-1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: UserPlus, color: "bg-emerald/10 border-border-default text-emerald-400 hover:border-emerald/40", onClick: () => setModal("create") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: Clock, color: "bg-amber-400/10 border-border-default text-amber-400 hover:border-amber-400/40", onClick: () => setModal("addTime") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: Minus, color: "bg-cyan/10 border-border-default text-cyan-400 hover:border-cyan/40", onClick: () => setModal("subTime") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-border-default mx-1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: RefreshCcw, color: "bg-orange-500/10 border-border-default text-orange-500 hover:border-orange-500/40", onClick: () => setModal("resetHwid") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExportDropdown, { users: filtered }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolBtn, { icon: Trash2, color: "bg-rose/10 border-border-default text-rose hover:border-rose/40", onClick: () => selected.size > 0 && setModal("delete") })
      ] })
    ] }),
    viewMode === "card" && (filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl border border-border-default py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: search ? Search : Users$1, title: "No users found", description: search ? "No users match your filters." : "Get started by creating your first user." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: paginated.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        onClick: () => toggleOne(u.id),
        className: clsx(
          "glass rounded-2xl border p-4 cursor-pointer transition-all hover:border-border-accent select-none",
          selected.has(u.id) ? "border-purple/50 bg-purple/5" : "border-border-default"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
              u.status === "banned" ? "bg-rose/60" : "bg-gradient-to-br from-purple to-cyan"
            ), children: u.username[0].toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary truncate", children: u.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted truncate", children: u.email ?? "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: selected.has(u.id),
                onChange: () => toggleOne(u.id),
                onClick: (e) => e.stopPropagation(),
                className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer ml-auto shrink-0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("px-2 py-0.5 rounded-full border", u.status === "active" ? "bg-emerald/10 border-emerald/30 text-emerald-400" : "bg-rose/10 border-rose/30 text-rose"), children: u.status }),
            u.ip && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-white/5 border border-border-default text-text-muted font-mono", children: u.ip })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleToggleBan(u.id);
                },
                className: "flex-1 h-7 rounded-lg border border-border-default text-[10px] text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors",
                children: u.status === "banned" ? "Unban" : "Ban"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleDeleteUser(u.id);
                },
                className: "h-7 w-7 rounded-lg border border-rose/20 text-rose hover:bg-rose/5 transition-colors flex items-center justify-center",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
              }
            )
          ] })
        ]
      },
      u.id
    )) })),
    viewMode === "table" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl border border-border-default overflow-hidden", children: [
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: search ? Search : Users$1,
          title: "No users found",
          description: search ? "No users match your filters." : "Get started by creating your first user.",
          className: "py-24"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-bg-secondary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: paginated.length > 0 && selected.size === paginated.length,
              onChange: toggleAll,
              className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer"
            }
          ) }),
          ["User", "Status", "IP / HWID", "Expiry", "Last Login", "Joined", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: clsx("px-4 py-3 text-[11px] font-semibold text-text-muted tracking-wider uppercase", h === "" ? "text-right" : "text-left"), children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: paginated.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserRow,
          {
            user: u,
            selected: selected.has(u.id),
            onToggle: () => toggleOne(u.id),
            onToggleBan: () => handleToggleBan(u.id),
            onDelete: () => handleDeleteUser(u.id)
          },
          u.id
        )) }) })
      ] }) }),
      filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border-default bg-bg-secondary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-muted", children: selected.size > 0 ? `${selected.size} selected` : `Showing ${Math.min((page - 1) * USERS_PER_PAGE + 1, filtered.length)}–${Math.min(page * USERS_PER_PAGE, filtered.length)} of ${filtered.length}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page === 1,
              className: "px-3 py-1.5 text-xs font-medium rounded-lg border border-border-default text-text-secondary hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
            page,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
              disabled: page === totalPages,
              className: "px-3 py-1.5 text-xs font-medium rounded-lg border border-border-default text-text-secondary hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
              children: "Next"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateUserModal, { onClose: () => setModal(null), onCreate: handleCreateUser }),
      modal === "addTime" && /* @__PURE__ */ jsxRuntimeExports.jsx(TimeModifierModal, { action: "add", count: selected.size, onClose: () => setModal(null), onConfirm: handleAddTime }),
      modal === "subTime" && /* @__PURE__ */ jsxRuntimeExports.jsx(TimeModifierModal, { action: "subtract", count: selected.size, onClose: () => setModal(null), onConfirm: handleSubtractTime }),
      modal === "resetHwid" && /* @__PURE__ */ jsxRuntimeExports.jsx(ResetHwidModal, { count: selected.size, onClose: () => setModal(null), onConfirm: handleResetHwid }),
      modal === "delete" && selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black/65 backdrop-blur-sm", onClick: () => setModal(null) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-sm mx-4 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-text-primary mb-2", children: [
            "Delete ",
            selected.size,
            " user",
            selected.size !== 1 ? "s" : "",
            "?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mb-5", children: "This action cannot be undone." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setModal(null), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "danger", size: "sm", onClick: () => {
              handleDeleteSelected();
              setModal(null);
            }, children: "Delete" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Users as default
};
