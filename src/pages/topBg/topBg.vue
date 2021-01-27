<template>
  <view class='kuang'>
    <view class="page_top_next">
      <view class="ptn_left">
        <text class="second_title">{{secondTitle}}</text>
        <text class="data_date">
          <text style="white-space:nowrap;" >{{dataDate}}</text>
          <a class="sjsmIcon" @click="showOrHideExplain()">?</a>
        </text>
      </view>
      <view class="ptn_right">
        <a
          class="ptn_right_1"
          @click="gotoPage2021()"
        >
          <text class="data_explain">
            <text style="margin-left:2Px;font-weight: bold;">{{dataExplain}}</text>
            <view class="arrow"></view>
          </text>
        </a>
      </view>
    </view>
  </view>
</template>

<script>
import { goto2021Url } from "../../app";
import "./topBg.scss";

export default {
  name: "topBg",
  data() {
    return {
      dataDate: "统计时间2020年1月至12月 | 数据说明",
    };
  },
  props: {
    secondTitle: String,
    dataExplain: String,
    showOrHideExplain: Function,
  },
  components: {},
  created() {
    // 时间
    // this.setNowTime();
  },
  mounted() {},
  methods: {
    // setNowTime() {
    //   const _this = this;
    //   // setInterval(()=>{
    //   _this.dataDate =
    //     "数据更新截止 " +
    //     new Date().toISOString().slice(0, 10) +
    //     " " +
    //     new Date(new Date().getTime() - 30 * 60 * 1000)
    //       .toTimeString()
    //       .slice(0, 8);
    //   // },1000);
    // },
    gotoPage2021() {
      window.location.href = goto2021Url;
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
