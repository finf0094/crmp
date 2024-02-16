import { app, BrowserWindow, protocol, ipcMain, Menu, Tray, systemPreferences, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from "path";
import log from "electron-log";
import Handlers from "./main/IPCHandlers";
import constants from "./constants/constants";

app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("no-sandbox");

const isDevelopment = process.env.NODE_ENV !== "production";

if (!isDevelopment) Menu.setApplicationMenu();
const secondInstanceLock = app.requestSingleInstanceLock();

log.transports.console.format = "{h}:{i}:{s} | <{processType}> | [{level}]| {text}";
log.transports.file.format = "{y}.{m}.{d}, {h}:{i}:{s} | <{processType}> | [{level}]| {text}";
log.transports.file.resolvePathFn = () => { return path.join(constants.appWorkingPath, "logs", "main.log") };
log.errorHandler.startCatching({ showDialog: false });

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

global.executeJavaScript = () => {};

class Launcher {
  constructor() {
    this.window = null;
  }

  async createWindow() {
    log.info('=== Start launcher ===');
    let display = screen.getPrimaryDisplay();
    const screenMultiplier = (display.size.width + display.size.height) / (1920 + 1080);
    const isTransparent = systemPreferences.isAeroGlassEnabled();
    log.info(`[Launcher] Screen: ${display.size.width}x${display.size.height}`);
    log.info(`[Launcher] Launcher Version: ${app.getVersion()}`);
    log.info(`[Launcher] Development Mode: ${isDevelopment}`);
    log.info(`[Launcher] DWM: ${isTransparent}`);
    this.window = new BrowserWindow({
      width: parseInt(1350 * screenMultiplier, 10),
      height: parseInt(850 * screenMultiplier, 10),
      transparent: isTransparent,
      frame: false,
      center: true,
      resizable: false,
      show: false,
      icon: path.join(__static, "favicon.ico"),
      webPreferences: {
        spellcheck: false,
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
        sandbox: false,
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();

      global.executeJavaScript = (code) => {
        if (!this.window.webContents) return;

        this.window.webContents.executeJavaScript(code);
      };
    });
    this.window.webContents.openDevTools();
    
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    } else {
      createProtocol("app");

      this.window.loadURL("app://./index.html");
    }
  }

  setAppListeners() {
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
    });

    app.setAppUserModelId("mikosh-launcher");

    app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
      log.error(`[event] <certificate-error> url: ${url}, certificates: ${certificate}, error: ${error}`);
    });

    app.on("render-process-gone", (event, webContents, details) => {
      log.error(`[event] <render-process-gone> details: ${details}`);
    });

    app.on("child-process-gone", (event, details) => {
      log.error(`[event] <child-process-gone> details: ${details}`);
    });

    app.on("second-instance", () => {
      log.info("Start second instance");
      this.window.show();
      this.window.center();
    });

    app.on("ready", async () => {
      const handlers = new Handlers(ipcMain, app.getVersion());
      handlers.setMainHandlers();

      const tray = new Tray(path.join(__static, "favicon.ico"));
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Открыть",
          type: "normal",
          click: () => {
            this.window.show();
            this.window.center();
          },
        },
        {
          label: "Закрыть",
          type: "normal",
          click: () => {
            app.quit();
          },
        },
      ]);

      tray.on("double-click", () => {
        this.window.show();
        this.window.center();
      });

      tray.setToolTip("Mikosh Launcher");
      tray.setContextMenu(contextMenu);

      this.createWindow();

      handlers.setWin(this.window);
    });

    if (isDevelopment) {
      if (process.platform === "win32") {
        process.on("message", (data) => {
          if (data === "graceful-exit") {
            app.quit();
          }
        });
      } else {
        process.on("SIGTERM", () => {
          app.quit();
        });
      }
    }
  }
}

if (!secondInstanceLock) {
  log.info("[Launcher] Second instance is not running, launch");
} else {
  const launcher = new Launcher();
  launcher.setAppListeners();
}
