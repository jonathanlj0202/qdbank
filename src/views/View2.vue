<template>
  <div class="container2">
    <div class="content-box-left" v-show="isLeft">
      <div class="content-wrapper">
        <div class="abc-logo"></div>
        <div class="video-wrapper">
          <div class="video-box" v-show="videoBoo">
            <video
              class="video"
              :src="videoSrc"
              autoplay="autoplay"
              type="video/mp4"
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
        </div>

        <Swiper
          v-if="swiperslideArr.length > 0"
          :showIndicator="swiperslideArr.length > 1"
          :autoPlay="false"
        >
          <Slide v-for="(objArr, key) in swiperslideArr" :key="key">
            <div class="video-btn-box">
              <div
                class="video-btn"
                v-for="(item, index) in objArr"
                :key="index"
                @click="chanceVideoFn(key * 4 + index)"
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
    <div class="content-box-right" v-show="isRight">
      <div class="person-wrapper">
        <div class="user-item" v-for="(item, i) in personArr" :key="i">
          <div class="avatar-box">
            <img class="user-avatar" :src="item.personimage" />
          </div>
          <div class="user-name">{{ item.personname }}</div>
          <div class="user-desc">职位：{{ item.position }}</div>
          <div class="user-desc">工龄：{{ item.workeyear }}年</div>
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
        文化剧场
      </div>
      <div
        :class="{ 'btn-right left-choose': isLeft, 'btn-right': isRight }"
        @click="chooseFn('isRight')"
      >
        员工信息
      </div>
    </div>
  </div>
</template>
<script>
import { Swiper, Slide } from "vue-swiper-component";
import SockJS from "sockjs-client";
import { Stomp } from "../assets/js/stomp.js";
import { getCultureData, getPersonData } from "../api";
const { ipcRenderer } = window.require("electron");

export default {
  name: "View2",
  components: {
    Swiper,
    Slide,
  },
  data() {
    return {
      isLeft: true,
      isRight: false,
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
    this.getPerson();
    this.getCultureDataFn();
    this.connectionSocket();
  },
  methods: {
    getPerson() {
      getPersonData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.personArr = res.data;
        }
      });
    },
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
            if (++index % 4 === 0) {
              this.swiperslideArr.push(slideArr);
              slideArr = [];
            }
            if (
              this.swiperArr.length % 4 !== 0 &&
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
    chooseFn(str) {
      if (str === "isLeft") {
        this.isLeft = true;
        this.isRight = false;
        if (this.videoListInter) {
          clearInterval(this.videoListInter);
          this.videoListInter = null;
        }
        if (this.timingPlayBoo) {
          this.videoList = this.timingArr;
        } else {
          this.videoList = this.videoArr;
        }
        this.videoListPlay();
      } else {
        this.isLeft = false;
        this.isRight = true;
        this.videoBoo = false;
        this.videoSrc = "";
      }
    },
    playVideo() {
      if (this.isLeft) {
        if (this.chanceTime) {
          clearTimeout(this.chanceTime);
          this.chanceTime = null;
        }
        this.videoBoo = true;
        this.videoSrc = this.swiperArr[this.clickIndex].url;
        this.$refs.videoRef.load();
        let videoval = setTimeout(() => {
          this.$refs.videoRef.play();
          clearTimeout(videoval);
        }, 150);
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
      }
    },
    //实现播放列表轮播
    videoListPlay() {
      if (this.isLeft) {
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
                number = 0;
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
      }
    },
    //监听定时播放
    timingPlay() {
      setInterval(() => {
        let timeStr = new Date().getTime();
        this.swiperArr.forEach((element, index) => {
          if (
            timeStr > element.time[0] &&
            timeStr < element.time[1] &&
            element.type === 1
          ) {
            if (
              this.timingArr.length < 1 ||
              this.timingArr[0].url !== element.url
            ) {
              this.timingArr = [];
              this.timingArr.push(this.swiperArr[index]);
              if (this.videoListInter) {
                clearInterval(this.videoListInter);
                this.videoListInter = null;
              }
              this.videoList = this.timingArr;

              this.videoListPlay();
            }
          }
          if (this.timingArr.length > 0) {
            this.timingPlayBoo = true;
          } else {
            this.timingPlayBoo = false;
          }
        });
      }, 1000);
    },
  },
};
</script>
<style scoped>
/* @import '../assets/css/view2_1920.css'; */
.container2 {
  width: 1040px;
  height: 1920px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 1100px;
  margin-top: -960px;
  /*no*/
  overflow: hidden;
}

.container2 .content-box-left,
.content-box-right {
  width: 100%;
  padding-top: 80px;
  /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.container2 .content-wrapper {
  width: 1040px;
  height: 1730px;
  /*no*/
  padding-top: 80px;
  /*no*/
  box-sizing: border-box;
}

.container2 .abc-logo {
  width: 484px;
  height: 94px;
  background: url("../assets/img/banklogo.png") no-repeat;
  background-size: contain;
  margin: 0px auto 100px;
  /*no*/
}

.container2 .video-wrapper {
  width: 1026px;
  border: 5px solid #916f0e; /*no*/
  height: 580px;
  /*no*/
  margin: 0 auto 60px;
  /*no*/
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
}

.container2 .video-box {
  width: 1026px;
  height: 580px;
  /*no*/
}

.container2 .video-box .video {
  width: 1026px;
  height: 580px;
  /*no*/
  border: none;
  background-color: rgba(0, 0, 0, 0.8);
  outline: 0;
  margin: 0 auto;
}

.container2 .video-bg {
  width: 1036px;
  height: 580px;
  /*no*/
  overflow: hidden;
  position: relative;
}

.container2 .video-bg img {
  width: 1036px;
  height: 580px;
  /*no*/
}

.container2 .video-play-btn {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 1036px;
  height: 580px;
  /*no*/
  background-color: rgba(0, 0, 0, 0.6);
  background-image: url("../assets/img/videoplay.png");
  background-repeat: no-repeat;
  background-size: 100px 100px;
  background-position: center center;
}

.container2 .video-btn-box {
  width: 960px;
  height: 620px;
  /*no*/
  margin: 0 auto;
  margin-top: 60px;
  /*no*/
  overflow: hidden;
}

.container2 .video-btn {
  width: 430px;
  height: 281px;
  /*no*/
  margin-left: 25px;
  margin-right: 25px;
  margin-bottom: 30px;
  /*no*/
  float: left;
  background: url("../assets/img/btnbg.png") no-repeat;
  background-size: 100% 100%;
}

.container2 .btn-item {
  width: 360px;
  height: 220px;
  /*no*/
  margin: 0 auto;
  margin-top: 30px;
  /*no*/
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

/*rightview*/

.container2 .person-wrapper {
  width: 1040px;
  height: 1730px;
  /*no*/
  /* background-image: url("../assets/img/centerbg.png"); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 0px 100px;
  padding-top: 155px !important;
  /*no*/
  padding-bottom: 260px !important;
  /*no*/
  box-sizing: border-box;
}

.container2 .user-item {
  width: 180px;
  float: left;
  margin: 0 50px;
  margin-bottom: 55px !important;
  /*no*/
  color: #fff;
  overflow: hidden;
  text-align: center;
}

.container2 .avatar-box {
  width: 180px;
  height: 180px;
  background: url("../assets/img/userBorder.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
}

.container2 .user-avatar {
  width: 160px;
  height: 160px;
  border-radius: 80px;
  margin-top: 10px;
}

.container2 .user-name {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  margin-top: 15px;
  overflow: hidden;
}

.container2 .user-desc {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

/*bottomview*/

.container2 .bottom-btn-box {
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
  color: #fff;
  letter-spacing: 2px;
}

.container2 .choose {
  background-image: url("../assets/img/1.png") !important;
}

.container2 .btn-left {
  width: 405px;
  float: left;
  font-size: 32px;
  color: #fff;
}

.container2 .left-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}

.container2 .btn-right {
  width: 405px;
  float: right;
  font-size: 32px;
  color: #fff;
}

.container2 .right-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}
</style>
