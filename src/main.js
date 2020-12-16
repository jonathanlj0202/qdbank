import Vue from "vue";
import App from "./App.vue";
import router from './router';
import 'lib-flexible'
import './assets/css/init.css'

const { ipcRenderer } = window.require("electron");

Vue.config.productionTip = false;

window.MAC = ipcRenderer.sendSync('mac');

window.MAC = "88:d7:f6:42:d6:dd";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");




