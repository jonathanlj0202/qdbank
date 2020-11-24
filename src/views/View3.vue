<template>
  <div class="container">
    <div class="top-title">千人千面</div>
    <div class="bottom-btn-right">千人千面</div>
  </div>
</template>
<script>
export default {
  name: "View3",
  components: {},
  data() {
    return {};
  },
  methods: {},
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
  background-image: url("../assets/img/choose.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
