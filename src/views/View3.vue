<template>
  <div class="container">
    <div class="content-box">
      <div
        class="hotproduct-item-wrapper"
        v-for="(item, index) of productArr"
        :key="index"
      >
        <flipper
          width="100%"
          height="100%"
          :flipped="flippedArr[index]"
          @click="onClick(index)"
        >
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
    </div>

    <div class="bottom-btn-box">热销产品</div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
import { getBankData } from "../api";

export default {
  name: "View3",
  components: {
    vueQr,
    Flipper,
  },
  data() {
    return {
      imageUrl: require("../assets/img/abclogo.png"),
      flippedArr: [],
      productArr: [],
    };
  },
  created() {
    for (let index = 0; index < 6; index++) {
      this.flippedArr.push(false);
    }
    getBankData({
      terminal_no: window.MAC,
    }).then((res) => {
      console.info(2233, res);
      if (res.retCode === "0" && res.data) {
        this.productArr = [];
        res.data.forEach((ele) => {
          this.productArr.push({
            name: ele.title.substring(
              ele.title.indexOf(`“`) + 1,
              ele.title.indexOf(`”`)
            ),
            type: "定期理财",
            num: ele.interest,
            unit: "业绩基准",
            dsc1: `投资期限：${ele.prodLimit}`,
            dsc2: `起购金额：${ele.amtStart}`,
            url: `https://webank.abchina.com/mmsp-xs/customer/product/view/financeDetail?moduleId=${ele.moduleId}&moduleType=20003000&storeId=103638&employeeOrder=1&logId=20201218092254396001&_t=34037&_t=75422`,
          });
        });
      }
    });
  },
  methods: {
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css"></style>
<style scoped>
.container {
  width: 1100px;
  height: 1920px; /*no*/
  position: absolute;
  top: 50%;
  left: 2140px;
  margin-top: -960px; /*no*/
  overflow: hidden;
}

.content-box {
  width: 1025px;
  margin: 0px auto 35px;
  padding-top: 80px; /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.hotproduct-item-wrapper {
  width: 500px;
  height: 330px; /*no*/
  float: left;
  margin-bottom: 20px; /*no*/
}

.hotproduct-item-wrapper:nth-child(odd) {
  margin-right: 20px;
}

.hotproduct-item {
  width: 500px;
  height: 330px; /*no*/
  padding: 25px 0px; /*no*/
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  background: url("../assets/img/hotproductbg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.hotproduct-item .back-box {
  width: 200px;
  height: 250px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -125px;
  margin-left: -100px;
}

.hotproduct-item .url-code {
  width: 200px;
  height: 200px;
}

.hotproduct-item .tips-text {
  height: 30px;
  line-height: 30px;
  color: #00ffd6;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.hotproduct-item .item-name {
  width: 450px;
  height: 40px; /*no*/
  line-height: 40px; /*no*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #00ffd6;
  text-align: center;
  font-size: 26px;
}

.hotproduct-item .item-type {
  text-align: center;
  height: 30px; /*no*/
  line-height: 30px; /*no*/
  color: #fff;
  font-size: 24px;
  margin-top: 5px; /*no*/
}

.hotproduct-item .item-num {
  text-align: center;
  height: 50px; /*no*/
  line-height: 50px; /*no*/
  font-size: 40px;
  margin-top: 10px; /*no*/
  color: #00ffd6;
}

.hotproduct-item .item-unit {
  text-align: center;
  height: 30px; /*no*/
  line-height: 30px; /*no*/
  font-size: 22px;
  color: #fff;
  margin-top: 10px; /*no*/
}

.hotproduct-item .item-des1 {
  text-align: center;
  height: 30px; /*no*/
  line-height: 30px; /*no*/
  font-size: 22px;
  margin-top: 10px; /*no*/
  color: #fff;
}

.hotproduct-item .item-des2 {
  text-align: center;
  height: 30px; /*no*/
  line-height: 30px; /*no*/
  font-size: 22px;
  color: #fff;
  margin-top: 5px; /*no*/
}

/*bottomview*/

.bottom-btn-box {
  position: absolute;
  bottom: 25px; /*no*/
  left: 205px;
  width: 690px;
  height: 60px; /*no*/
  line-height: 60px; /*no*/
  background-image: url("../assets/img/3.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #00ffd6;
  letter-spacing: 2px;
  font-size: 32px;
}
</style>
