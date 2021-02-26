<template>
  <div class="container3">
    <div class="content-wrapper">
      <scroller :data="productArr" class="content-box" ref="scroller">
        <div
          class="hotproduct-item-wrapper"
          v-for="(item, index) of productArr"
          :key="index"
          @click="onClick(index)"
        >
          <flipper width="100%" height="100%" :flipped="flippedArr[index]">
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
      </scroller>
    </div>

    <div class="bottom-btn-box">热销产品</div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import Flipper from "vue-flipper";
import scroller from "vue-infinite-auto-scroll";
import { getBankData } from "../api";

export default {
  name: "View3",
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
      cleaTime: null,
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
      if (this.cleaTime) {
        clearTimeout(this.cleaTime);
        this.cleaTime = null;
      }
      this.$refs.scroller.stop();
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
      this.cleaTime = setTimeout(() => {
        this.$refs.scroller.start();
        clearTimeout(this.cleaTime);
      }, 15000);
    },
  },
};
</script>
<style src="vue-flipper/dist/vue-flipper.css"></style>
<style scoped>
@import '../assets/css/view3_1920.css';
</style>
