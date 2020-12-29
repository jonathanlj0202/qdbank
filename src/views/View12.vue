<template>
  <div class="container">
    <div class="top-title">{{ titleText }}</div>
    <div class="content-box-left" v-show="isLeft">
      <div class="content-left">
        <div class="content-title">汇率</div>
        <div class="content-box">
          <div class="header-box">
            <div class="item">品种</div>
            <div class="item">客户卖出价</div>
            <div class="item">客户买入价</div>
            <div class="item">报价时间</div>
          </div>
          <div class="box-wrapper">
            <div class="item-content-box">
              <div
                class="item-box"
                v-for="(item, index) of exchangeArr"
                :key="index"
              >
                <div class="item">
                  {{ item.CurrName.substring(0, item.CurrName.indexOf("(")) }}
                </div>
                <div class="item">
                  {{ parseFloat(item.BuyingPrice).toFixed(2) }}
                </div>
                <div class="item">
                  {{ parseFloat(item.SellPrice).toFixed(2) }}
                </div>
                <div class="item">{{ item.PublishTime }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-title">贵金属</div>
        <div class="content-box">
          <div class="header-box">
            <div class="item">品种</div>
            <div class="item">客户卖出价</div>
            <div class="item">客户买入价</div>
            <div class="item">报价时间</div>
          </div>
          <div class="box-wrapper">
            <div class="item-content-box">
              <div
                class="item-box"
                v-for="(item, index) of goldArr"
                :key="index"
              >
                <div class="item">{{ item.ProdName }}</div>
                <div class="item">{{ item.CustomerBuy }}</div>
                <div class="item">{{ item.CustomerSell }}</div>
                <div class="item">{{ item.UpdateTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="content-title">利率</div>
        <div class="mini-title">整存整取</div>
        <div class="mini-box">
          <div
            class="mini-item"
            v-for="(item, index) of lilvLeftArr"
            :key="index"
          >
            <div class="item-left">{{ item.priect }}</div>
            <div class="item-right">{{ item.data }}</div>
          </div>
        </div>
        <div class="mini-title bottom-title">零存整取、整存零取、存本取息</div>
        <div class="mini-box bottom-box">
          <div
            class="mini-item"
            v-for="(item, index) of lilvRightArr"
            :key="index"
          >
            <div class="item-left">{{ item.priect }}</div>
            <div class="item-right">{{ item.data }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-box-right" v-show="isRight">
      <div class="user-item" v-for="(item, i) in personArr" :key="i">
        <div class="avatar-box">
          <img class="user-avatar" :src="item.personimage" />
        </div>
        <div class="user-name">{{ item.personname }}</div>
        <div class="user-desc">职位：{{ item.position }}</div>
        <div class="user-desc">工龄：{{ item.workeyear }}年</div>
      </div>
    </div>
    <div
      :class="{
        'bottom-btn-left choose': isLeft,
        'bottom-btn-left nochoose': isRight,
      }"
      @click="chooseFn('isLeft')"
    >
      数据看板
    </div>
    <div
      :class="{
        'bottom-btn-right nochoose': isLeft,
        'bottom-btn-right choose': isRight,
      }"
      @click="chooseFn('isRight')"
    >
      员工信息
    </div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import { getPersonData } from "../api";

export default {
  name: "View1",
  components: {},
  data() {
    return {
      isLeft: true,
      isRight: false,
      titleText: "数据看板",
      lilvLeftArr: [],
      lilvRightArr: [],
      exchangeArr: [],
      goldArr: [],
      personArr: [],
    };
  },
  created() {
    this.connectionSocket();
    this.getPerson();
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
    getPerson() {
      getPersonData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.personArr = res.data;
        }
      });
    },
    chooseFn(str) {
      if (str === "isLeft") {
        this.isLeft = true;
        this.isRight = false;
        this.titleText = "数据看板";
      } else {
        this.isLeft = false;
        this.isRight = true;
        this.titleText = "员工信息";
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 900px;
  height: 1200px;
  background: url("../assets/img/border.png") no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.top-title {
  width: 320px;
  height: 40px;
  margin-left: 10px;
  margin-bottom: 100px;
  line-height: 60px;
  font-size: 30px;
  color: #00ffd6;
  text-align: center;
}

.content-box-left,
.content-box-right {
  width: 900px;
  box-sizing: border-box;
  overflow: hidden;
}

/*leftview*/
.content-box-left {
  padding: 0px 40px;
}

/*content-left*/

.content-left {
  width: 600px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
}

.content-left .content-title {
  text-align: left;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  letter-spacing: 5px;
  color: #00ffd6;
}

.content-left .content-box {
  width: 560px;
  height: 400px;
  margin-top: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  background-color: rgba(41, 68, 183, 0.5);
  overflow: hidden;
}

.content-box .header-box {
  width: 560px;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.content-box .header-box .item {
  color: #00ffd6 !important;
  font-size: 22px !important;
}

.content-box .item-box {
  width: 560px;
  height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.content-box .box-wrapper {
  width: 560px;
  height: 350px;
  overflow: hidden;
}

.content-box .item-content-box {
  width: 560px;
  height: 350px;
  box-sizing: border-box;
}

.content-box .item-content-box::-webkit-scrollbar {
  display: none;
}

.content-box .item-content-box {
  -webkit-animation: bottomrowup 10s 1s linear infinite;
  animation: bottomrowup 10s 1s linear infinite;
}

.content-box .item-content-box:hover {
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}

@-webkit-keyframes bottomrowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -300px, 0);
  }
}

@keyframes bottomrowup {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -300px, 0);
  }
}

.content-box .item-box .item:nth-child(1),
.content-box .header-box .item:nth-child(1) {
  width: 160px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 22px;
  text-align: center;
  float: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.content-box .item-box .item:nth-child(2),
.content-box .header-box .item:nth-child(2) {
  width: 130px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 22px;
  text-align: center;
  float: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.content-box .item-box .item:nth-child(3),
.content-box .header-box .item:nth-child(3) {
  width: 130px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 22px;
  text-align: center;
  float: left;
}

.content-box .item-box .item:nth-child(4),
.content-box .header-box .item:nth-child(4) {
  width: 120px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 22px;
  text-align: center;
  float: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/*content-right*/

.content-right {
  width: 220px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
}

.content-right .content-title {
  text-align: left;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  letter-spacing: 5px;
  color: #00ffd6;
}

.content-right .mini-title {
  height: 30px;
  line-height: 50px;
  font-size: 22px;
  color: #fff;
  text-align: left;
  margin-bottom: 31px;
}

.bottom-title {
  line-height: 30px !important;
}

.content-right .mini-box {
  width: 180px;
  height: 350px;
  padding: 6px 0px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  background-color: rgba(41, 68, 183, 0.5);
  overflow: hidden;
  margin-bottom: 50px;
}

.bottom-box {
  height: 330px !important;
  margin-top: 53px;
}

.mini-box .mini-item {
  width: 180px;
  color: #fff;
  overflow: hidden;
}
.mini-item .item-left,
.mini-item .item-right {
  width: 90px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 22px;
  float: left;
}

/*rightview*/

.content-box-right {
  box-sizing: border-box;
  padding: 0 50px;
  height: 760px;
  margin-top: 170px;
  overflow: hidden;
}

.user-item {
  width: 160px;
  float: left;
  margin: 0 20px 18px;
  color: #fff;
  overflow: hidden;
  text-align: center;
}

.avatar-box {
  width: 135px;
  height: 135px;
  background: url("../assets/img/userBorder.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
}

.user-avatar {
  width: 116px;
  height: 116px;
  border-radius: 58px;
  margin-top: 9.5px;
}

.user-name {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  margin-top: 15px;
  overflow: hidden;
}

.user-desc {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

.bottom-btn-left {
  width: 250px;
  height: 50px;
  text-align: center;
  font-size: 28px;
  line-height: 50px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 270px;
  letter-spacing: 4px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.bottom-btn-right {
  width: 250px;
  height: 50px;
  text-align: center;
  font-size: 28px;
  line-height: 50px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 30px;
  letter-spacing: 4px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.choose {
  background-image: url("../assets/img/choose.png");
}

.nochoose {
  background-image: url("../assets/img/nochoose.png");
}
</style>
