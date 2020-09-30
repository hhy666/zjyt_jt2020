<template>
  <view class='showCompany' :style="{height:pmHeight+'px'}" >
      <view class="sc_outer_kuang" :style="{height:pmHeight+'px'}" ></view>
      <view class="sc_inner_kuang" :style="{height:pmHeight*0.78+'px'}" >
          <view class="scik_title" >
              <text class="scikt_word" >请选择公司</text>
              <a class="scikt_close" @click="cancle()" >x</a>
          </view>
          <view class="scik_body" >
              <view class="scikb_left" >
                  <a class="scikbl_tr fx100" 
                    v-for="(item,index) in companyData" :key="index" 
                    :class="{choosed: choosedIndex == index}"
                    @click="showChildren(index)" >{{item.gsname}}</a>
              </view>
              <view class="scikb_right" 
                :style="{height: childrenData.length*44+'px'}" >
                  <a class="scikbr_tr"
                    v-for="(item,index) in childrenData" :key="index" 
                    :class="{choosed: choosedChildIndex == index}"
                    @click="chooseThis(index)" >{{item.gsname}}</a>
              </view>
          </view>
          <view class="scik_bottom" >
              <!-- <a class="cancel_btn" @click="cancle()" >取消</a>
              <a class="submit_btn" @click="submit()" >确定</a> -->
          </view>
      </view>
  </view>
</template>

<script>
import './showCompany.scss'
import Taro from '@tarojs/taro'
import { $ } from '@tarojs/extend';
import requestData from '../util/request'

export default {
  name: 'showCompany',
  data(){
    return {
        companyData:Array,
        childrenData:Array,
        choosedIndex:Number,
        choosedChildIndex:-1,
        pmHeight:Number
    }
  },
  props:{
      showChoosedCompany:Function
  },
  components: {},
  created(){
      this.pmHeight = window.innerHeight;
      this.choosedIndex = 0;
      
      const _this = this;

      // zj 查询全部公司
      const companyId = 'zj';    

      requestData({
          operServiceId: 'NewReportService',
          operId: 'findCompanyMsgForChange',
          data: {companyId: companyId}
      },response => {
          _this.companyData = response.data.data.tableData;

          _this.childrenData = _this.companyData[0].children;
      });
  },
  mounted(){},
  methods: {
      showChildren(index){
          this.choosedIndex = index;
          this.choosedChildIndex = -1;
          this.childrenData = this.companyData[index].children;
      },
      chooseThis(index){
          this.choosedChildIndex = index;
          this.submit();
      },
      cancle(){
          this.showChoosedCompany();
      },
      submit(){
          if(this.choosedChildIndex == -1){
              return false;
          }

          $('body').removeClass('modal-open');
          // 设置 点击的公司信息
          Taro.setStorageSync("showType",this.childrenData[this.choosedChildIndex].id);
          Taro.setStorageSync("showArea",1);
          Taro.setStorageSync("showTypeName",this.childrenData[this.choosedChildIndex].gsname);

          Taro.reLaunch({
              url:'/pages/jtgs/jtgs?s='+Math.random()
          });
      }
  }
}
</script>
<style lang='scss' scoped>
</style>
