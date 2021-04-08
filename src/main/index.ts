import { BrowserWindow, Menu, Tray, app, session } from 'electron';
import { join } from 'path';
import { description, name } from '../../package.json';
import { __static } from '@main/static';
import { General } from '@main/General';
import '@main/remote';
import logger from '@logger';

export let mainWindow: BrowserWindow | null, tray: Tray;
const mainWindowURL = import.meta.env.DEV
    ? 'http://localhost:9080/MainWindow.html'
    // eslint-disable-next-line node/no-path-concat
    : `file://${__dirname}/../render/MainWindow.html`;

export function createMainWindow() {
    if (mainWindow) {
        mainWindow.show();
        return;
    }
    /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        show: false,
        useContentSize: true,
        width: 1280,
        height: 720,
        minWidth: 620,
        minHeight: 400,
        title: description,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(mainWindowURL);

    mainWindow.once('ready-to-show', () => {
        if (!mainWindow) return;
        mainWindow.setContentSize(1280, 720);
        const [width, height] = mainWindow.getContentSize();
        mainWindow.setContentSize(1280 * 2 - width, 720 * 2 - height);
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    logger('app ready');
    tray = new Tray(join(__static, '/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '打开主界面', click: createMainWindow },
        {
            label: '退出',
            click: () => {
                General.getAllInstances().forEach(i => i.destroy());
                app.exit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('double-click', createMainWindow);
    tray.setToolTip(name);
    session.fromPartition('insecure-remote-content')
        .setPermissionRequestHandler((webContents, permission, callback) => callback(false));
    createMainWindow();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});

app.on('window-all-closed', () => {
    // do nothing
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
