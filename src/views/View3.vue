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
              <div class="item-name" v-show="item.waterbusinessname === '商圈'">
                {{ item.watergoodsname }}
              </div>
              <div class="item-text" v-html="item.businesscontent"></div>
              <img
                v-show="item.waterbusinessname === '商品'"
                class="item-mini-logo"
                :src="item.waterbusinessimage"
              />
            </div>
            <div class="product-item" slot="back">
              <div class="item-detail-name">{{ item.watergoodsname }}</div>
              <div class="item-detail-content" v-html="item.goodscontent"></div>
              <div class="item-detail-left-logo">
                <img :src="item.watergoodsimage" />
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
import Stomp from "stompjs";
import { getProductData, getCultureData } from "../api";
const { ipcRenderer } = window.require("electron");

export default {
  name: "View3",
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
    };
  },
  created() {
    this.getProductDataFn();
    this.getCultureDataFn();
    this.connectionSocket();
    // this.swipershowFn();
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
            console.info(5, result, zz);
          });
        },
        (err) => {
          console.log("连接失败", err);
        }
      );
    },
    getCultureDataFn() {
      getCultureData({
        terminal_no: "cs001",
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.swiperArr = [];
          let result = ipcRenderer.sendSync("videolist");
          res.data.forEach((ele) => {
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
                time: ele.timerange,
                terminalno: ele.terminalno,
              });
            } else if (ele.sourcestype === "图片") {
              this.swiperArr.push({
                //1为视频，2为图片
                type: 2,
                url: ele.sources,
                bgimg: ele.sources,
                time: ele.timerange,
                terminalno: ele.terminalno,
              });
            }
          });
          this.clickIndex = 0;
          this.videoImgUrl = this.swiperArr[0].bgimg;
          this.swipertype = this.swiperArr[0].type;
        }
      });
    },
    getProductDataFn() {
      getProductData({
        terminal_no: "cs001",
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
        this.titleText = "互动营销";
      }
    },
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
    playVideo() {
      this.videoBoo = true;
      this.videoSrc = this.swiperArr[this.clickIndex].url;
      this.$refs.videoRef.load();
      this.$refs.videoRef.play();
      this.$refs.videoRef.addEventListener(
        "ended",
        function () {
          //结束
          console.log("播放结11束");
        },
        false
      );
    },
    swipershowFn() {
      setInterval(() => {
        if (this.clickIndex < this.swiperArr.length) {
          ++this.clickIndex;
          this.chanceVideoFn(this.clickIndex);
          console.info(1112222, this.clickIndex, this.swiperArr);
        }
      }, 3000);
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css">
</style>
<style scoped>
.container {
  width: 780px;
  height: 980px;
  margin-right: 12px;
  background: url("../assets/img/border.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;
}

.top-title {
  width: 320px;
  height: 40px;
  margin-left: 50px;
  line-height: 50px;
  font-size: 28px;
  color: #00ffd6;
  text-align: center;
}

.content-box-left,
.content-box-right {
  width: 100%;
  overflow: hidden;
}

.box {
  width: 700px;
  height: 500px;
  margin: 200px auto 0px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
}

.video-box {
  width: 700px;
  height: 400px;
}

.video-box .video {
  width: 700px;
  height: 400px;
  border: none;
  outline: 0;
}

.video-bg {
  width: 700px;
  height: 400px;
  overflow: hidden;
  position: relative;
}

.video-bg img {
  width: 700px;
  height: 400px;
}

.video-btn-box {
  width: 700px;
  height: 100px;
  padding: 10px 50px;
  box-sizing: border-box;
}

.video-btn {
  width: 100px;
  height: 80px;
  margin-right: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  float: left;
}

.video-btn img {
  width: 100px;
  height: 80px;
}

.video-play-btn {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 700px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.6);
  background-image: url("../assets/img/videoplay.png");
  background-repeat: no-repeat;
  background-size: 100px 100px;
  background-position: center center;
}

.close-video {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 20px;
  right: 20px;
  background: url("../assets/img/closevideo.png") no-repeat;
  background-size: 100% 100%;
}

/*rightview*/

.product-box {
  width: 575px;
  overflow: hidden;
  margin: 90px auto 0px;
}

.product {
  width: 280px;
  height: 225px;
  overflow: hidden;
}

.product:nth-child(odd) {
  margin-right: 15px;
  float: left;
  margin-bottom: 20px;
}

.product-item {
  width: 280px;
  height: 225px;
  background: url("../assets/img/border4.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
}

.item-logo {
  width: 210px;
  height: 110px;
  margin-top: 22px;
  margin-bottom: 5px;
}

.item-name {
  width: 280px;
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
}

.item-text {
  width: 210px;
  height: 40px;
  margin: 0 auto;
  line-height: 15px;
  font-size: 10px;
  overflow: hidden;
}

.item-mini-logo {
  width: 95px;
  height: 30px;
}

.item-detail-name {
  width: 210px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  font-size: 18px;
  margin: 0 auto;
  padding-top: 12px;
  padding-bottom: 5px;
}

.item-detail-content {
  width: 210px;
  height: 90px;
  margin: 0 auto;
  line-height: 18px;
  font-size: 10px;
  overflow: hidden;
}

.item-detail-left-logo {
  width: 135px;
  height: 65px;
  margin-left: 36px;
  text-align: left;
  float: left;
}

.item-detail-left-logo img {
  width: 135px;
  height: 40px;
}

.item-detail-right-logo {
  width: 65px;
  height: 80px;
  margin-left: 16px;
  float: left;
}

.item-detail-right-logo img {
  width: 65px;
  height: 65px;
}

.bottom-btn-left {
  width: 200px;
  height: 40px;
  text-align: center;
  font-size: 26px;
  line-height: 40px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 235px;
  letter-spacing: 4px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.bottom-btn-right {
  width: 200px;
  height: 40px;
  text-align: center;
  font-size: 26px;
  line-height: 40px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 40px;
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
