<template>
  <div class="container">
    <div class="top-logo"></div>
    <div class="top-time">
      <div class="time">{{ nowTime }}</div>
      <div class="date">{{ nowDate }}</div>
    </div>
    <div class="view-box">
      <router-view name="v1" class="view"></router-view>
      <router-view name="v2" class="view"></router-view>
      <router-view name="v3" class="view"></router-view>
      <router-view name="v4" class="view"></router-view>
    </div>
    <div class="close-dialog-box" v-show="closeDialogBoo">
      <div class="close-dialog">
        <div class="number-box">
          <div :class="numberClass" v-for="(item, index) of 4" :key="index">
            <div class="dot" v-show="pdArr[index] || pdArr[index] === 0"></div>
          </div>
        </div>
        <div class="number-btn-box">
          <div class="number-btn" @click="numberInput(1)">1</div>
          <div class="number-btn" @click="numberInput(2)">2</div>
          <div class="number-btn" @click="numberInput(3)">3</div>
          <div class="number-btn" @click="numberInput(4)">4</div>
          <div class="number-btn" @click="numberInput(5)">5</div>
          <div class="number-btn" @click="numberInput(6)">6</div>
          <div class="number-btn" @click="numberInput(7)">7</div>
          <div class="number-btn" @click="numberInput(8)">8</div>
          <div class="number-btn" @click="numberInput(9)">9</div>
          <div class="number-btn back-btn" @click="backFn()">返回</div>
          <div class="number-btn" @click="numberInput(0)">0</div>
          <div class="number-btn clear-btn" @click="clearInput()">退格</div>
        </div>
      </div>
    </div>
    <div class="close-btn" @click="closeDialogFn()"></div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  name: "ViewBox",
  components: {},
  data() {
    return {
      nowDate: "", // 当前日期
      nowTime: "", // 当前时间
      closeDialogBoo: false,
      pdArr: [],
      pdIndex: null,
      numberClass: "number-item",
    };
  },
  created() {
    // this.connectionSocket();
  },
  methods: {
    connectionSocket() {
      //连接SockJS的endpoint名称为"endpoint-websocket"
      const socket = new SockJS(
        "http://192.168.2.30:8089/bankmanage/endpoint-websocket"
      );
      // 获取STOMP子协议的客户端对象
      let stompClient = Stomp.over(socket);
      // 向服务器发起websocket连接
      stompClient.connect(
        {},
        () => {
          stompClient.subscribe("/topic/service_Notice", (response) => {
            let result = JSON.parse(response.body);
            console.info(3322111, result);
          });
        },
        (err) => {
          console.log("连接失败", err);
        }
      );
    },
    currentTime() {
      setInterval(this.getDate, 500);
    },
    getDate() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      this.nowTime = hh + ":" + mf;
      this.nowDate = yy + "/" + mm + "/" + dd;
    },
    closeDialogFn() {
      this.closeDialogBoo = true;
    },
    numberInput(index) {
      if (this.pdArr.length < 4) {
        this.pdArr.push(index);
      }
      if (this.pdArr.length === 4) {
        let password = [2, 5, 8, 0];
        let pdconfirm = true;
        this.pdArr.forEach((ele, index) => {
          if (ele !== password[index]) {
            pdconfirm = false;
          }
        });
        if (pdconfirm) {
          window.close();
        } else {
          this.numberClass = "number-item red-border";
          let setout = setTimeout(() => {
            this.pdArr = [];
            this.numberClass = "number-item";
            clearTimeout(setout);
          }, 1000);
        }
      }
    },
    clearInput() {
      if (this.pdArr.length > 0) {
        this.pdArr.pop();
      }
    },
    backFn() {
      this.pdArr = [];
      this.closeDialogBoo = false;
    },
  },
  mounted() {
    this.currentTime();
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

.top-logo {
  width: 217px;
  height: 42px;
  position: absolute;
  top: 50px;
  left: 60px;
  background: url("../assets/img/logo.png") no-repeat;
  background-size: 100% 100%;
}

.top-time {
  width: 200px;
  height: 42px;
  position: absolute;
  top: 50px;
  right: 50px;
  text-align: center;
  color: #fff;
}

.top-time .time {
  font-size: 30px;
}

.top-time .date {
  font-size: 20px;
}

.view-box {
  width: 3240px;
  height: 1000px;
  padding-left: 42px;
  padding-right: 30px;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -500px;
  margin-left: -1620px;
}

.view {
  width: 800px;
  height: 1000px;
  float: left;
}

.close-dialog-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.8);
}

.close-dialog {
  width: 600px;
  height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -300px;
  z-index: 10;
  border-radius: 30px;
  background: url("../assets/img/password.png") no-repeat;
  background-size: 100% 100%;
  /* background-color: #0ff; */
}

.number-box {
  width: 100%;
  margin: 0px 60px;
  margin-top: 80px;
  overflow: hidden;
}

.number-item {
  width: 60px;
  height: 60px;
  margin: 0px 30px;
  border: 1px solid #31f9fb; /*no*/
  float: left;
}

.red-border {
  border: 1px solid #f00 !important;  /*no*/
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  margin: 20px auto;
}

.number-btn-box {
  width: 360px;
  margin: 50px auto;
  overflow: hidden;
}

.number-btn {
  width: 60px;
  height: 60px;
  font-size: 30px;
  border-radius: 30px;
  text-align: center;
  line-height: 60px;
  float: left;
  margin: 0 30px;
  margin-bottom: 20px;
  color: #fff;
  border: 1px solid #31f9fb; /*no*/
  box-sizing: border-box;
  /* background-color: #fff; */
}

.back-btn,
.clear-btn {
  font-size: 15px;
}

.close-btn {
  width: 20px; /*no*/
  height: 20px; /*no*/
  position: absolute;
  bottom: 0px;
  right: 0px;
}
</style>
