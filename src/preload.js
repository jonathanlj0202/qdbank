// import { ipcRenderer } from 'electron';
window.ipcRenderer = require('electron').ipcRenderer;
window.ipcMain = require('electron').ipcMain;

// // electron的BrowserWindow设置nodeIntegration为true时，导致页面可以访问node的module影响页面正常模块引入功能，如jQuery
// document.addEventListener('DOMNodeInserted', function(event){
//     // 页面内容加载之前需要引入的一些代码
//     if (document.head && !document.getElementById('module')) {
//       var script = document.createElement('script');
//       script.setAttribute('id', 'module');
//       script.innerHTML = "if (typeof module === 'object') {window.module = module; module = undefined;}"
//       document.head.appendChild(script);
//     }

//   });
//   document.addEventListener('DOMContentLoaded', function(event) {
//     // 页面内容加载之后需要引入的一些操作
//     var script = document.createElement('script');
//     script.innerHTML = `if (window.module) module = window.module;`
//     document.body.appendChild(script);
//   })