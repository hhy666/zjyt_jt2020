<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="cbk_title" >
            <text class="cbk_title_main" >{{main}}</text>    
            <text class="cbk_title_fu" >{{fu}}</text>    
          </view>
          <view class="cbk_body" >
            <view class="yy_view" v-for="(item, index) in yyData" :key="index" >
                <view class="yyv_up" >
                    <text class="yyv_up_num" >{{item.num}}</text>
                    <text class="yyv_up_unit" >{{item.unit}}</text>
                </view>
                <text class="yyv_down" style="font-size:18Px;margin-top: 5Px;" >{{item.word}}</text>
                <view class="shuxian" v-if="index == 0 || index == 1 || index == 3" ></view>
            </view>
          </view>
      </view>
  </view>
</template>

<script>
import './jnjyqk.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'jnjyqk',
  data(){
    return {
        main:"今年经营情况",
        fu:"数据来自NC系统利润表",
        yyData:Array
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
      this.yyData = [];

      this.yyData.push({num: 0, unit:"", word:"营业收入"});
      this.yyData.push({num: 0, unit:"", word:"营业成本"});
      this.yyData.push({num: 0, unit:"", word:"营业利润"});
      this.yyData.push({num: 0, unit:"", word:"营业总额"});
      this.yyData.push({num: 0, unit:"", word:"净利润"});
      this.yyData.push({num: 0, unit:"", word:""});

      this.initYyData();
  },
  mounted(){},
  methods: {
    initYyData(){
      const _this = this;
      // 获取缓存的id
      const companyId = Taro.getStorageSync("showType");  
      // 获取缓存的类型t
      const type = Taro.getStorageSync("showArea"); 
      // 集团
      let operId = 'findTotalByZhongjian';

      if(type == 1){
        operId = 'findTotalByCompany';
      }else if(type == 3){
        operId = 'findTotalByQuyu';
      }

      requestData({
            operServiceId: 'NewReportService',
            operId: operId,
            data: {companyId: companyId}
        },response => {
          if(response.data.data.tdata == null || response.data.data.tdata.length == 0){
            // alert("系统异常！");
            return false;
          }

          _this.yyData = response.data.data.tdata;
        });
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
