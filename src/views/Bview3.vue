<template>
  <div class="container">
    <div class="content-wrapper">
      <div class="video-wrapper">
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
          <div
            class="video-img"
            :style="{ backgroundImage: 'url(' + videoImgUrl + ')' }"
          ></div>
          <div
            class="video-play-btn"
            @click="playVideo()"
            v-show="swipertype === 1"
          ></div>
        </div>
      </div>

      <div class="video-btn-box">
        <div
          class="video-btn"
          v-for="(item, index) of swiperArr"
          :key="index"
          @click="chanceVideoFn(index)"
        >
          <div
            class="btn-item"
            :style="{ backgroundImage: 'url(' + item.bgimg + ')' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import { getCultureData } from "../api";
const { ipcRenderer } = window.require("electron");

export default {
  name: "Bview3",
  components: {},
  data() {
    return {
      videoBoo: false,
      baseUrl: "http://localhost/",
      videoSrc: "",
      videoImgUrl: null,
      clickIndex: null,
      swipertype: null,
      swiperArr: [],
      startvideoboo: false,
      inter: null,
    };
  },
  created() {
    this.connectionSocket();
    this.getCultureDataFn();
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
    playVideo() {
      this.videoBoo = true;
      this.videoSrc = this.swiperArr[this.clickIndex].url;
      this.$refs.videoRef.load();
      this.$refs.videoRef.play();
    },
    startvideo() {
      this.inter = setInterval(() => {
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

.content-wrapper {
  width: 2500px;
  height: 1780px; /*no*/
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -890px; /*no*/
  margin-left: -1250px;
  overflow: hidden;
}

.video-wrapper {
  width: 2500px;
  height: 1440px; /*no*/
  margin: 0 auto 30px; /*no*/
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bview3bg.png") no-repeat;
  background-size: 100% 100%;
}

.video-box {
  width: 2400px;
  height: 1350px; /*no*/
  margin: 0 auto; /*no*/
  margin-top: 45px; /*no*/
  background-color: rgba(0, 0, 0, 0.8);
}

.video-box .video {
  width: 2400px;
  height: 1350px; /*no*/
  border: none;
  outline: 0;
  margin: 0 auto;
}

.video-bg {
  width: 2400px;
  height: 1350px; /*no*/
  overflow: hidden;
  position: relative;
  margin: 0 auto; /*no*/
  margin-top: 45px; /*no*/
}

.video-bg .video-img {
  width: 2400px;
  height: 1350px; /*no*/
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
}

.video-play-btn {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 2400px;
  height: 1350px; /*no*/
  background-color: rgba(0, 0, 0, 0.6);
  background-image: url("../assets/img/videoplay.png");
  background-repeat: no-repeat;
  background-size: 100px 100px;
  background-position: center center;
}

.video-btn-box {
  width: 2500px;
  height: 281px; /*no*/
  margin: 0 auto;
  margin-top: 60px; /*no*/
  overflow: hidden;
}

.video-btn {
  width: 430px;
  height: 281px; /*no*/
  margin-right: 25px;
  margin-bottom: 30px; /*no*/
  float: left;
  background: url("../assets/img/btnbg.png") no-repeat;
  background-size: 100% 100%;
}

.btn-item {
  width: 360px;
  height: 220px; /*no*/
  margin: 0 auto;
  margin-top: 30px; /*no*/
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
</style>
