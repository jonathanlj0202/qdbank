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

if (process.env.NODE_ENV === "development") {
  window.MAC = "00:15:5d:a9:fa:0c"
} else {
  window.MAC = ipcRenderer.sendSync('mac');
}

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");