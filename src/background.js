"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain
} from "electron";
import getMAC from 'getmac'
import {
  createProtocol
} from "vue-cli-plugin-electron-builder/lib";
import {
  getCultureData
} from "./api";
import {
  autoUpdater
} from 'electron-updater';
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require('path');
const fs = require("fs");
const pathName = 'C:/nginx/html';
let win = "";

let dirs = [];

ipcMain.on('mac', (event) => {
  event.returnValue = getMAC();
})

ipcMain.on('videolist', (event) => {
  let videolistArr = [];
  fs.readdir(pathName, function (err, files) {
    (function iterator(i) {
      if (i == files.length) {
        event.returnValue = videolistArr;
        return;
      }
      fs.stat(path.join(pathName, files[i]), function (err, data) {
        if (data.isFile()) {
          if (files[i].indexOf('mp4') > -1) {
            videolistArr.push(files[i]);
          }
        }
        iterator(i + 1);
      });
    })(0);
  });

})

//当增加视频通知更新下载
ipcMain.on('updatedownload', (event) => {
  downloadfile();
  event.returnValue = 11;
  // return;
});

//首次调用播放列表
function downloadfile() {
  fs.readdir(pathName, function (err, files) {
    (function iterator(i) {
      if (i == files.length) {
        win.webContents.session.on('will-download', (event, item, webContents) => {
          const filePath = path.join(pathName, item.getFilename());
          item.setSavePath(filePath);
        });
        getCultureData({
          terminal_no: getMAC(),
        }).then((res) => {
          if (res.data && res.code === "0000") {
            res.data.forEach((ele, index) => {
              if (dirs.length > 0) {
                let downBoo = true;
                dirs.forEach(element => {
                  if (ele.sourcestype === "视频" && ele.sources.indexOf(element) > -1) {
                    downBoo = false;
                  }
                });
                if (ele.sourcestype === "视频" && downBoo) {
                  win.webContents.downloadURL(ele.sources);
                }
              } else if (ele.sourcestype === "视频") {
                win.webContents.downloadURL(ele.sources);
              }
            });
          }
        });
        return;
      }
      fs.stat(path.join(pathName, files[i]), function (err, data) {
        if (data.isFile()) {
          if (files[i].indexOf('mp4') > -1) {
            dirs.push(files[i]);
          }
        }
        iterator(i + 1);
      });
    })(0);
  });
}

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(uploadUrl) {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  const os = require('os');

  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    win.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments);
      console.log("开始更新");
      //some code here to handle event
      autoUpdater.quitAndInstall();
    });

    win.webContents.send('isUpdateNow')
  });

  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  win.webContents.send('message', text)
}


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: "app",
  privileges: {
    secure: true,
    standard: true
  }
}]);


async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    // width: 800,
    // height: 600,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      nodeIntegration: true
    }
  });

  downloadfile();

  //设置版本更新地址，即将打包后的latest.yml文件和exe文件同时放在    
  //http://xxxx/test/version/对应的服务器目录下,该地址和package.json的publish中的url保持一致
  let feedUrl = "http://8.131.236.236/update/qdabc";
  //检测版本更新
  updateHandle(feedUrl);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}



// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
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