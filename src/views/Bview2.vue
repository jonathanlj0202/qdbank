<template>
  <div class="container_b2">
    <div class="product-box">
      <div class="product" v-for="(item, index) of productArr" :key="index">
        <flipper
          width="100%"
          height="100%"
          :flipped="flippedArr[index]"
          @click="onClick(index)"
        >
          <div class="product-item" slot="front">
            <div
              class="item-logo"
              :style="{ backgroundImage: 'url(' + item.waterbusiness + ')' }"
            ></div>
            <div class="item-name">
              {{ item.watergoodsname }}
            </div>
          </div>
          <div class="product-item" slot="back">
            <div class="item-detail-name">{{ item.watergoodsname }}</div>
            <div class="item-detail-content" v-html="item.goodscontent"></div>
            <div class="item-detail-left-logo">
              <img :src="item.waterbusinessimage" />
            </div>
            <div class="item-detail-right-logo">
              <img :src="item.watercodeimage" />
            </div>
          </div>
        </flipper>
      </div>
    </div>
    <div class="dialog-wrapper" @click="clickdialog()" v-show="attr"></div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import Flipper from "vue-flipper";
import { getProductData } from "../api";

export default {
  name: "Bview2",
  components: {
    Flipper,
  },
  data() {
    return {
      flippedArr: [],
      productArr: [],
      attr: null,
      timeval: null,
    };
  },
  created() {
    this.connectionSocket();
    this.getProductDataFn();
    this.attr = this.$route.query.attr;
    if (this.attr === "standpage") {
      this.timeval = setTimeout(() => {
        this.$router.push({ path: "/bview31", query: { attr: "standpage" } });
        clearTimeout(this.timeval);
      }, 60000);
    }
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
            if (result[0] !== "StandByPage" && this.attr && this.timeval) {
              clearTimeout(this.timeval);
            }
          });
        },
        (err) => {
          console.log("连接失败", err);
        }
      );
    },
    getProductDataFn() {
      getProductData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.productArr = res.data;
          this.productArr.forEach(() => {
            this.flippedArr.push(false);
          });
        }
      });
    },
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
    clickdialog() {
      clearTimeout(this.timeval);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
@import '../assets/css/bview2_1920.css';
</style>
