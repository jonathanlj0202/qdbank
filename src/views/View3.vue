<template>
  <div class="container">
    <div class="top-title">{{ titleText }}</div>
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
      <div class="box-right" v-for="(item, index) of productArr" :key="index">
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
            <img class="code-img" :src="item.url" />
            <div class="tips-text">扫码购买</div>
          </div>
        </flipper>
      </div>
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
    <div
      :class="{
        'bottom-btn-right nochoose': isLeft,
        'bottom-btn-right choose': isRight,
      }"
      @click="chooseFn('isRight')"
    >
      热销产品
    </div>
  </div>
</template>
<script>
import Flipper from "vue-flipper";
import { getGuideData, getBankData } from "../api";

export default {
  name: "View3",
  components: {
    Flipper,
  },
  data() {
    return {
      isLeft: false,
      isRight: true,
      clickNum: 4,
      titleText: "热销产品",
      GuideUrl: "",
      flippedArr: [],
      productArr: [
        {
          name: "安心·灵动·20天",
          type: "定期理财",
          num: "2.15%-2.85%",
          unit: "业绩基准",
          dsc1: "投资期限：最低持有20天",
          dsc2: "起购金额：10000.00元",
          url: require("../assets/img/pd1.png"),
        },
        {
          name: "安心·灵动·45天",
          type: "定期理财",
          num: "2.15%-2.95%",
          unit: "业绩基准",
          dsc1: "投资期限：最低持有45天",
          dsc2: "起购金额：10000.00元",
          url: require("../assets/img/pd2.png"),
        },
        {
          name: "安心·灵动·75天",
          type: "定期理财",
          num: "2.15%-3.05%",
          unit: "业绩基准",
          dsc1: "投资期限：最低持有75天",
          dsc2: "起购金额：10000.00元",
          url: require("../assets/img/pd3.png"),
        },
        {
          name: "农银私行·农银时时付",
          type: "定期理财",
          num: "3.05%",
          unit: "业绩基准",
          dsc1: "投资期限：7303天",
          dsc2: "起购金额：100.00元",
          url: require("../assets/img/pd4.png"),
        },
        {
          name: "农银私行·安心快线天天利",
          type: "定期理财",
          num: "2.35%-2.45%",
          unit: "业绩基准",
          dsc1: "投资期限：最短持有1天",
          dsc2: "起购金额：1000000.00元",
          url: require("../assets/img/pd5.png"),
        },
        {
          name: "安心快线天天利第２期",
          type: "定期理财",
          num: "2.15%",
          unit: "业绩基准",
          dsc1: "投资期限：最短持有1天",
          dsc2: "起购金额：10000.00元",
          url: require("../assets/img/pd6.png"),
        },
      ],
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
        this.titleText = "网点导览";
      } else {
        this.isLeft = false;
        this.isRight = true;
        this.titleText = "热销产品";
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
  width: 900px;
  height: 1200px;
  background: url("../assets/img/border.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;
}

.top-title {
  width: 320px;
  height: 40px;
  margin-left: 50px;
  line-height: 60px;
  font-size: 30px;
  color: #00ffd6;
  text-align: center;
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
  box-sizing: border-box;
  overflow: hidden;
  margin: 90px auto 0px;
}

.box-right {
  width: 380px;
  height: 300px;
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

.box-right-item .code-img {
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
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #00ffd6;
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

.bottom-btn-left {
  width: 250px;
  height: 50px;
  text-align: center;
  font-size: 28px;
  line-height: 50px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 270px;
  letter-spacing: 4px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.bottom-btn-right {
  width: 250px;
  height: 50px;
  text-align: center;
  font-size: 28px;
  line-height: 50px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 30px;
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
