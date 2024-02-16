import path from "path";
import fs from 'fs';
import log from 'electron-log';
import { exec } from "child_process";
import { dialog } from "electron";

class Paths {
  constructor() {
    this.RLPath = null;
    this.sampPath = null;
    this.isSelectPathDialogOpen = false;
  }

  async selectRLPath(customPath) {
    this.isSelectPathDialogOpen = true;

    log.info('================================');
    log.info("[selectRLPath] Start select path: Radmir Launcher");
    const { filePaths, canceled } = await dialog.showOpenDialog({ properties: ["openDirectory"], defaultPath: customPath });

    this.isSelectPathDialogOpen = false;
    log.info(`[selectRLPath] Selected path for RL: "${filePaths[0]}". Canceled: "${canceled}"`);

    if (canceled) return false;
    if (!this.checkRLPath(filePaths[0])) return "invalid-path";

    return filePaths[0];
  }

  async selectSampPath(customPath) {
    if (this.isSelectPathDialogOpen) return false;
    this.isSelectPathDialogOpen = true;

    log.info('================================');
    log.info("[selectSampPath] Start select path: SAMP");
    const { filePaths, canceled } = await dialog.showOpenDialog({ properties: ["openDirectory"], defaultPath: customPath });

    this.isSelectPathDialogOpen = false;
    log.info(`[selectSampPath] Selected path for SAMP: "${filePaths[0]}". Canceled: "${canceled}"`);

    if (canceled) return false;
    if (!this.checkSampPath(filePaths[0])) return "invalid-path";

    return filePaths[0];
  }

  async searchPaths() {
    log.info('================================');
    log.info('[searchPaths] Start search paths');

    await this.searchRLPath();
    await this.searchSampPath();

    if ((this.RLPath === null || this.RLPath === "") || (this.sampPath === null || this.sampPath === "")) return 'error';

    
    log.info(`[searchPaths] Search paths finished! RLPath: ${this.RLPath}, SampPath: ${this.sampPath}`);
    log.info(`================================`);
    return [this.RLPath, this.sampPath];
  }

  async searchPaths() {
    log.info('================================');
    log.info('[searchPaths] Start search paths');
  
    await this.searchRLPath();
    if (this.RLPath === null || this.RLPath === "") {
      log.info('[searchPaths] Radmir launcher path not found. Aborting search.');
      return 'error';
    }
  
    await this.searchSampPath();
    if (this.sampPath === null || this.sampPath === "") {
      log.info('[searchPaths] Samp path not found. Aborting search.');
      return 'error';
    }
  
    log.info('================================');
    log.info(`[searchPaths] Search paths finished! RLPath: ${this.RLPath}, SampPath: ${this.sampPath}`);
    return [this.RLPath, this.sampPath];
  }
  
  async searchRLPath() {
    const drives = ['C:\\', 'D:\\', 'E:\\', 'F:\\'];
    log.info('[searchRLPath] Start search radmir launcher path...');
    for (const drive of drives) {
      try {
        const { stdout } = await new Promise((resolve, reject) => {
          exec(`dir /s /b ${drive}RADMIR_LAUNCHER_EX.exe`, (error, stdout, stderr) => {
            if (error || stderr) {
              if ((error?.message.includes(drive) || stderr?.includes(drive))) {
                resolve({ stdout: '', stderr: '' });
              } else {
                reject(error || stderr);
              }
            } else {
              resolve({ stdout, stderr });
            }
          });
        });
  
        if (stdout) {
          const RLPath = stdout.trim().replace('\\RADMIR_LAUNCHER_EX.exe', '');
          log.info(`[searchRLPath] Found path for radmir launcher: "${RLPath}". Checking for valid...`);
  
          if (this.checkRLPath(RLPath)) {
            log.info(`[searchRLPath] Radmir launcher path found successfully! Path: "${RLPath}"`);
            this.RLPath = RLPath;
            return;
          } else {
            log.info(`[searchRLPath] Radmir launcher path is not valid.`);
            throw new Error('Invalid Radmir launcher path.');
          }
        } else {
          log.info(`[searchRLPath] Folder not found.`);
          throw new Error('Radmir launcher folder not found.');
        }
      } catch (error) {
        log.error(`[searchPaths] ${error.message}`);
        throw error;
      }
    }
  }
  
  async searchSampPath() {
    log.info('[searchSampPath] Start search samp path...');
    const drives = ['C:\\', 'D:\\', 'E:\\', 'F:\\'];
    for (const drive of drives) {
      try {
        const { stdout } = await new Promise((resolve, reject) => {
          exec(`dir /s /b ${drive}crmp`, (error, stdout, stderr) => {
            if (error || stderr) {
              if ((error?.message.includes(drive) || stderr?.includes(drive))) {
                resolve({ stdout: '', stderr: '' });
              } else {
                reject(error || stderr);
              }
            } else {
              resolve({ stdout, stderr });
            }
          });
        });
  
        if (stdout) {
          const sampPath = stdout.trim();
          log.info(`[searchSampPath] Found path for samp: "${sampPath}". Checking for valid...`);
          if (this.checkSampPath(sampPath)) {
            log.info(`[searchSampPath] Samp path found successfully! Path: "${sampPath}"`);
            this.sampPath = sampPath;
            return;
          } else {
            log.info(`[searchSampPath] Samp path is not valid.`);
            throw new Error('Invalid Samp path.');
          }
        } else {
          log.info(`[searchSampPath] Folder not found`);
          throw new Error('Samp folder not found.');
        }
      } catch (error) {
        log.error(`[searchSampPath] ${error.message}`);
        throw error;
      }
    }
  }

  checkSampPath(sampPath) {
    log.info(`[checkSampPath] Check path: "${sampPath}"`);
    const clientSideDll = fs.existsSync(path.join(sampPath, "clientside.dll"));
    const gtaSaExe = fs.existsSync(path.join(sampPath, "gta_sa.exe"));
    const sampExe = fs.existsSync(path.join(sampPath, "samp.exe"));
    const launcherExe = fs.existsSync(path.join(sampPath, "cef", "launcher.exe"));
    return clientSideDll && gtaSaExe && sampExe && launcherExe;
  }

  checkRLPath(RLPath) {
    log.info(`[checkRLPath] Check path: "${RLPath}"`);
    const radmirExe = fs.existsSync(path.join(RLPath, "RADMIR_LAUNCHER.exe"));
    const radmirExExe = fs.existsSync(path.join(RLPath, "RADMIR_LAUNCHER_EX.exe"));
    const resourcesPak = fs.existsSync(path.join(RLPath, "resources.pak"));
    const appAsar = fs.existsSync(path.join(RLPath, "resources", "app.asar"));
    const crmpFolder = fs.existsSync(path.join(RLPath, "resources", "projects", "crmp"));
    return radmirExe && radmirExExe && resourcesPak && appAsar && crmpFolder;
  }
}

export default new Paths();