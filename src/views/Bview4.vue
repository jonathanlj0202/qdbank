<template>
  <div class="container">
    <div class="person-wrapper">
      <div class="user-item" v-for="(item, i) in personArr" :key="i">
        <div class="avatar-box">
          <img class="user-avatar" :src="item.personimage" />
        </div>
        <div class="user-name">{{ item.personname }}</div>
        <div class="user-desc">职位：{{ item.position }}</div>
        <div class="user-desc">工龄：{{ item.workeyear }}年</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPersonData } from "../api";

export default {
  name: "Bview4",
  components: {},
  data() {
    return {
      personArr: [],
    };
  },
  created() {
    this.getPerson();
  },
  methods: {
    getPerson() {
      getPersonData({
        terminal_no: window.MAC,
      }).then((res) => {
        if (res.data && res.code === "0000") {
          this.personArr = res.data;
        }
      });
    },
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

/*rightview*/
.person-wrapper {
  width: 1040px;
  height: 1730px; /*no*/
  background-image: url("../assets/img/centerbg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 0px 100px;
  padding-top: 155px !important; /*no*/
  padding-bottom: 260px !important; /*no*/
  box-sizing: border-box;
}

.user-item {
  width: 180px;
  float: left;
  margin: 0 50px;
  margin-bottom: 55px !important; /*no*/
  color: #fff;
  overflow: hidden;
  text-align: center;
}

.avatar-box {
  width: 180px;
  height: 180px;
  background: url("../assets/img/userBorder.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
}

.user-avatar {
  width: 160px;
  height: 160px;
  border-radius: 80px;
  margin-top: 10px;
}

.user-name {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  margin-top: 15px;
  overflow: hidden;
}

.user-desc {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

/*bottomview*/

.bottom-btn-box {
  position: absolute;
  bottom: 25px; /*no*/
  left: 205px;
  width: 690px;
  height: 60px; /*no*/
  line-height: 60px; /*no*/
  background-image: url("../assets/img/2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
}
.choose {
  background-image: url("../assets/img/1.png") !important;
}

.btn-left {
  width: 405px;
  float: left;
  font-size: 32px;
  color: #00ffd6;
}

.left-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}

.btn-right {
  width: 405px;
  float: right;
  font-size: 32px;
  color: #00ffd6;
}

.right-choose {
  width: 225px !important;
  font-size: 26px !important;
  color: #fff !important;
}
</style>
