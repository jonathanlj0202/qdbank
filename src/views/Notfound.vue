<template>
  <div class="container">
    <div class="tips">你的设备使用时间到期，请尽快联系管理员</div>
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
  overflow: hidden;
}
.tips {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  color: #fff;
  font-size: 20px;
}
</style>