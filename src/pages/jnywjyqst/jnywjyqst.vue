<template>
  <view class='kuang'>
    <view
      class="circle_bg_kuang"
      :style="{marginTop: mt+'Px'}"
    >
      <view class="cbk_title">
        <text class="cbk_title_main">{{main}}</text>
      </view>
      <view class="chart">
        <view
          class="chart_body"
          :style="{height: (ht+50)+'Px'}"
        >
          <chart :option="dbOption" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import "../yytb/yytb.scss";
import Taro from "@tarojs/taro";
import requestData from "../util/request";
import chart from "../chart/chart";

export default {
  name: "jnywjyqst",
  data() {
    return {
      main: "2020年业务经营趋势图",
      dbOption: null,
    };
  },
  props: {
    mt: Number,
    ht: Number,
  },
  components: {
    chart: chart,
  },
  created() {
    this.initDbOption();
  },
  mounted() {},
  methods: {
    initDbOption() {
      const _this = this;

      // 获取缓存的id
      const companyId = Taro.getStorageSync("showType");
      // 获取type
      const type = Taro.getStorageSync("showArea");
      // 请求的服务方法名
      let operId;

      switch (parseInt(type)) {
        case 0:
          operId = "findYwjyqstZj";
          break;
        case 1:
          operId = "findYwjyqstGs";
          break;
        case 3:
          operId = "findYwjyqstQyGs";
          break;
      }

      requestData(
        {
          operServiceId: "NewReport2020Service",
          operId: operId,
          data: { companyId: companyId },
        },
        (response) => {
          if (response.error) {
            _this.dbOption = {
              error: true,
              msg: response.error,
            };

            return false;
          }

          const option = response.data.data;

          const legendData = [];

          legendData.push({ name: "业务收入总额", icon: "rect" });
          legendData.push({ name: "业务成本总额", icon: "rect" });
          legendData.push({
            name: "业务收入总额环比",
            icon:
              "path://M10,10 L19,10 L19,12 L10,12 M,20,11 a3,3 0 1,0 6,0 a3,3 0 1, 0 -6, 0 M27,10 L36,10 L36,12 L27,12Z",
          });
          legendData.push({
            name: "业务成本总额环比",
            icon:
              "path://M10,10 L19,10 L19,12 L10,12 M,20,11 a3,3 0 1,0 6,0 a3,3 0 1, 0 -6, 0 M27,10 L36,10 L36,12 L27,12Z",
          });

          _this.dbOption = {
            color: ["#F07879", "#3377FF", "#F07879", "#3377FF"],
            tooltip: {
              triggrt: "x",
              position: [30, 40],
              formatter: function (params) {
                let srze = _this.dbOption.series[0].data[params.dataIndex];
                let cbze = _this.dbOption.series[1].data[params.dataIndex];
                let srhb = _this.dbOption.series[2].data[params.dataIndex];
                let cbhb = _this.dbOption.series[3].data[params.dataIndex];
                let str = params.name + "\n";
                str +=
                  _this.dbOption.series[0].name +
                  " : " +
                  (srze > 100000000
                    ? parseFloat(srze / 100000000).toFixed(2) + "亿"
                    : srze > 10000
                    ? parseInt(srze / 10000) + "万"
                    : srze) +
                  " \n ";

                str +=
                  _this.dbOption.series[1].name +
                  " : " +
                  (cbze > 100000000
                    ? parseFloat(cbze / 100000000).toFixed(2) + "亿"
                    : cbze > 10000
                    ? parseInt(cbze / 10000) + "万"
                    : cbze) +
                  " \n";

                str +=
                  _this.dbOption.series[2].name + " : " + srhb + "%" + " \n";

                str += _this.dbOption.series[2].name + " : " + cbhb + "%";

                return str;
              },
              extraCssText: "width:190px; white-space:pre-wrap; color:#fff;",
            },
            legend: [
              {
                height: 20,
                top: 0,
                width: "80%",
                itemWidth: 20,
                itemHeight: 8,
                data: legendData,
              },
            ],
            grid: [
              {
                left: 45,
                right: 45,
                top: 70,
                bottom: 100,
                height: "75%",
              },
            ],
            xAxis: [
              {
                type: "category",
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  fontSize: 10,
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                data: option.xAxisData,
              },
            ],
            yAxis: [
              {
                position: "left",
                min: option.yAxis[0].min,
                max: option.yAxis[0].max,
                axisLabel: {
                  fontSize: 10,
                  margin: 10,
                  formatter: function (value) {
                    const val = Math.abs(value),
                      zf = value > 0 ? 1 : -1;
                    return val > 100000000
                      ? parseFloat(val / 100000000).toFixed(2) * zf + "亿"
                      : val > 10000
                      ? parseInt(val / 10000) * zf + "万"
                      : val * zf;
                  },
                },
                splitLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                boundaryGap: 300,
              },
              {
                position: "right",
                min: option.yAxis[1].min,
                max: option.yAxis[1].max,
                axisLabel: {
                  fontSize: 10,
                  formatter: "{value}%",
                },
                splitLine: {
                  lineStyle: {
                    color: ["#eee"],
                  },
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                boundaryGap: 300,
              },
            ],
            series: [
              {
                name: legendData[0].name,
                type: "bar",
                barGap: "10%",
                symbol: "rect",
                symbolSize: 8,
                data: option.seriesData[0],
              },
              {
                name: legendData[1].name,
                type: "bar",
                barGap: "10%",
                symbol: "rect",
                symbolSize: 8,
                data: option.seriesData[2],
              },
              {
                name: legendData[2].name,
                type: "line",
                yAxisIndex: 1,
                symbol: "circle",
                symbolSize: 8,
                label: { show: true, formatter: "{c}%" },
                data: option.seriesData[1],
              },
              {
                name: legendData[3].name,
                type: "line",
                yAxisIndex: 1,
                symbol: "circle",
                symbolSize: 8,
                label: { show: true, formatter: "{c}%" },
                data: option.seriesData[3],
              },
            ],
          };
        }
      );
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
