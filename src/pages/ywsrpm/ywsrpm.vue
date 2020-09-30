<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="selected_tab" >
              <a class="stab" v-for="(item, index) in tabData" :key="index" 
                :class="{choosed:index == tabId}" 
                @click="choosedThis(index)">{{item.text}}</a>
          </view>
          <view class="chart" >
              <view class="chart_body" :id="tabData[tabId].id" :style="{height: ht+'Px'}" >
                  <chart :option="srpmOption" />
              </view>
          </view>
      </view>
  </view>
</template>

<script>
import './ywsrpm.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import chart from '../chart/chart'
import {$} from '@tarojs/extend'
import * as echarts from "../../ec-canvas/echarts.min.js";

export default {
  name: 'ywsrpm',
  data(){
    return {
        tabId:0,
        srpmOption:null,
        isShuBan:true
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
      this.initSrpmOption();
  },
  mounted(){},
  methods: {
    choosedThis(i){
        $("#"+this.tabData[this.tabId].id).height(this.ht);
        this.tabId = i;
        this.chartTitle = this.tabData[i].title;        
        this.initSrpmOption();
    },
    initSrpmOption(){
        this.srpmOption = {};
        this.isShuBan = false;        
        const _this = this;

        requestData({
            operServiceId: 'NewReportService',
            operId: _this.tabData[_this.tabId].operId,
            data: {}
        },response => {
            if(response.error){
                _this.dbOption = {
                    error: true,
                    msg: response.error
                }
                
                return false;
            }
            
            _this.returnOptionById(_this.tabData[_this.tabId].id,response.data.data);
        });
    },
    returnOptionById(id,option){
        if(id == "zjdwtb0" || id == "zjdwtb1"){
            this.srpmOption = this.returnZjdwtb0Option(option);
        }else if(id == 'gngstb0' || id == 'gngstb1'){
            this.srpmOption = this.returnGngstb0Option(option);
        }else if(id == 'jwgstb0' || id == 'jwgstb1'){
            this.srpmOption = this.returnJwgstb0Option(option);
        }
    },
    returnZjdwtb0Option(option){
        const _this = this;
        return {
                color:['#39CB73'],
                tooltip:{
                    triggrt:"x",
                    position:[30,40],
                    formatter:function(params){
                        return params.name+" : "+(params.value > 100000000 ? 
                                parseFloat(params.value/100000000).toFixed(2)+'亿' 
                                : ( params.value > 10000 ? 
                                    parseInt(params.value/10000)+'万' : params.value ));
                    }
                },
                toolbox:{
                    iconStyle:{
                        borderColor:'blue',
                        borderWidth:1
                    },
                    feature:{
                        myTool1:{
                            show:true,
                            title:'横版/竖版切换',
                            icon:'path://M10,50 H90 V90 H10 Z M50,10 H90 V90 H50 Z',
                            onclick:function(){
                                const xxx = this;
                                if(_this.isShuBan){
                                    _this.isShuBan = false;

                                    // 重设值chart的高度 暂时+300
                                    // $("#"+_this.tabData[_this.tabId].id).height(_this.ht+300);
                                    // 刷新chart
                                    let chart = echarts.init($("#"+_this.tabData[_this.tabId].id+" .charts")[0]);
                                    let op = chart.getOption();
                                    const opxs = op.xAxis;
                                    op.xAxis = op.yAxis;
                                    op.yAxis = opxs;
                                    let xxx = [],yyy = [];
                                    for (let i = op.xAxis[0].data.length - 1; i >= 0; i--) {
                                        xxx.push(op.xAxis[0].data[i]);
                                        yyy.push(op.series[0].data[i]);
                                    }
                                    op.xAxis[0].data = xxx;
                                    op.series[0].data = yyy;
                                    chart.setOption(op);
                                    chart.resize();
                                }else{
                                    _this.isShuBan = true;
                                    // 重设值chart的高度
                                    // $("#"+_this.tabData[_this.tabId].id).height(_this.ht);
                                    // 刷新chart
                                    let chart = echarts.init($("#"+_this.tabData[_this.tabId].id+" .charts")[0]);
                                    let op = chart.getOption();
                                    const opxs = op.xAxis;
                                    op.xAxis = op.yAxis;
                                    op.yAxis = opxs;
                                    let xxx = [],yyy = [];
                                    for (let i = op.yAxis[0].data.length - 1; i >= 0; i--) {
                                        xxx.push(op.yAxis[0].data[i]);
                                        yyy.push(op.series[0].data[i]);
                                    }
                                    op.yAxis[0].data = xxx;
                                    op.series[0].data = yyy;
                                    chart.setOption(op);
                                    chart.resize();
                                }
                            }
                        }
                    }
                },
                legend:[{
                    height:20,
                    top:5,
                    itemWidth:20,
                    itemHeight:8,
                    data:[{name:_this.tabData[_this.tabId].title,icon:'rect'}]
                }],
                grid:[{
                    left: 60,
                    right: 35,
                    top: 60,
                    bottom: 60,
                    height: 'auto'
                }],
                xAxis:[{
                    type: 'category',
                    splitLine: {
                        show:false
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: 10,
                        rotate:45,
                        width:10,
                        height:'auto'
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
                        width:'auto',
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
                    name: _this.tabData[_this.tabId].title,
                    type: 'bar',
                    barGap: '10%',
                    symbol: 'rect',
                    symbolSize: 8,
                    data: option.seriesData[0]
                }]
            }
    },
    returnGngstb0Option(option){
        const _this = this;
        return {
                color:['#1D8EFF'],
                tooltip:{
                    triggrt:"x",
                    position:[30,40],
                    formatter:function(params){
                        return params.name+" : "+(params.value > 100000000 ? 
                                parseFloat(params.value/100000000).toFixed(2)+'亿' 
                                : ( params.value > 10000 ? 
                                    parseInt(params.value/10000)+'万' : params.value ));
                    }
                },
                toolbox:{
                    iconStyle:{
                        borderColor:'blue',
                        borderWidth:1
                    },
                    feature:{
                        myTool2:{
                            show:true,
                            title:'横版/竖版切换',
                            icon:'path://M10,50 H90 V90 H10 Z M50,10 H90 V90 H50 Z',
                            onclick:function(){
                                const xxx = this;
                                if(_this.isShuBan){
                                    _this.isShuBan = false;

                                    // 重设值chart的高度 暂时+300
                                    $("#"+_this.tabData[_this.tabId].id).height(_this.ht);
                                    // 刷新chart
                                    let chart = echarts.init($("#"+_this.tabData[_this.tabId].id+" .charts")[0]);
                                    let op = chart.getOption();
                                    const opxs = op.xAxis;
                                    op.xAxis = op.yAxis;
                                    op.yAxis = opxs;
                                    op.grid[0].left = 15;
                                    op.xAxis[0].axisLabel = {
                                        interval: 0,
                                        fontSize: 10,
                                        fontWeight:'bold',
                                        formatter:function(value){
                                            const va = value.split("");
                                            return va.join("\n");
                                        }
                                    }
                                    op.yAxis[0].axisLabel = {
                                        fontSize: 8,
                                        rotate:-90,
                                        formatter:function(value){
                                            return value > 100000000 ? 
                                                parseFloat(value/100000000).toFixed(2)+'亿' 
                                                : ( value > 10000 ? 
                                                    parseInt(value/10000)+'万' : value );
                                        }
                                    }   
                                    let xxx = [],yyy = [];
                                    for (let i = op.xAxis[0].data.length - 1; i >= 0; i--) {
                                        xxx.push(op.xAxis[0].data[i]);
                                        yyy.push(op.series[0].data[i]);
                                    }
                                    op.xAxis[0].data = xxx;
                                    op.series[0].data = yyy;
                                    chart.setOption(op);
                                    chart.resize();
                                }else{
                                    _this.isShuBan = true;
                                    // 重设值chart的高度
                                    $("#"+_this.tabData[_this.tabId].id).height(_this.ht+300);
                                    // 刷新chart
                                    let chart = echarts.init($("#"+_this.tabData[_this.tabId].id+" .charts")[0]);
                                    let op = chart.getOption();
                                    const opxs = op.xAxis;                                    
                                    op.xAxis = op.yAxis;
                                    op.xAxis[0].axisLabel = {
                                        rotate:0,
                                        formatter:function(value){
                                            return value > 100000000 ? 
                                                parseFloat(value/100000000).toFixed(2)+'亿' 
                                                : ( value > 10000 ? 
                                                    parseInt(value/10000)+'万' : value );
                                        }
                                    }
                                    op.yAxis = opxs;
                                    op.yAxis[0].axisLabel = {
                                        interval: 0,
                                        fontSize: 10,
                                        fontWeight:'bold'
                                    }
                                    op.grid[0].left = 60;
                                    op.grid[0].right = 20;
                                    let xxx = [],yyy = [];
                                    for (let i = op.yAxis[0].data.length - 1; i >= 0; i--) {
                                        xxx.push(op.yAxis[0].data[i]);
                                        yyy.push(op.series[0].data[i]);
                                    }
                                    op.yAxis[0].data = xxx;
                                    op.series[0].data = yyy;
                                    chart.setOption(op);
                                    chart.resize();
                                }
                            }
                        }
                    }
                },
                legend:[{
                    height:20,
                    top:5,
                    itemWidth:20,
                    itemHeight:8,
                    data:[{name:_this.tabData[_this.tabId].title,icon:'rect'}]
                }],
                grid:[{
                    left:15,
                    right:10,
                    top: 60,
                    bottom: 70,
                    height:"auto"
                }],
                xAxis:[{
                    type: 'category',
                    splitLine: {
                        show:false
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: 10,
                        fontWeight:'bold',
                        formatter:function(value){
                            const va = value.split("");
                            return va.join("\n");
                        }
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
                        fontSize: 8,
                        rotate:-90,
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
                    name: _this.tabData[_this.tabId].title,
                    type: 'bar',
                    barGap: '10%',
                    symbol: 'rect',
                    symbolSize: 8,
                    data: option.seriesData[0]
                }]
            }
    },
    returnJwgstb0Option(option){
        const _this = this;
        return {
                color:['#4DCDC1'],
                tooltip:{
                    triggrt:"x",
                    position:[30,40],
                    formatter:function(params){
                        return params.name+" : "+(params.value > 100000000 ? 
                                parseFloat(params.value/100000000).toFixed(2)+'亿' 
                                : ( params.value > 10000 ? 
                                    parseInt(params.value/10000)+'万' : params.value ));
                    }
                },
                toolbox:{
                    iconStyle:{
                        borderColor:'blue',
                        borderWidth:1
                    },
                    feature:{
                        myTool2:{
                            show:true,
                            title:'横版/竖版切换',
                            icon:'path://M10,50 H90 V90 H10 Z M50,10 H90 V90 H50 Z',
                            onclick:function(){
                                const xxx = this;
                                if(_this.isShuBan){
                                    _this.isShuBan = false;

                                    // 重设值chart的高度 暂时+300
                                    $("#"+_this.tabData[_this.tabId].id).height(_this.ht);
                                    // 刷新chart
                                    let chart = echarts.init($("#"+_this.tabData[_this.tabId].id+" .charts")[0]);
                                    let op = chart.getOption();
                                    const opxs = op.xAxis;
                                    op.xAxis = op.yAxis;
                                    op.yAxis = opxs;
                                    op.grid[0].left = 15;
                                    op.xAxis[0].axisLabel = {
                                        interval: 0,
                                        fontSize: 10,
                                        fontWeight:'bold',
                                        formatter:function(value){
                                            const va = value.split("");
                                            return va.join("\n");
                                        }
                                    }
                                    op.yAxis[0].axisLabel = {
                                        fontSize: 8,
                                        rotate:-90,
                                        formatter:function(value){
                                            return value > 100000000 ? 
                                                parseFloat(value/100000000).toFixed(2)+'亿' 
                                                : ( value > 10000 ? 
                                                    parseInt(value/10000)+'万' : value );
                                        }
                                    }   
                                    let xxx = [],yyy = [];
                                    for (let i = op.xAxis[0].data.length - 1; i >= 0; i--) {
                                        xxx.push(op.xAxis[0].data[i]);
                                        yyy.push(op.series[0].data[i]);
                                    }
                                    op.xAxis[0].data = xxx;
                                    op.series[0].data = yyy;
                                    chart.setOption(op);
                                    chart.resize();
                                }else{
                                    _this.isShuBan = true;
                                    // 重设值chart的高度
                                    $("#"+_this.tabData[_this.tabId].id).height(_this.ht+300);
                                    // 刷新chart
                                    let chart = echarts.init($("#"+_this.tabData[_this.tabId].id+" .charts")[0]);
                                    let op = chart.getOption();
                                    const opxs = op.xAxis;                                    
                                    op.xAxis = op.yAxis;
                                    op.xAxis[0].axisLabel = {
                                        formatter:function(value){
                                            value = value > 100000000 ? 
                                                parseFloat(value/100000000).toFixed(2)+'亿' 
                                                : ( value > 10000 ? 
                                                    parseInt(value/10000)+'万' : value );
                                            value += "";        
                                            const va = value.split("");
                                            return va.join("\n");                                                            
                                        }
                                    }
                                    op.yAxis = opxs;
                                    op.yAxis[0].axisLabel = {
                                        interval: 0,
                                        fontSize: 10,
                                        fontWeight:'bold'
                                    }
                                    op.grid[0].left = 120;
                                    op.grid[0].right = 20;
                                    let xxx = [],yyy = [];
                                    for (let i = op.yAxis[0].data.length - 1; i >= 0; i--) {
                                        xxx.push(op.yAxis[0].data[i]);
                                        yyy.push(op.series[0].data[i]);
                                    }
                                    op.yAxis[0].data = xxx;
                                    op.series[0].data = yyy;
                                    chart.setOption(op);
                                    chart.resize();
                                }
                            }
                        }
                    }
                },
                legend:[{
                    height:20,
                    top:5,
                    itemWidth:20,
                    itemHeight:8,
                    data:[{name:_this.tabData[_this.tabId].title,icon:'rect'}]
                }],
                grid:[{
                    left:15,
                    right:10,
                    top: 60,
                    bottom: 120,
                    height:"auto"
                }],
                xAxis:[{
                    type: 'category',
                    splitLine: {
                        show:false
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: 10,
                        fontWeight:'bold',
                        formatter:function(value){
                            const va = value.split("");
                            return va.join("\n");
                        }
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
                        fontSize: 8,
                        rotate:-90,
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
                    name: _this.tabData[_this.tabId].title,
                    type: 'bar',
                    barGap: '10%',
                    symbol: 'rect',
                    symbolSize: 8,
                    data: option.seriesData[0]
                }]
            }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
