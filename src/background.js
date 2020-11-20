"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
// import { machineId, machineIdSync } from "node-machine-id";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require('path');


ipcMain.on('getMsg', (sys, msg) => {
  console.log(msg)  //接收窗口传来的消息
})
console.info(2233, path.join(__dirname.substring(0,__dirname.length - 13), "src/preload.js"));

// window.ipcRenderer = ipcRenderer
// const path = require('path');
// global.mac = "1234";

// ipcMain.on('msg-a', function (event, msg) {
//   // 接收数据
//   console.log(msg);

//   // 发送数据的两种方法
//   // 1.
//   event.sender.send('msg-b', 'HMCXY');
//   // 2. 利用窗口的webContents
//   //  win.webContents.send('msg-b','HMCXY');

// })

// machineId().then(id => {
//   console.info("id", id);
// });

// // Syncronous call

// let id1 = machineIdSync();

// console.info("id1", id1);
// console.info(12, process.cwd() + '/src/preload.js')


// remote.getGlobal( "MyGlobalVariable" );

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
      nodeIntegration: true,
      preload: path.join(__dirname.substring(0,__dirname.length - 13), "src/preload.js"),
    }
  });

  // win.webContents.send('msg-b', 'HMCXY');
  // win.webContents.session.on('will-download', (event, item, webContents) => {
  //   const filePath = path.join(app.getPath('downloads'), item.getFilename());
  //   item.setSavePath(filePath);
  // });
  // win.webContents.downloadURL("http://searchbox.bj.bcebos.com/miniapp/demo-1.0.1.zip");
  win.webContents.send("mac", "Hi There!");

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