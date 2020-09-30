<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="cbk_title" >
            <text class="cbk_title_main" >{{main}}</text>    
          </view>
          <view class="today_total_kuang" >
            <text class="loading" v-if="loading" >数据加载中</text>
            <!-- 上半部 今日和总量 -->  
            <view class="cbk_body bb" >  
                <view class="yy_view" v-for="(item, index) in ttuData" :key="index" :class="{mb10: index >= ttuData.length - 3}" >
                    <view class="yyv_up" >
                        <text class="yyv_up_num" >{{item.num}}</text>
                        <text class="yyv_up_unit" >{{item.unit}}</text>
                    </view>
                    <text class="yyv_down" >{{item.word}}</text>
                    <view class="yyv_bottom" >
                        <text class="yyv_bottom_word" >{{item.bword}}</text>
                        <text class="yyv_bottom_num" >{{item.bnum}}</text>
                    </view>
                    <view class="shuxian" v-if="index%3 != 2" ></view>
                </view>  
            </view>

            <!-- 下半部 今日和总量 -->
            <view class="cbk_body fdr fx100">  
                <view class="fdr fx50" v-for="(im, idx) in ttdData" :key="idx" >
                    <text class="yyvl_body_word" >{{im.word}}</text>
                    <text class="yyv_up_num fs20" >{{im.num}}</text>
                    <text class="yyv_up_unit" >{{im.unit}}</text>
                </view>
            </view>
          </view>
      </view>
  </view>
</template>

<script>
import '../jnjyqk/jnjyqk.scss'
import './cpxJnszsk.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'cpxJnszsk',
  data(){
    return {
        main: "今年收支实况",
        ttuData: Array,
        ttdData: Array,
        loading:false
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
      this.ttuData = [];

      this.ttuData.push({num:0, unit:"", word:"委托金额", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"开工金额", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"预测收入", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"收入总额", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"业务成本", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:'0', unit:"", word:"毛利率", bword:"", bnum:""});

      this.ttdData = [];

      this.ttdData.push({word: "直接成本", num:0, unit: ""});
      this.ttdData.push({word: "间接成本", num:0, unit: ""});

      this.initTableData();
  },
  mounted(){},
  methods: {
      initTableData(){
        this.searchData('YhWtje',0);    
        this.searchData('YhKgje',1); 
        this.searchData('YhYcsr',2); 
        this.searchData('YhYwsr',3); 
        this.searchData('YhYwcb',4); 
        this.searchData('YhMll',5);
        this.searchData('YhCb',6);
      },
      searchData(id,i){
        const _this = this;
        
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType");    

        requestData({
            operServiceId: 'NewReportService',
            operId: 'findSzskByCpx'+id,
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null){
                // alert("系统错误!");
                return false;
            }

            // _this.loading = false;
            if(i < 6){
                _this.$set(_this.ttuData, i, response.data.data.result);
            }else{
                _this.ttdData = response.data.data.ttdData;
            }
        });
    }
  }
}
</script>
<style lang='scss' scoped>
.yyvl_body_word{
    font-size: 16Px;
    color: #000;
}
</style>
