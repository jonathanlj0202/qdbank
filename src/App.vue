<template>
  <div id="app">
    <div class="top-logo"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  created() {
    (function (doc, win) {
      let docEl = doc.documentElement,
        resizeEvt =
          "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function () {
          let clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          if (clientWidth < 850) {
            docEl.style.fontSize = 16 * (850 / 3240) + "px";
          } else {
            docEl.style.fontSize = 16 * (clientWidth / 3240) + "px";
          }
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(document, window);
  },
  methods: {},
};
</script>

<style lang="scss">
@import "./assets/scss/common.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url("./assets/img/bg.png") no-repeat;

  .top-logo {
    width: Px(434);
    height: Px(84);
    margin-top: Px(130);
    margin-left: Px(80);
    background: url("./assets/img/logo.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
