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
      <div class="user-item" v-for="(item, i) in personArr" :key="i">
        <div class="avatar-box">
          <img class="user-avatar" :src="item.personimage" />
        </div>
        <div class="user-name">{{ item.personname }}</div>
        <div class="user-desc">职位：{{ item.position }}</div>
        <div class="user-desc">工龄：{{ item.workeyear }}年</div>
      </div>
    </div>
    <div
      :class="{
        'bottom-btn-left choose': isLeft,
        'bottom-btn-left nochoose': isRight,
      }"
      @click="chooseFn('isLeft')"
    >
      网点导览
    </div>
    <div
      :class="{
        'bottom-btn-right nochoose': isLeft,
        'bottom-btn-right choose': isRight,
      }"
      @click="chooseFn('isRight')"
    >
      员工信息
    </div>
  </div>
</template>
<script>
import { getPersonData, getGuideData } from "../api";

export default {
  name: "View2",
  components: {},
  data() {
    return {
      isLeft: true,
      isRight: false,
      clickNum: 4,
      titleText: "网点导览",
      personArr: [],
      GuideUrl: "",
    };
  },
  created() {
    console.info("view22211");
    this.getGuide();
    this.getPerson();
  },
  methods: {
    getPerson() {
      getPersonData({
        terminal_no: "cs001",
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.personArr = res.data;
        }
      });
    },
    getGuide() {
      getGuideData({
        terminal_no: "cs001",
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
        this.titleText = "员工信息";
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
  overflow:hidden;
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
  box-sizing: border-box;
  padding: 0 100px;
  margin-top: 200px;
  overflow: hidden;
}

.user-item {
  width: 103px;
  float: left;
  margin: 0 20px 18px;
  color: #fff;
  overflow: hidden;
  text-align: center;
}

.avatar-box {
  width: 103px;
  height: 103px;
  background: url("../assets/img/userBorder.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.user-avatar {
  width: 84px;
  height: 84px;
  margin-top: 9.5px;
}

.user-name {
  font-size: 16px;
  height: 25px;
  line-height: 25px;
  margin-top: 8px;
}

.user-desc {
  font-size: 12px;
  height: 20px;
  line-height: 20px;
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
