<template>
  <view>
    <view class="goods-list">
      <view v-for="(item,i) in goodsList" :key="i" @click="gotoDetail(item)">
        <my-goods :item="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    data() {
      return {
        // 定义的请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类id
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表
        goodsList: [],
        //商品总数
        total: 0,
        // 定义节流阀flag,判断是否正在请求数据
        isloading: false
      };
    },
    methods: {
      async getGoodsList(cb) {
        this.isloading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isloading = false
        // 短路运算符判断有回调函数就执行
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg('数据获取失败')
        //通过展开运算符对新返回的数据与老数据进行拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 触地事件处理函数
    onReachBottom() {
      // 判断是否加载完毕
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('到底了')
      // 如果正在请求数据,是的话不发起额外重复请求
      if (this.isloading) return
      //让页码自增加一
      this.queryObj.pagenum += 1
      //重新获取数据列表
      this.getGoodsList()
    },
    //下拉刷新事件
    onPullDownRefresh() {
      //重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      //重新发起请求
      this.getGoodsList(() => {
        //小程序不会自动结束下拉刷新，所以要在刷新完成后用回调函数结束
        uni.stopPullDownRefresh()
      })
    }
  }
</script>

<style lang="scss">

</style>
