<template>
  <div class="container">
    <div class="logo">
      <div class="tips">设备已到期</div>
      <div class="connet">请<span class="highlighted">联系管理员</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.container {
  width: 100%;
  height: 100vh;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.logo {
  width: 1418px;
  height: 1019px;
  background: url("../assets/img/notfound.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -510px;
  margin-left: -709px;
}
.tips {
  width: 100%;
  text-align: center;
  margin-top: 780px;
  color: #fff;
  letter-spacing: 2px;
  font-size: 30px;
}

.connet {
  width: 100%;
  text-align: center;
  font-size: 30px;
  color: #fff;
  letter-spacing: 2px;
  margin-top: 20px;
}

.highlighted {
  color: #009cff;
}
</style>