import { j as jsxRuntimeExports, d as Search, X, e as clsx } from "./index-Bnbhtkos.js";
function SearchBar({ value, onChange, placeholder = "Search...", className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx("relative", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        className: "h-9 w-full pl-9 pr-8 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all"
      }
    ),
    value && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChange(""),
        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
      }
    )
  ] });
}
export {
  SearchBar as S
};
