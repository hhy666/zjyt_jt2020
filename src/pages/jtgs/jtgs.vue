<template>
  <view class='kuang'>
    <!-- 具体公司 -->
    <a
      class="goBack"
      @click="goBack()"
    ></a>
    <view class="index_head">
      <text class="ih_title">中检一天</text>
      <!-- <a
        class="ih_a"
        @click="showOrHideExplain()"
      >
        <text class="ih_wh">?</text>
        <text class="ih_word">数据说明</text>
      </a> -->
    </view>
    <view class="index_body">
      <topBg
        :secondTitle="secondTitle"
        :showOrHideExplain="showOrHideExplain"
        :dataExplain="'2021年业务'"
      />
      <!-- 2020年经营情况 -->
      <jnjyqk :mt="-30" />
      <!-- 营业同比 -->
      <yytb
        :mt="10"
        :ht="300"
        :tabData="yytbData"
      />
      <!-- 2020年业务实况 -->
      <jnywsk :mt="10" />
      <!-- 2020年业务经营情况 -->
      <jnywjyqk :mt="10" />
      <!-- 2020年业务经营趋势图 -->
      <jnywjyqst
        :mt="10"
        :ht="350"
      />
      <!-- 表格 -->
      <jtgsTable :mt="10" />
    </view>

    <!-- 说明文字框 -->
    <explain
      v-if="isShowExplain"
      :showOrHideExplain="showOrHideExplain"
    ></explain>
    <a
      class="change_company"
      @click="showChoosedCompany()"
    >公司 切换</a>
    <showCompany
      v-if="showCompany"
      :showChoosedCompany="showChoosedCompany"
    ></showCompany>
    <!-- 置顶按钮 -->
    <a
      class="zhiding"
      v-if="showZd"
      @click="scrollToTop()"
    >
      <text class="zd_xian"></text>
    </a>
  </view>
</template>

<script>
import "./jtgs.scss";
import Taro from "@tarojs/taro";
import topBg from "../topBg/topBg";
import explain from "../explain/explain.vue";
import jnjyqk from "../jnjyqk/jnjyqk";
import yytb from "../yytb/yytb";
import jnywsk from "../jnywsk/jnywsk";
import jnywjyqk from "../jnywjyqk/jnywjyqk";
import jtgsTable from "../jtgsTable/jtgsTable";
import showCompany from "../showCompany/showCompany";
import { $ } from "@tarojs/extend";
import jnywjyqst from "../jnywjyqst/jnywjyqst";

export default {
  name: "jtgs",
  data() {
    return {
      secondTitle: String,
      isShowExplain: false,
      dataDate: String,
      yytbData: Array,
      showZd: false,
      showCompany: false,
      sil: Object,
    };
  },
  components: {
    explain: explain,
    topBg: topBg,
    jnjyqk: jnjyqk,
    yytb: yytb,
    jnywsk: jnywsk,
    jnywjyqk: jnywjyqk,
    showCompany: showCompany,
    jtgsTable: jtgsTable,
    jnywjyqst: jnywjyqst,
  },
  created() {
    // 置顶
    document.scrollingElement.scrollTop = 0;

    // 获取缓存的公司名称
    // this.secondTitle = Taro.getStorageSync("showTypeName") + "一天";
    this.secondTitle = Taro.getStorageSync("showTypeName");
    // 清空khmc内容
    Taro.setStorageSync("khmc", "");

    this.showZdBtn();

    this.yytbData = [];

    this.yytbData.push({
      id: 0,
      text: "营业收入同比",
      title: "2020年营业收入与去年营业收入同期比对",
      operId: "findYysrTbByCompany",
    });
    this.yytbData.push({
      id: 1,
      text: "营业成本同比",
      title: "2020年营业成本与去年营业成本同期比对",
      operId: "findYycbTbByCompany",
    });
    this.yytbData.push({
      id: 2,
      text: "营业利润同比",
      title: "2020年营业利润与去年营业利润同期比对",
      operId: "findYylrTbByCompany",
    });
  },
  mounted() {},
  methods: {
    goBack() {
      Taro.redirectTo({
        url: "../index/index?s=" + Math.random(),
      });
    },
    showOrHideExplain() {
      this.isShowExplain = !this.isShowExplain;
      if (this.isShowExplain) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    showZdBtn() {
      const _this = this;
      window.onscroll = function () {
        const sctop = document.scrollingElement.scrollTop;

        if (sctop > 10) {
          _this.showZd = true;
        } else {
          _this.showZd = false;
        }
      };
    },
    scrollToTop() {
      document.scrollingElement.scrollTop = 0;
      this.showZd = !this.showZd;
    },
    showChoosedCompany() {
      if (!this.showCompany) {
        this.scrollTop = document.scrollingElement.scrollTop;
        $("body").addClass("modal-open");
        document.body.style.top = -this.scrollTop + "px";
      } else {
        $("body").removeClass("modal-open");
        document.scrollingElement.scrollTop = this.scrollTop;
      }

      this.showCompany = !this.showCompany;
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
