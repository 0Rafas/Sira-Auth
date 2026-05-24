import { j as jsxRuntimeExports, e as clsx } from "./index-Bnbhtkos.js";
const variantStyles = {
  active: "bg-emerald/15 text-emerald border-emerald/30",
  inactive: "bg-text-muted/15 text-text-secondary border-text-muted/30",
  banned: "bg-rose/15 text-rose border-rose/30",
  expired: "bg-amber/15 text-amber border-amber/30",
  warning: "bg-amber/15 text-amber border-amber/30",
  info: "bg-cyan/15 text-cyan border-cyan/30",
  default: "bg-purple/15 text-purple-light border-purple/30"
};
const dotColors = {
  active: "bg-emerald",
  inactive: "bg-text-muted",
  banned: "bg-rose",
  expired: "bg-amber",
  warning: "bg-amber",
  info: "bg-cyan",
  default: "bg-purple-light"
};
function Badge({ variant = "default", children, dot = false, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      ),
      children: [
        dot && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx("w-1.5 h-1.5 rounded-full", dotColors[variant]) }),
        children
      ]
    }
  );
}
export {
  Badge as B
};
