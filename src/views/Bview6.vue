<template>
  <div class="container">
    <Swiper :showIndicator="false" :autoPlay="false">
      <Slide class="item">
        <Bview1></Bview1>
      </Slide>
      <Slide class="item">
        <Bview2></Bview2>
      </Slide>
      <Slide class="item">
        <Bview3></Bview3>
      </Slide>
      <Slide class="item">
        <Bview5></Bview5>
      </Slide>
    </Swiper>
  </div>
</template>
<script>
import { Swiper, Slide } from "vue-swiper-component";
import Bview1 from "./Bview1.vue";
import Bview2 from "./Bview2.vue";
import Bview3 from "./Bview3.vue";
import Bview5 from "./Bview5.vue";

export default {
  name: "Bview6",
  components: {
    Swiper,
    Slide,
    Bview1,
    Bview2,
    Bview3,
    Bview5,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onClick(number) {
      this.$set(this.flippedArr, number, !this.flippedArr[number]);
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

.item {
  width: 100%;
  height: 100vh;
}
</style>
