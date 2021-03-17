<template>
  <div class="container_b1">
    <div class="view-wrapper">
      <div class="exchange-box">
        <div class="title">汇率 <span class="mini-logo"></span></div>
        <div class="exchange-item exchange-title">
          <div class="name">品种</div>
          <div class="buy">客户卖出价</div>
          <div class="sell">客户买入价</div>
          <div class="time">报价时间</div>
        </div>
        <div class="exchange-wrapper">
          <div class="exchange-item-box">
            <vue-seamless-scroll
              :data="exchangeArr"
              :class-option="classOption"
            >
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
            </vue-seamless-scroll>
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
            <vue-seamless-scroll :data="goldArr" :class-option="classOption">
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
            </vue-seamless-scroll>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-wrapper" @click="clickdialog()"></div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import { getPageData } from "../api";
import vueSeamlessScroll from "vue-seamless-scroll";

export default {
  name: "Bview1",
  components: {
    vueSeamlessScroll,
  },
  data() {
    return {
      lilvLeftArr: [],
      lilvRightArr: [],
      exchangeArr: [],
      goldArr: [],
      timeval: null,
    };
  },
  created() {
    this.getPageDataFn();
    this.connectionSocket();
    this.timeval = setTimeout(() => {
      this.$router.push({ path: "/bview2" });
      clearTimeout(this.timeval);
    }, 90000);
  },
  computed: {
    classOption() {
      return {
        step: 0.8, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 150, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
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
    getPageDataFn() {
      getPageData({ terminal_no: window.MAC }).then((res) => {
        if (res.data && res.code === "0000") {
          this.goldArr = [];
          this.exchangeArr = [];
          this.goldArr = JSON.parse(res.data.gold);
          this.exchangeArr = JSON.parse(res.data.huilv);
          let lilv = JSON.parse(res.data.lilv);
          this.lilvLeftArr = [];
          this.lilvRightArr = [];
          this.goldArr.forEach((ele) => {
            this.goldArr.push(ele);
          });
          this.exchangeArr.forEach((ele) => {
            this.exchangeArr.push(ele);
          });
          for (let index = 5; index < 11; index++) {
            this.lilvLeftArr.push(lilv[index]);
          }
          for (let index = 12; index < 15; index++) {
            this.lilvRightArr.push(lilv[index]);
          }
        }
      });
    },
    clickdialog() {
      clearTimeout(this.timeval);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* @import '../assets/css/bview1_1920.css'; */
.container_b1 {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.container_b1 .view-wrapper {
  width: 3030px;
  height: 1620px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -1515px;
  margin-top: -810px;
  /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.container_b1 .exchange-box {
  width: 1440px;
  height: 1620px;
  /*no*/
  float: left;
  margin-right: 60px;
  background: url("../assets/img/databg3.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.container_b1 .lilv-box {
  width: 1520px;
  height: 640px;
  /*no*/
  margin-bottom: 60px;
  /*no*/
  float: left;
  background: url("../assets/img/databg1.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.container_b1 .gold-box {
  width: 1520px;
  height: 920px;
  /*no*/
  float: left;
  background: url("../assets/img/databg2.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.container_b1 .lilv-box .title,
.container_b1 .exchange-box .title,
.container_b1 .gold-box .title {
  font-size: 72px;
  height: 150px;
  /*no*/
  line-height: 180px;
  /*no*/
  color: #00ffd6;
  padding: 0 50px;
}

.title .mini-logo {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url("../assets/img/datatitlelogo.png") no-repeat;
  background-size: 100% 100%;
}

.container_b1 .exchange-wrapper {
  width: 1440px;
  height: 1200px;
  /*no*/
  margin-top: 20px;
  /*no*/
  overflow: hidden;
}

.container_b1 .exchange-item-box {
  width: 1440px;
  overflow: hidden;
}

.container_b1 .gold-wrapper {
  width: 1520px;
  height: 600px;
  /*no*/
  overflow: hidden;
}

.container_b1 .gold-item-box {
  width: 1520px;
  overflow: hidden;
}

.container_b1 .exchange-item,
.container_b1 .gold-item {
  width: 1440px;
  height: 150px;
  /*no*/
  line-height: 150px;
  /*no*/
  color: #fff;
  text-align: center;
  font-size: 48px;
  overflow: hidden;
}

.container_b1 .exchange-item {
  height: 150px !important;
  /*no*/
  line-height: 150px !important;
  /*no*/
}

.container_b1 .exchange-title,
.container_b1 .gold-title {
  color: #00ffd6 !important;
}

.container_b1 .exchange-item .name,
.container_b1 .gold-item .name {
  width: 460px;
  float: left;
}

.container_b1 .exchange-item .buy,
.container_b1 .gold-item .buy {
  width: 340px;
  float: left;
}

.container_b1 .exchange-item .sell,
.container_b1 .gold-item .sell {
  width: 340px;
  float: left;
}

.container_b1 .exchange-item .time,
.container_b1 .gold-item .time {
  width: 300px;
  float: left;
}

.container_b1 .exchange-item-box::-webkit-scrollbar,
.container_b1 .excgoldhange-item-box::-webkit-scrollbar {
  display: none;
}

/* .container_b1 .exchange-item-box,
.container_b1 .gold-item-box {
  -webkit-animation: bottomrowup 10s 1s linear infinite;
  animation: bottomrowup 10s 1s linear infinite;
}

.container_b1 .exchange-item-box:hover,
.container_b1 .gold-item-box:hover {
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
} */

@-webkit-keyframes bottomrowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -540px, 0);
    /*no*/
  }
}

@keyframes bottomrowup {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -540px, 0);
    /*no*/
  }
}

.container_b1 .lilv-box .mini-title {
  height: 70px;
  /*no*/
  line-height: 50px;
  /*no*/
  font-size: 50px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #00ffd6;
}

.container_b1 .lilv-box .left {
  width: 690px;
  float: left;
  overflow: hidden;
}

.container_b1 .lilv-item {
  width: 690px;
  overflow: hidden;
}

.container_b1 .lilv-item .item-left,
.container_b1 .lilv-item .item-right {
  width: 315px;
  height: 65px;
  /*no*/
  line-height: 65px;
  /*no*/
  overflow: hidden;
  float: left;
  text-align: center;
  color: #fff;
  font-size: 48px;
}

.container_b1 .lilv-item .item-left {
  margin-left: 60px;
}

.container_b1 .lilv-box .line {
  width: 1px;
  float: left;
  background-color: #00ffd6;
  height: 375px;
  /*no*/
  margin: 70px auto 0px;
  /*no*/
}

.container_b1 .lilv-box .right {
  width: 800px;
  float: right;
  overflow: hidden;
}

.container_b1 .dialog-wrapper {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}
</style>
