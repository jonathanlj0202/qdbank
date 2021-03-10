<template>
  <div id="app">
    <router-view></router-view>
    <div class="close-dialog-box" v-show="closeDialogBoo">
      <div class="close-dialog">
        <div class="number-box">
          <div :class="numberClass" v-for="(item, index) of 4" :key="index">
            <div class="dot" v-show="pdArr[index] || pdArr[index] === 0"></div>
          </div>
        </div>
        <div class="number-btn-box">
          <div class="number-btn" @click="numberInput(1)">1</div>
          <div class="number-btn" @click="numberInput(2)">2</div>
          <div class="number-btn" @click="numberInput(3)">3</div>
          <div class="number-btn" @click="numberInput(4)">4</div>
          <div class="number-btn" @click="numberInput(5)">5</div>
          <div class="number-btn" @click="numberInput(6)">6</div>
          <div class="number-btn" @click="numberInput(7)">7</div>
          <div class="number-btn" @click="numberInput(8)">8</div>
          <div class="number-btn" @click="numberInput(9)">9</div>
          <div class="number-btn back-btn" @click="backFn()">返回</div>
          <div class="number-btn" @click="numberInput(0)">0</div>
          <div class="number-btn clear-btn" @click="clearInput()">退格</div>
        </div>
      </div>
    </div>
    <div class="close-btn" @click="closeDialogFn()"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      closeDialogBoo: false,
      pdArr: [],
      pdIndex: null,
      numberClass: "number-item",
    };
  },
  created() {},
  methods: {
    closeDialogFn() {
      this.closeDialogBoo = true;
    },
    numberInput(index) {
      if (this.pdArr.length < 4) {
        this.pdArr.push(index);
      }
      if (this.pdArr.length === 4) {
        let password = [2, 5, 8, 0];
        let pdconfirm = true;
        this.pdArr.forEach((ele, index) => {
          if (ele !== password[index]) {
            pdconfirm = false;
          }
        });
        if (pdconfirm) {
          window.close();
        } else {
          this.numberClass = "number-item red-border";
          let setout = setTimeout(() => {
            this.pdArr = [];
            this.numberClass = "number-item";
            clearTimeout(setout);
          }, 1000);
        }
      }
    },
    clearInput() {
      if (this.pdArr.length > 0) {
        this.pdArr.pop();
      }
    },
    backFn() {
      this.pdArr = [];
      this.closeDialogBoo = false;
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.close-dialog-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.8);
}

.close-dialog {
  width: 600px;
  height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -300px;
  z-index: 10;
  border-radius: 30px;
  background: url("./assets/img/password.png") no-repeat;
  background-size: 100% 100%;
}

.number-box {
  width: 100%;
  margin: 0px 60px;
  margin-top: 80px;
  overflow: hidden;
}

.number-item {
  width: 60px;
  height: 60px;
  margin: 0px 30px;
  border: 1px solid #31f9fb; /*no*/
  float: left;
}

.red-border {
  border: 1px solid #f00 !important; /*no*/
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  margin: 20px auto;
}

.number-btn-box {
  width: 360px;
  margin: 50px auto;
  overflow: hidden;
}

.number-btn {
  width: 60px;
  height: 60px;
  font-size: 30px;
  border-radius: 30px;
  text-align: center;
  line-height: 60px;
  float: left;
  margin: 0 30px;
  margin-bottom: 20px;
  color: #fff;
  border: 1px solid #31f9fb; /*no*/
  box-sizing: border-box;
}

.back-btn,
.clear-btn {
  font-size: 15px;
}

.close-btn {
  width: 20px; /*no*/
  height: 20px; /*no*/
  position: absolute;
  bottom: 0px;
  right: 0px;
}
</style>
