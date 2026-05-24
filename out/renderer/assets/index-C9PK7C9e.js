import { D as create, F as persist, n as api, o as useParams, l as useAuthStore, a as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, m as motion, W as Webhook, d as Search, A as AnimatePresence, Z as Zap, e as clsx, s as formatDistanceToNow, X, f as AlertTriangle } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { B as Badge } from "./Badge-BPQFuK_4.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { C as Check } from "./check-V-0X9BuP.js";
import { C as Copy } from "./copy-C3WXQPHT.js";
import { P as Pencil } from "./pencil-BK1B2uTj.js";
import { T as ToggleRight, a as ToggleLeft } from "./toggle-right-DOilWeud.js";
const useWebhookStore = create()(
  persist(
    (set, get) => ({
      webhooks: {},
      addWebhook: (appId, webhook) => set({
        webhooks: {
          ...get().webhooks,
          [appId]: [...get().webhooks[appId] ?? [], webhook]
        }
      }),
      updateWebhook: (appId, id, patch) => set({
        webhooks: {
          ...get().webhooks,
          [appId]: (get().webhooks[appId] ?? []).map(
            (w) => w.id === id ? { ...w, ...patch } : w
          )
        }
      }),
      deleteWebhook: (appId, id) => set({
        webhooks: {
          ...get().webhooks,
          [appId]: (get().webhooks[appId] ?? []).filter((w) => w.id !== id)
        }
      }),
      deleteSelected: (appId, ids) => set({
        webhooks: {
          ...get().webhooks,
          [appId]: (get().webhooks[appId] ?? []).filter((w) => !ids.includes(w.id))
        }
      }),
      toggleStatus: (appId, id) => set({
        webhooks: {
          ...get().webhooks,
          [appId]: (get().webhooks[appId] ?? []).map(
            (w) => w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w
          )
        }
      })
    }),
    { name: "sira_webhook_store", partialize: (s) => ({ webhooks: s.webhooks }) }
  )
);
const webhooksApi = {
  getAll: async (appId) => {
    const res = await api.get(`/dashboard/apps/${appId}/webhooks`);
    return res.data;
  },
  create: async (appId, payload) => {
    const res = await api.post(`/dashboard/apps/${appId}/webhooks`, payload);
    return res.data;
  },
  update: async (appId, webhookId, payload) => {
    const res = await api.put(
      `/dashboard/apps/${appId}/webhooks/${webhookId}`,
      payload
    );
    return res.data;
  },
  delete: async (appId, webhookId) => {
    const res = await api.delete(`/dashboard/apps/${appId}/webhooks/${webhookId}`);
    return res.data;
  },
  test: async (appId, webhookId) => {
    const res = await api.post(
      `/dashboard/apps/${appId}/webhooks/${webhookId}/test`
    );
    return res.data;
  }
};
const WEBHOOK_EVENTS = [
  { value: "user.login", label: "User Login" },
  { value: "user.register", label: "User Register" },
  { value: "user.ban", label: "User Banned" },
  { value: "user.unban", label: "User Unbanned" },
  { value: "license.activate", label: "License Activated" },
  { value: "license.expire", label: "License Expired" },
  { value: "license.ban", label: "License Banned" },
  { value: "session.start", label: "Session Started" },
  { value: "session.end", label: "Session Ended" },
  { value: "app.pause", label: "App Paused" },
  { value: "app.resume", label: "App Resumed" },
  { value: "variable.update", label: "Variable Updated" }
];
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
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-lg mx-4",
        onClick: (e) => e.stopPropagation(),
        children
      }
    )
  ] });
}
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
function CreateWebhookModal({ appId, onClose, onSave }) {
  const [url, setUrl] = reactExports.useState("");
  const [secret, setSecret] = reactExports.useState("");
  const [selectedEvents, setSelectedEvents] = reactExports.useState([]);
  const toggle = (val) => setSelectedEvents((prev) => prev.includes(val) ? prev.filter((e) => e !== val) : [...prev, val]);
  const valid = url.trim().startsWith("http") && selectedEvents.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "w-4 h-4 text-purple-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Create Webhook" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Endpoint URL ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "url",
            value: url,
            onChange: (e) => setUrl(e.target.value),
            placeholder: "https://example.com/webhook",
            className: inputCls,
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1", children: "Must be a valid HTTPS URL that accepts POST requests." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Secret (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: secret,
            onChange: (e) => setSecret(e.target.value),
            placeholder: "Used to sign the payload (HMAC-SHA256)",
            className: inputCls
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-2 block", children: [
          "Events to listen ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: WEBHOOK_EVENTS.map((ev) => {
          const checked = selectedEvents.includes(ev.value);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggle(ev.value),
              className: clsx(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-all",
                checked ? "border-purple/60 bg-purple/10 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
                  "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                  checked ? "bg-purple border-purple" : "border-border-default"
                ), children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5 text-white" }) }),
                ev.label
              ]
            },
            ev.value
          );
        }) }),
        selectedEvents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1.5", children: "Select at least one event." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !valid, onClick: () => {
        onSave({
          id: randomId(),
          appId,
          url: url.trim(),
          events: selectedEvents,
          secret: secret.trim() || void 0,
          status: "active",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "w-4 h-4" }),
        " Create Webhook"
      ] })
    ] })
  ] });
}
function EditWebhookModal({ appId, webhook, onClose, onSave }) {
  const [url, setUrl] = reactExports.useState(webhook.url);
  const [secret, setSecret] = reactExports.useState(webhook.secret ?? "");
  const [selectedEvents, setSelectedEvents] = reactExports.useState(webhook.events);
  const toggle = (val) => setSelectedEvents((prev) => prev.includes(val) ? prev.filter((e) => e !== val) : [...prev, val]);
  const valid = url.trim().startsWith("http") && selectedEvents.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-cyan/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4 text-cyan" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Edit Webhook" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Endpoint URL ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", value: url, onChange: (e) => setUrl(e.target.value), className: inputCls })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Secret (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: secret, onChange: (e) => setSecret(e.target.value), className: inputCls })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-2 block", children: [
          "Events ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: WEBHOOK_EVENTS.map((ev) => {
          const checked = selectedEvents.includes(ev.value);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggle(ev.value),
              className: clsx(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-all",
                checked ? "border-purple/60 bg-purple/10 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0", checked ? "bg-purple border-purple" : "border-border-default"), children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5 text-white" }) }),
                ev.label
              ]
            },
            ev.value
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !valid, onClick: () => {
        onSave({ url: url.trim(), events: selectedEvents, secret: secret.trim() || void 0 });
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }),
        " Save Changes"
      ] })
    ] })
  ] });
}
function DeleteModal({ count, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete Webhook(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary", children: [
        "You are about to delete ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text-primary", children: count }),
        " webhook",
        count !== 1 ? "s" : "",
        "."
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
function WebhookRow({ webhook, selected, onToggle, onToggleStatus, onDelete, onEdit, onTest }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(webhook.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: clsx(
        "border-b border-border-default last:border-0 hover:bg-white/3 transition-colors",
        selected && "bg-purple/5"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selected, onChange: onToggle, className: "w-3.5 h-3.5 rounded accent-purple cursor-pointer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-text-primary truncate", children: webhook.url }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: copy, className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors shrink-0", children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-emerald" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 max-w-xs", children: [
          webhook.events.slice(0, 3).map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded-md bg-purple/10 border border-purple/20 text-[10px] text-purple-light", children: ev }, ev)),
          webhook.events.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded-md bg-white/5 border border-border-default text-[10px] text-text-muted", children: [
            "+",
            webhook.events.length - 3,
            " more"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: webhook.status === "active" ? "active" : "inactive", dot: true, children: webhook.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: formatDistanceToNow(new Date(webhook.createdAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onTest();
              },
              className: "p-1.5 rounded-lg text-text-muted hover:text-cyan hover:bg-cyan/5 transition-colors",
              title: "Send test ping",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" })
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
              title: "Edit webhook",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onToggleStatus();
              },
              className: clsx(
                "p-1.5 rounded-lg transition-colors",
                webhook.status === "active" ? "text-emerald hover:text-emerald/70 hover:bg-emerald/5" : "text-text-muted hover:text-emerald hover:bg-emerald/5"
              ),
              title: webhook.status === "active" ? "Disable" : "Enable",
              children: webhook.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "w-4 h-4" })
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
function Webhooks() {
  const { id: appId } = useParams();
  const { isDemoMode } = useAuthStore();
  const qc = useQueryClient();
  const { webhooks: allWebhooks, addWebhook, updateWebhook, deleteWebhook, deleteSelected, toggleStatus } = useWebhookStore();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [modal, setModal] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [testToast, setTestToast] = reactExports.useState(null);
  const { data: apiWebhooks } = useQuery({
    queryKey: ["webhooks", appId],
    queryFn: () => webhooksApi.getAll(appId),
    enabled: !isDemoMode && !!appId
  });
  reactExports.useEffect(() => {
    if (!isDemoMode && apiWebhooks?.data) {
      const current = allWebhooks[appId] ?? [];
      apiWebhooks.data.forEach((w) => {
        if (!current.find((c) => c.id === w.id)) addWebhook(appId, w);
      });
    }
  }, [apiWebhooks, isDemoMode, appId]);
  const webhooks = isDemoMode ? allWebhooks[appId] ?? [] : apiWebhooks?.data ?? allWebhooks[appId] ?? [];
  useMutation({
    mutationFn: (payload) => webhooksApi.create(appId, payload),
    onSuccess: (res) => {
      if (res.data) addWebhook(appId, res.data);
      qc.invalidateQueries({ queryKey: ["webhooks", appId] });
      setModal(null);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => webhooksApi.delete(appId, id),
    onSuccess: (_, id) => {
      deleteWebhook(appId, id);
      qc.invalidateQueries({ queryKey: ["webhooks", appId] });
    }
  });
  const filtered = reactExports.useMemo(() => webhooks.filter((w) => {
    const matchSearch = w.url.toLowerCase().includes(search.toLowerCase()) || w.events.some((e) => e.includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    return matchSearch && matchStatus;
  }), [webhooks, search, statusFilter]);
  const toggleAll = () => setSelected(selected.size === filtered.length ? /* @__PURE__ */ new Set() : new Set(filtered.map((w) => w.id)));
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const handleDeleteSelected = () => {
    if (isDemoMode) deleteSelected(appId, [...selected]);
    else selected.forEach((id) => deleteMutation.mutate(id));
    setSelected(/* @__PURE__ */ new Set());
  };
  const handleDeleteSingle = (id) => {
    setDeleteTarget(id);
    setModal("delete");
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      if (isDemoMode) deleteWebhook(appId, deleteTarget);
      else deleteMutation.mutate(deleteTarget);
      setDeleteTarget(null);
    } else {
      handleDeleteSelected();
    }
  };
  const handleTest = (webhook) => {
    setTestToast(`Test ping sent to ${webhook.url.slice(0, 40)}…`);
    setTimeout(() => setTestToast(null), 3e3);
  };
  const handleEdit = (webhook) => {
    setEditTarget(webhook);
    setModal("edit");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Webhooks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Receive real-time HTTP notifications when events happen in your application." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setModal("create"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Create Webhook"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search webhooks...",
            className: "h-9 w-56 pl-3 pr-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ) }),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "h-9 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary focus:outline-none focus:border-purple/60 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Statuses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inactive", children: "Inactive" })
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
            icon: Webhook,
            label: "Create Webhook",
            color: "bg-purple/10 border-border-default text-purple-light hover:border-purple/40",
            onClick: () => setModal("create")
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
          icon: search ? Search : Webhook,
          title: "No webhooks found",
          description: search ? `No results for "${search}"` : "Create a webhook to receive real-time event notifications.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8" }),
          ["Endpoint URL", "Events", "Status", "Created", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          WebhookRow,
          {
            webhook: w,
            selected: selected.has(w.id),
            onToggle: () => toggleOne(w.id),
            onToggleStatus: () => toggleStatus(appId, w.id),
            onDelete: () => handleDeleteSingle(w.id),
            onEdit: () => handleEdit(w),
            onTest: () => handleTest(w)
          },
          w.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
        filtered.length,
        " webhook",
        filtered.length !== 1 ? "s" : ""
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.3 },
        className: "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-cyan/5 border border-cyan/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "w-4 h-4 text-cyan shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-cyan", children: "How webhooks work: " }),
            "When a registered event occurs (e.g. a user logs in), Sira Auth will send a POST request to your endpoint with a JSON payload. Use the optional secret to verify the payload signature via ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-text-secondary", children: "X-Sira-Signature" }),
            "."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: testToast && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-cyan/15 border border-cyan/40 shadow-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-cyan shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cyan font-medium", children: [
            "Delivery sent — ",
            testToast
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CreateWebhookModal,
        {
          appId,
          onClose: () => setModal(null),
          onSave: (w) => addWebhook(appId, w)
        }
      ),
      modal === "edit" && editTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
        EditWebhookModal,
        {
          appId,
          webhook: editTarget,
          onClose: () => {
            setModal(null);
            setEditTarget(null);
          },
          onSave: (patch) => updateWebhook(appId, editTarget.id, patch)
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
  Webhooks as default
};
