"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  minimize: () => electron.ipcRenderer.send("window:minimize"),
  maximize: () => electron.ipcRenderer.send("window:maximize"),
  close: () => electron.ipcRenderer.send("window:close"),
  isMaximized: () => electron.ipcRenderer.invoke("window:isMaximized"),
  platform: process.platform
});
