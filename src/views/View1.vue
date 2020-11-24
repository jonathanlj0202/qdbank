<template>
  <div class="container">
    <div class="top-title">{{ titleText }}</div>
    <div class="content-box-left" v-show="isLeft">
      <div class="content-left">
        <div class="content-title">利率</div>
        <div class="content-top">
          <div class="top-left">
            <div class="mini-title">整存整取</div>
            <div class="mini-box">
              <div class="mini-item">
                <div class="item-left">三个月</div>
                <div class="item-right">1.35</div>
              </div>
            </div>
          </div>
          <div class="top-right">
            <div class="mini-title">零存整取/整存零取/存本取息</div>
            <div class="mini-box">
              <div class="mini-item">
                <div class="item-left">三个月</div>
                <div class="item-right">1.35</div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-bottom">
          <div class="content-title">贵金属</div>
          <div class="bottom-box">
            <div class="item-box header-box">
              <div class="item">品种</div>
              <div class="item">客户卖出价</div>
              <div class="item">客户买入价</div>
              <div class="item">报价时间</div>
            </div>
            <div class="item-box">
              <div class="item">人民币账户黄金</div>
              <div class="item">409.86</div>
              <div class="item">410.67</div>
              <div class="item">2020-10-22</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="content-title">汇率</div>
        <div class="content-box">
          <div class="item-box header-box">
            <div class="item">名称</div>
            <div class="item">现汇买入价</div>
            <div class="item">现汇卖出价</div>
            <div class="item">报价时间</div>
          </div>
          <div class="item-box">
            <div class="item">美元</div>
            <div class="item">669.1490</div>
            <div class="item">21.4010</div>
            <div class="item">2020-10-22</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-box-right" v-show="isRight">

      <div class="box-right-item">
        <div class="item-name">万家行业优选(161903）</div>
        <div class="item-type">基金产品</div>
        <div class="item-num">0.686%</div>
        <div class="item-unit">单位净值</div>
        <div class="item-des1">季涨幅：24.65%</div>
        <div class="item-des2">投资类型：股票型</div>
      </div>
      <!-- <div class="box-right-item"></div>
      <div class="box-right-item"></div>
      <div class="box-right-item"></div>
      <div class="box-right-item"></div>
      <div class="box-right-item"></div> -->
    </div>
    <div
      :class="{
        'bottom-btn-left choose': isLeft,
        'bottom-btn-left nochoose': isRight,
      }"
      @click="chooseFn('isLeft')"
    >
      数据看板
    </div>
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
export default {
  name: "View1",
  components: {},
  data() {
    return {
      isLeft: true,
      isRight: false,
      titleText: "数据看板",
    };
  },
  methods: {
    chooseFn(str) {
      if (str === "isLeft") {
        this.isLeft = true;
        this.isRight = false;
        this.titleText = "数据看板";
      } else {
        this.isLeft = false;
        this.isRight = true;
        this.titleText = "热销产品";
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 780px;
  height: 980px;
  margin-right: 12px;
  background: url("../assets/img/border.png") no-repeat;
  background-size: 100% 100%;
  padding: 0px 40px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.top-title {
  width: 320px;
  height: 40px;
  margin-left: 10px;
  margin-bottom: 150px;
  line-height: 50px;
  font-size: 28px;
  color: #00ffd6;
  text-align: center;
}

.content-box-left,
.content-box-right {
  width: 100%;
  overflow: hidden;
}

/*leftview*/

.content-left,
.content-right {
  width: 335px;
  overflow: hidden;
  float: left;
}

.content-left {
  margin-right: 25px;
}

.content-left .content-title,
.content-right .content-title {
  text-align: left;
  height: 40px;
  line-height: 40px;
  font-size: 22px;
  letter-spacing: 5px;
  color: #00ffd6;
}

.content-left .content-top,
.content-left .content-bottom {
  width: 335px;
  overflow: hidden;
}

.content-left .content-bottom {
  margin-top: 20px;
}

.content-bottom .bottom-box {
  width: 335px;
  height: 270px;
  padding: 20px 10px;
  margin-top: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  background-color: rgba(41, 68, 183, 0.5);
}

.bottom-box .item-box {
  width: 335px;
  overflow: hidden;
}

.bottom-box .header-box .item {
  color: #00ffd6 !important;
  font-size: 14px !important;
}

.bottom-box .item-box .item:nth-child(1) {
  width: 90px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.bottom-box .item-box .item:nth-child(2) {
  width: 78px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.bottom-box .item-box .item:nth-child(3) {
  width: 76px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.bottom-box .item-box .item:nth-child(4) {
  width: 70px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.top-left,
.top-right {
  width: 152px;
  float: left;
}

.top-left {
  margin-right: 30px;
}

.content-top .mini-title {
  height: 30px;
  line-height: 45px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
}
.content-top .mini-box {
  width: 152px;
  height: 163px;
  padding: 6px 0px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  background-color: rgba(41, 68, 183, 0.5);
}

.mini-box .mini-item {
  width: 152px;
  color: #fff;
  overflow: hidden;
}

.mini-item .item-left,
.mini-item .item-right {
  width: 76px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  float: left;
}

.content-right .content-box {
  width: 335px;
  height: 525px;
  padding: 20px 10px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  margin-top: 20px;
  background-color: rgba(41, 68, 183, 0.5);
}

.content-box .header-box .item {
  color: #00ffd6 !important;
  font-size: 14px !important;
}

.content-box .item-box .item:nth-child(1) {
  width: 60px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.content-box .item-box .item:nth-child(2) {
  width: 90px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.content-box .item-box .item:nth-child(3) {
  width: 90px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

.content-box .item-box .item:nth-child(4) {
  width: 70px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  float: left;
}

/*rightview*/

.content-box-right {
  padding: 0 60px;
  box-sizing: border-box;
  overflow: hidden;
}

.box-right-item:nth-child(odd) {
  margin-right: 18px;
}

.box-right-item {
  width: 280px;
  height: 210px;
  padding: 25px 0px;
  float: left;
  box-sizing: border-box;
  border: 1px solid rgba(0, 255, 214, 0.3); /*no*/
  background-color: rgba(41, 68, 183, 0.5);
  margin-bottom: 18px;
}

.box-right-item .item-name {
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #00ffd6;
  font-size: 14px;
}

.box-right-item .item-type {
  text-align: center;
  height: 20px;
  line-height: 20px;
  color: #fff;
  font-size: 10px;
}

.box-right-item .item-num {
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 30px;
  margin-top: 10px;
  color: #00ffd6;
}

.box-right-item .item-unit {
  text-align: center;
  height: 15px;
  line-height: 12px;
  font-size: 10px;
  color: #fff;
}

.box-right-item .item-des1 {
  text-align: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  margin-top: 15px;
  color: #fff;
}

.box-right-item .item-des2 {
  text-align: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
}




.bottom-btn-left {
  width: 200px;
  height: 40px;
  text-align: center;
  font-size: 26px;
  line-height: 40px;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 235px;
  letter-spacing: 4px;
  background-repeat: no-repeat;
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
