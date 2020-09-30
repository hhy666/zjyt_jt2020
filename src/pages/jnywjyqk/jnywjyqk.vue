<template>
  <view class='kuang'>
      <view class="circle_bg_kuang" :style="{marginTop: mt+'Px'}" >
          <view class="cbk_title" >
            <text class="cbk_title_main" >{{main}}</text>    
          </view>
          <text class="loading" v-if="loading" >数据加载中</text>
          <!-- 业务收入 -->
          <view class="inner_kuang fdr bb pd20 mt10" >
            <view class="fx33 fdc" v-if="ywsr.left != undefined" >
                <view class="yyv_up" >
                    <text class="yyv_up_num" >{{ywsr.left.num}}</text>
                    <text class="yyv_up_unit" >{{ywsr.left.unit}}</text>
                </view>
                <text class="yyv_down mtb10" >{{ywsr.left.word}}</text>
                <view class="yyv_bottom" >
                    <text class="yyv_bottom_word" >{{ywsr.left.bword}}</text>
                    <text class="yyv_bottom_num" >{{ywsr.left.bnum}}</text>
                </view>
            </view>
            <view class="fx60 fdc jcfs" >
               <view class="fx100 jcfs" v-for="(im, idx) in ywsr.right" :key="idx" >
                    <text class="yyvl_body_word" >{{im.word}}</text>
                    <text class="yyv_up_num fs20" >{{im.num}}</text>
                    <text class="yyv_up_unit" >{{im.unit}}</text>
                </view>
            </view>
          </view>
          <!-- 业务成本 -->
          <view class="inner_kuang fdr mb20 mt10" >
            <view class="fx33 fdc" v-if="ywsr.left != undefined" >
                <view class="yyv_up" >
                    <text class="yyv_up_num" >{{ywcb.left.num}}</text>
                    <text class="yyv_up_unit" >{{ywcb.left.unit}}</text>
                </view>
                <text class="yyv_down mtb10" >{{ywcb.left.word}}</text>
                <view class="yyv_bottom" >
                    <text class="yyv_bottom_word" >{{ywcb.left.bword}}</text>
                    <text class="yyv_bottom_num" >{{ywcb.left.bnum}}</text>
                </view>
            </view>
            <view class="fx33 fdc" >
                <view class="fx100 jcfs" v-for="(im, idx) in ywcb.mid" :key="idx" >
                    <text class="yyvl_body_word" >{{im.word}}</text>
                    <text class="yyv_up_num fs20" >{{im.num}}</text>
                    <text class="yyv_up_unit" >{{im.unit}}</text>
                </view>
            </view>
            <view class="fx33 fdc" >
                <view class="yyv_bottom w100" v-for="(im, idx) in ywcb.right" :key="idx" >
                    <text class="yyv_bottom_word lh32 fs15 wsnw" >{{im.bword}}</text>
                    <text class="yyv_bottom_num lh32 fs15 wsnw" >{{im.bnum}}</text>
                </view>
            </view>
          </view>
      </view>
  </view>
</template>

<script>
import '../jnjyqk/jnjyqk.scss'
import './jnywjyqk.scss'
import Taro from '@tarojs/taro'
import requestData from '../util/request'

export default {
  name: 'jnywjyqk',
  data(){
    return {
        main:"今年业务经营情况",
        ywsr:{},
        ywcb:{},
        loading:false
    }
  },
  props:{
      mt:Number
  },
  components: {},
  created(){
      this.ywsr = {
          left:{
              num:0,
              unit:"",
              word:"收入总额",
              bword:"今日",
              bnum:"+0"
          },
          right:[
              {word:"产品线业务收入", num:0, unit:""},
              {word:"非产品线业务收入", num:0, unit:""},
              {word:"待分类业务收入", num:0, unit:""},
              {word:"其他业务收入", num:0, unit:""}
          ]
      };

      this.ywcb = {
          left:{
              num:0,
              unit:"",
              word:"业务成本",
              bword:"今日",
              bnum:"+0"
          },
          mid:[
              {word:"直接成本", num:0, unit:""},
              {word:"间接成本", num:0, unit:""}
          ],
          right:[
              {bword:"今日", bnum:"+0"},
              {bword:"今日", bnum:"+0"}
          ]
      };

      // 获取类型
      const type = Taro.getStorageSync("showArea");

      if(type == 0){
        this.initData('findYyjyqk');
      }else if(type == 1){
        this.initData('findYyjyqkJtgs');
      }else if(type == 3){
        this.initData('findYyjyqkJtgsQuyu');
      }  
  },
  mounted(){},
  methods: {
    initData(id){
        // 收入总额 年 数量
        this.initYwsrYear(id+'YhSrzeYear', 'num', this.ywsr.left);
        // 收入总额 今日 数量
        this.initYwsrYear(id+'YhSrzeDay', 'bnum', this.ywsr.left);
        // 收入总额 产品线业务收入 数量
        this.initYwsrYear(id+'YhSrzeCpxywsr', 'num', this.ywsr.right[0]);
        // 收入总额 非产品线业务收入 数量
        this.initYwsrYear(id+'YhSrzeFcpxywsr', 'num', this.ywsr.right[1]);
        // 收入总额 待分类业务收入 数量
        this.initYwsrYear(id+'YhSrzeDflywsr', 'num', this.ywsr.right[2]);
        // 收入总额 其他业务收入 数量
        this.initYwsrYear(id+'YhSrzeQtywsr', 'num', this.ywsr.right[3]);
        // 业务成本 年 数量
        this.initYwsrYear(id+'YhYwcbYear', 'num', this.ywcb.left);
        // 业务成本 今日 数量
        this.initYwsrYear(id+'YhYwcbDay', 'bnum', this.ywcb.left);
        // 业务成本 直接成本 数量
        this.initYwsrYear(id+'YhYwcbZjcb', 'num', this.ywcb.mid[0]);
        // 业务成本 间接成本 数量
        this.initYwsrYear(id+'YhYwcbJjcb', 'num', this.ywcb.mid[1]);
        // 业务成本 直接成本 今日 数量
        this.initYwsrYear(id+'YhYwcbZjcbDay', 'bnum', this.ywcb.right[0]);
        // 业务成本 间接成本 今日 数量
        this.initYwsrYear(id+'YhYwcbJjcbDay', 'bnum', this.ywcb.right[1]);

    },
    initYwsrYear(operId, sx, parent){
        const _this = this;
        // 获取缓存的id 
        const companyId = Taro.getStorageSync("showType");

        requestData({
          operServiceId: 'NewReportService',
          operId: operId,
          data: {companyId: companyId}
        },response => {
            if(response.data.data == null || response.data.data.result == null){
                // alert("系统错误!");
                return false;
            }

            _this.$set(parent, sx, response.data.data.result);
        });
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
