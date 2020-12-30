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
    };
  },
  methods: {}
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
