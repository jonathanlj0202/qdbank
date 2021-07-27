<template>
  <div class="chat-box">
    <div class="line-chart">
      <ul>
        <li
          v-for="(item, index) in dataListArr"
          :class="item.number > 0 ? '' : 'position-top'"
          :key="index"
        >
          <div class="box" :style="{ height: item.percentNum * 100 + 'px' }">
            <span class="num">{{ item.number }}</span>
          </div>
          <div class="box-name">{{ item.name }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "ColumnChat",
  data() {
    return {};
  },
  props: {
    dataListArr: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  watch: {
    dataListArr: {
      deep: true,
      handler: function () {
        this.initData();
      },
    },
  },
  created() {},
  methods: {
    initData() {
      let maxIndex = 0,
        maxNegative = 0,
        maxPositive = 0;
      this.dataListArr.forEach(function (v, i) {
        if (Math.abs(v.number) <= Math.abs(v.number)) {
          maxIndex = i;
        }
        if (v.number > 0 && v.number > maxPositive) {
          maxPositive = v.number;
        }
        if (v.number < 0 && v.number < maxNegative) {
          maxNegative = v.number;
        }
      });
      this.$nextTick(function () {
        document.querySelector(".line-chart").style.marginTop =
          -(maxPositive - maxNegative) / 20 + "px";
      });
      let maxnumber = Math.abs(this.dataListArr[maxIndex].number);
      setTimeout(
        function () {
          this.dataListArr.forEach(function (value) {
            value.percentNum = Math.abs(value.number) / maxnumber;
          });
        }.bind(this),
        0
      );
    },
  },
};
</script>
<style lang="scss" scoped>
$green: #00a000 !default;
$borderColor: #262626 !default;
.chat-box {
  width: 100%;
  height: 157px; /*no*/
  position: relative;
  margin-left: -18px;
  .line-chart {
    position: absolute;
    top: 95%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
    ul {
      display: flex;
      justify-content: space-between;
      margin: 0 20px;
      li {
        text-align: center;
        list-style: none;
        .box {
          position: absolute;
          bottom: 20px;
          width: 20px;
          height: 0;
          background-image: linear-gradient(#f4cc5a, #2d2618);
          text-align: center;
          transform: translateX(-50%);
          transition: height 1s;
          .num {
            position: absolute;
            top: -22px;
            left: 0;
            right: 0;
            display: inline-block;
            color: #fff;
            font-weight: 500;
            font-size: 14px;
            line-height: 16px;
          }
        }
        .box-name {
          position: absolute;
          bottom: 0px;
          width: 80px;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #fff;
          text-align: center;
          transform: translateX(-50%);
        }
        &.position-top {
          .box {
            top: 0;
            background: $green;
            .num {
              color: $green;
            }
          }
        }
      }
    }
  }
}
</style>
