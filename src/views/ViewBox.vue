<template>
  <div class="container">
    <div class="top-logo"></div>
    <div class="top-time">
      <div class="time">{{ nowTime }}</div>
      <div class="date">{{ nowDate }}</div>
    </div>
    <div class="view-box">
      <router-view name="v1" class="view"></router-view>
      <router-view name="v2" class="view"></router-view>
      <router-view name="v3" class="view"></router-view>
      <router-view name="v4" class="view"></router-view>
    </div>
    <div class="close-dialog-box" v-show="closeDialogBoo">
      <div class="close-dialog"></div>
    </div>
    <div class="close-btn" @click="closeDialogFn()"></div>
  </div>
</template>

<script>
export default {
  name: "ViewBox",
  components: {},
  data() {
    return {
      nowDate: "", // 当前日期
      nowTime: "", // 当前时间
      closeDialogBoo: false,
    };
  },
  created() {},
  methods: {
    currentTime() {
      setInterval(this.getDate, 500);
    },
    getDate() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      this.nowTime = hh + ":" + mf;
      this.nowDate = yy + "/" + mm + "/" + dd;
    },
    closeDialogFn() {
      this.closeDialogBoo = true;
    },
  },
  mounted() {
    this.currentTime();
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
}

.top-logo {
  width: 217px;
  height: 42px;
  position: absolute;
  top: 50px;
  left: 60px;
  background: url("../assets/img/logo.png") no-repeat;
  background-size: 100% 100%;
}

.top-time {
  width: 200px;
  height: 42px;
  position: absolute;
  top: 50px;
  right: 50px;
  text-align: center;
  color: #fff;
}

.top-time .time {
  font-size: 30px;
}

.top-time .date {
  font-size: 20px;
}

.view-box {
  width: 3240px;
  height: 1000px;
  padding-left: 42px;
  padding-right: 30px;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -500px;
  margin-left: -1620px;
}

.view {
  width: 800px;
  height: 1000px;
  float: left;
}

.close-dialog-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.5);
}

.close-dialog {
  width: 1000px;
  height: 1000px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -500px;
  margin-left: -500px;
  z-index: 10;
  border-radius: 30px;
  background-color: #0ff;
}

.close-btn {
  width: 20px; /*no*/
  height: 20px; /*no*/
  position: absolute;
  bottom: 0px;
  right: 0px;
}
</style>
