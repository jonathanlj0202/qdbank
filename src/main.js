import Vue from "vue";
import App from "./App.vue";
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'lib-flexible'
import './assets/css/init.css'
import 'swiper/css/swiper.css'

Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper)

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
