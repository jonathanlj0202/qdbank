<template>
  <div class="container3">
    <div class="content-wrapper" @click="onClick">
      <vue-seamless-scroll
        :data="productArr"
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
              <div class="item-name">{{ item.name }}</div>
              <div class="item-type">{{ item.type }}</div>
              <div class="item-num">{{ item.num }}</div>
              <div class="item-unit">{{ item.unit }}</div>
              <div class="item-des1">{{ item.dsc1 }}</div>
              <div class="item-des2">{{ item.dsc2 }}</div>
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

    <div class="bottom-btn-box">热销产品</div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
import vueSeamlessScroll from "vue-seamless-scroll";

import { getBankData } from "../api";

export default {
  name: "View3",
  components: {
    vueQr,
    Flipper,
    vueSeamlessScroll,
  },
  data() {
    return {
      imageUrl: require("../assets/img/abclogo.png"),
      productArr: [],
      codeImgArr: [],
    };
  },
  computed: {
    classOption() {
      return {
        step: 0.8, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 350, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  created() {},
  mounted() {
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
            unit: "业绩基准",
            dsc1: `投资期限：${ele.prodLimit}`,
            dsc2: `起购金额：${ele.amtStart}`,
            url: `https://webank.abchina.com/mmsp-xs/customer/product/view/financeDetail?moduleId=${ele.moduleId}&moduleType=20003000&storeId=103638&employeeOrder=1&logId=20201218092254396001&_t=34037&_t=75422`,
          });
        });
        let length = this.productArr.length;
        length = length % 2 === 0 ? length : --length;
        for (let i = 0; i < length; i++) {
          this.productArr.push(this.productArr[i]);
        }
      }
    });
  },
  methods: {
    hasClass(ele, cName) {
      if (ele && ele.className === cName) {
        return true;
      } else {
        return false;
      }
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
  height: 1920px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 2140px;
  margin-top: -960px;
  /*no*/
  overflow: hidden;
}

.container3 .content-wrapper {
  width: 1025px;
  height: 1730px;
  /*no*/
  margin: 80px auto 0px;
  /*no*/
  overflow: hidden;
}

.container3 .content-box {
  width: 1025px;
  height: 1730px;
  /*no*/
}

/*no*/

.container3 .hotproduct-item-wrapper {
  width: 500px;
  height: 330px;
  /*no*/
  float: left;
  margin-bottom: 20px;
  /*no*/
}

.container3 .hotproduct-item-wrapper:nth-child(odd) {
  margin-right: 20px;
}

.container3 .hotproduct-item {
  width: 500px;
  height: 330px;
  /*no*/
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  background: url("../assets/img/hotproductbg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.container3 .hotproduct-item .back-box {
  width: 200px;
  height: 250px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -125px;
  margin-left: -100px;
}

.container3 .hotproduct-item .url-code {
  width: 200px;
  height: 200px;
}

.container3 .hotproduct-item .tips-text {
  height: 30px;
  line-height: 30px;
  color: #00ffd6;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.container3 .hotproduct-item .item-name {
  height: 40px;
  /*no*/
  line-height: 40px;
  /*no*/
  padding-top: 30px;
  /*no*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #00ffd6;
  text-align: center;
  font-size: 26px;
}

.container3 .hotproduct-item .item-type {
  text-align: center;
  height: 30px;
  /*no*/
  line-height: 30px;
  /*no*/
  color: #fff;
  font-size: 24px;
  padding-top: 5px;
  /*no*/
}

.container3 .hotproduct-item .item-num {
  text-align: center;
  height: 50px;
  /*no*/
  line-height: 50px;
  /*no*/
  font-size: 40px;
  padding-top: 10px;
  /*no*/
  color: #00ffd6;
}

.container3 .hotproduct-item .item-unit {
  text-align: center;
  height: 30px;
  /*no*/
  line-height: 30px;
  /*no*/
  font-size: 22px;
  color: #fff;
  padding-top: 10px;
  /*no*/
}

.container3 .hotproduct-item .item-des1 {
  text-align: center;
  height: 30px;
  /*no*/
  line-height: 30px;
  /*no*/
  font-size: 22px;
  padding-top: 10px;
  /*no*/
  color: #fff;
}

.container3 .hotproduct-item .item-des2 {
  text-align: center;
  height: 30px;
  /*no*/
  line-height: 30px;
  /*no*/
  font-size: 22px;
  color: #fff;
  padding-top: 5px;
  /*no*/
  padding-bottom: 50px;
  /*no*/
}

/*bottomview*/

.container3 .bottom-btn-box {
  position: absolute;
  bottom: 25px;
  /*no*/
  left: 205px;
  width: 690px;
  height: 60px;
  /*no*/
  line-height: 60px;
  /*no*/
  background-image: url("../assets/img/3.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #00ffd6;
  letter-spacing: 2px;
  font-size: 32px;
}
</style>
