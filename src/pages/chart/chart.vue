<template>
  <view class='charts' :id="ecid">
    
  </view>
</template>

<script>
import './chart.scss'
import { $ } from '@tarojs/extend'
import * as echarts from "../../ec-canvas/echarts.min.js";

export default {
  name: 'charts',
  data(){
    return {
        ecid: String
    }
  },
  props:{
      option: Object
  },
  components: {
     
  },
  created(){
    this.ecid = new Date().getMilliseconds()+''+parseInt(Math.random()*1000000);
  },
  mounted(){
      this.createEcharts();
  },
  methods: {
    createEcharts: function(){
      const cvs = document.getElementById(this.ecid);

      const chart = echarts.init(cvs);
      
      chart.showLoading({
            text: '数据正在加载...',
            textStyle: { fontSize : 30 , color: '#444' },
            effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
      });
    }
  },
  watch:{
    option:{
      deep:true,
      handler(val, oldVal){
        if(val != null){
          if(val.error){
            alert(val.msg);
            return false;
          }
          const cvs = document.getElementById(this.ecid);
          const chart = echarts.init(cvs);
          chart.clear();
          chart.setOption(val);
          chart.hideLoading();
          chart.resize();
          window.onresize = chart.resize;
        }
      }
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
