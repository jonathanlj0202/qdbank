<template>
  <div class="container_b4">
    <div class="content-wrapper">
      <div class="content-box">
        <vue-seamless-scroll :data="productArr" :class-option="classOption">
          <div
            class="hotproduct-item-wrapper"
            v-for="(item, index) of productArr"
            :key="index"
          >
            <flipper width="100%" height="100%">
              <div class="hotproduct-item" slot="front">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-type">{{ item.type }}</div>
                <div class="item-num">{{ item.num }}</div>
                <div class="item-unit">{{ item.unit }}</div>
                <div class="item-des1">{{ item.dsc1 }}</div>
                <div class="item-des2">{{ item.dsc2 }}</div>
              </div>
              <div class="hotproduct-item" slot="back">
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
    <div class="dialog-wrapper" @click="clickdialog()"></div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
// import scroller from "vue-infinite-auto-scroll";
import vueSeamlessScroll from "vue-seamless-scroll";
import { getBankData } from "../api";

export default {
  name: "Bview4",
  components: {
    vueQr,
    Flipper,
    vueSeamlessScroll,
  },
  data() {
    return {
      imageUrl: require("../assets/img/abclogo.png"),
      productArr: [],
      timeval: null,
    };
  },
  created() {
    this.timeval = setTimeout(() => {
      this.$router.push({ path: "/bview1", query: { attr: "standpage" } });
      clearTimeout(this.timeval);
    }, 90000);
  },
  computed: {
    classOption() {
      return {
        step: 0.8, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 540, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
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
    clickdialog() {
      clearTimeout(this.timeval);
      this.$router.push("/");
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css"></style>
<style scoped>
/* @import '../assets/css/bview5_1920.css'; */
.container_b4 {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.container_b4 .content-wrapper {
  width: 3120px;
  height: 1600px;
  /*no*/
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -800px;
  margin-left: -1560px;
  /*no*/
}

.container_b4 .content-box {
  width: 3120px;
  height: 1600px;
  /*no*/
}

.container_b4 .hotproduct-item-wrapper {
  width: 720px;
  height: 480px;
  /*no*/
  float: left;
  margin: 0 30px;
  margin-bottom: 60px;
  /*no*/
}

.container_b4 .hotproduct-item {
  width: 720px;
  height: 480px;
  /*no*/
  padding: 25px 0px;
  /*no*/
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  background: url("../assets/img/hotproductbg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.container_b4 .hotproduct-item .item-name {
  width: 720px;
  height: 60px;
  /*no*/
  line-height: 60px;
  /*no*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #00ffd6;
  text-align: center;
  font-size: 42px;
}

.container_b4 .hotproduct-item .item-type {
  text-align: center;
  height: 35px;
  /*no*/
  line-height: 35px;
  /*no*/
  color: #fff;
  font-size: 28px;
  margin-top: 10px;
  /*no*/
}

.container_b4 .hotproduct-item .item-num {
  text-align: center;
  height: 110px;
  /*no*/
  line-height: 110px;
  /*no*/
  font-size: 92px;
  margin-top: 20px;
  /*no*/
  color: #00ffd6;
}

.container_b4 .hotproduct-item .item-unit {
  text-align: center;
  height: 35px;
  /*no*/
  line-height: 35px;
  /*no*/
  font-size: 28px;
  color: #fff;
  margin-top: 20px;
  /*no*/
}

.container_b4 .hotproduct-item .item-des1 {
  text-align: center;
  height: 50px;
  /*no*/
  line-height: 50px;
  /*no*/
  font-size: 36px;
  margin-top: 15px;
  /*no*/
  color: #fff;
}

.container_b4 .hotproduct-item .item-des2 {
  text-align: center;
  height: 50px;
  /*no*/
  line-height: 50px;
  /*no*/
  font-size: 36px;
  color: #fff;
  margin-top: 15px;
  /*no*/
}

.container_b4 .hotproduct-item .back-box {
  width: 300px;
  height: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -170px;
  margin-left: -150px;
}

.container_b4 .hotproduct-item .url-code {
  width: 300px;
  height: 300px;
}

.container_b4 .hotproduct-item .tips-text {
  height: 50px;
  line-height: 50px;
  color: #00ffd6;
  font-size: 36px;
  text-align: center;
  margin-top: 10px;
}

.container_b4 .dialog-wrapper {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}
</style>
