<template>
  <div class="container_b3">
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
      </div>
    </div>
    <div class="dialog-wrapper" @click="clickdialog()"></div>
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
      videoArr: [],
      videoList: [],
      personArr: [],
      videoListInter: null,
      timingPlayBoo: null,
      timingArr: [],
      chanceTime: null,
      timeval: null,
    };
  },
  created() {
    this.timingPlay();
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
          stompClient.subscribe("/topic/service_change", () => {
            let zz = ipcRenderer.sendSync("updatedownload");
            this.getCultureDataFn();
            console.info(zz);
          });
        },
        (err) => {
          console.log("连接失败1", err);
        }
      );
    },
    getCultureDataFn() {
      this.videoBoo = false;
      this.videoSrc = "";
      getCultureData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.swiperArr = [];
          this.videoArr = [];
          this.videoList = [];
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
              let videoObj = {
                //1为视频，2为图片
                type: 1,
                url: localurl ? localurl : ele.sources,
                bgimg: ele.backgroundimages,
                time: timeArr,
                terminalno: ele.terminalno,
              };
              this.swiperArr.push(videoObj);
              this.videoArr.push(videoObj);
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
          this.videoImgUrl = this.swiperArr[0].bgimg;
          this.swipertype = this.swiperArr[0].type;
          if (this.timingPlayBoo) {
            this.videoList = this.timingArr;
          } else {
            this.videoList = this.videoArr;
          }
          this.videoListPlay();
        }
      });
    },
    //实现播放列表轮播
    videoListPlay() {
      let number = 0;
      this.videoBoo = true;
      this.videoSrc = this.videoList[number].url;
      this.$refs.videoRef.load();
      let videoval = setTimeout(() => {
        this.$refs.videoRef.play();
        clearTimeout(videoval);
      }, 150);
      this.videoListInter = setInterval(() => {
        if (this.$refs.videoRef) {
          if (this.$refs.videoRef.ended) {
            ++number;
            if (number >= this.videoList.length) {
              this.$router.push({ path: "/bview4" });
              return;
            }
            this.videoSrc = this.videoList[number].url;
            this.$refs.videoRef.load();
            let videoval = setTimeout(() => {
              this.$refs.videoRef.play();
              clearTimeout(videoval);
            }, 150);
          }
        }
      }, 500);
    },
    //监听定时播放
    timingPlay() {
      setInterval(() => {
        this.swiperArr.forEach((element, index) => {
          let timeStr = new Date().getTime();
          if (
            timeStr > element.time[0] &&
            timeStr < element.time[1] &&
            element.type === 1
          ) {
            this.timingArr = this.timingArr.push(this.swiperArr[index]);
          }
        });

        if (this.timingArr.length > 0) {
          this.timingPlayBoo = true;
        } else {
          this.timingArr = [];
          this.timingPlayBoo = false;
        }
      }, 1000);
    },
    clickdialog() {
      clearTimeout(this.timeval);
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
/* @import '../assets/css/bview3_1920.css'; */
.container_b3 {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.container_b3 .content-wrapper {
  width: 100%;
  height: 100vh;
  /*no*/
  position: absolute;
  top: 0px;
  left: 0px;
  overflow: hidden;
}

.container_b3 .video-wrapper {
  width: 100%;
  height: 100vh;
  /*no*/
  margin: 0 auto;
  /*no*/
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bview3bg.png") no-repeat;
  background-size: 100% 100%;
}

.container_b3 .video-box {
  width: 100%;
  height: 100vh;
  /*no*/
  margin: 0 auto;
  /*no*/
  background-color: rgba(0, 0, 0, 0.8);
}

.container_b3 .video-box .video {
  width: 100%;
  height: 100vh;
  /*no*/
  margin: 0 auto;
  /*no*/
  border: none;
  outline: 0;
}

.container_b3 .dialog-wrapper {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}
</style>
