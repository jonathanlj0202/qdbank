<template>
  <div class="container_b5">
    <div class="content-wrapper">
      <scroller :data="productArr" class="content-box">
        <div
          class="hotproduct-item-wrapper"
          v-for="(item, index) of productArr"
          :key="index"
        >
          <flipper
            width="100%"
            height="100%"
            :flipped="flippedArr[index]"
            @click="onClick(index)"
          >
            <div class="hotproduct-item" slot="front">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-type">{{ item.type }}</div>
              <div class="item-num">{{ item.num }}</div>
              <div class="item-unit">{{ item.unit }}</div>
              <div class="item-des1">{{ item.dsc1 }}</div>
              <div class="item-des2">{{ item.dsc2 }}</div>
            </div>
            <div class="hotproduct-item" slot="back">
              <div class="back-box">
                <vue-qr
                  :logoSrc="imageUrl"
                  :text="item.url"
                  class="url-code"
                ></vue-qr>
                <div class="tips-text">扫码购买</div>
              </div>
            </div>
          </flipper>
        </div>
      </scroller>
    </div>
    <div class="dialog-wrapper" @click="clickdialog()" v-show="attr"></div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
import scroller from "vue-infinite-auto-scroll";
import { getBankData } from "../api";

export default {
  name: "Bview5",
  components: {
    vueQr,
    Flipper,
    scroller,
  },
  data() {
    return {
      imageUrl: require("../assets/img/abclogo.png"),
      flippedArr: [],
      productArr: [],
      attr: null,
      timeval: null,
    };
  },
  created() {
    this.connectionSocket();
    for (let index = 0; index < 30; index++) {
      this.flippedArr.push(false);
    }
    this.attr = this.$route.query.attr;
    if (this.attr === "standpage") {
      this.timeval = setTimeout(() => {
        this.$router.push({ path: "/bview1", query: { attr: "standpage" } });
        clearTimeout(this.timeval);
      }, 90000);
    }
  },
  mounted() {
    getBankData({
      terminal_no: window.MAC,
    }).then((res) => {
      if (res.retCode === "0" && res.data) {
        this.productArr = [];
        res.data.forEach((ele) => {
          this.productArr.push({
            name:
              ele.title.indexOf(`“`) > -1
                ? ele.title.substring(
                    ele.title.indexOf(`“`) + 1,
                    ele.title.indexOf(`”`)
                  )
                : ele.title,
            type: "定期理财",
            num: ele.interest,
            unit: "业绩基准",
            dsc1: `投资期限：${ele.prodLimit}`,
            dsc2: `起购金额：${ele.amtStart}`,
            url: `https://webank.abchina.com/mmsp-xs/customer/product/view/financeDetail?moduleId=${ele.moduleId}&moduleType=20003000&storeId=103638&employeeOrder=1&logId=20201218092254396001&_t=34037&_t=75422`,
          });
        });
        let length = this.productArr.length;
        length = length % 2 === 0 ? length : --length;
        for (let i = 0; i < length; i++) {
          this.productArr.push(this.productArr[i]);
        }
      }
    });
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
<style src="vue-flipper/dist/vue-flipper.css"></style>
<style scoped>
@import '../assets/css/bview5_1920.css';
</style>
