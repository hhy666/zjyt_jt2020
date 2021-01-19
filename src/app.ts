import Vue from 'vue'
import './app.scss'
// import '../src/pages/util/loading'

// 跳转到2021的连接
// export const goto2021Url = "http://192.168.130.70:8081/";
export const goto2021Url = "http://rpt-1.ccic.com:8080/";

const App = new Vue({
  onShow(options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
