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
import './cpxZddx.scss'
import '../yytb/yytb.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import chart from '../chart/chart'

export default {
  name: 'cpxZddx',
  data(){
    return {
        main: "重点服务对象中类收入",
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
        operId: 'findJtgsSrbar',
        data: {companyId: companyId}
    },response => {
        _this.initDbOption(response.data.data.srbarOption);
    });
  },
  mounted(){},
  methods: {
      initDbOption(option){
        let legendData = [], seriesData = [];  
        if(option.yData.length > 0){
            for (let i = 0; i < option.yData.length; i++) {
                legendData.push({name:option.yData[i],icon:'rect'});
            }
        }  
        if(option.yData.length > 0){
            for (let i = 0; i < option.yData.length; i++) {
                seriesData.push({name:option.yData[i],type: 'bar',barWidth:20,data: [],barGap:'-100%'});

                for (let j = 0; j < 5; j++) {
                    if(j == i){
                        seriesData[i].data.push(option.sdata[i]);
                    }else{
                        seriesData[i].data.push(0);
                    }
                }
            }
        }

        this.dbOption = {
                backgroundColor:'#fff',
                color:['#0E77D6', '#73AD10', '#F99911', '#FB4444', '#17B3D0'],
                tooltip:{
                    show:true,
                    trigger:'axis',
                    position:[30,40],
                    formatter:function(params){
                        let f = false, str = "";

                        for (let i = 0; i < params.length; i++) {
                            if(params[i].value != 0){
                                f = true;
                                const jnv = params[i].value;
                                str += params[i].name + " : " + (jnv > 100000000 ? 
                                parseFloat(jnv/100000000).toFixed(2)+'亿' 
                                : ( jnv > 10000 ? 
                                    parseFloat(jnv/10000).toFixed(2)+'万' : jnv ));
                                break;
                            }
                        }

                        return str;
                    }
                },
                legend:{
                    show:true,
                    height:20,
                    top:5,
                    itemWidth:20,
                    itemHeight:8,
                    data:legendData
                },
                grid: {
                    top:70,
                    bottom:50,
                    right:20,
                    left: '18%'
                },
                xAxis: {
                    type: 'value',
                    min:option.xAxis.min,
                    max:option.xAxis.max*1.5,
                    axisLabel:{
                        show:true,
                        margin:30,
                        formatter:function(value){
                            return value > 100000000 ? 
                                parseFloat(value/100000000).toFixed(2)+'亿' 
                                : ( value > 10000 ? 
                                    parseInt(value/10000)+'万' : value );
                        }
                    },
                    axisTick:{
                        show:false  
                    },
                    axisLine:{
                        show:false  
                    },
                    splitLine:{
                        lineStyle:{
                            color:['#eee']
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    boundaryGap:false,
                    axisLabel:{
                        align:'center',
                        margin: 33,
                        interval:0,
                        color:'#aaa',
                        fontWeight: 'bold',
                        formatter:function(val){
                            var strs = val.split(''); //字符串数组
                            // var str = ''
                            // for(var i = 0, s; s = strs[i++];) { //遍历字符串数组
                            //     str += s;
                            //     if(!(i % 5)) str += '\n'; //按需要求余
                            // }
                            return strs.length > 4 ? val.substr(0,4)+".." : strs.join("");
                        }
                    },
                    axisTick:{
                        show:false  
                    },
                    axisLine:{
                        show:true  
                    },
                    data: option.yData
                },
                series: seriesData
          }
      }
  }
}
</script>
<style lang='scss' scoped>
</style>
