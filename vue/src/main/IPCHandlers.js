// import { app, dialog } from "electron";
// import Utils from "./index";
import log from 'electron-log'
import open from 'open'
import pathsService from '../services/pathsService';
import authService from '@/services/authService';
import utils from './utils';
// import { socket } from "./helpers/socket";
// import launcherVariables from "@/stores/launcherVariables";
// import authService from "@/services/authService";
// import Paths from "./helpers/paths";

// const utils = new Utils();
class Handlers {
  constructor(ipcMain, version) {
    this.isDialogOpen = false;
    this.ipcMain = ipcMain;
    this.version = version;
    this.win = null;
  }

  setWin(win) {
    this.win = win
  }

  setMainHandlers() {
    this.ipcMain.handle("saveConfig", (event, config) => {
      utils.saveConfig(JSON.parse(config));
    });

    this.ipcMain.handle("openLogsFile", (event, config) => {
      utils.openLogsFile();
    });

    this.ipcMain.handle("getConfig", (event) => {
      return utils.getConfig();
    });

    this.ipcMain.handle("login", async (event, loginData) => {
      const { data, error } = await authService.login(loginData);
      return { data, error };
    });

    this.ipcMain.handle("register", async (event, data) => {
      const result = await authService.register(data);
      return result;
    });

    // this.ipcMain.handle("startSocket", async () => {
    //   return socket.startSocket();
    // });

    this.ipcMain.handle("searchPaths", async () => {
      return pathsService.searchPaths();
    });

    this.ipcMain.handle("getSID", (event) => {
      return utils.getSID();
    });

    this.ipcMain.handle("getBoughtGames", (event) => {
      return utils.getBoughtGames();
    });

    this.ipcMain.handle("getFavouriteGames", (event) => {
      return utils.getFavouriteGames();
    });

    this.ipcMain.handle("getLauncherInfo", (event) => {
      return utils.getLauncherInfo();
    });

    this.ipcMain.handle("selectRLPath", (event) => {
      return pathsService.selectRLPath();
    });

    this.ipcMain.handle("selectSampPath", (event) => {
      return pathsService.selectSampPath();
    });

    this.ipcMain.handle("openLink", (event, url) => {
      open(url);
    });

    this.ipcMain.handle('hideWindow', () => {
      this.win.hide()
    })

    this.ipcMain.handle('closeApp', () => {
      this.win.close()
    })

    this.ipcMain.handle('minApp', () => {
      this.win.minimize()
    })
  }
}

export default Handlers;
