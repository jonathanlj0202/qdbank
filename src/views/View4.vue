<template>
  <div class="container">
    <div class="top-title">千人千面</div>
    <div class="content-box">
      <div
        :class="classArr[index]"
        v-for="(item, index) of peopleArr"
        :key="index"
      >
        <img :src="item.avatorUrl" @click="showProduct(index)" />
        <div class="close-btn" @click="closeFn(index)"></div>
      </div>
    </div>
    <div class="product-box" v-show="productBoo">
      <img :src="clickProductUrl" />
      <div class="close-product-btn" @click="closeProductFn()"></div>
    </div>
    <div class="bottom-btn-right">千人千面</div>
  </div>
</template>
<script>
export default {
  name: "View4",
  components: {},
  data() {
    return {
      productBoo: false,
      clickIndex: null,
      clickProductUrl: null,
      classArr: [],
      peopleArr: [
        {
          avatorUrl: require("../assets/img/p1.png"),
          productUrl: require("../assets/img/product1.png"),
        },
        {
          avatorUrl: require("../assets/img/p2.png"),
          productUrl: require("../assets/img/product2.png"),
        },
        {
          avatorUrl: require("../assets/img/p3.png"),
          productUrl: require("../assets/img/product3.png"),
        },
        {
          avatorUrl: require("../assets/img/p4.png"),
          productUrl: require("../assets/img/product1.png"),
        },
        {
          avatorUrl: require("../assets/img/p5.png"),
          productUrl: require("../assets/img/product2.png"),
        },
      ],
    };
  },
  created() {
    this.randomClass();
  },
  methods: {
    randomClass() {
      let arr = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
      ];
      for (let index = 0; index < 30; index++) {
        let randomNum = Math.floor(Math.random() * 20);
        let classStr = `face-item${arr[randomNum]} face-item`;
        this.classArr.push(classStr);
      }
      this.classArr = this.unique(this.classArr);
    },
    unique(arr) {
      var arr1 = []; // 新建一个数组来存放arr中的值
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr1.indexOf(arr[i]) === -1) {
          arr1.push(arr[i]);
        }
      }
      return arr1;
    },
    closeFn(index) {
      this.peopleArr.splice(index, 1);
    },
    showProduct(index) {
      this.productBoo = true;
      this.clickProductUrl = this.peopleArr[index].productUrl;
    },
    closeProductFn() {
      this.productBoo = false;
      this.clickProductUrl = null;
    },
  },
};
</script>
<style src="../assets/css/animate.css"></style>
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

.content-box {
  width: 720px;
  height: 720px;
  /* background-color: #00f; */
  margin: 80px auto;
  position: relative;
}

.face-item {
  width: 100px;
  height: 100px;
  background: url("../assets/img/faceborder.png") no-repeat;
  background-size: 100% 100%;
  background-position: center 5px;
  text-align: center;
  position: absolute;
}

.face-item img {
  width: 80px;
  height: 80px;
  margin-top: 15px;
}

.product-box {
  width: 304px;
  height: 464px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -232px;
  margin-left: -152px;
}

.product-box img {
  width: 304px;
  height: 464px;
}

.close-product-btn {
  width: 40px;
  height: 40px;
  position: absolute;
  background: url("../assets/img/closeproduct.png") no-repeat;
  background-size: 100% 100%;
  top: 425px;
  left: 262px;
}

.face-item .close-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: url("../assets/img/closebtn.png") no-repeat;
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
  background-image: url("../assets/img/choose.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
