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
      <!-- <router-view name="v4" class="view"></router-view> -->
    </div>
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
    };
  },
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
  background-size: 100% 100%;
}

.top-logo {
  width: 284px;
  height: 55px;
  /* width: 217px;
  height: 42px; */
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
  font-size: 36px;
}

.top-time .date {
  font-size: 30px;
}

.view-box {
  width: 3240px;
  height: 1200px;
  padding: 0 135px;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -600px;
  margin-left: -1620px;
}

.view {
  width: 900px;
  height: 1200px;
  float: left;
  overflow: hidden;
}

.view:nth-child(2) {
  margin: 0 135px;
}
</style>
