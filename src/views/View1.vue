<template>
  <div class="container">
    <div class="content-box-left" v-show="isLeft">
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

    <div class="content-box-right" v-show="isRight">
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
    </div>

    <div
      :class="{ 'bottom-btn-box': isLeft, 'bottom-btn-box choose': isRight }"
    >
      <div
        :class="{ 'btn-left': isLeft, 'btn-left right-choose': isRight }"
        @click="chooseFn('isLeft')"
      >
        数据看板
      </div>
      <div
        :class="{ 'btn-right left-choose': isLeft, 'btn-right': isRight }"
        @click="chooseFn('isRight')"
      >
        互动营销
      </div>
    </div>
  </div>
</template>
<script>
import Flipper from "vue-flipper";
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import { getProductData } from "../api";

export default {
  name: "View1",
  components: {
    Flipper,
  },
  data() {
    return {
      isLeft: true,
      isRight: false,
      lilvLeftArr: [],
      lilvRightArr: [],
      exchangeArr: [],
      goldArr: [],
      flippedArr: [],
      productArr: [],
    };
  },
  created() {
    this.connectionSocket();
    this.getProductDataFn();
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
    chooseFn(str) {
      if (str === "isLeft") {
        this.isLeft = true;
        this.isRight = false;
      } else {
        this.isLeft = false;
        this.isRight = true;
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 1100px;
  height: 1920px; /*no*/
  position: absolute;
  top: 50%;
  left: 0px;
  margin-top: -960px; /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.content-box-left,
.content-box-right {
  width: 1100px;
  padding-top: 80px; /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

/*leftview*/
.lilv-box,
.exchange-box,
.gold-box {
  width: 1025px;
  margin: 0px auto 35px;
  margin-bottom: 35px !important; /*no*/
  overflow: hidden;
  padding-top: 20px; /*no*/
  padding-bottom: 20px; /*no*/
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  color: #00ffd6;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /*width: 985px*/
}
.lilv-box {
  background-image: url("../assets/img/databg1.png");
  height: 395px; /*no*/
  overflow: hidden;
}

.exchange-box {
  background-image: url("../assets/img/databg3.png");
  height: 780px; /*no*/
  overflow: hidden;
}

.gold-box {
  background-image: url("../assets/img/databg2.png");
  height: 485px; /*no*/
  overflow: hidden;
}

.lilv-box .title,
.exchange-box .title,
.gold-box .title {
  font-size: 36px;
  height: 45px; /*no*/
  line-height: 45px; /*no*/
}

.lilv-box .mini-title {
  height: 40px; /*no*/
  line-height: 40px; /*no*/
  margin-bottom: 10px; /*no*/
  font-size: 26px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.lilv-box .left {
  width: 490px;
  float: left;
  overflow: hidden;
}

.lilv-item {
  width: 490px;
  overflow: hidden;
}

.lilv-item .item-left,
.lilv-item .item-right {
  width: 180px;
  height: 45px; /*no*/
  line-height: 45px; /*no*/
  overflow: hidden;
  float: left;
  text-align: center;
  color: #fff;
  font-size: 26px;
}

.lilv-item .item-left {
  margin-left: 55px;
}

.lilv-box .line {
  width: 1px;
  float: left;
  background-color: #00ffd6;
  height: 265px; /*no*/
  margin: 30px auto 0px;
}

.lilv-box .right {
  width: 480px;
  float: right;
  overflow: hidden;
}

.exchange-wrapper {
  width: 985px;
  height: 600px; /*no*/
  margin-top: 20px; /*no*/
  overflow: hidden;
}

.exchange-item-box {
  width: 985px;
  overflow: hidden;
}

.gold-wrapper {
  width: 985px;
  height: 300px; /*no*/
  overflow: hidden;
}

.gold-item-box {
  width: 985px;
  overflow: hidden;
}

.exchange-item,
.gold-item {
  width: 985px;
  height: 52px; /*no*/
  line-height: 52px; /*no*/
  color: #fff;
  text-align: center;
  font-size: 26px;
  overflow: hidden;
}

.exchange-item {
  height: 51px !important; /*no*/
  line-height: 51px !important; /*no*/
}

.exchange-title,
.gold-title {
  color: #00ffd6 !important;
}

.exchange-item .name,
.gold-item .name {
  width: 300px;
  float: left;
}

.exchange-item .buy,
.gold-item .buy {
  width: 240px;
  float: left;
}

.exchange-item .sell,
.gold-item .sell {
  width: 240px;
  float: left;
}

.exchange-item .time,
.gold-item .time {
  width: 205px;
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

/*rightview*/
.product-box {
  width: 1000px;
  height: 1730px; /*no*/
  margin: 0 auto;
  overflow: hidden;
}

.product {
  width: 490px;
  height: 410px; /*no*/
  margin-bottom: 25px; /*no*/
  overflow: hidden;
  float: left;
}

.product:nth-child(odd) {
  margin-right: 20px;
}

.product-item {
  width: 490px;
  padding-top: 1px; /*no*/
  box-sizing: border-box;
  height: 410px; /*no*/
  background: url("../assets/img/border4.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
}

.item-logo {
  width: 320px;
  height: 245px; /*no*/
  margin: 50px auto 10px; /*no*/
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  border-radius: 8px !important;
  overflow: hidden;
}

.item-name {
  width: 350px;
  height: 40px; /*no*/
  line-height: 40px; /*no*/
  font-size: 32px;
  margin: 0 auto;
  text-align: center;
}

.item-detail-name {
  width: 350px;
  height: 60px; /*no*/
  line-height: 30px; /*no*/
  overflow: hidden;
  font-size: 22px;
  margin: 0 auto;
  padding-top: 20px; /*no*/
  padding-bottom: 10px; /*no*/
  margin-top: 50px; /*no*/
  box-sizing: border-box;
}

.item-detail-content {
  width: 350px;
  height: 160px; /*no*/
  margin: 0 auto;
  line-height: 28px; /*no*/
  font-size: 20px;
  overflow: hidden;
}

.item-detail-left-logo {
  width: 240px;
  height: 90px; /*no*/
  margin-left: 90px;
  text-align: left;
  float: left;
}

.item-detail-left-logo img {
  width: 160px;
  height: 70px;
  border-radius: 5px;
}

.item-detail-right-logo {
  width: 70px;
  height: 70px;
  margin-left: 16px;
  float: left;
}

.item-detail-right-logo img {
  width: 70px;
  height: 70px;
}

/*bottomview*/

.bottom-btn-box {
  position: absolute;
  bottom: 25px; /*no*/
  left: 205px;
  width: 690px;
  height: 60px; /*no*/
  line-height: 60px; /*no*/
  background-image: url("../assets/img/2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  letter-spacing: 2px;
}
.choose {
  background-image: url("../assets/img/1.png") !important;
}

.btn-left {
  width: 405px;
  float: left;
  font-size: 32px;
  color: #00ffd6;
}

.left-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}

.btn-right {
  width: 405px;
  float: right;
  font-size: 32px;
  color: #00ffd6;
}

.right-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}
</style>
