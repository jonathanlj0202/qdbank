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
  width: 2700px;
  height: 1640px; /*no*/
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -820px;
  margin-left: -1350px; /*no*/
  overflow: hidden;
}

.user-item {
  width: 300px;
  height: 470px; /*no*/
  float: left;
  margin: 0 185px;
  margin-bottom: 80px !important; /*no*/
  color: #fff;
  overflow: hidden;
  text-align: center;
}

.avatar-box {
  width: 300px;
  height: 300px;
  background: url("../assets/img/userBorder.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
}

.user-avatar {
  width: 250px;
  height: 250px;
  border-radius: 125px;
  margin-top: 22.5px;
}

.user-name {
  font-size: 58px;
  height: 60px; /*no*/
  line-height: 60px; /*no*/
  margin-top: 15px; /*no*/
  overflow: hidden;
  letter-spacing: 5px;
}

.user-desc {
  font-size: 34px;
  height: 50px; /*no*/
  line-height: 50px; /*no*/
  overflow: hidden;
  letter-spacing: 2px;
}
</style>
