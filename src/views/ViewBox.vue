<template>
  <div class="container-box" @click="goStandPage()">
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
      timeVal: null,
    };
  },
  created() {
    this.timeVal = setTimeout(() => {
      this.$router.push({ path: "/bview1" });
    }, 120000);
  },
  methods: {
    goStandPage() {
      if (this.timeVal) {
        clearTimeout(this.timeVal);
        this.timeVal = null;
      }
      this.timeVal = setTimeout(() => {
        this.$router.push({ path: "/bview1" });
      }, 120000);
    },
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
