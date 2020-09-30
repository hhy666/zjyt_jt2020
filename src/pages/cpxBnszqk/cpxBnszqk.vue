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
import './cpxBnszqk.scss'
import '../yytb/yytb.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import chart from '../chart/chart'

export default {
  name: 'cpxBnszqk',
  data(){
    return {
        main: "本年收支情况",
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
      this.initDbOption();
  },
  mounted(){},
  methods: {
      initDbOption(){
          const _this = this;

        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType");    

        requestData({
            operServiceId: 'NewReportService',
            operId: 'findSzByCpx',
            data: {companyId: companyId}
        },response => {
            if(response.error){
                _this.dbOption = {
                    error: true,
                    msg: response.error
                }
                
                return false;
            }

            const option = response.data.data;

            const legendData = [];

            legendData.push({name:'业务收入总额',icon:'rect'});
            legendData.push({name:'业务成本总额',icon:'rect'});

            _this.dbOption = {
                color:['#0070C0','#F4B183'],
                tooltip:{
                    triggrt:"x",
                    position:[30,40],
                    formatter:function(params){
                        let str = params.seriesName+" : ",
                            jnv = params.value;
                        str += params.name+" "+(jnv > 100000000 ? 
                                parseFloat(jnv/100000000).toFixed(2)+'亿' 
                                : ( jnv > 10000 ? 
                                    parseInt(jnv/10000)+'万' : jnv ))+" ";
                        return str;
                    }
                },
                legend:[{
                    height:20,
                    top:5,
                    itemWidth:20,
                    itemHeight:8,
                    data:legendData
                }],
                grid:[{
                    left: 45,
                    right: 35,
                    top: 30,
                    bottom: 60,
                    height: '75%'
                }],
                xAxis:[{
                    type: 'category',
                    splitLine: {
                        show:false
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: 10
                    },
                    axisTick: {
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    data:option.xAxisData == undefined ? [] : option.xAxisData
                }],
                yAxis:[{
                    position:'left',
                    min:option.yAxis == undefined ? 0 : option.yAxis[0].min,
                    max:option.yAxis == undefined ? 0 : option.yAxis[0].max,
                    axisLabel: {
                        fontSize: 10,
                        formatter:function(value){
                            return value > 100000000 ? 
                                parseFloat(value/100000000).toFixed(2)+'亿' 
                                : ( value > 10000 ? 
                                    parseInt(value/10000)+'万' : value );
                        }
                    },
                    splitLine: {
                        show:false
                    },
                    axisTick: {
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    boundaryGap:300
                }],
                series:[{
                    name: legendData[0].name,
                    type: 'bar',
                    barGap: '10%',
                    symbol: 'rect',
                    symbolSize: 8,
                    data: option.seriesData == undefined ? [] : option.seriesData[0]
                },{
                    name: legendData[1].name,
                    type: 'bar',
                    barGap: '10%',
                    symbol: 'rect',
                    symbolSize: 8,
                    data: option.seriesData == undefined ? [] : option.seriesData[1]
                }]
            }
        });
      }
  }
}
</script>
<style lang='scss' scoped>
</style>
