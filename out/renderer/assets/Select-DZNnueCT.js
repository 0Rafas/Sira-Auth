import { r as reactExports, j as jsxRuntimeExports, e as clsx, N as ChevronDown, A as AnimatePresence, m as motion } from "./index-Bnbhtkos.js";
import { C as Check } from "./check-V-0X9BuP.js";
function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled,
  className,
  size = "md"
}) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const selected = options.find((o) => o.value === value);
  reactExports.useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: clsx("relative", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        disabled,
        onClick: () => setOpen((v) => !v),
        className: clsx(
          "w-full flex items-center justify-between gap-2 rounded-xl border transition-all text-left",
          size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3 text-sm",
          open ? "border-purple/60 ring-2 ring-purple/15 bg-bg-card text-text-primary" : "border-border-default bg-bg-card text-text-primary hover:border-border-accent",
          disabled && "opacity-50 cursor-not-allowed"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(!selected && "text-text-muted"), children: selected ? selected.label : placeholder }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: clsx("w-3.5 h-3.5 text-text-muted shrink-0 transition-transform", open && "rotate-180") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -6, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, scale: 0.97 },
        transition: { duration: 0.14 },
        className: "absolute z-[200] left-0 right-0 top-full mt-1.5 bg-[#12121a] rounded-xl border border-border-accent shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-52 overflow-y-auto py-1", children: options.map((opt) => {
          const isActive = opt.value === value;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                onChange(opt.value);
                setOpen(false);
              },
              className: clsx(
                "w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors",
                isActive ? "bg-purple/15 text-purple-light" : "text-text-primary hover:bg-white/5 hover:text-text-primary"
              ),
              children: [
                opt.label,
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-purple-light shrink-0" })
              ]
            },
            opt.value
          );
        }) })
      }
    ) })
  ] });
}
export {
  Select as S
};
