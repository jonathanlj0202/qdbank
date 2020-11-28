"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import getMAC from 'getmac'
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getCultureData } from "./api";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require('path');
const fs = require("fs");
const pathName = app.getPath('downloads');
//连接SockJS的endpoint名称为"endpoint-websocket"
// const socket = new SockJS(process.env.VUE_APP_SOCKETURL);
const socket = new SockJS("http://192.168.2.30:8089/bankmanage/endpoint-websocket");
// 获取STOMP子协议的客户端对象
let stompClient = Stomp.over(socket);

let dirs = [];

ipcMain.on('mac', (event) => {
  // console.log(arg) // prints "ping11111"
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

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);



async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
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




  fs.readdir(pathName, function (err, files) {
    (function iterator(i) {
      if (i == files.length) {
        win.webContents.session.on('will-download', (event, item, webContents) => {
          const filePath = path.join(app.getPath('downloads'), item.getFilename());
          item.setSavePath(filePath);
        });
        getCultureData({
          terminal_no: "cs001",
        }).then((res) => {
          if (res.data[0] && res.data[0].video[0]) {
            res.data[0].video.forEach((ele, index) => {
              if (dirs.length > 0) {
                let downBoo = true;
                dirs.forEach(element => {
                  if (ele.video.indexOf(element) > -1) {
                    downBoo = false;
                  }
                });
                if (downBoo) {
                  win.webContents.downloadURL(ele.video);
                }
              } else {
                win.webContents.downloadURL(ele.video);
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


  ipcMain.on('videodownload', (event, url) => {
    win.webContents.session.on('will-download', (event, item, webContents) => {
      const filePath = path.join(app.getPath('downloads'), item.getFilename());
      item.setSavePath(filePath);
    });
    win.webContents.downloadURL = url;
  });

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