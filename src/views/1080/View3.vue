<template>
  <div class="container3">
    <div class="content-box-left" v-show="isLeft">
      <div class="active-wrapper">
        <img :class="classVal" :src="srcUrl" />
      </div>
    </div>
    <div class="content-box-right" v-show="isRight">
      <div class="content-wrapper" @click="onClick">
        <vue-seamless-scroll
          :data="isRight ? productArr : []"
          class="content-box"
          :class-option="classOption"
        >
          <div
            class="hotproduct-item-wrapper"
            v-for="(item, index) of productArr"
            :key="index"
            :data-num="index"
          >
            <flipper width="100%" height="100%">
              <div class="hotproduct-item" slot="front" :id="index">
                <div class="item-logo">理财</div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-label-box">
                  <div class="item-label">封闭</div>
                  <div class="item-label">保本浮动收益</div>
                </div>
                <div class="item-num">{{ item.num }}</div>
                <div class="item-default-slogon">{{ item.defaultSlogon }}</div>
                <div class="item-des1">{{ item.dsc1 }}</div>
                <div class="item-des2">{{ item.dsc2 }}</div>
                <div class="item-buy">点击购买</div>
              </div>
              <div class="hotproduct-item" slot="back" :id="index">
                <div class="back-box">
                  <vue-qr
                    :logoSrc="imageUrl"
                    :text="item.url"
                    class="url-code"
                  ></vue-qr>
                  <div class="tips-text">扫码购买</div>
                </div>
              </div>
            </flipper>
          </div>
        </vue-seamless-scroll>
      </div>
    </div>
    <div
      :class="{ 'bottom-btn-box': isLeft, 'bottom-btn-box choose': isRight }"
    >
      <div
        :class="{ 'btn-left': isLeft, 'btn-left right-choose': isRight }"
        @click="chooseFn('isLeft')"
      >
        活动
      </div>
      <div
        :class="{ 'btn-right left-choose': isLeft, 'btn-right': isRight }"
        @click="chooseFn('isRight')"
      >
        理财
      </div>
    </div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
import vueSeamlessScroll from "vue-seamless-scroll";

import { getBankData } from "../../api";

export default {
  name: "View3",
  components: {
    vueQr,
    Flipper,
    vueSeamlessScroll,
  },
  data() {
    return {
      isLeft: true,
      isRight: false,
      index: 0,
      classVal: `active-logo animate__animated animate__fadeIn`,
      imageUrl: require("../../assets/img/abclogo.png"),
      productArr: [],
      codeImgArr: [],
      srcUrl: require("../../assets/img/a.jpg"),
      imgArr: [
        require("../../assets/img/a.jpg"),
        require("../../assets/img/b.jpg"),
        require("../../assets/img/c.jpg"),
      ],
    };
  },
  computed: {
    classOption() {
      return {
        step: 1.0, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 192, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  created() {
    this.initView();
    this.getBankDataFn();
    setInterval(() => {
      this.classVal = `active-logo animate__animated animate__fadeOut`;
      if (this.index > 1) {
        this.index = 0;
      } else {
        ++this.index;
      }
      let timeVal = setTimeout(() => {
        this.srcUrl = this.imgArr[this.index];
        this.classVal = `active-logo animate__animated animate__fadeIn`;
        clearTimeout(timeVal);
      }, 1500);
    }, 180000);
  },
  methods: {
    initView() {
      setInterval(() => {
        let contentDom = document.getElementsByClassName("content-box")[0]
          .children[0];
        let contentDomHight = document.defaultView.getComputedStyle(
          contentDom,
          null
        ).height;
        let contentDomHightNum =
          Number(contentDomHight.substring(0, contentDomHight.length - 2)) / 2;
        let contentDomTransform = document.defaultView.getComputedStyle(
          contentDom,
          null
        ).transform;
        let transformNum = Number(
          contentDomTransform.substring(23, contentDomTransform.length - 1)
        );
        if (transformNum > contentDomHightNum) {
          let eleLength = document.getElementsByClassName(
            "hotproduct-item-wrapper"
          ).length;
          for (let index = 0; index < eleLength; index++) {
            let dom = document.getElementsByClassName(
              "hotproduct-item-wrapper"
            )[index].children[0];
            dom.setAttribute("class", "Flipper");
          }
        }
      }, 1000);
    },
    chooseFn(str) {
      if (str === "isLeft") {
        this.isLeft = true;
        this.isRight = false;
      } else {
        this.isLeft = false;
        this.isRight = true;
      }
    },
    hasClass(ele, cName) {
      if (ele && ele.className === cName) {
        return true;
      } else {
        return false;
      }
    },
    getBankDataFn() {
      this.productArr = JSON.parse(localStorage.getItem("productArr"));
      getBankData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.retCode === "0" && res.data) {
          this.productArr = [];
          res.data.forEach((ele) => {
            this.productArr.push({
              name:
                ele.title.indexOf(`“`) > -1
                  ? ele.title.substring(
                      ele.title.indexOf(`“`) + 1,
                      ele.title.indexOf(`”`)
                    )
                  : ele.title,
              type: "定期理财",
              num: ele.interest,
              defaultSlogon: ele.defaultSlogon,
              dsc1: `起购金额：${ele.amtStart}`,
              dsc2: `投资期限：${ele.prodLimit}`,
              url: `https://webank.abchina.com/mmsp-xs/customer/product/view/financeDetail?moduleId=${ele.moduleId}&moduleType=20003000&storeId=103638&employeeOrder=1&logId=20201218092254396001&_t=34037&_t=75422`,
            });
          });
          let length = this.productArr.length;
          // length = length % 2 === 0 ? length : --length;
          for (let i = 0; i < length; i++) {
            this.productArr.push(this.productArr[i]);
          }
          localStorage.setItem("productArr", JSON.stringify(this.productArr));
        }
      });
    },
    getParent(ele, classStr) {
      let targetParent = ele.parentNode;
      while (!this.hasClass(targetParent, classStr)) {
        targetParent = targetParent.parentNode;
        if (targetParent.className === "app-box") {
          return targetParent;
        }
      }
      return targetParent;
    },
    onClick(event) {
      if (!this.codeImgArr.length) {
        let eleLength = document.getElementsByClassName(
          "hotproduct-item-wrapper"
        ).length;
        for (let index = 0; index < eleLength; index++) {
          let src = document
            .getElementsByClassName("hotproduct-item-wrapper")
            [index].getElementsByTagName("img")[0].src;
          if (src) this.codeImgArr.push(src);
        }
      }
      let zElement = this.getParent(event.target, "Flipper");
      let fElement = this.getParent(event.target, "Flipper Flipper--flipped");
      if (zElement.getAttribute("class") === "Flipper") {
        zElement.setAttribute("class", "Flipper Flipper--flipped");
        zElement.getElementsByTagName("img")[0].src = this.codeImgArr[
          zElement.parentNode.dataset.num
        ];
      } else if (
        fElement.getAttribute("class") === "Flipper Flipper--flipped"
      ) {
        fElement.setAttribute("class", "Flipper");
      }
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css"></style>
<style scoped>
/* @import '../assets/css/view3_1920.css'; */
.container3 {
  width: 1100px;
  height: 1080px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 2140px;
  margin-top: -540px;
  /*no*/
  overflow: hidden;
}

.container3 .content-box-left,
.container3 .content-box-right {
  width: 1025px;
  padding-top: 45px;
  /*no*/
  box-sizing: border-box;
  margin: 0px auto;
  overflow: hidden;
}

.container3 .content-wrapper {
  width: 1025px;
  height: 973px;
  /*no*/
  overflow: hidden;
}

.container3 .active-wrapper {
  width: 1025px;
  text-align: center;
  height: 973px;
  /*no*/
}

.container3 .active-logo {
  width: 100%;
  height: 100%;
}

.container3 .content-box {
  width: 1025px;
  height: 973px;
  /*no*/
}

/*no*/

.container3 .hotproduct-item-wrapper {
  width: 500px;
  height: 185px;
  /*no*/
  float: left;
  margin-bottom: 11px;
  /*no*/
}

.container3 .hotproduct-item-wrapper:nth-child(odd) {
  margin-right: 20px;
}

.container3 .hotproduct-item {
  width: 500px;
  height: 185px;
  /*no*/
  margin: 0 auto;
  padding-left: 40px;
  box-sizing: border-box;
  text-align: center;
  background: url("../../assets/img/hpBorder.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  border-top: 1px solid transparent;
}

.container3 .hotproduct-item .back-box {
  width: 200px;
  height: 140px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -70px;
  /*no*/
  margin-left: -100px;
}

.container3 .hotproduct-item .url-code {
  width: 200px;
  height: 112px;
  /*no*/
}


.container3 .hotproduct-item .tips-text {
  height: 30px;
  line-height: 30px;
  color: #ffb400;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.container3 .hotproduct-item .item-logo {
  width: 60px;
  box-sizing: border-box;
  height: 45px; /*no*/
  line-height: 45px; /*no*/
  background: url("../../assets/img/31minilogo.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 4.5px; /*no*/
  right: 60px;
  font-size: 22px;
  color: #6a5a00;
  letter-spacing: 2px; /*no*/
}

.container3 .hotproduct-item .item-name {
  height: 22px;
  /*no*/
  line-height: 22px;
  /*no*/
  margin-top: 22px;
  /*no*/
  margin-bottom: 5.6px;
  /*no*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
  text-align: left;
  font-size: 26px;
}

.container3 .hotproduct-item .item-label-box {
  width: 100%;
  height: 16px; /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.hotproduct-item .item-label-box .item-label {
  border: 1px solid #e8d87d; /*no*/
  height: 16px; /*no*/
  padding: 0px 10px;
  line-height: 16px; /*no*/
  font-size: 20px;
  float: left;
  margin-right: 18px;
  margin-left: 2px;
  color: #c3b66a;
  box-sizing: border-box;
}

.container3 .hotproduct-item .item-type {
  text-align: center;
  height: 16px;
  /*no*/
  line-height: 16px;
  /*no*/
  color: #fff;
  font-size: 24px;
  padding-top: 3px;
  /*no*/
}

.container3 .hotproduct-item .item-num {
  text-align: center;
  height: 28px;
  /*no*/
  line-height: 28px;
  /*no*/
  font-size: 40px;
  margin-top: 5.6px;
  /*no*/
  color: #ffb400;
}

.container3 .hotproduct-item .item-default-slogon {
  text-align: center;
  height: 16px;
  /*no*/
  line-height: 16px;
  /*no*/
  font-size: 22px;
  color: #fff;
  padding-top: 5.6px;
  /*no*/
}

.container3 .hotproduct-item .item-des1 {
  text-align: left;
  height: 16px;
  /*no*/
  line-height: 16px;
  /*no*/
  font-size: 22px;
  padding-top: 5.6px;
  /*no*/
  color: #fff;
}

.container3 .hotproduct-item .item-des2 {
  text-align: left;
  height: 16px;
  /*no*/
  line-height: 16px;
  /*no*/
  font-size: 22px;
  color: #fff;
  padding-top: 3px;
  /*no*/
  padding-bottom: 28px;
  /*no*/
}

.container3 .hotproduct-item .item-buy {
  width: 130px;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  color: #fff;
  position: absolute;
  bottom: 22px; /*no*/
  right: 30px;
  background: url("../../assets/img/buybtn.png") no-repeat;
  background-size: 100% 100%;
}

/*bottomview*/

.container3 .bottom-btn-box {
  position: absolute;
  bottom: 14px;
  /*no*/
  left: 205px;
  width: 690px;
  height: 33px;
  /*no*/
  line-height: 33px;
  /*no*/
  background-image: url("../../assets/img/2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
}

.container3 .choose {
  background-image: url("../../assets/img/1.png") !important;
}

.container3 .btn-left {
  width: 405px;
  float: left;
  font-size: 32px;
  color: #fff;
}

.container3 .left-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}

.container3 .btn-right {
  width: 405px;
  float: right;
  font-size: 32px;
  color: #fff;
}

.container3 .right-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}
</style>
