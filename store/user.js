export default{
  //开启命名空间
  namespaced:true,
  
  //state
  state:{
    address:JSON.parse(uni.getStorageSync('address')||'{}')
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