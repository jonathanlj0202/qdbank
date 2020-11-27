import Vue from "vue";
import App from "./App.vue";
import router from './router';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'lib-flexible'
import './assets/css/init.css'
import 'swiper/css/swiper.css'

const { ipcRenderer } = window.require("electron");

Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper)

window.MAC = ipcRenderer.sendSync('mac');
window.MAC = "cs001";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");




