<template>
  <div class="container">
    <div class="logo">
      <div class="logo-bg">
        <div class="tips">网络连接错误,请检查网络</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  components: {},
  data() {
    return {
      mac: window.MAC,
    };
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
  width: 1390px;
  height: 1019px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 5px solid #916f0e;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -510px;
  margin-left: -695px;
}

.logo-bg {
  width: 1390px;
  height: 562px;
  background: url("../assets/img/notfound.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 1px;
  margin: 200px auto 0px;
}

.tips {
  width: 100%;
  text-align: center;
  margin-top: 650px;
  color: #fff;
  letter-spacing: 2px;
  font-size: 35px;
}

.highlighted {
  color: #31f9fb;
}
</style>