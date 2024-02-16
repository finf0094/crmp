import path from "path";
import { app } from "electron";

class Constants {
	constructor() {
		this.appWorkingPath = path.join(app.getPath('appData'), "mikosh-launcher");
		this.config = {
			fileName: "launcherConfig.mikosh",
			folderPath: path.join(this.appWorkingPath, 'config'),
			path: path.join(this.appWorkingPath, 'config', 'launcherConfig.mikosh'),
			pass: "IEFExgyT99iF3WK0R0QyR"
		}
		this.archivePath = "";
		this.archiveName = "archive.zip";
		this.serverUrl = "http://localhost:3002/api";
	}
}

export default new Constants();