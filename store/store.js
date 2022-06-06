import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车vuex模块
import moduleCart from './cart.js'
import moduleUser from './user.js'

// 通过全局方法使用插件
Vue.use(Vuex)

const store = new Vuex.Store({
  // 按模块拆分
  modules:{
    // 挂载购物车模块，模块内成员的访问路径被重调整为m_cart
    m_cart:moduleCart,
    //用户模块
    m_user:moduleUser,
  }
})

export default store