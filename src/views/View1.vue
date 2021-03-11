<template>
  <div class="container1">
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
import vueSeamlessScroll from "vue-seamless-scroll";
import { getProductData, getPageData } from "../api";

export default {
  name: "View1",
  components: {
    Flipper,
    vueSeamlessScroll,
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
    this.getPageDataFn();
    this.connectionSocket();
    this.getProductDataFn();
  },
  computed: {
    classOption() {
      return {
        step: 0.8, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 52, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  methods: {
    connectionSocket() {
      //连接SockJS的1endpoint名称为"endpoint-websocket"
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
/* @import '../assets/css/view1_1920.css'; */
.container1 {
  width: 1100px;
  height: 1920px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 0px;
  margin-top: -960px;
  /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.container1 .content-box-left,
.container1 .content-box-right {
  width: 1100px;
  padding-top: 80px;
  /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

/*leftview*/

.container1 .lilv-box,
.container1 .exchange-box,
.container1 .gold-box {
  width: 1025px;
  margin: 0px auto 35px;
  margin-bottom: 35px !important;
  /*no*/
  overflow: hidden;
  padding-top: 20px;
  /*no*/
  padding-bottom: 20px;
  /*no*/
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  color: #00ffd6;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /*width: 985px*/
}

.container1 .lilv-box {
  background-image: url("../assets/img/databg1.png");
  height: 395px;
  /*no*/
  overflow: hidden;
}

.container1 .exchange-box {
  background-image: url("../assets/img/databg3.png");
  height: 780px;
  /*no*/
  overflow: hidden;
}

.container1 .gold-box {
  background-image: url("../assets/img/databg2.png");
  height: 485px;
  /*no*/
  overflow: hidden;
}

.container1 .lilv-box .title,
.container1 .exchange-box .title,
.container1 .gold-box .title {
  font-size: 36px;
  height: 45px;
  /*no*/
  line-height: 45px;
  /*no*/
}

.container1 .lilv-box .mini-title {
  height: 40px;
  /*no*/
  line-height: 40px;
  /*no*/
  margin-bottom: 10px;
  /*no*/
  font-size: 26px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.container1 .lilv-box .left {
  width: 490px;
  float: left;
  overflow: hidden;
}

.container1 .lilv-item {
  width: 490px;
  overflow: hidden;
}

.container1 .lilv-item .item-left,
.container1 .lilv-item .item-right {
  width: 180px;
  height: 45px;
  /*no*/
  line-height: 45px;
  /*no*/
  overflow: hidden;
  float: left;
  text-align: center;
  color: #fff;
  font-size: 26px;
}

.container1 .lilv-item .item-left {
  margin-left: 55px;
}

.container1 .container1.lilv-box .line {
  width: 1px;
  float: left;
  background-color: #00ffd6;
  height: 265px;
  /*no*/
  margin: 30px auto 0px;
}

.container1 .lilv-box .right {
  width: 480px;
  float: right;
  overflow: hidden;
}

.container1 .exchange-wrapper {
  width: 985px;
  height: 620px;
  /*no*/
  margin-top: 20px;
  /*no*/
  overflow: hidden;
}

.container1 .exchange-item-box {
  width: 985px;
  overflow: hidden;
}

.container1 .gold-wrapper {
  width: 985px;
  margin-top: 10px;
  /*no*/
  height: 320px;
  /*no*/
  overflow: hidden;
}

.container1 .gold-item-box {
  width: 985px;
  overflow: hidden;
}

.container1 .exchange-item,
.container1 .gold-item {
  width: 985px;
  height: 52px;
  /*no*/
  line-height: 52px;
  /*no*/
  color: #fff;
  text-align: center;
  font-size: 26px;
  overflow: hidden;
}

.container1 .exchange-title,
.container1 .gold-title {
  color: #00ffd6 !important;
}

.container1 .exchange-item .name,
.container1 .gold-item .name {
  width: 300px;
  float: left;
}

.container1 .exchange-item .buy,
.container1 .gold-item .buy {
  width: 240px;
  float: left;
}

.container1 .exchange-item .sell,
.container1 .gold-item .sell {
  width: 240px;
  float: left;
}

.container1 .exchange-item .time,
.container1 .gold-item .time {
  width: 205px;
  float: left;
}

.container1 .exchange-item-box::-webkit-scrollbar,
.container1 .excgoldhange-item-box::-webkit-scrollbar {
  display: none;
}

/*rightview*/

.container1 .product-box {
  width: 1000px;
  height: 1730px;
  /*no*/
  margin: 0 auto;
  overflow: hidden;
}

.container1 .product {
  width: 490px;
  height: 410px;
  /*no*/
  margin-bottom: 25px;
  /*no*/
  overflow: hidden;
  float: left;
}

.container1 .product:nth-child(odd) {
  margin-right: 20px;
}

.container1 .product-item {
  width: 490px;
  padding-top: 1px;
  /*no*/
  box-sizing: border-box;
  height: 410px;
  /*no*/
  background: url("../assets/img/border4.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
}

.container1 .item-logo {
  width: 320px;
  height: 245px;
  /*no*/
  margin: 50px auto 10px;
  /*no*/
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  border-radius: 8px !important;
  overflow: hidden;
}

.container1 .item-name {
  width: 350px;
  height: 40px;
  /*no*/
  line-height: 40px;
  /*no*/
  font-size: 32px;
  margin: 0 auto;
  text-align: center;
}

.container1 .item-detail-name {
  width: 350px;
  height: 60px;
  /*no*/
  line-height: 30px;
  /*no*/
  overflow: hidden;
  font-size: 22px;
  margin: 0 auto;
  padding-top: 20px;
  /*no*/
  padding-bottom: 10px;
  /*no*/
  margin-top: 50px;
  /*no*/
  box-sizing: border-box;
}

.container1 .item-detail-content {
  width: 350px;
  height: 160px;
  /*no*/
  margin: 0 auto;
  line-height: 28px;
  /*no*/
  font-size: 20px;
  overflow: hidden;
}

.container1 .item-detail-left-logo {
  width: 240px;
  height: 90px;
  /*no*/
  margin-left: 90px;
  text-align: left;
  float: left;
}

.container1 .item-detail-left-logo img {
  width: 160px;
  height: 70px;
  border-radius: 5px;
}

.container1 .item-detail-right-logo {
  width: 70px;
  height: 70px;
  margin-left: 16px;
  float: left;
}

.container1 .item-detail-right-logo img {
  width: 70px;
  height: 70px;
}

/*bottomview*/

.container1 .bottom-btn-box {
  position: absolute;
  bottom: 25px;
  /*no*/
  left: 205px;
  width: 690px;
  height: 60px;
  /*no*/
  line-height: 60px;
  /*no*/
  background-image: url("../assets/img/2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  letter-spacing: 2px;
}

.container1 .choose {
  background-image: url("../assets/img/1.png") !important;
}

.container1 .btn-left {
  width: 405px;
  float: left;
  font-size: 32px;
  color: #00ffd6;
}

.container1 .left-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}

.container1 .btn-right {
  width: 405px;
  float: right;
  font-size: 32px;
  color: #00ffd6;
}

.container1 .right-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}
</style>
