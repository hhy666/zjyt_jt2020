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
          <view class="table_area" >
              <view class="table_head" >
                  <text class="table_th" 
                    v-for="(item, index) in theadData" :key="index" 
                    >{{item}}</text>
              </view>
              <text class="loading" v-if="loading" >数据加载中</text>
              <view class="table_body" >
                  <view class="table_tr cql" v-for="(item, index) in tbodyData" :key="index" >
                    <view class="table_td" v-if="index > 0" >
                        <a :class="{icon_close:!showedChildrenIndex[index], icon_open: showedChildrenIndex[index]}" 
                            v-if="item.children.length > 0" @click="showChildrenData(index)" ></a>
                        <text class="table_td_text" v-if="tabId ==0 || tabId == 1"
                            :class="{iconNotExist:item.children.length == 0}" 
                            >{{item.name}}</text>
                        <a class="table_td_text cbl" v-if="tabId ==2"
                            @click="gotoGsDetail(index, -1)" >{{item.name}}</a>   
                    </view>
                    <text class="table_td" v-if="index == 0" >{{item.name}}</text> 
                    <text class="table_td" >{{item.wtdl}}</text>
                    <text class="table_td" >{{item.ycsr}}</text>
                    <text class="table_td" >{{item.srze}}</text>
                    <text class="table_td" >{{item.zcze}}</text>

                    <view class="table_tr_children cbai" 
                    v-for="(im,idx) in item.children" :key="idx" 
                    v-if="showedChildrenIndex[index]" >
                        <a class="table_td cbl" @click="gotoGsDetail(index,idx)" >{{im.name}}</a>
                        <text class="table_td" >{{im.wtdl}}</text>
                        <text class="table_td" >{{im.ycsr}}</text>
                        <text class="table_td" >{{im.srze}}</text>
                        <text class="table_td" >{{im.zcze}}</text>
                    </view>
                  </view>                  
              </view>
          </view>
      </view>
  </view>
</template>

<script>
import './gsTable.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'gsTable',
  data(){
    return {
        title:"按公司统计",
        unit:"单位 : 万元",
        tabId:0,
        tabData:Array,
        theadData:Array,
        tbodyData:Array,
        showedChildrenIndex:Array,
        loading:true
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
    this.tabData = [];

    this.tabData.push({id: 0, text: "公司", operId:"findCompanyMsgByCompanyYh"});
    this.tabData.push({id: 1, text: "产品线", operId:"findCompanyMsgByCpx"});
    this.tabData.push({id: 2, text: "区域公司", operId:"findCompanyMsgByAreaYh"});

    this.theadData = [];

    this.theadData.push("公司");
    this.theadData.push("委托单量");
    this.theadData.push("预测收入");
    this.theadData.push("收入总额");
    this.theadData.push("支出总额");

    const _this = this;

    // 获取缓存的id
    const companyId = Taro.getStorageSync("showType");    

    requestData({
        operServiceId: 'NewReportService',
        operId: this.tabData[this.tabId].operId,
        data: {companyId: companyId}
    },response => {
        if(response.data.data == null){
            alert("系统错误!");
            return false;
        }

        _this.loading = false;

        _this.tbodyData = response.data.data.tableData;
        _this.showedChildrenIndex = [];

        for (let index = 0; index < _this.tbodyData.length; index++) {
            _this.showedChildrenIndex.push(index == 1 ? true : false);
        }
    });
  },
  mounted(){},
  methods: {
      choosedThis(i){
        if(this.loading){
            return false;
        }  
        this.title = '按'+this.tabData[i].text+'统计';  
        this.tabId = i;
        this.initTableData(i);
      },
      showChildrenData(idx){
          this.$set(this.showedChildrenIndex,idx,!this.showedChildrenIndex[idx]);
      },
      gotoGsDetail(index, idx){
        let name = this.tbodyData[index].name;
         
        if(idx > -1){
            name = this.tbodyData[index].children[idx].name;
        }  
        const href = this.tabId == 1 ? "../cpx/cpx" : "../jtgs/jtgs" ;

        // 设置 缓存信息  
        // 类型 zj 表示 中检一天 其他 表示具体公司
        Taro.setStorageSync("showType", name);
        // 范围 0 集团 1 公司 3 区域公司 2 产品线
        let tp = this.tabId+1;
        if(idx != -1 && this.tabId == 2){
            tp = 1;
        }
        Taro.setStorageSync("showArea",tp);
        // 类型名称
        Taro.setStorageSync("showTypeName", name);

        Taro.redirectTo({
            url: href +"?s="+Math.random()
        });
      },
      initTableData(idx){
        const _this = this;

        this.loading = true;
        this.tbodyData = [];
        this.showedChildrenIndex = [];

        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType");    

        requestData({
            operServiceId: 'NewReportService',
            operId: this.tabData[this.tabId].operId,
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null){
                alert("系统错误!");
                return false;
            }

            _this.loading = false;

            _this.tbodyData = response.data.data.tableData;
            
            for (let index = 0; index < _this.tbodyData.length; index++) {
                _this.showedChildrenIndex.push(index == 1 ? true : false);
            }
        });
      }
  }
}
</script>
<style lang='scss' scoped>
</style>
