<template>
  <div class="container_b2">
    <div class="product-box">
      <div class="product" v-for="(item, index) of productArr" :key="index">
        <flipper
          width="100%"
          height="100%"
          :flipped="flippedArr[index]"
          @click="onClick(index)"
        >
          <div class="product-item" slot="front">
            <div
              class="item-logo"
              :style="{ backgroundImage: 'url(' + item.waterbusiness + ')' }"
            ></div>
            <div class="item-name">
              {{ item.watergoodsname }}
            </div>
          </div>
          <div class="product-item" slot="back">
            <div class="item-detail-name">{{ item.watergoodsname }}</div>
            <div class="item-detail-content" v-html="item.goodscontent"></div>
            <div class="item-detail-left-logo">
              <img :src="item.waterbusinessimage" />
            </div>
            <div class="item-detail-right-logo">
              <img :src="item.watercodeimage" />
            </div>
          </div>
        </flipper>
      </div>
    </div>
    <div class="dialog-wrapper" @click="clickdialog()"></div>
  </div>
</template>
<script>
import Flipper from "vue-flipper";
import { getProductData } from "../api";

export default {
  name: "Bview2",
  components: {
    Flipper,
  },
  data() {
    return {
      flippedArr: [],
      productArr: [],
      timeval: null,
    };
  },
  created() {
    this.getProductDataFn();
    this.timeval = setTimeout(() => {
      this.$router.push({ path: "/bview3" });
      clearTimeout(this.timeval);
    }, 60000);
  },
  methods: {
    getProductDataFn() {
      getProductData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.productArr = res.data;
          this.productArr.forEach(() => {
            this.flippedArr.push(false);
          });
        }
      });
    },
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
    clickdialog() {
      clearTimeout(this.timeval);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* @import '../assets/css/bview2_1920.css'; */
.container_b2 {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.container_b2 .product-box {
  width: 3130px;
  height: 1310px;
  /*no*/
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -1565px;
  margin-top: -655px;
  /*no*/
  box-sizing: border-box;
  overflow: hidden;
}

.container_b2 .product {
  width: 740px;
  height: 620px;
  /*no*/
  margin: 0 20px;
  margin-bottom: 40px;
  /*no*/
  overflow: hidden;
  float: left;
}

.container_b2 .product-item {
  width: 750px;
  padding-top: 1px;
  /*no*/
  box-sizing: border-box;
  height: 620px;
  /*no*/
  background: url("../assets/img/bview2bg.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
}

.container_b2 .item-logo {
  width: 580px;
  height: 370px;
  /*no*/
  margin: 75px auto 10px;
  /*no*/
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  border-radius: 8px !important;
  overflow: hidden;
}

.container_b2 .item-name {
  width: 580px;
  height: 70px;
  /*no*/
  line-height: 70px;
  /*no*/
  font-size: 56px;
  margin: 0 auto;
  text-align: center;
}

.container_b2 .item-detail-name {
  width: 680px;
  height: 60px;
  /*no*/
  line-height: 30px;
  /*no*/
  overflow: hidden;
  font-size: 46px;
  margin: 0 auto;
  padding-top: 20px;
  /*no*/
  padding-bottom: 10px;
  /*no*/
  margin-top: 50px;
  /*no*/
  box-sizing: border-box;
}

.container_b2 .item-detail-content {
  width: 680px;
  height: 300px;
  /*no*/
  margin: 10px auto 0px;
  /*no*/
  line-height: 60px;
  /*no*/
  font-size: 36px;
  overflow: hidden;
}

.container_b2 .item-detail-left-logo {
  width: 240px;
  height: 90px;
  /*no*/
  margin-left: 50px;
  text-align: left;
  float: left;
}

.container_b2 .item-detail-left-logo img {
  width: 320px;
  height: 140px;
  border-radius: 5px;
}

.container_b2 .item-detail-right-logo {
  width: 140px;
  height: 140px;
  margin-right: 50px;
  float: right;
}

.container_b2 .item-detail-right-logo img {
  width: 140px;
  height: 140px;
}

.container_b2 .dialog-wrapper {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}
</style>
