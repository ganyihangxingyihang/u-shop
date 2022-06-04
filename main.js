import App from './App'
import {$http} from '@escook/request-miniprogram'
import store from './store/store.js'
  
//将导入的http挂载到uni顶级对象上。
uni.$http = $http

//配置请求跟路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'

//请求之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({
    title:'数据加载中...',
  })
}

//请求完成之后做一些事情
$http.afterRequest = function(){
  uni.hideLoading()
}

//封装消息提示（toast）方法，将其挂在到uni对象上
uni.$showMsg= function (title = msg,duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    //将store挂在到Vue实例上
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

