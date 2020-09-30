<template>
  <view class="index">
    <gs></gs>
  </view>
</template>

<script>
import './index.scss'
import gs from '../gs/gs'
import Taro from '@tarojs/taro'
import {$} from '@tarojs/extend'

export default {
  data () {
    return {
      
    }
  },
  components:{
    gs: gs
  },
  created(){
    // 类型 zj 表示 中检一天 其他 表示具体公司
    Taro.setStorageSync("showType", 'zj');
    // 范围 0 集团 1 公司 3 区域公司 2 产品线
    Taro.setStorageSync("showArea",0);
    // 类型名称
    Taro.setStorageSync("showTypeName", '中检一天');

    // 置顶
    document.scrollingElement.scrollTop = 0;
  }
}
</script>
<style lang='scss' scoped>
</style>

