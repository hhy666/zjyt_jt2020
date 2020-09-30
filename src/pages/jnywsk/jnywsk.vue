<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="cbk_title" >
            <text class="cbk_title_main" >{{main}}</text>    
          </view>
          <view class="today_total_kuang" >
            <text class="loading" v-if="loading" >数据加载中</text>
            <!-- 上半部 今日和总量 -->  
            <view class="cbk_body bb" >  
                <view class="yy_view" v-for="(item, index) in ttuData" :key="index" :class="{mb10: index >= ttuData.length - 3}" >
                    <view class="yyv_up" >
                        <text class="yyv_up_num" >{{item.num}}</text>
                        <text class="yyv_up_unit" >{{item.unit}}</text>
                    </view>
                    <text class="yyv_down" >{{item.word}}</text>
                    <view class="yyv_bottom" >
                        <text class="yyv_bottom_word" >{{item.bword}}</text>
                        <text class="yyv_bottom_num" >{{item.bnum}}</text>
                    </view>
                    <view class="shuxian" v-if="index%3 != 2" ></view>
                </view>  
            </view>

            <!-- 下半部 今日和总量 -->
            <view class="cbk_body fdr mt10" v-for="(item, index) in ttdData" :key="index" >  
                <view class="yy_view fx40" >
                    <view class="yyv_up" >
                        <text class="yyv_up_num" >{{item.num}}</text>
                        <text class="yyv_up_unit" >{{item.unit}}</text>
                    </view>
                    <text class="yyv_down" >{{item.word}}</text>
                    <view class="yyv_bottom" >
                        <text class="yyv_bottom_word" >{{item.bword}}</text>
                        <text class="yyv_bottom_num" >{{item.bnum}}</text>
                    </view>
                    <view class="shuxian" ></view>
                </view>
                <view class="fdc fx60 mgl10" >
                    <view class="fx100 jcfs" v-for="(im, idx) in item.detail" :key="idx" >
                        <text class="yyvl_body_word" >{{im.word}}</text>
                        <text class="yyv_up_num fs20" >{{im.num}}</text>
                        <text class="yyv_up_unit" >{{im.unit}}</text>
                    </view>
                </view>  
            </view>
          </view>
      </view>
  </view>
</template>

<script>
import '../jnjyqk/jnjyqk.scss'
import './jnywsk.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'jnywsk',
  data(){
    return {
        main: "今年业务实况",
        ttuData: Array,
        ttdData: Array,
        loading:true
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
    this.loading = false;

    this.ttuData = [];

    this.ttuData.push({num:0, unit:"", word:"委托单量", bword:"今日", bnum:"+0"});
    this.ttuData.push({num:0, unit:"", word:"开工单量", bword:"今日", bnum:"+0"});
    this.ttuData.push({num:0, unit:"", word:"完工单量", bword:"今日", bnum:"+0"});
    this.ttuData.push({num:0, unit:"", word:"委托金额", bword:"今日", bnum:"+0"});
    this.ttuData.push({num:0, unit:"", word:"预测收入", bword:"今日", bnum:"+0"});
    this.ttuData.push({num:'0%', unit:"", word:"产品线毛利率", bword:"", bnum:""});

    this.ttdData = [];

    this.ttdData.push({num:0, unit:"", word:"客户数量", bword:"今日", bnum:"+0",detail:[
    {word:"产品线活跃客户数量", num:0, unit:""},
    {word:"非产品线活跃客户数量", num:0, unit:""}
    ]});
    this.ttdData.push({num:0, unit:"", word:"供应商数量", bword:"今日", bnum:"+0",detail:[
    {word:"产品线活跃供应商数量", num:0, unit:""},
    {word:"非产品线活跃供应商数量", num:0, unit:""},
    {word:"非活跃供应商数量", num:0, unit:""}
    ]});
    this.ttdData.push({num:0, unit:"", word:"出证数量", bword:"今日", bnum:"+0",detail:[
    {word:"证书数量", num:0, unit:""},
    {word:"其他成果物数量", num:0, unit:""}
    ]});
    
    this.findYwskMsgSql1();
    setTimeout(() => {
        this.findYwskMsgSql2();  
    }, 1);
    this.findYwskMsgSql3();
    this.findYwskMsgSql4();
    this.findYwskMsgSql5();
  },
  mounted(){},
  methods: {
    findYwskMsgSql1(){
        const _this = this;
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType"); 
        // 获取类型
        const type = Taro.getStorageSync("showArea");

        if(type == 0){
            this.findYwskMsgSql1Jt();
            return false;
        }

        requestData({
            operServiceId: 'NewReportService',
            operId: type == 1 ? 'findYwskMsgSql1' : 'findYwskMsgSql1Quyu',
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }
            
            for (let index = 0; index < response.data.data.result.length; index++) {
                _this.$set(_this.ttuData, index, response.data.data.result[index]);
            }    
        });
    },
    findYwskMsgSql1Jt(){
        setTimeout(() => {
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtWtdlYear','num', this.ttuData[0]);            
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtKgdlYear','num', this.ttuData[1]);            
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtWgdlYear','num', this.ttuData[2]);            
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtWtjeYear','num', this.ttuData[3]);            
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtYcsrYear','num', this.ttuData[4]);            
        }, 1);

        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtWtdlDay','bnum', this.ttuData[0]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtKgdlDay','bnum', this.ttuData[1]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtWgdlDay','bnum', this.ttuData[2]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtWtjeDay','bnum', this.ttuData[3]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql1JtYcsrDay','bnum', this.ttuData[4]);
    },
    findYwskMsgSql1JtQueryAttr(id,attr,p){
        const _this = this;
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType"); 

        requestData({
            operServiceId: 'NewReportService',
            operId: id,
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }
            
            if(id == "findYwskMsgSql3JtKhslFhy"){
                p.push(response.data.data.result);
            }else{
                _this.$set(p, attr, response.data.data.result);  
            }
        });
    },
    findYwskMsgSql2(){
        const _this = this;
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType"); 
        // 获取类型
        const type = Taro.getStorageSync("showArea");

        requestData({
            operServiceId: 'NewReportService',
            operId: type == 1 ? 'findYwskMsgSql2' : ( type == 0 ? 'findYwskMsgSql2Jt' : 'findYwskMsgSql2Quyu'),
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }
            
            _this.$set(_this.ttuData, 5, response.data.data.result);
        });
    },
    findYwskMsgSql3(){
        const _this = this;
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType"); 
        // 获取类型
        const type = Taro.getStorageSync("showArea");

        if(type == 0){
            this.findYwskMsgSql3Jt();
            return false;
        }

        requestData({
            operServiceId: 'NewReportService',
            operId: type == 1 ? 'findYwskMsgSql3' : 'findYwskMsgSql3Quyu',
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }
            
            _this.$set(_this.ttdData, 0, response.data.data.result); 
        });
    },
    findYwskMsgSql3Jt(){
        setTimeout(() => {
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql3JtKhslYear','num', this.ttdData[0]);            
        }, 1);

        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql3JtKhslDay','bnum', this.ttdData[0]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql3JtKhslCpxhy','num', this.ttdData[0].detail[0]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql3JtKhslFcpxhy','num', this.ttdData[0].detail[1]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql3JtKhslFhy',2, this.ttdData[0].detail);
    },
    findYwskMsgSql4(){
        const _this = this;
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType"); 
        // 获取类型
        const type = Taro.getStorageSync("showArea");

        requestData({
            operServiceId: 'NewReportService',
            operId: type == 1 ? 'findYwskMsgSql4' : ( type == 0 ? 'findYwskMsgSql4Jt' : 'findYwskMsgSql4Quyu'),
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }
            
            _this.$set(_this.ttdData, 1, response.data.data.result); 
        });
    },
    findYwskMsgSql5(){
        const _this = this;
        // 获取缓存的id
        const companyId = Taro.getStorageSync("showType"); 
        // 获取类型
        const type = Taro.getStorageSync("showArea");

        if(type == 0){
            this.findYwskMsgSql5Jt();
            return false;
        }

        requestData({
            operServiceId: 'NewReportService',
            operId: type == 1 ? 'findYwskMsgSql5' : 'findYwskMsgSql5Quyu',
            data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }
            
            _this.$set(_this.ttdData, 2, response.data.data.result); 
        });
    },
    findYwskMsgSql5Jt(){
        setTimeout(() => {
            this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql5JtCzslYear','num', this.ttdData[2]);            
        }, 1);
        
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql5JtCzslDay','bnum', this.ttdData[2]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql5JtCzslZssl','num', this.ttdData[2].detail[0]);
        this.findYwskMsgSql1JtQueryAttr('findYwskMsgSql5JtCzslQtcgw','num', this.ttdData[2].detail[1]);
    }
  }
}
</script>
<style lang='scss' scoped>
</style>


