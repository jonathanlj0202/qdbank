<template>
  <div class="container_b1">
    <div class="view-wrapper">
      <div class="exchange-box">
        <div class="title">汇率</div>
        <div class="exchange-item exchange-title">
          <div class="name">品种</div>
          <div class="buy">客户卖出价</div>
          <div class="sell">客户买入价</div>
          <div class="time">报价时间</div>
        </div>
        <div class="exchange-wrapper">
          <div class="exchange-item-box">
            <div
              class="exchange-item"
              v-for="(item, index) of exchangeArr"
              :key="index"
            >
              <div class="name">
                {{ item.CurrName.substring(0, item.CurrName.indexOf("(")) }}
              </div>
              <div class="buy">
                {{ parseFloat(item.BuyingPrice).toFixed(2) }}
              </div>
              <div class="sell">
                {{ parseFloat(item.SellPrice).toFixed(2) }}
              </div>
              <div class="time">{{ item.PublishTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="lilv-box">
        <div class="title">利率</div>
        <div class="left">
          <div class="mini-title">整存整取</div>
          <div
            class="lilv-item"
            v-for="(item, index) of lilvLeftArr"
            :key="index"
          >
            <div class="item-left">{{ item.priect }}</div>
            <div class="item-right">{{ item.data }}</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="right">
          <div class="mini-title">零存整取、整存零取、存本取息</div>
          <div
            class="lilv-item"
            v-for="(item, index) of lilvRightArr"
            :key="index"
          >
            <div class="item-left">{{ item.priect }}</div>
            <div class="item-right">{{ item.data }}</div>
          </div>
        </div>
      </div>

      <div class="gold-box">
        <div class="title">贵金属</div>
        <div class="gold-item gold-title">
          <div class="name">品种</div>
          <div class="buy">客户卖出价</div>
          <div class="sell">客户买入价</div>
          <div class="time">报价时间</div>
        </div>
        <div class="gold-wrapper">
          <div class="gold-item-box">
            <div
              class="gold-item"
              v-for="(item, index) of goldArr"
              :key="index"
            >
              <div class="name">
                {{ item.ProdName }}
              </div>
              <div class="buy">
                {{ item.CustomerBuy }}
              </div>
              <div class="sell">
                {{ item.CustomerSell }}
              </div>
              <div class="time">{{ item.UpdateTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-wrapper" @click="clickdialog()" v-show="attr"></div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";

export default {
  name: "Bview1",
  components: {},
  data() {
    return {
      lilvLeftArr: [],
      lilvRightArr: [],
      exchangeArr: [],
      goldArr: [],
      attr: null,
      timeval: null,
    };
  },
  created() {
    this.connectionSocket();
    this.attr = this.$route.query.attr;
    if (this.attr === "standpage") {
      this.timeval = setTimeout(() => {
        this.$router.push({ path: "/bview2", query: { attr: "standpage" } });
        clearTimeout(this.timeval);
      }, 90000);
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
          //贵金属
          stompClient.subscribe("/topic/service_gold", (response) => {
            let result = JSON.parse(response.body);
            this.goldArr = [];
            this.goldArr = JSON.parse(result.content);
            this.goldArr.forEach((ele) => {
              this.goldArr.push(ele);
            });
          });

          //汇率
          stompClient.subscribe("/topic/service_exchange", (response) => {
            let result = JSON.parse(response.body);
            this.exchangeArr = [];
            this.exchangeArr = JSON.parse(result.content);
            this.exchangeArr.forEach((ele) => {
              this.exchangeArr.push(ele);
            });
          });

          //利率
          stompClient.subscribe("/topic/service_lilv", (response) => {
            let result = JSON.parse(response.body);
            let lilv = JSON.parse(result.content);
            this.lilvLeftArr = [];
            this.lilvRightArr = [];
            for (let index = 5; index < 11; index++) {
              this.lilvLeftArr.push(lilv[index]);
            }
            for (let index = 12; index < 15; index++) {
              this.lilvRightArr.push(lilv[index]);
            }
          });

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
    clickdialog() {
      clearTimeout(this.timeval);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
@import '../assets/css/bview1_1920.css';
</style>
