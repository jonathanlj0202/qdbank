<template>
  <div class="container">
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
    };
  },
  created() {
    this.connectionSocket();
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
        },
        (err) => {
          console.log("连接失败", err);
        }
      );
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.view-wrapper {
  width: 3030px;
  height: 1620px; /*no*/
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -1515px;
  margin-top: -810px; /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.exchange-box {
  width: 1440px;
  height: 1620px; /*no*/
  float: left;
  margin-right: 60px;
  background: url("../assets/img/databg3.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.lilv-box {
  width: 1520px;
  height: 640px; /*no*/
  margin-bottom: 60px; /*no*/
  float: left;
  background: url("../assets/img/databg1.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.gold-box {
  width: 1520px;
  height: 920px; /*no*/
  float: left;
  background: url("../assets/img/databg2.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.lilv-box .title,
.exchange-box .title,
.gold-box .title {
  font-size: 72px;
  height: 150px; /*no*/
  line-height: 180px; /*no*/
  color: #00ffd6;
  padding: 0 50px;
}

.exchange-wrapper {
  width: 1440px;
  height: 1200px; /*no*/
  margin-top: 20px; /*no*/
  overflow: hidden;
}

.exchange-item-box {
  width: 1440px;
  overflow: hidden;
}

.gold-wrapper {
  width: 1520px;
  height: 600px; /*no*/
  overflow: hidden;
}

.gold-item-box {
  width: 1520px;
  overflow: hidden;
}

.exchange-item,
.gold-item {
  width: 1440px;
  height: 150px; /*no*/
  line-height: 150px; /*no*/
  color: #fff;
  text-align: center;
  font-size: 48px;
  overflow: hidden;
}

.exchange-item {
  height: 150px !important; /*no*/
  line-height: 150px !important; /*no*/
}

.exchange-title,
.gold-title {
  color: #00ffd6 !important;
}

.exchange-item .name,
.gold-item .name {
  width: 460px;
  float: left;
}

.exchange-item .buy,
.gold-item .buy {
  width: 340px;
  float: left;
}

.exchange-item .sell,
.gold-item .sell {
  width: 340px;
  float: left;
}

.exchange-item .time,
.gold-item .time {
  width: 300px;
  float: left;
}

.exchange-item-box::-webkit-scrollbar,
.excgoldhange-item-box::-webkit-scrollbar {
  display: none;
}

.exchange-item-box,
.gold-item-box {
  -webkit-animation: bottomrowup 10s 1s linear infinite;
  animation: bottomrowup 10s 1s linear infinite;
}

.exchange-item-box:hover,
.gold-item-box:hover {
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}

@-webkit-keyframes bottomrowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -540px, 0); /*no*/
  }
}

@keyframes bottomrowup {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -540px, 0); /*no*/
  }
}

.lilv-box .mini-title {
  height: 70px; /*no*/
  line-height: 50px; /*no*/
  font-size: 50px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #00ffd6;
}

.lilv-box .left {
  width: 690px;
  float: left;
  overflow: hidden;
}

.lilv-item {
  width: 690px;
  overflow: hidden;
}

.lilv-item .item-left,
.lilv-item .item-right {
  width: 315px;
  height: 65px; /*no*/
  line-height: 65px; /*no*/
  overflow: hidden;
  float: left;
  text-align: center;
  color: #fff;
  font-size: 48px;
}

.lilv-item .item-left {
  margin-left: 60px;
}

.lilv-box .line {
  width: 1px;
  float: left;
  background-color: #00ffd6;
  height: 375px; /*no*/
  margin: 70px auto 0px; /*no*/
}

.lilv-box .right {
  width: 800px;
  float: right;
  overflow: hidden;
}
</style>
