<template>
  <view class='kuang'>
    <!-- 集团首页 -->
    <view class="index_head" >中检一天</view>
    <view class="index_body" >
        <topBg :secondTitle="'中检一天'" 
            :showOrHideExplain="showOrHideExplain"
            :dataExplain="'数据说明'" />
        <!-- 今年经营情况 -->        
        <jnjyqk :mt="-80" />
        <!-- 营业同比 -->
        <yytb :mt="10" :ht="300" :tabData="yytbData" />
        <!-- 今年业务实况 -->
        <jnywsk :mt="10" />
        <!-- 今年业务经营情况 -->
        <jnywjyqk :mt="10" />
        <!-- 在京单位业务排名 -->
        <ywsrpm :mt="10" :ht="400" :tabData="zjdwtbData" />
        <!-- 国内公司业务排名 -->
        <ywsrpm :mt="10" :ht="400" :tabData="gngstbData" />
        <!-- 境外公司业务收入排名 -->
        <ywsrpm :mt="10" :ht="400" :tabData="jwgstbData" />
        <!-- 表格 -->
        <gsTable :mt="10"  />
    </view>

    <!-- 说明文字框 -->
    <explain v-if="isShowExplain" :showOrHideExplain="showOrHideExplain" ></explain> 
    <!-- 置顶按钮 -->     
    <a class="zhiding" v-if="showZd" @click="scrollToTop()" >
      <text class="zd_xian" ></text>
    </a>
  </view>
</template>

<script>
import './gs.scss'
import Taro from '@tarojs/taro'
import topBg from '../topBg/topBg'
import explain from '../explain/explain.vue'
import jnjyqk from '../jnjyqk/jnjyqk'
import yytb from '../yytb/yytb'
import jnywsk from '../jnywsk/jnywsk'
import jnywjyqk from '../jnywjyqk/jnywjyqk'
import ywsrpm from '../ywsrpm/ywsrpm'
import gsTable from '../gsTable/gsTable'

export default {
  name: 'gs',
  data(){
    return {
        isShowExplain:false,
        yytbData:Array,
        zjdwtbData:Array,
        gngstbData:Array,
        jwgstbData:Array,
        showZd:false        
    }
  },
  components: {
    explain: explain,
    topBg: topBg,
    jnjyqk: jnjyqk,
    yytb: yytb,
    jnywsk: jnywsk,
    jnywjyqk: jnywjyqk,
    ywsrpm: ywsrpm,
    gsTable: gsTable
  },
  created(){
    this.showZdBtn();

    this.yytbData = [];

    this.yytbData.push({id: 0, text: "营业收入同比", title:"今年营业收入与去年营业收入同期比对", operId:"findYysrTbByZhongjian"});
    this.yytbData.push({id: 1, text: "营业成本同比", title:"今年营业成本与去年营业成本同期比对", operId:"findYycbTbByZhongjian"});
    this.yytbData.push({id: 2, text: "营业利润同比", title:"今年营业利润与去年营业利润同期比对", operId:"findYylrTbByZhongjian"});

    this.zjdwtbData = [];

    this.zjdwtbData.push({id: 'zjdwtb0', text: "在京单位业务收入排名", title:"本年业务收入总额", operId:'findYwsrByZj'});
    this.zjdwtbData.push({id: 'zjdwtb1', text: "在京单位业务成本排名", title:"本年业务成本总额", operId:'findYwcbByZj'});

    this.gngstbData = [];

    this.gngstbData.push({id: 'gngstb0', text: "国内公司业务收入排名", title:"本年业务收入总额", operId:'findYwsrByGn'});
    this.gngstbData.push({id: 'gngstb1', text: "国内公司业务成本排名", title:"本年业务成本总额", operId:'findYwcbByGn'});

    this.jwgstbData = [];

    this.jwgstbData.push({id: 'jwgstb0', text: "境外公司业务收入排名", title:"本年业务收入总额", operId:'findYwsrByJw'});
    this.jwgstbData.push({id: 'jwgstb1', text: "境外公司业务成本排名", title:"本年业务成本总额", operId:'findYwcbByJw'});
  },
  mounted(){},
  methods: {
    showOrHideExplain(){
      this.isShowExplain = !this.isShowExplain;
      if(this.isShowExplain){
        document.body.style.overflow = 'hidden';
      }else{
        document.body.style.overflow = 'auto';
      }
    },
    showZdBtn(){
      const _this = this;
      window.onscroll = function(){
        const sctop = document.scrollingElement.scrollTop;
        
        if(sctop > 10){
          _this.showZd = true;
        }else{
          _this.showZd = false;
        }
      }
    },
    scrollToTop(){      
      document.scrollingElement.scrollTop = 0;
      this.showZd = !this.showZd;
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
