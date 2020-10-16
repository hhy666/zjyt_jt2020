<template>
  <view class='kuang'>
    <!-- 具体公司 -->
    <a class="goBack" @click="goBack()" ></a>
    <view class="index_head" >中检一天</view>
    <view class="index_body" >
        <topBg :secondTitle="secondTitle" 
            :showOrHideExplain="showOrHideExplain"
            :dataExplain="'数据说明'" />
        
        <!-- 今年业务实况 -->
        <cpxJnywsk :mt="-80" />
        <!-- 今年收支实况 -->
        <cpxJnszsk :mt="10" />
        <!-- 今年收支情况 -->
        <cpxBnszqk :mt="10" :ht="300" />
        <!-- 重点服务技术中类收入 -->
        <cpxZdsr :mt="10" :ht="300" />
        <!-- 重点服务对象中类收入 -->
        <cpxZddx :mt="10" :ht="300" />
        <!-- 表格 -->
        <cpxTable :mt="10" />
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
import './cpx.scss'
import Taro from '@tarojs/taro'
import topBg from '../topBg/topBg'
import explain from '../explain/explain'
import cpxJnywsk from '../cpxJnywsk/cpxJnywsk'
import cpxJnszsk from '../cpxJnszsk/cpxJnszsk'
import cpxBnszqk from '../cpxBnszqk/cpxBnszqk'
import cpxZdsr from '../cpxZdsr/cpxZdsr'
import cpxTable from '../cpxTable/cpxTable'
import cpxZddx from '../cpxZddx/cpxZddx'

export default {
  name: 'cpx',
  data(){
    return {
        secondTitle:String,
        isShowExplain:false,
        dataDate:String,
        showZd:false
    }
  },
  components: {
    explain: explain,
    topBg: topBg,
    cpxJnywsk: cpxJnywsk,
    cpxJnszsk: cpxJnszsk,
    cpxBnszqk: cpxBnszqk,
    cpxZdsr: cpxZdsr,
    cpxTable: cpxTable,
    cpxZddx: cpxZddx
  },
  created(){    
    // 置顶
    document.scrollingElement.scrollTop = 0;
      
    // 获取缓存的公司名称
    this.secondTitle = Taro.getStorageSync("showTypeName")+"一天";
    // 清空khmc内容
    Taro.setStorageSync("khmc","");

    this.showZdBtn();
  },
  mounted(){},
  methods: {
    goBack(){
        Taro.redirectTo({
            url: "../index/index?s="+Math.random()
        });
    },
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
