<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="cbk_title" >
            <text class="cbk_title_main" >{{main}}</text>    
          </view>
          <view class="chart" >
              <view class="chart_body" :style="{height: ht+'Px'}" >
                  <chart :option="dbOption" />
              </view>
          </view>  
      </view>
  </view>
</template>

<script>
import './cpxZdsr.scss'
import '../yytb/yytb.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import chart from '../chart/chart'

export default {
  name: 'cpxZdsr',
  data(){
    return {
        main: "重点服务技术中类收入",
        dbOption: null
    }
  },
  props:{
      mt:Number,
      ht:Number
  },
  components: {
      chart: chart
  },
  created(){
    const _this = this;

    // 获取缓存的id
    const companyId = Taro.getStorageSync("showType");      

    requestData({
        operServiceId: 'NewReportService',
        operId: 'findFwjsByCpx',
        data: {companyId: companyId}
    },response => {
        _this.initDbOption(response.data.data.tableData);
    });
  },
  mounted(){},
  methods: {
      initDbOption(sdata){
        this.dbOption = {
            backgroundColor:"#fff",
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    startAngle:140,
                    radius: [0, 75],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    data: sdata,
                    label:{
                        show: true,
                        // formatter: '{b}\n{c}, {d}%',
                        fontSize:12,
                        fontWeight:'bold',
                        formatter:params => {
                            let str = params.name+ "\n";
                            const value = params.value;
                            str += value > 100000000 ? 
                                    parseFloat(value/100000000).toFixed(2)+'亿' 
                                    : ( value > 10000 ? 
                                        parseFloat(value/10000).toFixed(2)+'万' : value );
                            str += "\n"+params.percent+"%";
                            return str;
                        }
                    },
                    labelLine:{
                        length:10,
                        length2:10
                    },
                    smooth:true
                }
            ]
        }
      }
  }
}
</script>
<style lang='scss' scoped>
</style>
