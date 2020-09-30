<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="selected_tab bbn" >
              <a class="stab gstab" v-for="(item, index) in tabData" :key="index" 
                :class="{choosed:tabId == index}" 
                @click="choosedThis(index)">{{item.text}}</a>
          </view>
          <!-- <view class="table_exp" >
              <text class="te_title" >{{title}}</text>
              <text class="te_unit" >{{unit}}</text>
          </view> -->
          <view class="table_kh_exp" v-if="tabId == 2" >
              <text class="tke_word" >取客户委托金额前100名</text>
              <view class="tke_btn" >
                  <a class="tkeb_a" :class="{cur: khType == 1}" @click="setKhType(1)" >内部</a>
                  <a class="tkeb_a" :class="{cur: khType == 2}" @click="setKhType(2)" >外部</a>
              </view>
          </view>
          <view class="table_area" >
              <view class="table_head" >
                  <text class="table_th" 
                    v-for="(item, index) in theadData" :key="index" 
                    >{{item}}</text>
              </view>
              <text class="loading" v-if="loading" >数据加载中</text>
              <view class="table_body" >
                  <view class="table_tr" v-for="(item, index) in tbodyData" :key="index" :class="{cbl: index == 0,table_tr_nc:tabId == 2 && index == 1}" 
                    v-if="(tabId == 2 && index > 0) || tabId == 1 || tabId == 0" >
                    <text class="table_td" v-if="tabId == 1" >{{item.name}}</text>
                    <text class="table_td" v-if="tabId == 2 || tabId == 0"
                        @touchstart="touchStart($event,item.name,index)" 
                        @touchend="touchEnd($event,item.name,index)" >
                        {{item.name.length > 6 ? item.name.substr(0,6) + '..' : item.name}}
                    </text> 
                    <text class="table_td" >{{item.wtdl}}</text>
                    <text class="table_td" >{{item.ycsr}}</text>
                    <text class="table_td" >{{item.srze}}</text>
                    <text class="table_td" >{{item.zcze}}</text>
                  </view>                  
              </view>
          </view>
      </view>
  </view>
</template>

<script>
import './jtgsTable.scss'
import '../gsTable/gsTable.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import {$} from '@tarojs/extend'

export default {
  name: 'jtgsTable',
  data(){
    return {
        title:"按公司统计",
        unit:"单位 : 万元",
        tabId:0,
        tabData:Array,
        theadData:Array,
        tbodyData:Array,
        khType:2,
        loading:true
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
    this.tabData = [];

    this.tabData.push({id: 0, text: "公司", operId:"findJtgsTableGs", operId3:'findJtgsTableGsQuyu'});
    this.tabData.push({id: 1, text: "产品线", operId:"findJtgsTableCpx", operId3:"findJtgsTableCpxQuyu"});
    this.tabData.push({id: 2, text: "客户", operId:"findJtgsTableKh", operId3:"findJtgsTableKhQuyu"});

    this.theadData = this.returnHeadAry(this.tabId);

    this.tbodyData = [];

    const _this = this;

    // 获取缓存的id
    const gsName = Taro.getStorageSync("showType");    
    // 类型
    const type = Taro.getStorageSync("showArea");    
    const operId = type == 3? this.tabData[this.tabId].operId3 : this.tabData[this.tabId].operId ;

    requestData({
        operServiceId: 'NewReportService',
        operId: operId,
        data: {gsName: gsName}
    },response => {
        if(response.data.data == null){
            alert("系统错误!");
            return false;
        }

        _this.loading = false;

        _this.tbodyData = response.data.data.tableData;
    });
  },
  mounted(){},
  methods: {
      choosedThis(i){
        if(this.loading){
            return false;
        }  
        this.tabId = i;
        this.initTableData(i);
      },
      showChildrenData(idx){
          this.$set(this.showedChildrenIndex,idx,!this.showedChildrenIndex[idx]);
      },
      gotoGsDetail(index, idx){
          // 设置 缓存信息
          Taro.setStorageSync("showTypeName", this.tbodyData[index].children[idx].name);  

          Taro.redirectTo({
              url: this.tbodyData[index].children[idx].href +"?s="+Math.random()
          });
      },
      initTableData(idx){
        this.theadData = this.returnHeadAry(this.tabId);

        this.tbodyData = [];

        this.title = idx == 0 ? "按公司统计" : ( idx == 1 ? "按产品线统计" : "按客户统计" );

        const _this = this;

        this.loading = true;
        this.tbodyData = [];
        
        // 获取缓存的id
        const gsName = Taro.getStorageSync("showType");    
        // 类型
        const type = Taro.getStorageSync("showArea");    
        const operId = type == 3? this.tabData[this.tabId].operId3 : this.tabData[this.tabId].operId ;
        requestData({
            operServiceId: 'NewReportService',
            operId: operId,
            data: {gsName: gsName, type: '0'+this.khType}
        },response => {
            if(response.data.data == null){
                alert("系统错误!");
                return false;
            }

            _this.loading = false;

            _this.tbodyData = response.data.data.tableData;
        });  
      },
      returnHeadAry(i){
          switch(i){
              case 0:
                  return ["公司","委托单量","预测收入","收入总额","支出总额"];
              case 1:
                  return ["产品线","委托单量","预测收入","收入总额","支出总额"];
              case 2:
                  return ["客户","委托单量","出证数量","委托总额","已收总额"];
          }
      },
      setKhType(t){
          this.khType = t;
          this.initTableData(this.tabId);
      },
      touchStart(e,name,idx){
        try {
          e.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
 
          var touch = e.touches[0]; //获取第一个触点
          var x = Number(touch.clientX); //页面触点X坐标
          var y = Number(touch.clientY); //页面触点Y坐标
          
          let $word = $("<text id='over_name_"+idx+"' >"+name+"</text>");
          $word.css({
            position:"fixed",
            top:(y-50)+'Px',
            left:(x+30)+'px',
            display:'block',
            zIndex:999,
            backgroundColor:'inherit',
            color:'#000'
          });
          $("body").append($word);
        } catch (e) {
          alert('touchSatrtFunc：' + e.message);
        }
      },
      touchEnd(e,name,idx){
        $("#over_name_"+idx).remove();
      }    
  }
}
</script>
<style lang='scss' scoped>
</style>
