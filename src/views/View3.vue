<template>
  <div class="container">
    <div class="top-title">千人千面</div>
    <div class="content-box">
      <div class="face-itemA face-item">
        <img src="../assets/img/p1.png" @click="showProduct()" />
        <div class="close-btn" @click="closeFn()"></div>
      </div>
      <div class="face-itemF face-item">
        <img src="../assets/img/p2.png" />
        <div class="close-btn"></div>
      </div>
      <div class="face-itemK face-item">
        <img src="../assets/img/p3.png" />
        <div class="close-btn"></div>
      </div>
      <div class="face-itemP face-item">
        <img src="../assets/img/p4.png" />
        <div class="close-btn"></div>
      </div>
      <div class="face-itemQ face-item">
        <img src="../assets/img/p5.png" />
        <div class="close-btn"></div>
      </div>
    </div>
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
  methods: {
    closeFn() {},
    showProduct() {

    },
  },
};
</script>
<style src="../assets/css/animate.css"></style>
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

.content-box {
  width: 720px;
  height: 720px;
  /* background-color: #00f; */
  margin: 80px auto;
  position: relative;
}

.face-item {
  width: 100px;
  height: 100px;
  background: url("../assets/img/faceborder.png") no-repeat;
  background-size: 100% 100%;
  background-position: center 5px;
  text-align: center;
  position: absolute;
}

.face-item img {
  width: 80px;
  height: 80px;
  margin-top: 15px;
}

.face-item .close-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: url("../assets/img/closebtn.png") no-repeat;
  background-size: 100% 100%;
}
/* 
.face-item .logo {
  width: 80px;
  height: 80px;
  margin-top: 15px auto 0px;
  background: url("../assets/img/p1.png") no-repeat;
  background-size: 100% 100%;
} */

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
