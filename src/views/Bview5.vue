<template>
  <div class="container">
    <div class="content-wrapper">
      <scroller
        :data="productArr"
        class="content-box"
      >
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
      </scroller>
    </div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
import scroller from "vue-infinite-auto-scroll";
import { getBankData } from "../api";

export default {
  name: "Bview5",
  components: {
    vueQr,
    Flipper,
    scroller,
  },
  data() {
    return {
      imageUrl: require("../assets/img/abclogo.png"),
      flippedArr: [],
      productArr: [],
    };
  },
  created() {
    for (let index = 0; index < 30; index++) {
      this.flippedArr.push(false);
    }
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
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css"></style>
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
  width: 3120px;
  height: 1600px; /*no*/
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -800px;
  margin-left: -1560px; /*no*/
}

.content-box {
  width: 3120px;
  height: 1600px; /*no*/
}

.hotproduct-item-wrapper {
  width: 720px;
  height: 480px; /*no*/
  float: left;
  margin: 0 30px;
  margin-bottom: 60px; /*no*/
}

.hotproduct-item {
  width: 720px;
  height: 480px; /*no*/
  padding: 25px 0px; /*no*/
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  background: url("../assets/img/hotproductbg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.hotproduct-item .item-name {
  width: 720px;
  height: 60px; /*no*/
  line-height: 60px; /*no*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #00ffd6;
  text-align: center;
  font-size: 42px;
}

.hotproduct-item .item-type {
  text-align: center;
  height: 35px; /*no*/
  line-height: 35px; /*no*/
  color: #fff;
  font-size: 28px;
  margin-top: 10px; /*no*/
}

.hotproduct-item .item-num {
  text-align: center;
  height: 110px; /*no*/
  line-height: 110px; /*no*/
  font-size: 92px;
  margin-top: 20px; /*no*/
  color: #00ffd6;
}

.hotproduct-item .item-unit {
  text-align: center;
  height: 35px; /*no*/
  line-height: 35px; /*no*/
  font-size: 28px;
  color: #fff;
  margin-top: 20px; /*no*/
}

.hotproduct-item .item-des1 {
  text-align: center;
  height: 50px; /*no*/
  line-height: 50px; /*no*/
  font-size: 36px;
  margin-top: 15px; /*no*/
  color: #fff;
}

.hotproduct-item .item-des2 {
  text-align: center;
  height: 50px; /*no*/
  line-height: 50px; /*no*/
  font-size: 36px;
  color: #fff;
  margin-top: 15px; /*no*/
}

.hotproduct-item .back-box {
  width: 300px;
  height: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -170px;
  margin-left: -150px;
}

.hotproduct-item .url-code {
  width: 300px;
  height: 300px;
}

.hotproduct-item .tips-text {
  height: 50px;
  line-height: 50px;
  color: #00ffd6;
  font-size: 36px;
  text-align: center;
  margin-top: 10px;
}
</style>
