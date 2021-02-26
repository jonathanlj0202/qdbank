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
@import '../assets/css/view2_1920.css';
</style>
