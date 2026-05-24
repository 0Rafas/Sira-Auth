import { n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, m as motion, K as Key, q as Clock, d as Search, e as clsx, A as AnimatePresence, G as Globe, s as formatDistanceToNow, X, f as AlertTriangle, t as Shield, v as Info } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { u as useSubStore } from "./sub.store-BORt4PCU.js";
import { B as Badge } from "./Badge-BPQFuK_4.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { S as Select } from "./Select-DZNnueCT.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { D as Download } from "./download-CZh5SlAX.js";
import { C as Check } from "./check-V-0X9BuP.js";
import { C as Copy } from "./copy-C3WXQPHT.js";
import { M as Monitor } from "./monitor-iLMrg7zS.js";
import { f as format } from "./format-DQaPZ8iA.js";
const licensesApi = {
  getAll: async (appId, page = 1, limit = 50) => {
    const res = await api.get(
      `/dashboard/apps/${appId}/licenses`,
      { params: { page, limit } }
    );
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post(
      `/dashboard/apps/${payload.appId}/licenses`,
      payload
    );
    return res.data;
  },
  delete: async (appId, licenseId) => {
    const res = await api.delete(
      `/dashboard/apps/${appId}/licenses/${licenseId}`
    );
    return res.data;
  },
  ban: async (appId, licenseId) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/licenses/${licenseId}/ban`
    );
    return res.data;
  }
};
const TIME_UNITS = ["Hours", "Days", "Weeks", "Months", "Years", "Lifetime"];
const DELETION_MODES = ["All licenses", "Unused licenses", "Used licenses", "Expired licenses", "Banned licenses"];
const DEFAULT_MASK = "*******-*******-*******-*******-*******";
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
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-lg mx-4",
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
      show && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-5 top-0 z-10 w-48 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border-accent text-[11px] text-text-secondary shadow-card", children: tip })
    ] })
  ] });
}
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
function CreateLicenseModal({ onClose, onCreate }) {
  const { id: appId } = useParams();
  const { subscriptions } = useSubStore();
  const subs = subscriptions[appId] || [];
  const [amount, setAmount] = reactExports.useState("1");
  const [mask, setMask] = reactExports.useState(DEFAULT_MASK);
  const [lowercase, setLowercase] = reactExports.useState(false);
  const [uppercase, setUppercase] = reactExports.useState(false);
  const [level, setLevel] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [unit, setUnit] = reactExports.useState("Days");
  const [duration, setDuration] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4 text-purple-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Create a new license" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "License Amount", required: true, tip: "Number of license keys to generate (max 100 at once)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            min: 1,
            max: 100,
            className: inputCls
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "License Mask", required: true, tip: "Pattern for the generated key. * = random character" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: mask, onChange: (e) => setMask(e.target.value), className: inputCls }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setLowercase((v) => !v),
              className: clsx(
                "flex-1 flex items-center justify-center gap-2 h-9 rounded-xl border text-xs font-medium transition-all",
                lowercase ? "border-purple/60 bg-purple/15 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
              ),
              children: [
                lowercase && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                " Lowercase Letters"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setUppercase((v) => !v),
              className: clsx(
                "flex-1 flex items-center justify-center gap-2 h-9 rounded-xl border text-xs font-medium transition-all",
                uppercase ? "border-purple/60 bg-purple/15 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
              ),
              children: [
                uppercase && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                " Uppercase Letters"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Access Tier", required: true, tip: "User subscription level assigned with this license" }),
        subs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3.5 py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No subscription tiers created yet. Users will be given level 1 by default." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: subs.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setLevel(String(sub.level)),
            className: clsx(
              "flex flex-col items-start p-3 gap-1 rounded-xl border transition-all text-left relative overflow-hidden",
              level === String(sub.level) ? "border-purple/60 bg-purple/15 ring-1 ring-purple/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "border-border-default bg-bg-card hover:border-border-accent"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: clsx("w-3.5 h-3.5", level === String(sub.level) ? "text-purple-light" : "text-text-muted") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("text-sm font-semibold truncate", level === String(sub.level) ? "text-purple-light" : "text-text-primary"), children: sub.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-text-muted z-10 truncate w-full", children: [
                "Level ",
                sub.level,
                " • ",
                sub.duration,
                " Days"
              ] }),
              level === String(sub.level) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple/20 to-transparent pointer-events-none" })
            ]
          },
          sub.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "License Note", tip: "Optional internal note for this license batch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: note,
            onChange: (e) => setNote(e.target.value),
            rows: 2,
            placeholder: "Optional note...",
            className: "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Expiry Unit", required: true, tip: "Unit of time for license expiration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              value: unit,
              onChange: setUnit,
              options: TIME_UNITS.map((u) => ({ value: u, label: u }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FieldLabel,
            {
              label: "Expiry Duration",
              required: unit !== "Lifetime",
              tip: "How long until the license expires (0 = immediate, leave blank for lifetime)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: duration,
              onChange: (e) => setDuration(e.target.value),
              placeholder: unit === "Lifetime" ? "∞" : "30",
              disabled: unit === "Lifetime",
              className: clsx(inputCls, unit === "Lifetime" && "opacity-50 cursor-not-allowed")
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          disabled: !level,
          onClick: () => {
            onCreate({ amount: parseInt(amount) || 1, mask, level: parseInt(level), note, unit, duration });
            onClose();
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4" }),
            " Create License"
          ]
        }
      )
    ] })
  ] });
}
function ExtendModal({ count, onClose, onConfirm }) {
  const [unit, setUnit] = reactExports.useState("Days");
  const [duration, setDuration] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-cyan/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-cyan" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Extend Unused License(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 rounded-xl bg-cyan/5 border border-cyan/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cyan", children: [
        count,
        " license",
        count !== 1 ? "s" : "",
        " selected"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Unit of time to add", required: true, tip: "Time unit to extend unused licenses by" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: unit,
            onChange: setUnit,
            options: TIME_UNITS.filter((u) => u !== "Lifetime").map((u) => ({ value: u, label: u }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Duration of time to add", required: true, tip: "How much time to add to unused licenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: duration,
            onChange: (e) => setDuration(e.target.value),
            placeholder: "e.g. 30",
            className: inputCls
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "primary", disabled: !duration || unit === "Lifetime", onClick: () => {
        onConfirm(unit, duration);
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
        " Extend License(s)"
      ] })
    ] })
  ] });
}
function DeleteModal({ count, onClose, onConfirm }) {
  const [mode, setMode] = reactExports.useState("");
  const [withUser, setWithUser] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete License(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 rounded-xl bg-rose/5 border border-rose/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-rose", children: [
        count,
        " license",
        count !== 1 ? "s" : "",
        " selected for deletion"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: "Deletion Mode", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: mode,
            onChange: setMode,
            placeholder: "Select option",
            options: DELETION_MODES.map((m) => ({ value: m, label: m }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2.5 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: withUser,
            onChange: (e) => setWithUser(e.target.checked),
            className: "w-4 h-4 rounded accent-rose cursor-pointer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-secondary", children: "Delete associated user too (if applicable)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-rose/8 border border-rose/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-rose shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose", children: "This action cannot be undone. Please confirm your selection." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", disabled: !mode, onClick: () => {
        onConfirm(mode, withUser);
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
        " Delete License(s)"
      ] })
    ] })
  ] });
}
function ExportDropdown({ licenses }) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(licenses, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "licenses.json";
    a.click();
    setOpen(false);
  };
  const exportCSV = () => {
    const header = "Key,Status,User,Level,ExpiresAt,CreatedAt";
    const rows = licenses.map(
      (l) => `${l.key},${l.status},${l.username ?? ""},${l.level},${l.expiresAt ?? ""},${l.createdAt}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "licenses.csv";
    a.click();
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToolBtn,
      {
        icon: Download,
        label: "Export Licenses",
        color: "bg-purple-dark/30 border-border-default text-purple-light hover:border-purple/40 hover:bg-purple-dark/50",
        onClick: () => setOpen((v) => !v),
        active: open
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -6, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, scale: 0.97 },
        transition: { duration: 0.15 },
        className: "absolute right-0 top-full mt-1.5 w-40 glass rounded-xl border border-border-accent shadow-card overflow-hidden z-30",
        children: [
          { label: "Export JSON", fn: exportJSON },
          { label: "Export CSV", fn: exportCSV }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: item.fn,
            className: "w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors",
            children: item.label
          },
          item.label
        ))
      }
    ) })
  ] });
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
function LicenseRow({ license, selected, onToggle, onDelete }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copyKey = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(license.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const statusVariant = {
    active: "active",
    expired: "expired",
    banned: "banned",
    unused: "inactive"
  };
  const linkedUser = license.username ? DEMO_USERS.find((u) => u.username === license.username) : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      onClick: onToggle,
      className: clsx(
        "border-b border-border-default last:border-0 hover:bg-white/4 transition-colors cursor-pointer select-none",
        selected && "bg-purple/5"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 w-8", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: selected,
            onChange: onToggle,
            className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-text-primary", children: license.key }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: copyKey, className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors", children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-emerald" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: statusVariant[license.status], dot: true, children: license.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-secondary", children: license.username ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: linkedUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 text-text-muted shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-text-secondary", children: linkedUser.ip ?? "—" }),
          linkedUser.hwid && /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "w-3 h-3 text-text-muted shrink-0", title: `HWID: ${linkedUser.hwid}` })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-muted", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: license.expiresAt ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: format(new Date(license.expiresAt), "PPP"), children: formatDistanceToNow(new Date(license.expiresAt), { addSuffix: true }) }) : license.duration === -1 ? "Lifetime" : `${license.duration}d` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs text-text-muted", children: [
          "Level ",
          license.level
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: formatDistanceToNow(new Date(license.createdAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onDelete,
            className: "p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/5 transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
          }
        ) })
      ]
    }
  );
}
const ITEMS_PER_PAGE = 25;
function Licenses() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [page, setPage] = reactExports.useState(1);
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [modal, setModal] = reactExports.useState(null);
  const { data: licData, isLoading } = useQuery({
    queryKey: ["licenses", appId],
    queryFn: () => licensesApi.getAll(appId, 1, 200),
    enabled: !isDemoMode && !!appId
  });
  const licenses = isDemoMode ? [] : licData?.data ?? [];
  const createMutation = useMutation({
    mutationFn: (payload) => licensesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["licenses", appId] });
      setModal(null);
      setPage(1);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (licenseId) => licensesApi.delete(appId, licenseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["licenses", appId] })
  });
  useMutation({
    mutationFn: (licenseId) => licensesApi.ban(appId, licenseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["licenses", appId] })
  });
  const filtered = reactExports.useMemo(() => licenses.filter((l) => {
    const matchSearch = l.key.toLowerCase().includes(search.toLowerCase()) || l.username?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  }), [licenses, search, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(/* @__PURE__ */ new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  };
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const handleCreate = ({ amount, level, note, unit, duration }) => {
    const durationDays = unit === "Lifetime" ? -1 : unit === "Hours" ? Math.ceil(parseInt(duration) / 24) : unit === "Days" ? parseInt(duration) : unit === "Weeks" ? parseInt(duration) * 7 : unit === "Months" ? parseInt(duration) * 30 : unit === "Years" ? parseInt(duration) * 365 : 30;
    createMutation.mutate({
      appId,
      amount: Math.min(amount, 100),
      level: level || 1,
      duration: durationDays === -1 ? void 0 : durationDays,
      maxUses: 1,
      note: note || void 0
    });
  };
  const handleExtend = (_unit, _duration) => {
  };
  const handleDelete = (_mode) => {
    const targetIds = selected.size > 0 ? selected : new Set(licenses.map((l) => l.id));
    targetIds.forEach((id) => deleteMutation.mutate(id));
    setSelected(/* @__PURE__ */ new Set());
    setPage(1);
  };
  const handleDeleteOne = (id) => {
    deleteMutation.mutate(id);
    setSelected((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Licenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Licenses allow your users to register on your application." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setModal("create"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Create License"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search licenses...",
            className: "h-9 w-56 pl-3 pr-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ) }),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, className: "w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: statusFilter,
            onChange: (v) => setStatusFilter(v),
            options: [
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "expired", label: "Expired" },
              { value: "banned", label: "Banned" },
              { value: "unused", label: "Unused" }
            ],
            size: "sm"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: Filter,
            label: "Filter",
            color: "bg-white/5 border-border-default text-text-muted hover:text-text-primary hover:bg-white/10",
            onClick: () => setShowFilter((v) => !v),
            active: showFilter
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: Key,
            label: "Generate License",
            color: "bg-emerald/10 border-border-default text-emerald-400 hover:border-emerald/40",
            onClick: () => setModal("create")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: Clock,
            label: "Extend Unused",
            color: "bg-cyan/10 border-border-default text-cyan-400 hover:border-cyan/40",
            onClick: () => setModal("extend")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExportDropdown, { licenses: filtered }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToolBtn,
          {
            icon: Trash2,
            label: "Delete License(s)",
            color: "bg-rose/10 border-border-default text-rose hover:border-rose/40",
            onClick: () => setModal("delete")
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
      paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: search ? Search : Key,
          title: "No licenses found",
          description: search ? `No results for "${search}"` : "Get started by creating your first license.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8" }),
          ["License Key", "Status", "User", "IP / HWID", "Expires", "Level", "Created", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: paginated.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          LicenseRow,
          {
            license: l,
            selected: selected.has(l.id),
            onToggle: () => toggleOne(l.id),
            onDelete: () => handleDeleteOne(l.id)
          },
          l.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border-default", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
          filtered.length,
          " license",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage(p),
              className: clsx(
                "w-7 h-7 rounded-lg text-xs transition-colors",
                p === page ? "bg-purple text-white" : "text-text-muted hover:text-text-primary hover:bg-white/5"
              ),
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CreateLicenseModal,
        {
          onClose: () => setModal(null),
          onCreate: handleCreate
        }
      ),
      modal === "extend" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ExtendModal,
        {
          count: selected.size,
          onClose: () => setModal(null),
          onConfirm: handleExtend
        }
      ),
      modal === "delete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteModal,
        {
          count: selected.size,
          onClose: () => setModal(null),
          onConfirm: (mode) => handleDelete()
        }
      )
    ] })
  ] });
}
export {
  Licenses as default
};
