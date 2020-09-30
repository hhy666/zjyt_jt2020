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
          </view>
      </view>
  </view>
</template>

<script>
import '../jnjyqk/jnjyqk.scss'
import './cpxJnywsk.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'cpxJnywsk',
  data(){
    return {
        main: "今年业务实况",
        ttuData: Array,
        loading:false
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
      this.ttuData = [];

      this.ttuData.push({num:0, unit:"", word:"委托单量", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"开工单量", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"完工单量", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"客户数量", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"供应商数量", bword:"今日", bnum:"+0"});
      this.ttuData.push({num:0, unit:"", word:"出证数量", bword:"今日", bnum:"+0"});

      this.initTableData();
  },
  mounted(){},
  methods: {
    initTableData(){
        // this.loading = true;
        // this.ttuData = [];

        this.searchData('YhWtdl',0);    
        this.searchData('YhKgdl',1); 
        this.searchData('YhWgdl',2); 
        this.searchData('YhKhsl',3); 
        this.searchData('YhGyssl',4); 
        this.searchData('YhCzsl',5); 
    },
    searchData(id,i){
        const _this = this;
        
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType");    

        requestData({
            operServiceId: 'NewReportService',
            operId: 'findYwskByCpx'+id,
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }

            // _this.loading = false;
            
            _this.$set(_this.ttuData, i, response.data.data.result);
        });
    }
  }
}
</script>
<style lang='scss' scoped>
.cbk_body{
    border-bottom: none;
    margin-bottom: 0;
}
</style>
