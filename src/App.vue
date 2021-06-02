<template>
  <div id="app" class="app-box">
    <router-view></router-view>
    <div class="update-box" v-show="updateBoo">
      <div class="update-item">
        <Progress
          strokeColor="#00ffd6"
          :transitionDuration="5000"
          :radius="200"
          :strokeWidth="10"
          :value="downloadPercent"
          class="update-item"
        >
          <div class="content">{{downloadPercent}}%</div>
          <template v-slot:footer>
            <p class="update-tips">
              更新进度：{{ `${downloadPercent}%`
              }}<br />软件正在更新，请不要关机断网。
            </p>
          </template>
        </Progress>
      </div>
    </div>
    <div class="close-dialog-box animate__animated animate__fadeIn" v-show="closeDialogBoo">
      <div class="close-dialog animate__animated animate__bounceIn">
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
const { ipcRenderer } = window.require("electron");
import Progress from "easy-circular-progress";
export default {
  name: "App",
  components: {
    Progress,
  },
  data() {
    return {
      closeDialogBoo: false,
      updateBoo: false,
      pdArr: [],
      pdIndex: null,
      numberClass: "number-item",
      downloadPercent: 0,
    };
  },
  created() {
    ipcRenderer.send("checkForUpdate");
  },
  mounted() {
    ipcRenderer.on("message", (event, text) => {
      console.log(text);
    });
    ipcRenderer.on("downloadProgress", (event, progressObj) => {
      if (!this.updateBoo) {
        this.updateBoo = true;
        this.closeDialogBoo = false;
      }
      this.downloadPercent = progressObj.percent.toFixed(2) || 0;
    });
    ipcRenderer.on("isUpdateNow", () => {
      ipcRenderer.send("isUpdateNow");
    });
  },
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
  beforeDestroy() {
    ipcRenderer.removeAllListeners([
      "message",
      "downloadProgress",
      "isUpdateNow",
    ]);
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

.update-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 12;
  background-color: rgba(0, 0, 0, 0.8);
}

.update-item {
  width: 100%;
  height: 800px;
  position: absolute;
  left: 0px;
  top: 50%;
  margin-top: -400px;
  text-align: center;
  color: #fff;
  font-size: 50px;
}

.update-tips {
  line-height: 100px;
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
  width: 800px;
  height: 800px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -400px;
  margin-left: -400px;
  z-index: 10;
  background: url("./assets/img/password.png") no-repeat;
  background-size: 100% 100%;
}

.number-box {
  width: 640px;
  margin: 0 auto;
  margin-top: 100px;
  overflow: hidden;
}

.number-item {
  width: 100px;
  height: 100px;
  margin: 0px 30px;
  border: 1px solid #31f9fb; /*no*/
  box-sizing: border-box;
  float: left;
}

.red-border {
  border: 1px solid #f00 !important; /*no*/
}

.dot {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #fff;
  margin: 35px auto;
}

.number-btn-box {
  width: 480px;
  margin: 80px auto 0px;
  overflow: hidden;
}

.number-btn {
  width: 90px;
  height: 90px;
  font-size: 40px;
  border-radius: 45px;
  text-align: center;
  line-height: 90px;
  float: left;
  margin: 0 35px;
  margin-bottom: 25px;
  color: #fff;
  border: 1px solid #31f9fb; /*no*/
  box-sizing: border-box;
}

.back-btn,
.clear-btn {
  font-size: 18px;
}

/*右下加触发密码弹窗按钮*/
.close-btn {
  width: 20px; /*no*/
  height: 20px; /*no*/
  position: absolute;
  bottom: 0px;
  right: 0px;
}
</style>
