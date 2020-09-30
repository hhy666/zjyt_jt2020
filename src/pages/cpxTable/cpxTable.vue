<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="selected_tab bbn" >
              <a class="stab gstab" v-for="(item, index) in tabData" :key="index" 
                :class="{choosed: index == tabId}" 
                @click="choosedThis(index)">{{item.text}}</a>
          </view>
          <!-- <view class="table_exp" >
              <text class="te_title" >{{title}}</text>
              <text class="te_unit" >{{unit}}</text>
          </view> -->
          <view class="table_kh_exp" v-if="tabId == 3" >
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
              <view class="table_body" v-if="tabId == 0 || tabId == 3" >
                  <view class="table_tr" v-for="(item, index) in tbodyData" :key="index" :class="{cbl: index == 0,table_tr_nc:tabId == 3 && index == 1}"
                    v-if="(tabId == 3 && index > 0) || tabId == 0" >
                    <!-- <a class="table_td cbl" 
                       @click="gotoGsDetail(index)" 
                       v-if="index > 0" >{{item.name}}</a> 
                    <text class="table_td" v-if="index == 0" >{{item.name}}</text>   -->
                    <text class="table_td" v-if="tabId == 0" >{{item.name}}</text>
                    <text class="table_td" v-if="tabId == 3"
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
              <view class="table_body" v-if="tabId == 1 || tabId == 2" >
                  <view class="table_tr cql" v-for="(item, index) in tbodyData" :key="index" >
                    <a class="table_td fx25" @click="showChildrenData(index)" >
                        <a :class="{icon_close:showedChildrenIndex[index] == false, icon_open: showedChildrenIndex[index] == true }" 
                            v-if="item.children.length > 0" ></a>
                        <text class="table_td_text" 
                            :class="{iconNotExist:item.children.length == 0}" 
                            >{{item.name}}</text>
                    </a>
                    <text class="table_td fx25" >{{item.wtje}}</text>
                    <text class="table_td fx25" >{{item.kpsr}}</text>
                    <text class="table_td fx25" >{{item.cbze}}</text>

                    <view class="table_tr_children cbai" 
                        v-for="(im,idx) in item.children" :key="idx" 
                        v-if="showedChildrenIndex[index]" >
                        <text class="table_td fx25" >{{im.name}}</text>
                        <text class="table_td fx25" >{{im.wtje}}</text>
                        <text class="table_td fx25" >{{im.kpsr}}</text>
                        <text class="table_td fx25" >{{im.cbze}}</text>
                    </view>
                  </view>                  
              </view>
          </view>
      </view>
  </view>
</template>

<script>
import './cpxTable.scss'
import '../gsTable/gsTable.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'
import {$} from '@tarojs/extend'

export default {
  name: 'cpxTable',
  data(){
    return {
        title:"按公司统计",
        unit:"单位 : 万元",
        tabId:0,
        tabData:Array,
        theadData:Array,
        tbodyData:Array,
        showedChildrenIndex:Array,
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

    this.tabData.push({id: 0, text: "公司", operId:"findCompanyMsgByCpxName"});
    this.tabData.push({id: 1, text: "服务技术", operId:"findCpxMsgByJsfl"});
    this.tabData.push({id: 2, text: "服务对象", operId:"findCpxMsgByDxfl"});
    this.tabData.push({id: 3, text: "客户", operId:"findCpxTableKh"});

    this.theadData = this.returnHeadAry(this.tabId);

    this.tbodyData = [];

    const _this = this;

    // 获取缓存的id
    const cpxName = Taro.getStorageSync("showType");    

    requestData({
        operServiceId: 'NewReportService',
        operId: this.tabData[this.tabId].operId,
        data: {cpxName: cpxName}
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

        this.title = idx == 0 ? "按公司统计" 
            : ( idx == 1 ? "按服务技术分类统计" 
                : ( idx == 2 ? "按服务对象分类统计" 
                    : "按客户统计" ) );

        const _this = this;

        this.loading = true;
        this.tbodyData = [];
        
        if(this.tabId == 1 || this.tabId == 2){
            this.showedChildrenIndex = [];
        }

        // 获取缓存的id
        const cpxName = Taro.getStorageSync("showType");    

        requestData({
            operServiceId: 'NewReportService',
            operId: this.tabData[this.tabId].operId,
            data: {cpxName: cpxName, type: '0'+this.khType}
        },response => {
            if(response.data.data == null){
                alert("系统错误!");
                return false;
            }

            _this.loading = false;

            _this.tbodyData = response.data.data.tableData;
            
            if(_this.tabId == 1 || _this.tabId == 2){
                for (let index = 0; index < _this.tbodyData.length; index++) {
                    _this.showedChildrenIndex.push(index == 0 ? true : false);
                }
            }
        });
      },
      setKhType(t){
          this.khType = t;
          this.initTableData(this.tabId);
      },
      returnHeadAry(i){
          switch(i){
              case 0:
                  return ["公司","委托单量","预测收入","收入总额","支出总额"];
              case 1:
                  return ["服务技术分类","委托金额","开票收入","成本总额"];
              case 2:
                  return ["服务对象分类","委托金额","开票收入","成本总额"];
              case 3:
                  return ["客户","委托单量","出证数量","委托金额","已收金额"];
          }
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
