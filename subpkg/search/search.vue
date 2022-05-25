<template>
  <view>
    <view class="search-box">
      <!-- 使用uni-ui提供的搜索组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
   
    <!-- 搜索推荐列表 -->
    <view class="seach-recommend" v-if="searchResults.length!==0">
      <view class="search-recommend-item" v-for="(item,i) in searchResults" :key="i"
        @click="gotoGoodDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="searchHistory-box" v-else>
      <view class="searchHistory-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <view class="searchHistory-list">
        <uni-tag :text="item" v-for="(item,i) in renderHitory" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的timerId
        timer: null,
        // 搜索关键词
        kw: '',
        // 保存搜索结果列表
        searchResults: [],
        //搜索历史列表
        searchHistoryList: []
      };
    },
    computed: {
      //渲染在页面上的浏览历史记录
      renderHitory() {
        if (this.searchHistoryList.length <= 10) {
          return this.searchHistoryList
        } else {
          return this.searchHistoryList.splice(0, 10)
          this.searchHistoryList = this.searchHistoryList.splice(0, 10)
        }
      }

    },
    onLoad(){
      //加载本地存储的搜索历史记录
      this.searchHistoryList = JSON.parse(uni.getStorageSync('kw')||'[]')
    },
    methods: {
      input(e) {
        // 清除timer对应的延时器
        clearTimeout(this.timer)
        //重新启动一个延时器
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchResults()
        }, 500)
      },
      // 获取搜索推荐列表
      async getSearchResults() {
        if (!this.kw) return this.searchResults = []
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg('数据获取失败!')
        this.searchResults = res.message
      },
      // 点击搜索推荐item跳转到商品详情
      gotoGoodDetail(goods_id) {
        //如果本地没有这个搜索历史，就添加，有则不添加
        if (!this.searchHistoryList.includes(this.kw)) {
          this.searchHistoryList.unshift(this.kw)
        }
        // 将搜索历史记录持久化到本地存储 uni.setStorageSync(key,value)
        uni.setStorageSync('kw',JSON.stringify(this.searchHistoryList))
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      //点击按钮清除搜索记录
      cleanHistory(){
        //清空data中的数据
        this.searchHistoryList = []
        //清空本地存储的数据
        uni.setStorageSync('kw','[]')
      },
      // 点击搜索历史跳转到商品列表页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url:'//subpkg/goods_list/goods_list?query='+item
        })
      }
    },

  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
    background-color: #c00000;
  }

  // 搜索推荐样式
  .seach-recommend {
    padding: 0 5px;

    .search-recommend-item {
      display: flex;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      align-items: center;
      justify-content: space-between;
    }

    .goods-name {
      //文字不允许换行
      white-space: nowrap;
      margin-right: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .searchHistory-box {
    padding: 0 5px;
    
    .searchHistory-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
      
      .searchHistory-list{
        display: flex;
        flex-wrap: wrap;
        
        uni-tag {
          margin-top: 5px;
          margin-right: 5px;
          }
      }
    }
  }
  // 搜索历史样式
  
</style>
