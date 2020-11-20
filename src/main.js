import Vue from "vue";
import App from "./App.vue";
import router from './router'
import './assets/scss/init.css'

Vue.config.productionTip = false;

// 接收
console.info(221, window.ipcRenderer);
window.ipcRenderer.on("mac", (event, myGlobalVariableValue) => {
  // global.myGlobalVariable = myGlobalVariableValue;
  console.info(2211, event, myGlobalVariableValue);
});

// window.ipcRenderer.send("getMsg", "123");

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
