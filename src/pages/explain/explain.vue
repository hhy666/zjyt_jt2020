<template>
  <view class='explain'>
    <view class="explain_outer_kuang" :style="{height:pmHeight+'px'}" ></view>
    <view class="explain_kuang" :style="{height:pmHeight*0.65+'px'}" >
      <text class="explain_title" >数据说明</text>
      <a class="explain_close" @click="closeExplain()" >X</a>
      <text class="explain_word explain_word_title" >1.数据来源:</text>
      <text class="explain_word" >BIMS主干系统、认证系统、结算中心、客户中心、</text>
      <text class="explain_word" >供应商中心、财务报销、再生资源产品线数据15分钟</text>
      <text class="explain_word" >汇聚一次。</text>
      <text class="explain_word" >填报式：溯源填报、旧机电填报；</text>
      <text class="explain_word explain_word_title" >2.实时数据统计原则：</text>
      <text class="explain_word" >a）开工数量、委托金额、成本、客户数量、供应商、</text>
      <text class="explain_word" >开票收入、证书数量都是间隔15分钟进行一次更新；</text>
      <text class="explain_word" >更新的数据</text>
      <text class="explain_word" >&nbsp;</text>
      <text class="explain_word" >&nbsp;</text>
      <text class="explain_word" >&nbsp;</text>
      <text class="explain_word" >&nbsp;</text>
      <text class="explain_word" >&nbsp;</text>
      <text class="explain_word" >&nbsp;</text>
      <text class="explain_word" >&nbsp;</text>
    </view>
  </view>
</template>

<script>
import './explain.scss'

export default {
  name: 'explain',
  data(){
    return {
        pmHeight:Number
    }
  },
  props:{
    showOrHideExplain:Function
  },
  components: {},
  created(){
    this.pmHeight = window.innerHeight;
  },
  mounted(){},
  methods: {
    closeExplain(){
        this.showOrHideExplain();
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
