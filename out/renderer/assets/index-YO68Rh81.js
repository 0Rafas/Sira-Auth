import { w as createLucideIcon, D as create, F as persist, o as useParams, r as reactExports, j as jsxRuntimeExports, B as Button, m as motion, d as Search, H as FolderOpen, A as AnimatePresence, e as clsx, s as formatDistanceToNow, X, f as AlertTriangle } from "./index-Bnbhtkos.js";
import { u as useSubStore } from "./sub.store-BORt4PCU.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { U as Upload } from "./upload-E7X_VYfu.js";
import { F as Filter } from "./filter-kkxgoy0D.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { C as Check } from "./check-V-0X9BuP.js";
import { C as Copy } from "./copy-C3WXQPHT.js";
import { D as Download } from "./download-CZh5SlAX.js";
import { F as FileText } from "./file-text-BcgJvZIP.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Archive = createLucideIcon("Archive", [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCode = createLucideIcon("FileCode", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m10 13-2 2 2 2", key: "17smn8" }],
  ["path", { d: "m14 17 2-2-2-2", key: "14mezr" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileImage = createLucideIcon("FileImage", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "10", cy: "13", r: "2", key: "6v46hv" }],
  ["path", { d: "m20 17-1.1-1.1a2 2 0 0 0-2.81.01L10 22", key: "14ir3o" }]
]);
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const File = createLucideIcon("File", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
]);
const useFileStore = create()(
  persist(
    (set, get) => ({
      files: {},
      addFile: (appId, file) => set({
        files: {
          ...get().files,
          [appId]: [...get().files[appId] ?? [], file]
        }
      }),
      deleteFile: (appId, id) => set({
        files: {
          ...get().files,
          [appId]: (get().files[appId] ?? []).filter((f) => f.id !== id)
        }
      }),
      deleteSelected: (appId, ids) => set({
        files: {
          ...get().files,
          [appId]: (get().files[appId] ?? []).filter((f) => !ids.includes(f.id))
        }
      })
    }),
    { name: "sira_file_store", partialize: (s) => ({ files: s.files }) }
  )
);
function randomId() {
  return Math.random().toString(36).slice(2, 12);
}
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
function FileIcon({ mimeType }) {
  if (mimeType.startsWith("image/")) return /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "w-4 h-4 text-cyan" });
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("gzip")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 text-amber" });
  if (mimeType.includes("text") || mimeType.includes("json") || mimeType.includes("xml")) return /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, { className: "w-4 h-4 text-emerald" });
  if (mimeType.includes("pdf") || mimeType.includes("document")) return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-rose" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-text-muted" });
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
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-md mx-4",
        onClick: (e) => e.stopPropagation(),
        children
      }
    )
  ] });
}
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
function UploadModal({ appId, onClose, onSave }) {
  const { subscriptions } = useSubStore();
  const subs = subscriptions[appId] ?? [];
  const fileInputRef = reactExports.useRef(null);
  const [dragging, setDragging] = reactExports.useState(false);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [requiredLevel, setRequiredLevel] = reactExports.useState("1");
  const [customName, setCustomName] = reactExports.useState("");
  const handleFile = (f) => {
    setSelectedFile(f);
    setCustomName(f.name);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };
  const valid = selectedFile !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-cyan/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 text-cyan" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Upload File" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onDragOver: (e) => {
            e.preventDefault();
            setDragging(true);
          },
          onDragLeave: () => setDragging(false),
          onDrop: handleDrop,
          onClick: () => fileInputRef.current?.click(),
          className: clsx(
            "flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all",
            dragging ? "border-purple/60 bg-purple/8" : selectedFile ? "border-emerald/50 bg-emerald/5" : "border-border-default hover:border-border-accent hover:bg-white/3"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                className: "hidden",
                onChange: (e) => e.target.files?.[0] && handleFile(e.target.files[0])
              }
            ),
            selectedFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileIcon, { mimeType: selectedFile.type }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-emerald-400 text-center", children: selectedFile.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: formatBytes(selectedFile.size) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted", children: "Click to change file" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5 text-text-muted" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary", children: [
                "Drop a file here or ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-light", children: "click to browse" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted", children: "Any file type supported" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Display Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: customName,
            onChange: (e) => setCustomName(e.target.value),
            placeholder: "File name shown to users",
            className: inputCls
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Required Access Level ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        subs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: subs.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setRequiredLevel(String(s.level)),
            className: clsx(
              "flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-all",
              requiredLevel === String(s.level) ? "border-purple/60 bg-purple/10 text-purple-light" : "border-border-default bg-bg-card text-text-secondary hover:border-border-accent"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(
                "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0",
                requiredLevel === String(s.level) ? "bg-purple border-purple" : "border-border-default"
              ), children: requiredLevel === String(s.level) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white" }) }),
              s.name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-text-muted", children: [
                "(L",
                s.level,
                ")"
              ] })
            ]
          },
          s.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: requiredLevel,
            onChange: (e) => setRequiredLevel(e.target.value),
            className: `${inputCls} cursor-pointer`,
            children: Array.from({ length: 10 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: i + 1, children: [
              "Level ",
              i + 1
            ] }, i + 1))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !valid, onClick: () => {
        onSave({
          id: randomId(),
          appId,
          name: customName.trim() || selectedFile.name,
          url: URL.createObjectURL(selectedFile),
          size: selectedFile.size,
          mimeType: selectedFile.type || "application/octet-stream",
          requiredLevel: parseInt(requiredLevel),
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
        " Upload File"
      ] })
    ] })
  ] });
}
function DeleteModal({ count, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete File(s)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary mb-3", children: [
        "Delete ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text-primary", children: count }),
        " file",
        count !== 1 ? "s" : "",
        "?"
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
function FileRow({ file, selected, onToggle, onDelete }) {
  const [copied, setCopied] = reactExports.useState(false);
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white/5 border border-border-default flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileIcon, { mimeType: file.mimeType }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-text-primary", children: file.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted", children: file.mimeType })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-secondary", children: formatBytes(file.size) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-1 rounded-md bg-purple/10 border border-purple/20 text-[10px] font-medium text-purple-light", children: [
          "Level ",
          file.requiredLevel,
          "+"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono text-text-muted truncate max-w-[120px]", children: [
            file.url.slice(0, 30),
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                navigator.clipboard.writeText(file.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              },
              className: "p-1 rounded text-text-muted hover:text-purple-light transition-colors shrink-0",
              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-emerald" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-text-muted", children: formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: file.url,
              download: file.name,
              onClick: (e) => e.stopPropagation(),
              className: "p-1.5 rounded-lg text-text-muted hover:text-cyan hover:bg-cyan/5 transition-colors",
              title: "Download file",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: clsx("w-9 h-9 rounded-xl border flex items-center justify-center transition-all", active ? `${color} ring-2 ring-white/10` : color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) }),
    tip && label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-bg-card border border-border-accent text-[10px] text-text-secondary whitespace-nowrap shadow-card z-20", children: label })
  ] });
}
function Files() {
  const { id: appId } = useParams();
  const { files: allFiles, addFile, deleteFile, deleteSelected } = useFileStore();
  const files = allFiles[appId] ?? [];
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [levelFilter, setLevelFilter] = reactExports.useState("all");
  const [modal, setModal] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || String(f.requiredLevel) === levelFilter;
    return matchSearch && matchLevel;
  }), [files, search, levelFilter]);
  const toggleAll = () => setSelected(selected.size === filtered.length ? /* @__PURE__ */ new Set() : new Set(filtered.map((f) => f.id)));
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      deleteFile(appId, deleteTarget);
      setDeleteTarget(null);
    } else {
      deleteSelected(appId, [...selected]);
      setSelected(/* @__PURE__ */ new Set());
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Files" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "Host and distribute files to your users based on their subscription level." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setModal("upload"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
        " Upload File"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search files...",
            className: "h-9 w-56 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 transition-all"
          }
        ),
        showFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: levelFilter,
            onChange: (e) => setLevelFilter(e.target.value),
            className: "h-9 px-3 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary focus:outline-none focus:border-purple/60 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Levels" }),
              Array.from({ length: 10 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: i + 1, children: [
                "Level ",
                i + 1
              ] }, i + 1))
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
            icon: Upload,
            label: "Upload File",
            color: "bg-cyan/10 border-border-default text-cyan hover:border-cyan/40",
            onClick: () => setModal("upload")
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
          icon: search ? Search : FolderOpen,
          title: "No files found",
          description: search ? `No results for "${search}"` : "Upload files to distribute to your users.",
          className: "py-20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-default bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-8" }),
          ["File", "Size", "Required Level", "URL", "Uploaded", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          FileRow,
          {
            file: f,
            selected: selected.has(f.id),
            onToggle: () => toggleOne(f.id),
            onDelete: () => {
              setDeleteTarget(f.id);
              setModal("delete");
            }
          },
          f.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center px-4 py-3 border-t border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-text-muted", children: [
        filtered.length,
        " file",
        filtered.length !== 1 ? "s" : ""
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsx(UploadModal, { appId, onClose: () => setModal(null), onSave: (f) => addFile(appId, f) }),
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
  Files as default
};
