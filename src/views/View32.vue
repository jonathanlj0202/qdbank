<template>
  <div class="container">
    <div class="content-box-left" v-show="isLeft">
      <div class="map-content">
        <img v-show="GuideUrl" :src="GuideUrl" />
      </div>
      <div
        :class="[
          clickNum === 1 ? 'map-btn map-choose-btn first' : 'map-btn first',
        ]"
      >
        现金<br />服务区
      </div>
      <div
        :class="[
          clickNum === 2 ? 'map-btn map-choose-btn second' : 'map-btn second',
        ]"
      >
        个贷<br />业务区
      </div>
      <div
        :class="[
          clickNum === 3 ? 'map-btn map-choose-btn third' : 'map-btn third',
        ]"
      >
        智能<br />服务区
      </div>
      <div
        :class="[
          clickNum === 4 ? 'map-btn map-choose-btn fourth' : 'map-btn fourth',
        ]"
      >
        引导区
      </div>
      <div
        :class="[
          clickNum === 5 ? 'map-btn map-choose-btn fifth' : 'map-btn fifth',
        ]"
      >
        等候区
      </div>
      <div
        :class="[
          clickNum === 6 ? 'map-btn map-choose-btn sixth' : 'map-btn sixth',
        ]"
      >
        非<br />现金区
      </div>
      <div
        :class="[
          clickNum === 7 ? 'map-btn map-choose-btn seventh' : 'map-btn seventh',
        ]"
      >
        理财<br />业务区
      </div>
    </div>
    <div class="content-box-right" v-show="isRight">
      <slider :pages="pages" :sliderinit="sliderinit">
        <!-- slot  -->
      </slider>
      <!-- <div class="box-right" v-for="(item, index) of productArr" :key="index">
        <flipper
          width="100%"
          height="100%"
          :flipped="flippedArr[index]"
          @click="onClick(index)"
        >
          <div class="box-right-item" slot="front">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-type">{{ item.type }}</div>
            <div class="item-num">{{ item.num }}</div>
            <div class="item-unit">{{ item.unit }}</div>
            <div class="item-des1">{{ item.dsc1 }}</div>
            <div class="item-des2">{{ item.dsc2 }}</div>
          </div>
          <div class="box-right-item" slot="back">
            <vue-qr
              :logoSrc="imageUrl"
              :text="item.url"
              class="url-code"
            ></vue-qr>
            <div class="tips-text">扫码购买</div>
          </div>
        </flipper>
      </div> -->
    </div>
    <!-- <div
      :class="{
        'bottom-btn-left choose': isLeft,
        'bottom-btn-left nochoose': isRight,
      }"
      @click="chooseFn('isLeft')"
    >
      网点导览
    </div> -->
    <div class="bottom-btn-box">热销产品</div>
  </div>
</template>
<script>
// import vueQr from "vue-qr";
// import Flipper from "vue-flipper";
import slider from "vue-concise-slider";
import { getGuideData, getBankData } from "../api";

export default {
  name: "View3",
  components: {
    // vueQr,
    // Flipper,
    slider,
  },
  data() {
    return {
      isLeft: false,
      isRight: true,
      clickNum: 4,
      GuideUrl: "",
      imageUrl: require("../assets/img/abclogo.png"),
      flippedArr: [],
      productArr: [],
      pages: [
        {
          title: "",
          style: {
            backgroundColor: "#0ff",
          },
        },
        {
          title: "",
          style: {
            backgroundColor: "#0f0",
          },
        },
        {
          title: "slide3",
          style: {
            background: "#4bbfc3",
          },
        },
      ],
      //滑动配置[obj]
      sliderinit: {
        currentPage: 0, //当前页码
        thresholdDistance: 500, //滑动判定距离
        thresholdTime: 100, //滑动判定时间
        autoplay: 1000, //自动滚动[ms]
        loop: true, //循环滚动
        direction: "vertical", //方向设置，垂直滚动
        infinite: 1, //无限滚动前后遍历数
        slidesToScroll: 1, //每次滑动项数
      },
    };
  },
  created() {
    // this.getGuide();
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
    getGuide() {
      getGuideData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.GuideUrl = res.data[0].guideimage;
        }
      });
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
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
    },
  },
};
</script>

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

.content-box-left,
.content-box-right {
  width: 100%;
  overflow: hidden;
}

/*leftview*/
.map-content {
  width: 468px;
  height: 296px;
  margin: 220px auto 0px;
  overflow: hidden;
  text-align: center;
}

.map-content img {
  width: 468px;
  height: 296px;
}

.map-btn {
  width: 82px;
  height: 60px;
  overflow: hidden;
  text-align: center;
  background-image: url("../assets/img/ncbtn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #20c9b8;
  font-size: 14px;
}

.map-choose-btn {
  background-image: url("../assets/img/cbtn.png") !important;
}

.first {
  top: 445px;
  left: 55px;
  position: absolute;
}

.second {
  top: 550px;
  left: 100px;
  position: absolute;
}

.third {
  top: 615px;
  left: 210px;
  position: absolute;
}

.fourth {
  top: 635px;
  left: 360px;
  position: absolute;
}

.fifth {
  top: 615px;
  left: 510px;
  position: absolute;
}

.sixth {
  top: 550px;
  left: 620px;
  position: absolute;
}

.seventh {
  top: 445px;
  left: 655px;
  position: absolute;
}

/*rightview*/
.content-box-right {
  padding: 0 61px;
  height: 945px;
  box-sizing: border-box;
  overflow: hidden;
  margin: 90px auto 0px;
}

.box-right {
  width: 380px;
  height: 300px;
  overflow: hidden;
  margin-bottom: 15px;
  float: left;
  overflow: hidden;
}

.box-right:nth-child(odd) {
  margin-right: 18px;
}

.box-right-item {
  width: 380px;
  height: 300px;
  padding: 25px 0px;
  float: left;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  background-color: rgba(41, 68, 183, 0.5);
  text-align: center;
}

.box-right-item .url-code {
  width: 180px;
  height: 180px;
  margin-top: 20px;
}

.box-right-item .tips-text {
  color: #00ffd6;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.box-right-item .item-name {
  width: 380px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #00ffd6;
  text-align: center;
  font-size: 26px;
}

.box-right-item .item-type {
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #fff;
  font-size: 24px;
  margin-top: 5px;
}

.box-right-item .item-num {
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-size: 40px;
  margin-top: 10px;
  color: #00ffd6;
}

.box-right-item .item-unit {
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #fff;
  margin-top: 10px;
}

.box-right-item .item-des1 {
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  margin-top: 10px;
  color: #fff;
}

.box-right-item .item-des2 {
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #fff;
  margin-top: 5px;
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
