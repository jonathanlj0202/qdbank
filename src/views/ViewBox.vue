<template>
  <div class="container-box" @click="goStandPage()">
    <router-view name="v1" class="view"></router-view>
    <router-view name="v2" class="view"></router-view>
    <router-view name="v3" class="view"></router-view>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";

export default {
  name: "ViewBox",
  components: {},
  data() {
    return {
      timeVal: null,
    };
  },
  created() {
    this.connectionSocket();
    this.timeVal = setTimeout(() => {
      this.$router.push({ path: "/bview1", query: { attr: "standpage" } });
    }, 120000);
  },
  methods: {
    connectionSocket() {
      //连接SockJS的endpoint名称为"endpoint-websocket"
      const socket = new SockJS(process.env.VUE_APP_SOCKETURL);
      // 获取STOMP子协议的客户端对象
      let stompClient = Stomp.over(socket);
      stompClient.debug = null;
      // 向服务器发起websocket连接
      stompClient.connect(
        {},
        () => {

          //页面选择
          stompClient.subscribe("/topic/service_Model", (response) => {
            let result = JSON.parse(response.body);
            if (result[0]) {
              clearTimeout(this.timeVal);
            }
          });
        },
        (err) => {
          console.log("连接失败", err);
        }
      );
    },
    goStandPage() {
      if (this.timeVal) {
        clearTimeout(this.timeVal);
        this.timeVal = null;
      }
      this.timeVal = setTimeout(() => {
        this.$router.push({ path: "/bview1", query: { attr: "standpage" } });
      }, 120000);
    },
  },
};
</script>

<style scoped>
.container-box {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.view {
  width: 1100px;
  float: left;
  overflow: hidden;
}

.view:nth-child(2) {
  width: 1040px !important;
}
</style>
