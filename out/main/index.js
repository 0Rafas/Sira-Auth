"use strict";
const electron = require("electron");
const path = require("path");
const isDev = !electron.app.isPackaged;
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    frame: false,
    backgroundColor: "#080812",
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
      webSecurity: true
    }
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: "deny" };
  });
  if (isDev) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"] ?? "http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.ipcMain.on("window:minimize", (e) => {
  electron.BrowserWindow.fromWebContents(e.sender)?.minimize();
});
electron.ipcMain.on("window:maximize", (e) => {
  const win = electron.BrowserWindow.fromWebContents(e.sender);
  win?.isMaximized() ? win.unmaximize() : win?.maximize();
});
electron.ipcMain.on("window:close", (e) => {
  electron.BrowserWindow.fromWebContents(e.sender)?.close();
});
electron.ipcMain.handle("window:isMaximized", (e) => {
  return electron.BrowserWindow.fromWebContents(e.sender)?.isMaximized() ?? false;
});
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
