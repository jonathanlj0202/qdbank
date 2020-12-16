<template>
  <div class="container">
    <div class="top-title">{{ titleText }}</div>
    <div class="content-box-left" v-show="isLeft">
      <div class="box">
        <div class="video-box" v-show="videoBoo">
          <video
            class="video"
            :src="videoSrc"
            autoplay="autoplay"
            type="video/mp4"
            controls="controls"
            ref="videoRef"
          ></video>
        </div>
        <div class="video-bg" v-show="!videoBoo">
          <img :src="videoImgUrl" />
          <div
            class="video-play-btn"
            @click="playVideo()"
            v-show="swipertype === 1"
          ></div>
        </div>
        <div class="video-btn-box">
          <div
            class="video-btn"
            v-for="(item, index) of swiperArr"
            :key="index"
            @click="chanceVideoFn(index)"
          >
            <img :src="item.bgimg" />
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
              <img class="item-logo" :src="item.waterbusiness" />
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
      :class="{
        'bottom-btn-left choose': isLeft,
        'bottom-btn-left nochoose': isRight,
      }"
      @click="chooseFn('isLeft')"
    >
      文化剧场
    </div>
    <div
      :class="{
        'bottom-btn-right nochoose': isLeft,
        'bottom-btn-right choose': isRight,
      }"
      @click="chooseFn('isRight')"
    >
      互动营销
    </div>
  </div>
</template>
<script>
import Flipper from "vue-flipper";
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import { getProductData, getCultureData } from "../api";
const { ipcRenderer } = window.require("electron");

export default {
  name: "View2",
  components: {
    Flipper,
  },
  data() {
    return {
      isLeft: true,
      isRight: false,
      videoBoo: false,
      baseUrl: "http://localhost/",
      videoSrc: "",
      titleText: "文化剧场",
      videoImgUrl: null,
      clickIndex: null,
      swipertype: null,
      swiperArr: [],
      flippedArr: [],
      productArr: [],
      startvideoboo: false,
      inter: null,
    };
  },
  created() {
    this.getProductDataFn();
    this.getCultureDataFn();
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
          stompClient.subscribe("/topic/service_change", (response) => {
            let result = JSON.parse(response.body);
            let zz = ipcRenderer.sendSync("updatedownload");
            this.getCultureDataFn();
            console.info(
              51,
              result,
              zz,
              "timerange",
              "2020-12-10 00:00:00 ~ 2020-12-12 00:00:00"
            );
          });
        },
        (err) => {
          console.log("连接失败1", err);
        }
      );
    },
    getCultureDataFn() {
      getCultureData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.swiperArr = [];
          let result = ipcRenderer.sendSync("videolist");
          res.data.forEach((ele) => {
            let timeArr = "";
            if (ele.timerange) {
              timeArr = ele.timerange.split(" ~ ");
              timeArr[0] = new Date(timeArr[0].replace(/-/g, "/")).getTime();
              timeArr[1] = new Date(timeArr[1].replace(/-/g, "/")).getTime();
            }
            if (ele.sourcestype === "视频") {
              let localurl = "";
              result.forEach((element) => {
                if (ele.sources.indexOf(element) > -1) {
                  localurl = this.baseUrl + element;
                }
              });
              this.swiperArr.push({
                //1为视频，2为图片
                type: 1,
                url: localurl ? localurl : ele.sources,
                bgimg: ele.backgroundimages,
                time: timeArr,
                terminalno: ele.terminalno,
              });
            } else if (ele.sourcestype === "图片") {
              this.swiperArr.push({
                //1为视频，2为图片
                type: 2,
                url: ele.sources,
                bgimg: ele.sources,
                time: timeArr,
                terminalno: ele.terminalno,
              });
            }
          });
          this.clickIndex = 0;
          this.videoImgUrl = this.swiperArr[0].bgimg;
          this.swipertype = this.swiperArr[0].type;
          this.startvideo();
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
    chanceVideoFn(index) {
      if (index !== this.clickIndex) {
        this.videoBoo = false;
        this.videoSrc = "";
      }
      if (this.inter) {
        clearInterval(this.inter);
      }
      // if (!this.videoBoo) {
      //   let timeval = setTimeout(() => {
      //     console.info("nobody33");
      //     this.startvideo();
      //     clearTimeout(timeval);
      //   }, 60000);
      // } else {
      //   this.$refs.videoRef.addEventListener(
      //     "ended",
      //     () => {
      //       let timeval = setTimeout(() => {
      //         console.info("nobody33");
      //         this.startvideo();
      //         clearTimeout(timeval);
      //       }, 60000);
      //     },
      //     false
      //   );
      // }
      this.videoImgUrl = this.swiperArr[index].bgimg;
      this.swipertype = this.swiperArr[index].type;
      this.clickIndex = index;
    },
    chooseFn(str) {
      if (str === "isLeft") {
        this.isLeft = true;
        this.isRight = false;
        this.titleText = "文化剧场";
      } else {
        this.isLeft = false;
        this.isRight = true;
        this.videoBoo = false;
        this.videoSrc = "";
        this.titleText = "互动营销";
      }
    },
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
    playVideo() {
      if (this.isLeft) {
        this.videoBoo = true;
        this.videoSrc = this.swiperArr[this.clickIndex].url;
        this.$refs.videoRef.load();
        this.$refs.videoRef.play();
      }
    },
    startvideo() {
      if (this.isLeft) {
        // if (this.inter) {
        //   clearInterval(this.inter);
        // }
        this.inter = setInterval(() => {
          // console.info(12);
          if (this.swiperArr.length > 0) {
            let clearinter = true;
            this.swiperArr.forEach((element, index) => {
              let timeStr = new Date().getTime();
              if (
                timeStr > element.time[0] &&
                timeStr < element.time[1] &&
                this.videoSrc === "" &&
                element.type === 1
              ) {
                this.clickIndex = index;
                this.videoBoo = true;
                this.videoSrc = this.swiperArr[this.clickIndex].url;
                this.$refs.videoRef.load();
                this.$refs.videoRef.play();
                this.$refs.videoRef.addEventListener(
                  "ended",
                  () => {
                    this.$refs.videoRef.load();
                    this.$refs.videoRef.play();
                  },
                  false
                );
              }

              if (element.time[1] > timeStr && element.type === 1) {
                clearinter = false;
              }
            });
            if (clearinter) {
              clearInterval(this.inter);
            }
          }
        }, 1000);
      }
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css"></style>
<style scoped>
.container {
  width: 900px;
  height: 1200px;
  background: url("../assets/img/border.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;
}

.top-title {
  width: 320px;
  height: 40px;
  margin-left: 50px;
  line-height: 60px;
  font-size: 30px;
  color: #00ffd6;
  text-align: center;
}

.content-box-left,
.content-box-right {
  width: 100%;
  overflow: hidden;
}

.box {
  width: 800px;
  height: 760px;
  margin: 180px auto 0px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
}

.video-box {
  width: 800px;
  height: 600px;
}

.video-box .video {
  width: 800px;
  height: 600px;
  border: none;
  background-color: rgba(0, 0, 0, 0.8);
  outline: 0;
}

.video-bg {
  width: 800px;
  height: 600px;
  overflow: hidden;
  position: relative;
}

.video-bg img {
  width: 800px;
  height: 600px;
}

.video-btn-box {
  width: 800px;
  height: 160px;
  padding: 20px 40px;
  box-sizing: border-box;
}

.video-btn {
  width: 170px;
  height: 120px;
  margin-right: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  float: left;
}

.video-btn img {
  width: 170px;
  height: 120px;
}

.video-play-btn {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 800px;
  height: 600px;
  background-color: rgba(0, 0, 0, 0.6);
  background-image: url("../assets/img/videoplay.png");
  background-repeat: no-repeat;
  background-size: 100px 100px;
  background-position: center center;
}

/*rightview*/

.product-box {
  width: 775px;
  height: 960px;
  overflow: hidden;
  margin: 100px auto 0px;
}

.product {
  width: 380px;
  height: 300px;
  margin-bottom: 20px;
  overflow: hidden;
}

.product:nth-child(odd) {
  margin-right: 15px;
  float: left;
}

.product-item {
  width: 380px;
  height: 300px;
  background: url("../assets/img/border4.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
}

.item-logo {
  width: 320px;
  height: 180px;
  margin-top: 22px;
  margin-bottom: 22px;
  border-radius: 8px;
}

.item-name {
  width: 350px;
  height: 40px;
  line-height: 40px;
  font-size: 32px;
  margin: 0 auto;
  text-align: center;
}

.item-text {
  width: 350px;
  height: 40px;
  margin: 0 auto;
  line-height: 25px;
  font-size: 20px;
  overflow: hidden;
}

.item-mini-logo {
  width: 150px;
  height: 40px;
}

.item-detail-name {
  width: 350px;
  height: 60px;
  line-height: 30px;
  overflow: hidden;
  font-size: 22px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 10px;
  box-sizing: border-box;
}

.item-detail-content {
  width: 350px;
  height: 150px;
  margin: 0 auto;
  line-height: 28px;
  font-size: 20px;
  overflow: hidden;
}

.item-detail-left-logo {
  width: 240px;
  height: 90px;
  margin-left: 30px;
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
