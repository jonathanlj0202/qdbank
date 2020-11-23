<template>
  <div id="app">
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
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      nowDate: "", // 当前日期
      nowTime: "", // 当前时间
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
  },
  mounted() {
    this.currentTime();
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("./assets/img/bg.png") no-repeat;
}

.top-logo {
  width: 217px;
  height: 42px;
  position: absolute;
  top: 50px;
  left: 60px;
  background: url("./assets/img/logo.png") no-repeat;
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
</style>
