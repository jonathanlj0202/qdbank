<template>
  <div class="container-box">
    <div class="box1">
      <router-view name="v1" class="view"></router-view>
      <router-view name="v2" class="view"></router-view>
      <router-view name="v3" class="view"></router-view>
      <div class="bg" v-show="showBgBoo" @click="goIndex()"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewBox",
  components: {},
  data() {
    return {
      timeVal: null,
      showBgBoo: false,
    };
  },
  created() {
    setInterval(() => {
      this.showBgBoo = true;
      let timeVal = setTimeout(() => {
        this.showBgBoo = false;
        clearTimeout(timeVal);
      }, 10000);
    }, 300000);

    
  },

  methods: {
    goIndex() {
      this.showBgBoo = false;
    }
  },
};
</script>

<style scoped>
.container-box {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../../assets/img/bg.png") no-repeat;
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

.bg {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 18;
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.jpg") no-repeat;
  background-size: 100% 100%;
}
</style>
