<template>
  <div class="container">
    <div class="top-title">{{ titleText }}</div>
    <div class="content-box-left" v-show="isLeft">
      <div class="box">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) of 4" :key="index">
            <div class="swiper-img-box" @click="playVideo(index)">
              <img
                class="swiper-img"
                :src="require(`../assets/img/video${++index}.png`)"
              />
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="video-box" v-show="videoBoo">
        <video
          class="video"
          :src="videoSrc"
          autoplay
          type="video/mp4"
          controls="controls"
        ></video>
        <div class="close-video" @click="closeVideoFn()"></div>
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
const { ipcRenderer } = window.require("electron");
import { getProductData } from "../api";

export default {
  name: "View4",
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
      flippedArr: [],
      productArr: [],
      swiperOption: {
        loop: true,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1.5,
        coverflowEffect: {
          //修改其中的数值，即可
          rotate: 0, //旋转
          stretch: 80, //拉伸
          depth: 150, //深度
          modifier: 1,
          slideShadows: true,
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
      },
    };
  },
  created() {
    var result = ipcRenderer.sendSync("videolist");
    console.info("videolist", result);
    this.getProductDataFn();
  },
  methods: {
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
      this.videoSrc = this.baseUrl + "2F836E14792C4DC2A34865EC40F65D72.mp4";
    },
    closeVideoFn() {
      this.videoBoo = false;
      this.videoSrc = "";
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
  width: 600px;
  height: 270px;
  margin: 305px auto 0px;
  position: relative;
  overflow: hidden;
}
.swiper-container {
  width: 100%;
  height: 270px;
  overflow: hidden;
}

.swiper-img-box {
  width: 370px;
  height: 260px;
  overflow: hidden;
}

.swiper-img {
  width: 370px;
  height: 260px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.video-box {
  width: 730px;
  height: 430px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -215px;
  margin-left: -365px;
  overflow: hidden;
  z-index: 10;
  background-color: rgba(0, 0, 0, 1);
}

.video-box .video {
  width: 730px;
  height: 430px;
  border: none;
  outline: 0;
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
