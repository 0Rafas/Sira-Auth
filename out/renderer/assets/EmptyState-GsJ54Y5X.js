import { j as jsxRuntimeExports, m as motion, e as clsx } from "./index-Bnbhtkos.js";
function EmptyState({ icon: Icon, emoji, title, description, action, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: clsx("flex flex-col items-center justify-center py-16 text-center", className),
      children: [
        emoji && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-4", children: emoji }),
        Icon && !emoji && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-7 h-7 text-purple-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-text-primary", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-1 max-w-xs", children: description }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: action })
      ]
    }
  );
}
export {
  EmptyState as E
};
