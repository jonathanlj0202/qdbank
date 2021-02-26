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
@import '../assets/css/view1_1920.css';
</style>
