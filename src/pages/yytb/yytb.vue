<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="selected_tab" >
              <a class="stab" v-for="(item, index) in tabData" :key="index" 
                :class="{choosed:index == tabId}" 
                @click="choosedThis(index)">{{item.text}}</a>
          </view>
          <view class="chart" >
              <text class="chart_title" >{{chartTitle}}</text>
              <view class="chart_body" :style="{height: (ht+50)+'Px'}" >
                  <chart :option="dbOption" />
              </view>
          </view>
      </view>
  </view>
</template>

<script>
import './yytb.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import chart from '../chart/chart'

export default {
  name: 'yytb',
  data(){
    return {
        chartTitle:String,
        tabId:Number,
        dbOption: null
    }
  },
  props:{
      tabData:Array,
      mt:Number,
      ht:Number
  },
  components: {
      chart: chart
  },
  created(){
      this.tabId = 0;
      this.chartTitle = this.tabData[0].title;
      this.initDbOption();   
  },
  mounted(){},
  methods: {
      choosedThis(i){
        this.tabId = i;
        this.chartTitle = this.tabData[i].title;
        this.initDbOption();
      },
      initDbOption(){
        const _this = this;

        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType");    
        // 获取type
        const type = Taro.getStorageSync("showArea"); 
        let operId = this.tabData[this.tabId].operId;
        
        if(type == 3){
            operId = this.tabId == 0 ? "findYysrTbByQuyu" : ( this.tabId == 1 ? "findYycbTbByQuyu" : "findYylrTbByQuyu" ) ;
        }
        
        requestData({
            operServiceId: 'NewReportService',
            operId: operId,
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

            legendData.push({name:'今年收入',icon:'rect'});
            legendData.push({name:'去年收入',icon:'rect'});
            legendData.push({name:'同比',icon:'path://M10,10 L19,10 L19,12 L10,12 M,20,11 a3,3 0 1,0 6,0 a3,3 0 1, 0 -6, 0 M27,10 L36,10 L36,12 L27,12Z'});


            _this.dbOption = {
                color:['#0070C0','#F4B183','#FF0000'],
                tooltip:{
                    triggrt:"x",
                    position:[30,40],
                    formatter:function(params){
                        let jnv = _this.dbOption.series[0].data[params.dataIndex];
                        let qnv = _this.dbOption.series[1].data[params.dataIndex];
                        let tbv = _this.dbOption.series[2].data[params.dataIndex];
                        let str = params.name+"\n";
                        str += _this.dbOption.series[0].name+" : "+(jnv > 100000000 ? 
                                parseFloat(jnv/100000000).toFixed(2)+'亿' 
                                : ( jnv > 10000 ? 
                                    parseInt(jnv/10000)+'万' : jnv ))+" \n ";

                        str += _this.dbOption.series[1].name+" : "+(qnv > 100000000 ? 
                                parseFloat(qnv/100000000).toFixed(2)+'亿' 
                                : ( qnv > 10000 ? 
                                    parseInt(qnv/10000)+'万' : qnv ))+" \n";
                        str +=  _this.dbOption.series[2].name+" : "+ tbv + "%";                                                                      
                        
                        return str;
                    },
                    extraCssText:'width:140px; white-space:pre-wrap; color:#fff;'
                },
                legend:[{
                    height:20,
                    top:0,
                    itemWidth:20,
                    itemHeight:8,
                    data:legendData
                }],
                grid:[{
                    left: 45,
                    right: 35,
                    top: 50,
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
                    data:option.xAxisData
                }],
                yAxis:[{
                    position:'left',
                    min:option.yAxis[0].min,
                    max:option.yAxis[0].max,
                    axisLabel: {
                        fontSize: 10,
                        margin:10,
                        formatter:function(value){
                            const val = Math.abs(value), zf = value > 0 ? 1 : -1;
                            return val > 100000000 ? 
                                parseFloat(val/100000000).toFixed(2)*zf+'亿' 
                                : ( val > 10000 ? 
                                    parseInt(val/10000)*zf+'万' : val*zf );
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
                },{
                    position:'right',
                    min:option.yAxis[1].min,
                    max:option.yAxis[1].max,
                    axisLabel:{
                        fontSize: 10,
                        formatter:'{value}%'
                    },
                    splitLine: {
                        lineStyle:{
                            color:['#eee']
                        }
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
                    data: option.seriesData[0]
                },{
                    name: legendData[1].name,
                    type: 'bar',
                    barGap: '10%',
                    symbol: 'rect',
                    symbolSize: 8,
                    data: option.seriesData[1]
                },{
                    name: legendData[2].name,
                    type: 'line',
                    yAxisIndex:1,
                    symbol: 'circle',
                    symbolSize: 8,
                    label:{show:true,formatter:"{c}%"},
                    data: option.seriesData[2]
                }]
            }
        });
      }
  }
}
</script>
<style lang='scss' scoped>
</style>
