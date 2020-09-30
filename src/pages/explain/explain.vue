<template>
  <view class='explain'>
    <view class="explain_outer_kuang" :style="{height:pmHeight+'px'}" ></view>
    <view class="explain_kuang" :style="{height:pmHeight*0.9+'px'}" >
      <text class="explain_title" >数据说明</text>
      <a class="explain_close" @click="closeExplain()" >X</a>
      <view class="explain_kuang_scroll" :style="{height:pmHeight*0.8+'px'}" >
        <view class="explain_kuang_scroll_body" >
          <text class="explain_word explain_word_title" >委托单量</text>
          <text class="explain_word" >本年累计：本年度创建的委托单数据，审核状态为通过的委托单数量。</text>
          <text class="explain_word" >今日累计：今日创建的委托单数据，审核状态为通过的委托单数量。</text>
          <text class="explain_word explain_word_title" >开工单量</text>
          <text class="explain_word" >本年累计：本年度开工的委托单数据，审核状态为通过的委托单数量。</text>
          <text class="explain_word" >今日累计：今日开工的委托单数据状，审核状态为通过的委托单数量。</text>
          <text class="explain_word explain_word_title" >完工单量</text>
          <text class="explain_word" >本年累计：本年度完工的委托单数据，审核状态为通过的委托单数量。</text>
          <text class="explain_word" >今日累计：今日完工的委托单数据，审核状态为通过的委托单数量。</text>
          <text class="explain_word explain_word_title" >委托金额</text>
          <text class="explain_word" >本年累计：本年度创建的委托单数据，审核状态为通过的委托单的合</text>
          <text class="explain_word" >计（人民币）金额。</text>
          <text class="explain_word" >今日累计：今日创建的委托单数据，审核状态为通过的委托单的合计</text>
          <text class="explain_word" >（人民币）金额。</text>
          <text class="explain_word explain_word_title" >预测收入</text>
          <text class="explain_word" >本年累计：本年度所有委托单状态为已完工的合计（人民币）金额。</text>
          <text class="explain_word" >今日累计：今日所有委托单状态为已完工的合计（人民币）金额。</text>
          <text class="explain_word explain_word_title" >客户数量</text>
          <text class="explain_word" >本年累计：客户中心创建的所有客户数量。</text>
          <text class="explain_word" >今日累计：今日发生业务的客户数量。</text>
          <text class="explain_word" >产品线活跃客户数量：近12个月发生业务的产品线客户数量。</text>
          <text class="explain_word" >非产品线活跃客户数量：近12个月发生非产品线业务的客户数量。</text>
          <text class="explain_word explain_word_title" >供应商数量</text>
          <text class="explain_word" >本年累计：供应商中心创建的的供应商数量。</text>
          <text class="explain_word" >今日累计：今日发生业务的供应商数量。</text>
          <text class="explain_word" >产品线活跃供应商数量：近12个月发生业务的产品线供应商数量。</text>
          <text class="explain_word" >非产品线活跃供应商数量：近12个月发生业务的非产品线供应商数量。</text>
          <text class="explain_word explain_word_title" >出证数量</text>
          <text class="explain_word" >本年累计：本年证书中心的出证数量。</text>
          <text class="explain_word" >今日累计：今日证书中心的出证数量。</text>
          <text class="explain_word" >证书数量：本年度证书信息的电子证书报告数量+纸质证书报告数量。</text>
          <text class="explain_word" >其他成果物数量：本年度证书信息的其他工作成果物数量。</text>
          <text class="explain_word explain_word_title" >收入总额</text>
          <text class="explain_word" >包含产品线业务收入、非产品线业务收入、待分类业务收入、其他</text>
          <text class="explain_word" >业务收入。</text>
          <text class="explain_word" >产品线业务收入：包括23条产品线+通用线中的服务技术中类为</text>
          <text class="explain_word" >“检验”“鉴定”“检测”“培训”“咨询“</text>
          <text class="explain_word" >的开票（含不开票和废票）收入（不含税金额）。</text>
          <text class="explain_word" >非产品线业务收入：通用线中，除服务技术中类为</text>
          <text class="explain_word" >“检验““鉴定”“检测”“培训”“咨询”</text>
          <text class="explain_word" >外业务的开票（含不开票和废票）收入（不含税金额），</text>
          <text class="explain_word" >例如商贸服务等。</text>
          <text class="explain_word" >其他业务收入：主营业务以外的其他日常活动（如固定资产出租）</text>
          <text class="explain_word" >所取得的收入。</text>
          <text class="explain_word" >待分类业务收入：未能明确划分产品线的收入，包括对接数据、</text>
          <text class="explain_word" >19年延续业务等。</text>
          <text class="explain_word" >其他业务收入：主营业务以外的其他日常活动（如固定资产出租）</text>
          <text class="explain_word" >所取得的收入。</text>
          <text class="explain_word explain_word_title" >业务成本</text>
          <text class="explain_word" >包含直接成本和间接成本。</text>
          <text class="explain_word" >直接成本：指差旅费、交通费等实付内付金额；分包费、分成费、</text>
          <text class="explain_word" >佣金和劳务费，实付外付金额。</text>
          <text class="explain_word" >间接成本：指薪酬类支出的分摊成本和非薪酬类支出的分摊成本。</text>
          <text class="explain_word explain_word_title" >产品线毛利率</text>
          <text class="explain_word" >（产品线业务收入－产品线业务成本）/产品线业务收入×100%</text>
        </view>
      </view>
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
