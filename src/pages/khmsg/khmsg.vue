<template>
  <view class='khmsg'>
      <view class="title_back" >
          <a class="go_back" @click="navigateToback()" ></a>
          <text class="khm_title" >{{khmc}}</text>
      </view>
      <view class="khmsg_table" >
          <view class="khmsg_title" >
            <text class="khmsgt_word" >工商信息</text>    
            <a :class="{expand:gseflag, unexpand: !gseflag}" @click="qhGseflag()" ></a>
          </view>
          <view class="khmsg_tr" v-for="(item,index) in gsData" :key="index" v-if="gseflag" >
              <view class="khmsg_td" :class="{w100: item.td1 == '' }" >{{item.td0}}</view>
              <view class="khmsg_td" v-if="item.td1 != ''" >{{item.td1}}</view>
          </view>
          <text class="khmsg_kong" v-if="loading[0] == true" >{{loadWord[0]}}</text>
          <text class="khmsg_kong" v-if="kong[0] == true" >查无信息</text>
      </view>
      <view class="khmsg_table" v-if="khid != null" >
          <view class="khmsg_title" >
            <text class="khmsgt_word" >股东信息</text>    
            <a :class="{expand:gdeflag, unexpand: !gdeflag}" @click="qhGdeflag()" ></a>
          </view>
          <view class="khmsg_tr" v-for="(item,index) in gdData" :key="index" v-if="gdeflag" :style="{lineHeight: (gdeflag && (item.td0 != '' || item.td1 != '' ) ? 0 : '30Px')}" >
            <view class="khmsg_td" 
                :class="{w100: item.td1 == '', gdc: item.gdname, dgd: item.dgd }" >{{item.td0}}</view>
            <view class="khmsg_td" :class="{cgbl: item.cgbl}" v-if="item.td1 != ''" >{{item.td1}}</view>
          </view>
          <text class="khmsg_kong" v-if="loading[1]" >{{loadWord[1]}}</text>
          <text class="khmsg_kong" v-if="kong[1]" >查无信息</text>
      </view>
      <view class="khmsg_table" v-if="khid != null" >
          <view class="khmsg_title" >
            <text class="khmsgt_word" >高管信息</text>    
            <a :class="{expand:ggeflag, unexpand: !ggeflag}" @click="qhGgeflag()" ></a>
          </view>
          <view class="khmsg_tr" v-for="(item,index) in ggData" :key="index" v-if="ggeflag" >
              <view class="khmsg_td ggc" >{{item.td0}}</view>
              <view class="khmsg_td" >{{item.td1}}</view>
          </view>
          <text class="khmsg_kong" v-if="loading[2]" >{{loadWord[2]}}</text>
          <text class="khmsg_kong" v-if="kong[2]" >查无信息</text>
      </view>
      <view class="khmsg_table" v-if="khid != null" >
          <view class="khmsg_title" >
            <text class="khmsgt_word" >分支机构信息</text>    
            <a :class="{expand:fzjgeflag, unexpand: !fzjgeflag}" @click="qhFzjgeflag()" ></a>
          </view>
          <view class="khmsg_tr" v-for="(item,index) in fzjgData" :key="index" v-if="fzjgeflag" >
              <view class="khmsg_td" :class="{w100: item.td1 == '', gdc: item.gdname, ggc: item.ggname }" >{{item.td0}}</view>
              <view class="khmsg_td" v-if="item.td1 != ''" >{{item.td1}}</view>
          </view>
          <text class="khmsg_kong" v-if="loading[3] == true" >{{loadWord[3]}}</text>
          <text class="khmsg_kong" v-if="kong[3] == true" >查无信息</text>
      </view>
      <!-- <a v-if="showToTop0" class="zhiding" @click="toTop0()" >置顶</a> -->
      <a class="zhiding" v-if="showToTop0" @click="toTop0()" >
        <text class="zd_xian" ></text>
      </a>
  </view>
</template>

<script>
import './khmsg.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'khmsg',
  data(){
    return {
        khmc:String,
        khid:null,
        loadWord:Array,
        loading:Array,
        kong:Array,
        gsData: Array,
        gdData: Array,
        ggData: Array,
        fzjgData: Array,
        showToTop0: false,
        gseflag:true,
        gdeflag:true,
        ggeflag:true,
        fzjgeflag:true
    }
  },
  components: {},
  created(){
      this.kong = [];
      this.loadWord = [];

      for (let index = 0; index < 4; index++) {
          this.$set(this.kong,index,false);
          this.$set(this.loadWord,index,"");
          this.$set(this.loading,index,true);
      }
      // 设置置顶 
      this.setTabFixed();
      // 客户名称
      this.khmc = Taro.getStorageSync("khmc");

      // 判断 khmc 是否存在 不存在就获取id 进行查询获取客户名称
      if(this.khmc == null || this.khmc == "" || this.khmc == undefined){
        this.findKhmcByOrgId();
      }else{
        this.initGsData();  
      }

    //   // 高管信息
    //   this.ggData = [];

    //   this.ggData.push({td0: '姓名', td1:'职位'});
    //   this.ggData.push({td0: '王勇', td1:'执行董事兼总经理'});
    //   this.ggData.push({td0: '姓名', td1:'职位'});
    //   this.ggData.push({td0: '王刚', td1:'监事'});

      // 分支机构信息
    //   this.fzjgData = [];
    
    //   this.fzjgData.push({td0: '', td1:''});
    //   this.fzjgData.push({td0: '山东恒邦冶炼股份有限公司江西分公司', td1:'', gdname:true});
    //   this.fzjgData.push({td0: '法定代表人', td1:'经营状态'});
    //   this.fzjgData.push({td0: '刘全成', td1:'注销', ggname:true});
    //   this.fzjgData.push({td0: '注册时间', td1:''});
    //   this.fzjgData.push({td0: '2013-09-27', td1:''});
    //   this.fzjgData.push({td0: '', td1:''});
    //   this.fzjgData.push({td0: '山东恒邦冶炼股份有限公司江苏分公司', td1:'', gdname:true});
    //   this.fzjgData.push({td0: '法定代表人', td1:'经营状态'});
    //   this.fzjgData.push({td0: '刘全成', td1:'注销', ggname:true});
    //   this.fzjgData.push({td0: '注册时间', td1:''});
    //   this.fzjgData.push({td0: '2013-08-19', td1:''});
    //   this.fzjgData.push({td0: '', td1:''});
    //   this.fzjgData.push({td0: '山东恒邦冶炼股份有限公司辽宁分公司', td1:'', gdname:true});
    //   this.fzjgData.push({td0: '法定代表人', td1:'经营状态'});
    //   this.fzjgData.push({td0: '刘全成', td1:'存续', ggname:true});
    //   this.fzjgData.push({td0: '注册时间', td1:''});
    //   this.fzjgData.push({td0: '2013-08-16', td1:''});
    //   this.fzjgData.push({td0: '', td1:''});
    //   this.fzjgData.push({td0: '山东恒邦冶炼股份有限公司精炼分公司', td1:'', gdname:true});
    //   this.fzjgData.push({td0: '法定代表人', td1:'经营状态'});
    //   this.fzjgData.push({td0: '曲胜利', td1:'在业', ggname:true});
    //   this.fzjgData.push({td0: '注册时间', td1:''});
    //   this.fzjgData.push({td0: '2008-03-18', td1:''});
  },
  mounted(){
    // 置顶
    document.scrollingElement.scrollTop = 0;
  },
  methods: {
      findKhmcByOrgId(){
        const _this = this;
        requestData({
          operServiceId: 'NewReportService',
          operId: 'findKhmcByOrgId',
          data: {companyId: Taro.getStorageSync("orgId")}
        },response => {
          if(response.data.data.khmc == undefined || response.data.data.khmc == null){
            _this.khmc = "查无此公司";
          }else{
            _this.khmc = response.data.data.khmc;
          }

          this.initGsData();
        });
      },
      navigateToback(){
        Taro.redirectTo({
            url: Taro.getStorageSync("href") +"?s="+Math.random()
        });
      },
      setTabFixed(){
        const _this = this;
        window.onscroll = function(){
            const sctop = document.scrollingElement.scrollTop;
            _this.setCssByClass(sctop,50);
        }      
      },
      setCssByClass(sctop,val){
        if(sctop >= val){
          this.showToTop0 = true;
        }else{
          this.showToTop0 = false;
        }
      },
      toTop0(){
        document.scrollingElement.scrollTop = 0;
        this.showToTop0 = false;
      },
      returnSil(i){
          return setInterval(() => {
            if(this.loadWord[i] == ""){
                this.$set(this.loadWord,i,"数据加载中");
            }else if(this.loadWord[i] == "数据加载中"){
                this.$set(this.loadWord,i,"数据加载中.");
            }else if(this.loadWord[i] == "数据加载中."){
                this.$set(this.loadWord,i,"数据加载中..");
            }else if(this.loadWord[i] == "数据加载中.."){
                this.$set(this.loadWord,i,"数据加载中...");
            }else if(this.loadWord[i] == "数据加载中..."){
                this.$set(this.loadWord,i,"数据加载中");
            }
        }, 500)
      },
      initGsData(){
        const _this = this;
        const ldsl = this.returnSil(0);
        requestData({
            operServiceId: 'reportService',
            operId: 'findStationByCompany',
            data: {companyId: this.khmc}
        },response => {
            clearInterval(ldsl);
            _this.$set(_this.loading,0,false);

            if(response.data.data.tdata == undefined || response.data.data.tdata.length == 0){
                _this.$set(_this.kong,0,true);
                return false;
            }
            
            _this.gsData = response.data.data.tdata;

            // 客户id 不为空 继续进行下面查询
            if(response.data.data.id != null && response.data.data.id != ""){
               _this.khid = response.data.data.id;
               // 查询股东信息
               _this.initGdData(response.data.data.id); 
            }
        });
      },
      initGdData(id){
        const _this = this;
        const ldsl = this.returnSil(1);
        requestData({
            operServiceId: 'reportService',
            operId: 'findGdmsgByCompanyId',
            data: {companyId: id}
        },response => {
            clearInterval(ldsl);
            _this.$set(_this.loading,1,false);
            // 查询高管信息
            _this.initGgData(id);

            if(response.data.data.tdata == undefined || response.data.data.tdata.length == 0){
                _this.$set(_this.kong,1,true);
                return false;
            }
            
            _this.gdData = response.data.data.tdata;
            
        });
      },
      initGgData(id){
        const _this = this;
        const ldsl = this.returnSil(2);
        requestData({
            operServiceId: 'reportService',
            operId: 'findGgmsgByCompanyId',
            data: {companyId: id}
        },response => {
            clearInterval(ldsl);
            _this.$set(_this.loading,2,false);
            // 查询分支机构
            _this.initFzjgData(id);

            if(response.data.data.tdata == undefined || response.data.data.tdata.length == 0){
                _this.$set(_this.kong,2,true);
                return false;
            }
            
            _this.ggData = response.data.data.tdata;
        });
      },
      initFzjgData(id){
        const _this = this;
        const ldsl = this.returnSil(3);
        requestData({
            operServiceId: 'reportService',
            operId: 'findFzjgmsgByCompanyId',
            data: {companyId: id}
        },response => {
            clearInterval(ldsl);
            _this.$set(_this.loading,3,false);

            if(response.data.data.tdata == undefined || response.data.data.tdata.length == 0){
                _this.$set(_this.kong,3,true);
                return false;
            }
            
            this.fzjgData = response.data.data.tdata;            
        });
      },
      qhGseflag(){
          this.gseflag = !this.gseflag;
      },
      qhGdeflag(){
          this.gdeflag = !this.gdeflag;
      },
      qhGgeflag(){
          this.ggeflag = !this.ggeflag;
      },
      qhFzjgeflag(){
          this.fzjgeflag = !this.fzjgeflag;
      }
  }
}
</script>
<style lang='scss' scoped>
</style>