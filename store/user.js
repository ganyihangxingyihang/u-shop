export default{
  //开启命名空间
  namespaced:true,
  
  //state
  state:{
    address:JSON.parse(uni.getStorageSync('address')||'{}'),
    //登录之后服务器返回的token字符串
    token:uni.getStorageSync('token')||'',
    userinfo:JSON.parse(uni.getStorageSync('userinfo')||'{}'),
    //登录后重定向的object对象{openType,from}
    redirectInfo:null
  },
  
  //方法
  mutations:{
    // 更新收货地址
    updateAddress(state,address){
      state.address = address
      // 通过this.commit的方法，调用m_cart模块下的saveAddressToStorage方法存储address到本地
      this.commit('m_user/saveAddressToStorage')
    },
    //将address持久化存储到本地
    saveAddressToStorage(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
    },
    // 更新用户基本信息
    updateUserInfo(state,userinfo){
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 将用户信息持久护存储到本地
    saveUserInfoToStorage(state){
      uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
    },
    //更新Token字符串
    updateToken(state,token){
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    //持久化存储token
    saveTokenToStorage(state){
      uni.setStorageSync('token',state.token)
    },
    //更新重定向的信息对象
    updateRedirectInfo(state,info){
      state.redirectInfo = info
    }
  },
  
  //数据包装
  getters:{
    addstr(state){
      if(!state.address.provinceName) return ''
      
      //返回拼接出的详细地址字符串
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}