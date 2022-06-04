export default {
  //为当前模块开启命名空间
  namespaced: true,

  //模块state数据,和data类似
  state: {
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  },

  //模块的mutations方法，用来修改state和getters里面的数据
  mutations: {
    //将商品信息加入购物车
    addToCart(state, goods) {
      //根据提交的商品Id，查询购物车是否存在该商品
      //如果不存在，则findResult为undefined，否则为查找到的商品信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      //通过commit方法调用m_cart命名空间下的saveToLocalStorage方法
      this.commit('m_cart/saveToLocalStorage')
    },

    // 将数据存储在本地
    saveToLocalStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },

    //更新购物车商品勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToLocalStorage')
      }
    },

    //更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        // 更新商品数量
        findResult.goods_count = goods.goods_count
        console.log(findResult);
        // 持久化存储到本地
        this.commit('m_cart/saveToLocalStorage')
      }
    },

    // 删除购物车商品信息
    removeGoodsById(state, goods_id) {
      // 把想要移除的商品从cart中删除
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToLocalStorage')
    },

    //更新所有商品选中状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToLocalStorage')
    }
  },

  //模块的getters属性，和计算属性类似
  getters: {
    //统计购物车中商品总数
    total(state) {
      let c = 0
      if (state.cart) {
        state.cart.forEach(goods => c += goods.goods_count)
      }
      return c
    },
    //统计勾选的商品数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state)
      .reduce((total, item) => total += item.goods_count, 0)
    },
    //统计勾选商品的总价格
    checkedGoodsAmount(state) {
     return state.cart.filter(x => x.goods_state)
      .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
      .toFixed(2)
      
    }
  },

}
