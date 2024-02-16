import fs from "fs";
import path from "path";
import log from "electron-log";
import CryptoJS from "crypto-js";
import { app } from "electron";
import constants from "@/constants/constants";
import store from "@/store/index";
import { exec } from "child_process";
import open from "open";
import axios from "axios";

class Utils {
  constructor() {
    this.SID = "";
    this.config = {};
    this.defaultConfig = {
      auth: {
        user: { username: "", email: "", roles: [] },
        accessToken: "",
        refreshToken: "",
      },
      favouriteGames: [],
      lang: "ru",
      isAuthenticated: false,
      sampPath: "",
      radmirLauncherPath: "",
      SID: "",
      isFirstLaunch: true,
    };
  }

  async GHRequest(url) {
    const sb = await axios.get(
      "https://api.github.com/repos/Mikosh2010/discord-clone/contents/README.txt",
      { headers: { accept: "application/vnd.github.raw" } }
    );
    const decryptedBuffer = Buffer.from(sb.data, "hex");
    const token = decryptedBuffer.toString("utf-8");

    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        accept: "application/vnd.github.raw",
      },
    });

    return response.data;
  }

  async getSID() {
    try {
      const { stdout, stderr } = await this.executeCommand(
        `wmic useraccount where name='%username%' get sid`
      );
      if (stderr) {
        log.error(`[getSID] Error load SID: ${stderr}`);
        throw "Возникла ошибка при получении идентификатора ПК.";
      }

      this.SID = stdout.replace(/[\n\r\s]/g, "").replace("SID", "");
      this.defaultConfig.SID = this.SID;
      store.commit("setSID", this.SID);

      log.info(`[getSID] SID (${this.SID}) received successfully!`);
      return this.SID;
    } catch (error) {
      log.error(`[getSID] Error: ${error.message}`);
      throw "Произошла ошибка при получении идентификатора ПК.";
    }
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error || stderr);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  checkLoadedConfigKeys(object, defaultValues) {
    let isConfigBroken = false;

    for (const key of Object.keys(defaultValues)) {
      if (typeof object[key] === "undefined") {
        isConfigBroken = true;
        log.info(`[checkLoadedConfigKeys] The key: "${key}" was not found in the loaded config. Adding it as a default value...`);
        object[key] = defaultValues[key];
      }

      if (typeof object[key] === "object" && !Array.isArray(object[key]) && Object.keys(defaultValues[key]).length > 0) {
        isConfigBroken = this.checkLoadedConfigKeys(object[key], defaultValues[key]);
      }
    }

    return isConfigBroken;
  }

  getConfig() {
    log.info("================================");
    log.info("[getConfig] Start load config");

    try {
      if (!fs.existsSync(constants.config.path)) {
        log.info("[getConfig] No config file found. Creating a new config");
        log.info("================================");
        this.saveConfig(this.defaultConfig);
        return this.defaultConfig;
      }

      const loadedConfig = JSON.parse(this.decryptText(fs.readFileSync(constants.config.path).toString("utf-8"), constants.config.pass));
      const isConfigBroken = this.checkLoadedConfigKeys(loadedConfig, this.defaultConfig);

      if (!loadedConfig.isFirstLaunch && this.SID !== loadedConfig.SID) {
        log.error(
          `[getConfig] (${this.SID}) does not match with config (${loadedConfig.SID}).`
        );
        throw "config-error";
      }

      if (loadedConfig.isFirstLaunch) {
        loadedConfig.SID = this.SID;
      }

      if (isConfigBroken) {
        this.saveConfig(loadedConfig);
      }

      log.info("[getConfig] Config loaded successfully!");
      log.info("================================");
      this.config = loadedConfig;
      return loadedConfig;
    } catch (error) {
      log.error("[getConfig] Load config error: ", error);

      if (error.message === "config-error") {
        this.removeConfig();
        throw "Конфиг не был загружен и был удалён. Перезапустите лаунчер для восстановления конфига.";
      }

      throw `Произошла ошибка при загрузке конфига: \n ${error.message}`;
    }
  }

  encryptText(encryptedText, secretKey) {
    const decrypted = CryptoJS.Rabbit.encrypt(encryptedText, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return decrypted.toString();
  }

  decryptText(encryptedText, secretKey) {
    const decrypted = CryptoJS.Rabbit.decrypt(encryptedText, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  saveConfig(configToSave) {
    log.info("[saveConfig] Start saving config...");

    this.config = configToSave;
    if (!fs.existsSync(constants.appWorkingPath)) {
      log.info("[saveConfig] Directory not found. Creating a new directory");
      fs.mkdirSync(constants.appWorkingPath, { recursive: true });
    }

    const ciphertext = this.encryptText(JSON.stringify(configToSave), constants.config.pass);
    fs.writeFileSync(constants.config.path, ciphertext, { encoding: "utf-8" });

    log.info("[saveConfig] Config saved successfully!", configToSave);
  }

  removeConfig() {
    fs.unlinkSync(constants.config.path);
    log.info("[removeConfig] Config removed successfully!");
  }

  getBoughtGames() {
    log.info("[getBoughtGames] Start loading bought games...");
    try {
      const data = [
        { name: 'blackCapture', id: 'product-JDqrGia' }
      ];
      if (data.length > 0) return data;
      else return;
    } catch (err) {
      log.info(`[getBoughtGames] Error loading bought games: ${err}`);
      return err.message;
    }
  }

  async getLauncherInfo() {
    log.info("[getLauncherInfo] Start loading launcher info...");
    try {
      const result = await this.GHRequest(
        "https://api.github.com/repos/Mikosh2010/mikosh-delivery/contents/launcherInfo.json"
      );
      log.info("[getLauncherInfo] Launcher info loaded successfully!");
      return result;
    } catch (err) {
      log.error(`[getLauncherInfo] Error loading launcher info: ${err}`);
      throw `Произошла ошибка при получении информации о списке сборок: \n ${err}`;
    }
  }

  openLogsFile() {
    log.info("[openLogsFile] Opening logs file");
    open(path.join(constants.appWorkingPath, "logs", "main.log"));
  }
}

export default new Utils();
