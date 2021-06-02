import Vue from "vue";
import App from "./App.vue";
import router from './router';
import 'lib-flexible';
import './assets/css/init.css';
import animated from "animate.css";
const {
  ipcRenderer
} = window.require("electron");

Vue.config.productionTip = false;
Vue.use(animated);

window.MAC = ipcRenderer.sendSync('mac');

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");