import { w as createLucideIcon, l as useAuthStore, u as useNavigate, r as reactExports, j as jsxRuntimeExports, C as Card, J as User, a4 as Mail, a2 as CheckCircle, t as Shield, a5 as Sparkles, s as formatDistanceToNow } from "./index-Bnbhtkos.js";
import { d as differenceInDays, S as Star, C as Calendar } from "./differenceInDays-B_ENeNAv.js";
import { f as format } from "./format-DQaPZ8iA.js";
import { H as Hash } from "./hash-D9MVFCe1.js";
import { U as Upload } from "./upload-E7X_VYfu.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Camera = createLucideIcon("Camera", [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
]);
const PLAN_COLORS = {
  Free: "bg-text-muted/10 text-text-muted border-text-muted/20",
  Pro: "bg-purple/10 text-purple-light border-purple/30",
  Enterprise: "bg-amber/10 text-amber border-amber/30"
};
function AvatarUploader() {
  const { user, updateProfile } = useAuthStore();
  const [dragging, setDragging] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const processFile = reactExports.useCallback((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result;
      if (base64) updateProfile({ avatar: base64 });
    };
    reader.readAsDataURL(file);
  }, [updateProfile]);
  const onDrop = reactExports.useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };
  const initials = user?.username?.[0]?.toUpperCase() ?? "U";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop,
        onClick: () => inputRef.current?.click(),
        className: `relative w-28 h-28 rounded-full cursor-pointer group transition-all ${dragging ? "ring-4 ring-purple/60 scale-105" : "ring-2 ring-border-accent hover:ring-purple/40"}`,
        children: [
          user?.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: user.avatar,
              alt: "Avatar",
              className: "w-full h-full rounded-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-white text-3xl font-bold", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center gap-1 transition-opacity ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`, children: [
            dragging ? /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-6 h-6 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5 text-white" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white font-medium", children: dragging ? "Drop here" : "Change" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: onFileChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-text-muted text-center", children: [
      "Click or drag & drop an image",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "JPG, PNG, GIF, WebP"
    ] }),
    user?.avatar && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => updateProfile({ avatar: void 0 }),
        className: "text-[11px] text-rose hover:text-rose/80 transition-colors",
        children: "Remove photo"
      }
    )
  ] });
}
function InfoField({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3 border-b border-border-default last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-text-muted" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-text-primary font-mono truncate", children: value })
    ] })
  ] });
}
function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = reactExports.useState(false);
  const copyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const planLabel = user?.plan ?? "Free";
  const planColorClass = PLAN_COLORS[planLabel] ?? PLAN_COLORS.Free;
  const daysRemaining = user?.planExpiry ? differenceInDays(new Date(user.planExpiry), /* @__PURE__ */ new Date()) : null;
  const memberSince = user?.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "Unknown";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Manage your account information and avatar." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "flex items-center justify-center sm:w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarUploader, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex-1", padding: "none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: "Account Info" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { icon: User, label: "Username", value: user?.username ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { icon: Mail, label: "Email", value: user?.email ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-4 h-4 text-text-muted" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mb-0.5", children: "Owner ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-text-primary font-mono truncate", children: user?.id ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: copyId,
                    className: "text-[11px] shrink-0 text-purple-light hover:text-purple transition-colors",
                    children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-3 h-3" }),
                      " Copied"
                    ] }) : "Copy"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { icon: Shield, label: "Role", value: user?.role ?? "admin" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-amber" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: "Current Plan" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "Your active subscription plan." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${planColorClass}`, children: planLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/3 rounded-xl p-3 border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-text-muted mb-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
            " Expires"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary", children: user?.planExpiry ? format(new Date(user.planExpiry), "MMM d, yyyy") : "Never" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/3 rounded-xl p-3 border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mb-1", children: "Time Remaining" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-semibold ${daysRemaining !== null && daysRemaining < 7 ? "text-rose" : "text-emerald"}`, children: daysRemaining === null ? "—" : daysRemaining < 0 ? "Expired" : daysRemaining === 0 ? "Expires today" : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => navigate("/plans"),
          className: "mt-4 w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-purple/30 bg-purple/5 text-xs font-semibold text-purple-light hover:bg-purple/10 hover:border-purple/50 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
            "Upgrade Plan"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary mb-3", children: "Account Stats" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/3 rounded-xl p-3 border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mb-1", children: "Member Since" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary", children: memberSince })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/3 rounded-xl p-3 border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mb-1", children: "Last Updated" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary", children: user?.updatedAt ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true }) : "Never" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Profile as default
};
