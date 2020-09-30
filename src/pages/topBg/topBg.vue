<template>
  <view class='kuang'>
    <view class="page_top_next" >
      <view class="ptn_left" >
        <text class="second_title" >{{secondTitle}}</text>
        <text class="data_date" >{{dataDate}}</text>
      </view>
      <view class="ptn_right" >
        <a class="ptn_right_1" @click="showOrHideExplain()" >
          <view class="ptn_right_left" >
            <text class="circle" >?</text>
          </view>
          <text class="data_explain" >{{dataExplain}}</text>
        </a>
      </view>
    </view>
  </view>
</template>

<script>
import './topBg.scss'

export default {
  name: 'topBg',
  data(){
    return {
        dataDate:""
    }
  },
  props:{
      secondTitle:String,
      dataExplain:String,
      showOrHideExplain:Function
  },
  components: {},
  created(){
    // 时间
    this.setNowTime();
  },
  mounted(){},
  methods: {
    setNowTime(){
      const _this = this;
      // setInterval(()=>{
        _this.dataDate = "数据更新截止 " + new Date().toISOString().slice(0,10) + ' ' + new Date(new Date().getTime() - 30*60*1000).toTimeString().slice(0,8);
      // },1000);
    } 
  }
}
</script>
<style lang='scss' scoped>
</style>
