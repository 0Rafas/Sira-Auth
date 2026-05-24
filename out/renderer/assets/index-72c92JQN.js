import { w as createLucideIcon, o as useParams, r as reactExports, j as jsxRuntimeExports, P as Plus, e as clsx, A as AnimatePresence, m as motion, U as Users, a0 as MessageSquare, s as formatDistanceToNow, X, B as Button, f as AlertTriangle } from "./index-Bnbhtkos.js";
import { E as EmptyState } from "./EmptyState-GsJ54Y5X.js";
import { H as Hash } from "./hash-D9MVFCe1.js";
import { M as MoreHorizontal } from "./more-horizontal-gQQt4mcb.js";
import { T as Trash2 } from "./trash-2-CSUatlzR.js";
import { f as format } from "./format-DQaPZ8iA.js";
/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Send = createLucideIcon("Send", [
  ["path", { d: "m22 2-7 20-4-9-9-4Z", key: "1q3vgg" }],
  ["path", { d: "M22 2 11 13", key: "nzbqef" }]
]);
function randomId() {
  return Math.random().toString(36).slice(2, 10);
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
        className: "relative z-10 glass rounded-2xl shadow-card border border-border-accent w-full max-w-sm mx-4",
        onClick: (e) => e.stopPropagation(),
        children
      }
    )
  ] });
}
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-card text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all";
function CreateChannelModal({ onClose, onCreate }) {
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const sanitizeName = (s) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-4 h-4 text-purple-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Create Channel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: [
          "Channel Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: name,
            onChange: (e) => setName(sanitizeName(e.target.value)),
            placeholder: "e.g. general, announcements",
            className: inputCls,
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1", children: "Lowercase, no spaces. Hyphens allowed." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-text-secondary mb-1.5 block", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "What is this channel for?",
            className: inputCls
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border-default bg-bg-secondary/40 rounded-b-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !name.trim(), onClick: () => {
        onCreate(name.trim(), description.trim());
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-4 h-4" }),
        " Create Channel"
      ] })
    ] })
  ] });
}
function DeleteChannelModal({ name, onClose, onConfirm }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModalWrap, { onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-rose" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-text-primary", children: "Delete Channel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-text-secondary mb-3", children: [
        "Delete channel ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-text-primary", children: [
          "#",
          name
        ] }),
        "? All messages will be lost."
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
function MessageBubble({ msg, isOwn }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      className: clsx("flex items-end gap-2 max-w-[75%]", isOwn ? "ml-auto flex-row-reverse" : "mr-auto"),
      children: [
        !isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center text-xs font-bold text-purple-light shrink-0 mb-0.5", children: msg.username[0].toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          !isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mb-1 ml-1", children: msg.username }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(
            "px-3.5 py-2 rounded-2xl text-sm",
            isOwn ? "bg-purple text-white rounded-br-sm" : msg.isAdmin ? "bg-amber/15 border border-amber/30 text-text-primary rounded-bl-sm" : "bg-white/8 border border-border-default text-text-primary rounded-bl-sm"
          ), children: [
            msg.isAdmin && !isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber font-semibold mb-0.5", children: "Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "leading-relaxed", children: msg.content })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: clsx("text-[10px] text-text-muted mt-0.5", isOwn ? "text-right mr-1" : "ml-1"), children: format(new Date(msg.timestamp), "HH:mm") })
        ] })
      ]
    }
  );
}
function Chats() {
  const { id: appId } = useParams();
  const [channels, setChannels] = reactExports.useState([]);
  const [messages, setMessages] = reactExports.useState([]);
  const [activeChannel, setActiveChannel] = reactExports.useState(null);
  const [input, setInput] = reactExports.useState("");
  const [modal, setModal] = reactExports.useState(null);
  const [channelToDelete, setChannelToDelete] = reactExports.useState(null);
  const [channelMenuId, setChannelMenuId] = reactExports.useState(null);
  const messagesEndRef = reactExports.useRef(null);
  const channelMessages = activeChannel ? messages.filter((m) => m.channelId === activeChannel.id) : [];
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages.length, activeChannel?.id]);
  const sendMessage = () => {
    if (!input.trim() || !activeChannel) return;
    setMessages((prev) => [...prev, {
      id: randomId(),
      channelId: activeChannel.id,
      userId: "admin",
      username: "Admin",
      content: input.trim(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      isAdmin: true
    }]);
    setInput("");
  };
  const createChannel = (name, description) => {
    const newChannel = {
      id: randomId(),
      name,
      description: description || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setChannels((prev) => [...prev, newChannel]);
    setActiveChannel(newChannel);
  };
  const deleteChannel = (channel) => {
    const remaining = channels.filter((c) => c.id !== channel.id);
    setMessages((prev) => prev.filter((m) => m.channelId !== channel.id));
    setChannels(remaining);
    if (activeChannel?.id === channel.id) {
      setActiveChannel(remaining.length > 0 ? remaining[0] : null);
    }
  };
  const unreadCount = (channelId) => messages.filter((m) => m.channelId === channelId).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-text-primary", children: "Chats" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-text-muted mt-0.5", children: "In-app messaging channels between you and your application users." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl border border-border-default overflow-hidden flex", style: { height: "580px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-56 shrink-0 border-r border-border-default flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-3 border-b border-border-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-3.5 h-3.5 text-text-muted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-text-primary", children: "Channels" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setModal("create"),
              className: "p-1 rounded-lg text-text-muted hover:text-purple-light hover:bg-purple/5 transition-colors",
              title: "New channel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto py-1.5 px-1.5 space-y-0.5", children: [
          channels.map((ch) => {
            const isActive = activeChannel?.id === ch.id;
            const count = unreadCount(ch.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setActiveChannel(ch),
                  className: clsx(
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors",
                    isActive ? "bg-purple/20 text-purple-light" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-3.5 h-3.5 shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium truncate flex-1", children: ch.name }),
                    count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-text-muted bg-white/8 px-1 rounded", children: count })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setChannelMenuId(channelMenuId === ch.id ? null : ch.id);
                    },
                    className: "p-1 rounded text-text-muted hover:text-text-primary transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoreHorizontal, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: channelMenuId === ch.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.95, y: -4 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95, y: -4 },
                    className: "absolute right-0 top-full mt-1 w-32 glass rounded-xl border border-border-accent shadow-card overflow-hidden z-30",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => {
                          setChannelToDelete(ch);
                          setModal("delete");
                          setChannelMenuId(null);
                        },
                        className: "w-full flex items-center gap-2 px-3 py-2 text-xs text-rose hover:bg-rose/8 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                          " Delete"
                        ]
                      }
                    )
                  }
                ) })
              ] })
            ] }, ch.id);
          }),
          channels.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-text-muted", children: "No channels yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setModal("create"), className: "text-[11px] text-purple-light hover:underline mt-1", children: "Create one" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2.5 border-t border-border-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px]", children: [
            activeChannel ? new Set(messages.filter((m) => m.channelId === activeChannel.id).map((m) => m.userId)).size : 0,
            " participants"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0", children: !activeChannel ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: MessageSquare,
          title: "No channel selected",
          description: "Create a channel on the left to get started."
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3 border-b border-border-default bg-bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-4 h-4 text-text-muted shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-text-primary", children: activeChannel.name }),
            activeChannel.description && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-muted ml-2", children: activeChannel.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-3", children: channelMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: MessageSquare,
            title: "No messages yet",
            description: `Be the first to send a message in #${activeChannel.name}`
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border-default" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-text-muted", children: formatDistanceToNow(new Date(channelMessages[0].timestamp), { addSuffix: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border-default" })
          ] }),
          channelMessages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBubble, { msg, isOwn: msg.userId === "admin" }, msg.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border-default bg-bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                },
                placeholder: `Message #${activeChannel.name}...`,
                className: "flex-1 h-9 px-3.5 rounded-xl border border-border-default bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/15 transition-all"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: sendMessage,
                disabled: !input.trim(),
                className: clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                  input.trim() ? "bg-purple hover:bg-purple/80 text-white" : "bg-white/5 border border-border-default text-text-muted cursor-not-allowed"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-text-muted mt-1.5", children: "Press Enter to send · Messages visible to app users" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateChannelModal, { onClose: () => setModal(null), onCreate: createChannel }),
      modal === "delete" && channelToDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteChannelModal,
        {
          name: channelToDelete.name,
          onClose: () => {
            setModal(null);
            setChannelToDelete(null);
          },
          onConfirm: () => deleteChannel(channelToDelete)
        }
      )
    ] })
  ] });
}
export {
  Chats as default
};
