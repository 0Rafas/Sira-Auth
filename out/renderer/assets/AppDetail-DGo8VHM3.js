import { u as useNavigate, a as useQueryClient, b as useAppStore, l as useAuthStore, c as useToast, r as reactExports, j as jsxRuntimeExports, m as motion, C as Card, S as SquareStack, I as Input, B as Button, h as appsApi } from "./index-Bnbhtkos.js";
import { u as useMutation } from "./useMutation-Bts06aKB.js";
import { A as ArrowLeft } from "./arrow-left-T6NrbVWN.js";
import { R as Rocket } from "./rocket-plmOu1Ki.js";
function AppDetail({ isNew }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { addApp, setSelectedApp } = useAppStore();
  const { isDemoMode } = useAuthStore();
  const toast = useToast();
  const [form, setForm] = reactExports.useState({ name: "", version: "1.0.0", description: "" });
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const createMutation = useMutation({
    mutationFn: () => appsApi.create({ name: form.name.trim(), version: form.version.trim() || "1.0.0" }),
    onSuccess: (res) => {
      if (res.data) {
        addApp(res.data);
        setSelectedApp(res.data);
        qc.invalidateQueries({ queryKey: ["apps"] });
        toast.success("Application created!", `"${res.data.name}" is ready to use.`);
        navigate(`/apps/${res.data.id}/licenses`);
      }
    },
    onError: () => {
      toast.error("Failed to create application", "Check your connection and try again.");
    }
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (isDemoMode) {
      toast.info("Demo mode", "Connect to backend to create real applications.");
      return;
    }
    createMutation.mutate();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/apps"),
          className: "p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Create Application" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Applications are the backbone of all the data." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 pb-5 border-b border-border-default", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-purple/30 to-cyan/20 border border-border-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareStack, { className: "w-6 h-6 text-purple-light" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-text-primary", children: "New Application" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "Fill in the details below" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "Application Name *",
                value: form.name,
                onChange: (e) => set("name", e.target.value),
                placeholder: "My Awesome App",
                hint: "This name will be shown to your users.",
                required: true,
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "Version",
                value: form.version,
                onChange: (e) => set("version", e.target.value),
                placeholder: "1.0.0",
                hint: "Semantic versioning recommended (e.g. 1.0.0)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-medium text-text-secondary mb-1.5", children: [
                "Description ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: form.description,
                  onChange: (e) => set("description", e.target.value),
                  placeholder: "Brief description of your application...",
                  rows: 3,
                  className: "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-purple/5 border border-purple/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-light font-medium mb-1", children: "What happens next?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-text-muted space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• A unique secret key will be generated for your app" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• You'll be redirected to manage licenses & users" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Connect your app via our SDK or API" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate("/apps"), children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", loading: createMutation.isPending, disabled: !form.name.trim(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "w-4 h-4" }),
                "Create Application"
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] });
}
export {
  AppDetail as default
};
