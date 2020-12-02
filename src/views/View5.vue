<template>
  <div class="container">
    <div class="top-title">{{ titleText }}</div>
    <div class="content-box-left" v-show="isLeft">
      <div class="box">
        <carousel-3d
          :autoplay="false"
          :perspective="35"
          :display="5"
          :animationSpeed="1000"
          :width="100"
        >
          <slide v-for="(item, i) in slides" :index="i" :key="i">
            <!--通过插槽作用域可以拿到点击的图片的索引-->
            <template>
              <img class="slide-logo" :src="item" alt="" />
            </template>
          </slide>
        </carousel-3d>
      </div>
    </div>
    <div class="content-box-right" v-show="isRight">
      <div class="product-box">
        <div class="product">
          <flipper
            width="100%"
            height="100%"
            :flipped="flippedArr[0]"
            @click="onClick(0)"
          >
            <div class="product-item" slot="front">
              <img class="item-logo" src="../assets/img/yx1top.png" />
              <div class="item-text">
                跳过前贴广告，设置更清晰的视频画面<br />提前观看影视，屏幕专属颜色设置。
              </div>
              <img class="item-mini-logo" src="../assets/img/yx1bottom.png" />
            </div>
            <div class="product-item" slot="back">
              <div class="item-detail-name">优酷</div>
              <div class="item-detail-content">
                优酷和中国农业银行联合推出金穗优酷电子账<br />户，通过绑定六大行一类借记卡，可实时在线<br />注册开通，开通完成后即可免费获得45天优酷<br />会员权益。
              </div>
              <div class="item-detail-left-logo">
                <img src="../assets/img/yx1bottom.png" />
              </div>
              <div class="item-detail-right-logo">
                <img src="../assets/img/code.png" />
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

export default {
  name: "View4",
  components: {
    Flipper,
  },
  data() {
    return {
      isLeft: true,
      isRight: false,
      titleText: "文化剧场",
      flippedArr: [false, false],
      slides: [
        require("../assets/img/video1.png"),
        require("../assets/img/video2.png"),
        require("../assets/img/video3.png"),
        require("../assets/img/video4.png"),
        require("../assets/img/video5.png"),
      ],
    };
  },
  methods: {
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
}
.swiper-container {
  width: 100%;
  height: 270px;
}

.swiper-img {
  width: 370px;
  height: 270px;
}

.slide-logo {
  width: 370px;
  height: 270px;
}

.carousel-3d-slide {
  width: 370px !important;
  height: 270px !important;
}

.carousel-3d-slider {
  width: 370px !important;
  height: 270px !important;
}

.carousel-3d-container {
  width: 100% !important;
}

/* .carousel-3d-slider {
  width: 200px !important;
  height: 200px !important;
} */

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
