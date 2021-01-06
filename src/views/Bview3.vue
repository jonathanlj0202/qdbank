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
      <Swiper v-if="swiperslideArr.length > 0" :showIndicator="swiperslideArr.length > 1" :autoPlay="false">
        <Slide v-for="(objArr, key) in swiperslideArr" :key="key">
          <div class="video-btn-box">
            <div
              class="video-btn"
              v-for="(item, index) in objArr"
              :key="index"
              @click="chanceVideoFn(key * 5 + index)"
            >
              <div
                class="btn-item"
                :style="{ backgroundImage: 'url(' + item.bgimg + ')' }"
              ></div>
            </div>
          </div>
        </Slide>
      </Swiper>
    </div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import { Swiper, Slide } from "vue-swiper-component";
import { Stomp } from "../assets/js/stomp.js";
import { getCultureData } from "../api";
const { ipcRenderer } = window.require("electron");

export default {
  name: "Bview3",
  components: {
    Swiper,
    Slide,
  },
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
      swiperslideArr: [],
      personArr: [],
      videoListInter: null,
      timingPlayBoo: null,
      timingArr: [],
      chanceTime: null,
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
          this.swiperslideArr = [];
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
          let slideArr = [];
          this.swiperArr.forEach((ele, index) => {
            slideArr.push(ele);
            if (++index % 5 === 0) {
              this.swiperslideArr.push(slideArr);
              slideArr = [];
            }
            if (
              this.swiperArr.length % 5 !== 0 &&
              this.swiperArr.length === ++index
            ) {
              this.swiperslideArr.push(slideArr);
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
    chanceVideoFn(index) {
      if (this.chanceTime) {
        clearTimeout(this.chanceTime);
        this.chanceTime = null;
      }
      if (this.videoListInter) {
        clearInterval(this.videoListInter);
        this.videoListInter = null;
      }
      if (index !== this.clickIndex) {
        this.videoBoo = false;
        this.videoSrc = "";
      }
      this.videoImgUrl = this.swiperArr[index].bgimg;
      this.swipertype = this.swiperArr[index].type;
      this.clickIndex = index;
      this.chanceTime = setTimeout(() => {
        clearTimeout(this.chanceTime);
        if (this.timingPlayBoo) {
          this.videoList = this.timingArr;
        } else {
          this.videoList = this.videoArr;
        }
        this.videoListPlay();
      }, 30000);
    },
    playVideo() {
      if (this.chanceTime) {
        clearTimeout(this.chanceTime);
        this.chanceTime = null;
      }
      this.videoBoo = true;
      this.videoSrc = this.swiperArr[this.clickIndex].url;
      this.$refs.videoRef.load();
      this.$refs.videoRef.play();
      this.$refs.videoRef.addEventListener(
        "ended",
        () => {
          let timeval = setTimeout(() => {
            clearTimeout(timeval);
            if (this.timingPlayBoo) {
              this.videoList = this.timingArr;
            } else {
              this.videoList = this.videoArr;
            }
            this.videoListPlay();
          }, 15000);
        },
        false
      );
    },
    //实现播放列表轮播
    videoListPlay() {
      let number = 0;
      this.videoBoo = true;
      this.videoSrc = this.videoList[number].url;
      this.$refs.videoRef.load();
      this.$refs.videoRef.play();
      this.videoListInter = setInterval(() => {
        if (this.$refs.videoRef.ended) {
          ++number;
          if (number >= this.videoList.length) {
            number = 0;
          }
          this.videoSrc = this.videoList[number].url;
          this.$refs.videoRef.load();
          this.$refs.videoRef.play();
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
  height: 320px; /*no*/
  overflow: hidden;
}

.video-btn {
  width: 430px;
  height: 281px; /*no*/
  margin-right: 70px;
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
