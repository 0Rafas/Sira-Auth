import { w as createLucideIcon, u as useNavigate, l as useAuthStore, Z as Zap, r as reactExports, j as jsxRuntimeExports, m as motion, a6 as CreditCard, C as Card, e as clsx, q as Clock, B as Button, a5 as Sparkles, f as AlertTriangle, A as AnimatePresence, a2 as CheckCircle, t as Shield, P as Plus } from "./index-Bnbhtkos.js";
import { C as Crown } from "./crown-Bg-QtcQN.js";
import { R as Rocket } from "./rocket-plmOu1Ki.js";
import { S as Star, d as differenceInDays, C as Calendar } from "./differenceInDays-B_ENeNAv.js";
import { A as ArrowLeft } from "./arrow-left-T6NrbVWN.js";
import { f as format } from "./format-DQaPZ8iA.js";
import { T as ToggleRight, a as ToggleLeft } from "./toggle-right-DOilWeud.js";
import { R as RefreshCw } from "./refresh-cw-Ck3axOlu.js";
import { D as Download } from "./download-CZh5SlAX.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Receipt = createLucideIcon("Receipt", [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
]);
const PLAN_META = {
  basic: {
    icon: Zap,
    color: "text-cyan",
    bg: "bg-cyan/10",
    border: "border-cyan/30",
    badge: "bg-cyan/15 text-cyan border-cyan/30",
    monthly: 3.99,
    yearly: 44
  },
  pro: {
    icon: Star,
    color: "text-purple-light",
    bg: "bg-purple/10",
    border: "border-purple/30",
    badge: "bg-purple/15 text-purple-light border-purple/30",
    monthly: 15.99,
    yearly: 192
  },
  ultra: {
    icon: Rocket,
    color: "text-amber",
    bg: "bg-amber/10",
    border: "border-amber/30",
    badge: "bg-amber/15 text-amber border-amber/30",
    monthly: 39.99,
    yearly: 480
  },
  unlimited: {
    icon: Crown,
    color: "text-rose",
    bg: "bg-rose/10",
    border: "border-rose/30",
    badge: "bg-rose/15 text-rose border-rose/30",
    monthly: 149,
    yearly: 1800
  }
};
const MOCK_INVOICES = [];
function SectionHeader({ icon: Icon, title, subtitle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border-default flex items-center gap-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-text-muted" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted", children: subtitle })
    ] })
  ] });
}
function PaymentCardDisplay({ onRemove }) {
  const [confirmRemove, setConfirmRemove] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 rounded-xl border border-border-accent bg-white/3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-9 rounded-lg bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center border border-white/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-white/70" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary", children: "•••• •••• •••• 4242" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted", children: "Expires 12 / 2027  ·  Visa" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/25 font-semibold shrink-0", children: "Default" }),
    !confirmRemove ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setConfirmRemove(true),
        className: "p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-colors shrink-0",
        title: "Remove card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-rose", children: "Remove?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            onRemove();
            setConfirmRemove(false);
          },
          className: "text-[11px] text-rose hover:underline",
          children: "Yes"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setConfirmRemove(false),
          className: "text-[11px] text-text-muted hover:text-text-primary",
          children: "No"
        }
      )
    ] })
  ] });
}
function Billing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const planKey = (user?.plan ?? "pro").toLowerCase().replace(" edition", "");
  const meta = PLAN_META[planKey] ?? PLAN_META.pro;
  const PlanIcon = meta.icon;
  const planExpiry = user?.planExpiry ? new Date(user.planExpiry) : null;
  const daysLeft = planExpiry ? differenceInDays(planExpiry, /* @__PURE__ */ new Date()) : null;
  const [billing, setBilling] = reactExports.useState("monthly");
  const [autoRenew, setAutoRenew] = reactExports.useState(true);
  const [hasCard, setHasCard] = reactExports.useState(true);
  const [cancelConfirm, setCancelConfirm] = reactExports.useState(false);
  const [showAddCard, setShowAddCard] = reactExports.useState(false);
  const currentPrice = billing === "monthly" ? meta.monthly : meta.yearly;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto flex flex-col gap-5 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate("/plans"),
              className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-purple-light" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Manage Billing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "Subscription, payment methods & invoices" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.05 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", className: clsx("overflow-hidden", meta.border), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Star, title: "Active Subscription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", meta.bg), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanIcon, { className: clsx("w-6 h-6", meta.color) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-text-primary", children: user?.plan ?? "Pro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("text-[11px] px-2 py-0.5 rounded-full border font-semibold", meta.badge), children: "Active" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-text-muted", children: [
                  "$",
                  currentPrice.toFixed(2),
                  " / ",
                  billing === "monthly" ? "month" : "year"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center bg-bg-secondary rounded-xl p-1 gap-1 border border-border-default shrink-0", children: ["monthly", "yearly"].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setBilling(b),
                  className: clsx(
                    "px-3 py-1 rounded-lg text-[11px] font-medium capitalize transition-all",
                    billing === b ? "bg-purple text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                  ),
                  children: b
                },
                b
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
              {
                label: "Next Renewal",
                value: planExpiry ? format(planExpiry, "MMM d, yyyy") : "—",
                icon: Calendar
              },
              {
                label: "Days Remaining",
                value: daysLeft !== null ? daysLeft > 0 ? `${daysLeft} days` : "Expired" : "—",
                icon: Clock,
                alert: daysLeft !== null && daysLeft <= 7
              },
              {
                label: "Amount Due",
                value: `$${currentPrice.toFixed(2)}`,
                icon: CreditCard
              }
            ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/3 rounded-xl p-3 border border-border-default", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-text-muted mb-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "w-3 h-3" }),
                " ",
                stat.label
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: clsx(
                "text-sm font-bold",
                stat.alert ? "text-rose" : "text-text-primary"
              ), children: stat.value })
            ] }, stat.label)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-t border-border-default", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-text-primary", children: "Auto-Renew" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted", children: autoRenew ? "Subscription renews automatically on the next billing date." : "Subscription will expire and not be renewed automatically." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setAutoRenew((v) => !v),
                  className: "ml-4 shrink-0 transition-colors",
                  children: autoRenew ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "w-8 h-8 text-purple-light" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "w-8 h-8 text-text-muted" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => navigate("/plans"),
                  className: "gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                    " Upgrade Plan"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                " Renew Now"
              ] }),
              !cancelConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setCancelConfirm(true),
                  className: "px-3 h-8 rounded-lg text-xs text-text-muted hover:text-rose hover:bg-rose/8 border border-transparent hover:border-rose/20 transition-all",
                  children: "Cancel Subscription"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose/8 border border-rose/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-rose shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-rose font-medium", children: "Cancel subscription?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setCancelConfirm(false),
                    className: "text-[11px] text-rose hover:underline font-semibold",
                    children: "Yes, cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setCancelConfirm(false),
                    className: "text-[11px] text-text-muted hover:text-text-primary",
                    children: "Keep it"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: CreditCard,
              title: "Payment Methods",
              subtitle: "Cards used for subscription billing"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
            hasCard ? /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentCardDisplay, { onRemove: () => setHasCard(false) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-6 rounded-xl border border-dashed border-border-accent text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-8 h-8 text-text-muted opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-text-muted", children: "No payment method added" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAddCard && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                className: "overflow-hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border-accent bg-white/2 flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-text-secondary", children: "New Card Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Card number",
                        className: "w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          placeholder: "MM / YY",
                          className: "bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          placeholder: "CVC",
                          className: "bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Cardholder name",
                        className: "w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        onClick: () => {
                          setHasCard(true);
                          setShowAddCard(false);
                        },
                        className: "gap-1.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-3.5 h-3.5" }),
                          " Save Card"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowAddCard(false), children: "Cancel" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-text-muted flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3" }),
                    " Your card details are encrypted and stored securely."
                  ] })
                ] })
              }
            ) }),
            !showAddCard && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setShowAddCard(true),
                className: "flex items-center gap-2 px-4 h-9 rounded-xl border border-dashed border-border-accent text-xs text-text-muted hover:text-text-primary hover:border-border-default transition-all w-fit",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Add Payment Method"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.15 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: Receipt,
              title: "Billing Address",
              subtitle: "Used on invoices and payment receipts"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid grid-cols-1 gap-2.5", children: [
            [
              { placeholder: "Full name", span: false },
              { placeholder: "Company name (optional)", span: false },
              { placeholder: "Street address", span: false },
              { placeholder: "City", span: false },
              { placeholder: "ZIP / Postal code", span: false },
              { placeholder: "Country", span: false }
            ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: field.placeholder,
                className: "w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent transition-colors"
              },
              field.placeholder
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", className: "w-fit mt-1", children: "Save Address" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { padding: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: Receipt,
              title: "Invoice History",
              subtitle: "Download past receipts and billing records"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border-default bg-white/2", children: ["Invoice", "Date", "Plan", "Amount", "Status", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              MOCK_INVOICES.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-xs text-text-muted", children: "No invoices yet — your billing history will appear here." }) }),
              MOCK_INVOICES.map((inv, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.tr,
                {
                  initial: { opacity: 0, y: -4 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.22 + i * 0.04 },
                  className: "border-b border-border-default last:border-0 hover:bg-white/2 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-text-secondary", children: inv.id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: format(new Date(inv.date), "MMM d, yyyy") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-primary", children: inv.plan }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs font-semibold text-text-primary", children: [
                      "$",
                      inv.amount.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20 font-medium", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-2.5 h-2.5" }),
                      " Paid"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-1 text-[11px] text-text-muted hover:text-purple-light transition-colors", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                      " PDF"
                    ] }) })
                  ]
                },
                inv.id
              ))
            ] })
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.3 },
        className: "flex items-center justify-center gap-6 py-2",
        children: [
          { icon: Shield, text: "SSL Encrypted" },
          { icon: CheckCircle, text: "PCI Compliant" },
          { icon: RefreshCw, text: "Cancel Anytime" }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-[11px] text-text-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-3.5 h-3.5" }),
          " ",
          item.text
        ] }, item.text))
      }
    )
  ] });
}
export {
  Billing as default
};
