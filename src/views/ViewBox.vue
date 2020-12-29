<template>
  <div class="container-box">
    <router-view name="v1" class="view"></router-view>
    <router-view name="v2" class="view"></router-view>
    <router-view name="v3" class="view"></router-view>
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
.container-box {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
}

.view {
  width: 1100px;
  float: left;
  overflow: hidden;
}

.view:nth-child(2) {
  width: 1040px !important;
}
</style>
