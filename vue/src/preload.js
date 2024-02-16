import { contextBridge, ipcRenderer } from "electron";
import log from "electron-log";


contextBridge.exposeInMainWorld("client", {
  sendEvent: (event, ...args) => {
    log.info("[sendEvent] Send event:", event);
    return ipcRenderer.invoke(event, ...args);
  },
});

contextBridge.exposeInMainWorld("log", {
  info: (...msg) => log.info(...msg),
  error: (...msg) => log.error(...msg),
});