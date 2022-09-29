import * as path from 'path';
import * as fs from 'fs-extra';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { app, BrowserWindow } from 'electron';
import { windowMarkShouldQuit } from '../node/window_state';

import {
  getPrintableError,
  LoggerType,
  MessagesType,
  showCannotUpdateDialog,
  // showDownloadUpdateDialog,
  showUpdateDialog,
} from './common';
import { gt as isVersionGreaterThan, parse as parseVersion } from 'semver';
import { getLastestRelease } from '../node/latest_desktop_release';
// import * as file from 'fs';
// import * as os from "os";
let isUpdating = false;
let downloadIgnored = false;
let interval: NodeJS.Timeout | undefined;
let stopped = false;

export async function start(
  getMainWindow: () => BrowserWindow | null,
  messages: MessagesType,
  logger: LoggerType
) {
  if (interval) {
    logger.info('auto-update: Already running');

    return;
  }

  logger.info('auto-update: starting checks...');

  autoUpdater.logger = logger;
  autoUpdater.autoDownload = false;

  interval = global.setInterval(async () => {
    try {
      await checkForUpdates(getMainWindow, messages, logger);
    } catch (error) {
      logger.error('auto-update: error:', getPrintableError(error));
    }
  }, 10 * 60 * 10); // trigger and try to update every 10 minutes to let the file gets downloaded if we are updating
  stopped = false;

  await checkForUpdates(getMainWindow, messages, logger);
}

export function stop() {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
  stopped = true;
}

async function checkForUpdates(
  getMainWindow: () => BrowserWindow | null,
  messages: MessagesType,
  logger: LoggerType
) {
  logger.info('[updater] checkForUpdates');
  if (stopped || isUpdating || downloadIgnored) {
    return;
  }

  const canUpdate = await canAutoUpdate();
  logger.info('[updater] canUpdate', canUpdate);
  // insertInto(`[updater] canUpdate",${canUpdate}`)
  console.log(path.join(__dirname, '..', '..', 'config'))
  if (!canUpdate) {
    logger.info('checkForUpdates canAutoUpdate false');
    return;
  }

  logger.info('[updater] checkForUpdates...');

  isUpdating = true;

  try {
    const latestVersionFromFsFromRenderer = getLastestRelease();
    // insertInto(`[updater] checkForUpdates isMoreRecent:",${latestVersionFromFsFromRenderer}`)
    // insertInto(`VERSION cuurent :weepoe`)
    logger.info('[updater] latestVersionFromFsFromRenderer', latestVersionFromFsFromRenderer);
    if (!latestVersionFromFsFromRenderer || !latestVersionFromFsFromRenderer?.length) {
      logger.info(
        '[updater] testVersionFromFsFromRenderer was not updated yet by renderer. Skipping update check'
      );
      return;
    }
    // insertInto(`VERSION cuurent :`)
    const currentVersion = autoUpdater.currentVersion.toString();
    // insertInto(`VERSION cuurent :",${currentVersion}`)
    const isMoreRecent = isVersionGreaterThan(latestVersionFromFsFromRenderer, currentVersion);
    // insertInto(`[updater] checkForUpdates isMoreRecent:",${isMoreRecent}`)
    logger.info('[updater] checkForUpdates isMoreRecent', isMoreRecent);
    if (!isMoreRecent) {
      logger.info(
        `Fileserver has no update so we are not looking for an update from github current:${currentVersion} fromFileServer:${latestVersionFromFsFromRenderer}`
      );
      return;
    }

    const mainWindow = getMainWindow();
    if (!mainWindow) {
      console.warn('cannot showDownloadUpdateDialog, mainWindow is unset');
      return;
    }
    // Get the update using electron-updater, this fetches from github
    await showCannotUpdateDialog(mainWindow, messages);

    const result = await autoUpdater.checkForUpdates();
    // insertInto(`RESULT:auto update:",${JSON.stringify(result)}`)
    logger.info('[updater] checkForUpdates got github response back ');

    if (!result.updateInfo) {
      logger.info('[updater] no update info received');

      return;
    }

    try {
      const hasUpdate = isUpdateAvailable(result.updateInfo);
      // insertInto(`[updater] hasUpdate:",${JSON.stringify(hasUpdate)}`)
      logger.info('[updater] hasUpdate:', hasUpdate);

      if (!hasUpdate) {
        logger.info('[updater] no update available');

        return;
      }

     

      logger.info('[updater] showing download dialog...');
      // const shouldDownload = await showDownloadUpdateDialog(mainWindow, messages);
      // insertInto(`[updater] shouldDownload:",${shouldDownload}`)
      autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
              // insertInto(`update-downloaded-event",${JSON.stringify(event)}`)
              // insertInto(`update-downloaded-releaseNotes",${releaseNotes}`)
              // insertInto(`update-downloaded-releasename",${releaseName}`)
        console.log("event, releaseNotes, releaseName:",event, releaseNotes, releaseName)
        autoUpdater.quitAndInstall(false)
     })

      // logger.info('[updater] shouldDownload:', shouldDownload);

      // if (!shouldDownload) {
      //   insertInto(`[updater] shouldDownload:if ::",${!shouldDownload}`)
      //   downloadIgnored = true;

      //   return;
      // }
      // insertInto(`[updater] shouldDownload:1::",${shouldDownload}`)
      console.log("AFTER")
    //  const down= await autoUpdater.downloadUpdate();
    //  insertInto(`download:",${down}`)

    } catch (error) {
      // insertInto(`[updater] error:",${error}`)
      const mainWindow = getMainWindow();
      if (!mainWindow) {
        console.warn('cannot showDownloadUpdateDialog, mainWindow is unset');
        return;
      }
    //  let app = await showCannotUpdateDialog(mainWindow, messages);
    //  insertInto(`showCannotUpdateDialog:",${JSON.stringify(app)}`)
      throw error;
    }
    const window = getMainWindow();
    if (!window) {
      console.warn('cannot showDownloadUpdateDialog, mainWindow is unset');
      return;
    }
    // Update downloaded successfully, we should ask the user to update
    logger.info('[updater] showing update dialog...');
    const shouldUpdate = await showUpdateDialog(window, messages);
    // insertInto(`[updater] showing update dialog...:",${JSON.stringify(shouldUpdate)}`)
    if (!shouldUpdate) {
      return;
    }

    logger.info('[updater] calling quitAndInstall...');
    windowMarkShouldQuit();
    autoUpdater.quitAndInstall();
  } finally {
    isUpdating = false;
  }
}

function isUpdateAvailable(updateInfo: UpdateInfo): boolean {
  const latestVersion = parseVersion(updateInfo.version);
  if (!latestVersion) {
    return false;
  }

  // We need to convert this to string because typescript won't let us use types across submodules ....
  const currentVersion = autoUpdater.currentVersion.toString();

  return isVersionGreaterThan(latestVersion, currentVersion);
}

/*
  Check if we have the required files to auto update.
  These files won't exist inside certain formats such as a linux deb file.
*/
async function canAutoUpdate(): Promise<boolean> {
  const isPackaged = app.isPackaged;

  console.log("ispackaged:",isPackaged)
  console.log("REsource:",process.resourcesPath)

  // On a production app, we need to use resources path to check for the file
  if (isPackaged && !process.resourcesPath) {
    return false;
  }

  // Taken from: https://github.com/electron-userland/electron-builder/blob/d4feb6d3c8b008f8b455c761d654c8088f90d8fa/packages/electron-updater/src/ElectronAppAdapter.ts#L25
  const updateFile = isPackaged ? 'app-update.yml' : 'dev-app-update.yml';
  const basePath = isPackaged && process.resourcesPath ? process.resourcesPath : app.getAppPath();
  const appUpdateConfigPath = path.join(basePath, updateFile);
  console.log("after update")
  return new Promise(resolve => {
    try {
      // tslint:disable-next-line: non-literal-fs-path
      const exists = fs.existsSync(appUpdateConfigPath);
      resolve(exists);
    } catch (e) {
      resolve(false);
    }
  });
}

// function insertInto(a:any){
//   file.appendFileSync(`${os.homedir()}/Desktop/updateLog.json`,`${a}`+'\n', 'utf8');
// }