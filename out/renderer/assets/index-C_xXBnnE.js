import { w as createLucideIcon, r as reactExports, l as useAuthStore, u as useNavigate, Z as Zap, j as jsxRuntimeExports, m as motion, a5 as Sparkles, e as clsx, q as Clock, B as Button, E as ExternalLink, t as Shield, z as ChevronRight } from "./index-Bnbhtkos.js";
import { S as Star, d as differenceInDays, C as Calendar } from "./differenceInDays-B_ENeNAv.js";
import { R as Rocket } from "./rocket-plmOu1Ki.js";
import { C as Crown } from "./crown-Bg-QtcQN.js";
import { f as format } from "./format-DQaPZ8iA.js";
import { C as Check } from "./check-V-0X9BuP.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Infinity = createLucideIcon("Infinity", [
  [
    "path",
    {
      d: "M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z",
      key: "1z0uae"
    }
  ]
]);
const PLANS = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Perfect for solo developers getting started",
    icon: Zap,
    color: "cyan",
    colorClass: {
      border: "border-cyan/30",
      ring: "ring-cyan/20",
      bg: "bg-cyan/10",
      text: "text-cyan",
      btn: "bg-cyan hover:bg-cyan/90 text-bg-primary",
      badge: "bg-cyan/15 text-cyan border-cyan/30",
      glow: "shadow-[0_0_40px_rgba(6,182,212,0.12)]"
    },
    monthly: 3.99,
    yearly: 44,
    yearlyMonthly: 3.67,
    badge: null,
    features: [
      { text: "2 Applications", highlight: false },
      { text: "1 API Token", highlight: false },
      { text: "100 License Keys", highlight: false },
      { text: "130 Users", highlight: false },
      { text: "5 Subscription Tiers", highlight: false },
      { text: "API rate: 60 req/min", highlight: false },
      { text: "Email support (48h)", highlight: false },
      { text: "Basic analytics", highlight: false }
    ]
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing projects with real users",
    icon: Star,
    color: "purple",
    colorClass: {
      border: "border-purple/40",
      ring: "ring-purple/25",
      bg: "bg-purple/10",
      text: "text-purple-light",
      btn: "bg-purple hover:bg-purple/90 text-white",
      badge: "bg-purple/15 text-purple-light border-purple/30",
      glow: "shadow-[0_0_50px_rgba(124,58,237,0.18)]"
    },
    monthly: 15.99,
    yearly: 192,
    yearlyMonthly: 16,
    badge: "Most Popular",
    features: [
      { text: "15 Applications", highlight: false },
      { text: "10 API Tokens", highlight: false },
      { text: "400 License Keys", highlight: false },
      { text: "480 Users", highlight: false },
      { text: "20 Subscription Tiers", highlight: false },
      { text: "API rate: 300 req/min", highlight: false },
      { text: "Priority support (12h)", highlight: true },
      { text: "Advanced analytics & reports", highlight: true },
      { text: "Webhook integrations", highlight: true },
      { text: "Discord & Telegram bot support", highlight: true }
    ]
  },
  {
    id: "ultra",
    name: "Ultra",
    tagline: "Serious protection for serious products",
    icon: Rocket,
    color: "amber",
    colorClass: {
      border: "border-amber/35",
      ring: "ring-amber/20",
      bg: "bg-amber/10",
      text: "text-amber",
      btn: "bg-amber hover:bg-amber/90 text-bg-primary",
      badge: "bg-amber/15 text-amber border-amber/30",
      glow: "shadow-[0_0_50px_rgba(245,158,11,0.14)]"
    },
    monthly: 39.99,
    yearly: 480,
    yearlyMonthly: 40,
    badge: "Best Value",
    features: [
      { text: "80 Applications", highlight: false },
      { text: "35 API Tokens", highlight: false },
      { text: "750 License Keys", highlight: false },
      { text: "1,000 Users", highlight: false },
      { text: "60 Subscription Tiers", highlight: false },
      { text: "API rate: 1,000 req/min", highlight: false },
      { text: "Super Anti-Crack Protection", highlight: true },
      { text: "Priority support (4h)", highlight: true },
      { text: "Full analytics & audit logs", highlight: true },
      { text: "Custom domain support", highlight: true },
      { text: "SLA 99.9% uptime guarantee", highlight: true },
      { text: "White-label branding options", highlight: true }
    ]
  },
  {
    id: "unlimited",
    name: "Unlimited Edition",
    tagline: "The complete enterprise-grade solution",
    icon: Crown,
    color: "rose",
    colorClass: {
      border: "border-rose/35",
      ring: "ring-rose/20",
      bg: "bg-rose/10",
      text: "text-rose",
      btn: "bg-gradient-to-r from-rose to-purple hover:opacity-90 text-white",
      badge: "bg-rose/15 text-rose border-rose/30",
      glow: "shadow-[0_0_60px_rgba(244,63,94,0.15)]"
    },
    monthly: 149,
    yearly: 1800,
    yearlyMonthly: 150,
    badge: "Enterprise",
    features: [
      { text: "Unlimited Applications", highlight: false },
      { text: "Unlimited API Tokens", highlight: false },
      { text: "Unlimited License Keys", highlight: false },
      { text: "Unlimited Users", highlight: false },
      { text: "Unlimited Subscription Tiers", highlight: false },
      { text: "Unlimited API rate (no throttle)", highlight: false },
      { text: "Super Anti-Crack Protection", highlight: true },
      { text: "Dedicated account manager (1h)", highlight: true },
      { text: "Free promo listing on our website", highlight: true },
      { text: "Free ads on our Discord servers", highlight: true },
      { text: "Full white-label & custom branding", highlight: true },
      { text: "SLA 99.99% uptime guarantee", highlight: true },
      { text: "Early access to new features", highlight: true }
    ]
  }
];
function planIndex(id) {
  return PLANS.findIndex((p) => p.id === id);
}
function PlanCard({
  plan,
  billing,
  isCurrent,
  currentIndex,
  cardIndex,
  delay
}) {
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const suffix = billing === "monthly" ? "/mo" : "/yr";
  const yearlySaving = Math.round(plan.monthly * 12 - plan.yearly);
  const PlanIcon = plan.icon;
  const isUpgrade = cardIndex > currentIndex;
  const isDowngrade = cardIndex < currentIndex;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
      className: clsx(
        "relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
        isCurrent ? clsx("ring-2", plan.colorClass.border, plan.colorClass.ring, plan.colorClass.glow, "bg-bg-card") : "border-border-default bg-bg-card hover:border-border-accent hover:shadow-lg"
      ),
      children: [
        plan.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
          "px-3 py-1 rounded-full text-[11px] font-bold border",
          plan.colorClass.badge
        ), children: plan.badge }) }),
        isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: clsx(
          "px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1",
          plan.colorClass.badge
        ), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
          " Your Plan"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
            plan.colorClass.bg
          ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanIcon, { className: clsx("w-5 h-5", plan.colorClass.text) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-text-primary", children: plan.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5 leading-tight max-w-[160px]", children: plan.tagline })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-extrabold text-text-primary", children: [
              "$",
              price.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-text-muted mb-1", children: suffix })
          ] }),
          billing === "yearly" && yearlySaving > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-emerald mt-0.5 font-medium", children: [
            "Saves $",
            yearlySaving,
            " vs monthly billing"
          ] }),
          billing === "yearly" && yearlySaving <= 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted mt-0.5", children: "One annual payment · billed once per year" }),
          billing === "monthly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-text-muted mt-0.5", children: [
            "Or $",
            plan.yearly,
            "/yr",
            yearlySaving > 0 ? ` — save $${yearlySaving}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2 mb-6 flex-1", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: clsx(
            "w-3.5 h-3.5 shrink-0 mt-0.5",
            f.highlight ? plan.colorClass.text : "text-text-muted"
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
            "text-xs leading-snug",
            f.highlight ? "text-text-primary font-medium" : "text-text-secondary"
          ), children: f.text })
        ] }, f.text)) }),
        isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            disabled: true,
            className: clsx(
              "w-full h-10 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 opacity-80 cursor-default",
              plan.colorClass.bg,
              plan.colorClass.text,
              plan.colorClass.border
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
              " Current Plan"
            ]
          }
        ) : isUpgrade ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/billing"),
            className: clsx(
              "w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              plan.colorClass.btn
            ),
            children: [
              "Upgrade ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        ) : isDowngrade ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/billing"),
            className: "w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-border-accent text-text-secondary hover:text-text-primary hover:border-border-default transition-all",
            children: "Downgrade"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/billing"),
            className: clsx(
              "w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              plan.colorClass.btn
            ),
            children: [
              "Get Started ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        )
      ]
    }
  );
}
function ManagePlans() {
  const [billing, setBilling] = reactExports.useState("monthly");
  const { user } = useAuthStore();
  const navigate2 = useNavigate();
  const userPlanId = user?.plan?.toLowerCase().replace(" edition", "") ?? "basic";
  const currentPlan = PLANS.find((p) => p.id === userPlanId) ?? PLANS[1];
  const currentIdx = planIndex(currentPlan.id);
  const planExpiry = user?.planExpiry ? new Date(user.planExpiry) : null;
  const daysLeft = planExpiry ? differenceInDays(planExpiry, /* @__PURE__ */ new Date()) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "flex flex-col gap-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-purple-light" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: "Manage Plans" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-text-muted ml-10", children: "Choose the plan that fits your product. Upgrade or downgrade at any time." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.05 },
        className: "flex items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-bg-secondary rounded-2xl p-1 gap-1 border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBilling("monthly"),
              className: clsx(
                "px-5 py-2 rounded-xl text-sm font-medium transition-all",
                billing === "monthly" ? "bg-purple text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              ),
              children: "Monthly"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setBilling("yearly"),
              className: clsx(
                "flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all",
                billing === "yearly" ? "bg-purple text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              ),
              children: [
                "Yearly",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all",
                  billing === "yearly" ? "bg-white/20 text-white" : "bg-emerald/15 text-emerald"
                ), children: "Save up to 8%" })
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5", children: PLANS.map((plan, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlanCard,
      {
        plan,
        billing,
        isCurrent: plan.id === currentPlan.id,
        currentIndex: currentIdx,
        cardIndex: i,
        delay: 0.08 + i * 0.06
      },
      plan.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.32 },
        className: clsx(
          "rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center gap-4",
          currentPlan.colorClass.border,
          currentPlan.colorClass.glow,
          "bg-bg-card"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
            currentPlan.colorClass.bg
          ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(currentPlan.icon, { className: clsx("w-6 h-6", currentPlan.colorClass.text) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-text-primary", children: "Active Plan:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                currentPlan.colorClass.badge
              ), children: currentPlan.name }),
              currentPlan.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-text-muted border border-border-default", children: currentPlan.badge })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-4 text-xs text-text-muted", children: planExpiry && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                "Renews ",
                format(planExpiry, "MMM d, yyyy")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: clsx(
                "flex items-center gap-1.5 font-medium",
                daysLeft !== null && daysLeft <= 7 ? "text-rose" : daysLeft !== null && daysLeft <= 14 ? "text-amber" : "text-emerald"
              ), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                daysLeft !== null && daysLeft > 0 ? `${daysLeft} days remaining` : "Expired"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-2", children: currentPlan.features.slice(0, 5).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-border-default", children: f.text }, f.text)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", onClick: () => navigate2("/billing"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
              " Manage Billing"
            ] }),
            currentPlan.id !== "unlimited" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: clsx(
              "h-8 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
              currentPlan.colorClass.btn
            ), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
              " Upgrade Plan"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.4 },
        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
        children: [
          {
            icon: Shield,
            title: "Secure Payments",
            desc: "All transactions are encrypted and processed securely through our payment provider."
          },
          {
            icon: Infinity,
            title: "Cancel Anytime",
            desc: "No lock-in contracts. Downgrade or cancel your subscription at any time, no questions asked."
          },
          {
            icon: Zap,
            title: "Instant Activation",
            desc: "Your plan upgrades and new limits apply immediately after your payment is confirmed."
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-4 rounded-xl bg-bg-secondary border border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4 h-4 text-purple-light" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-text-primary mb-0.5", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted leading-relaxed", children: item.desc })
          ] })
        ] }, item.title))
      }
    )
  ] });
}
export {
  ManagePlans as default
};
