<template>
  <view>
    <view class="search-box">
      <my-search @click = "gotoSearch"></my-search>
    </view>
    <view class="scroll-view-container">
      <!-- 左侧滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height:wh+'px'}">
        <block v-for="(item, i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">
            / {{item2.cat_name}} /
          </view>
          <view class="cate-lv2-list">
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <image :src="item3.cat_icon"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {

    data() {
      return {
        cateList: [],
        // 动态计算剩余窗口的高度
        wh: 0,
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        // 滚动条距离顶部的距离
        scrollTop:0
      }
    },
    onLoad() {
      this.getCateList()
      //获取当前系统信息
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight-50
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg('数据获取失败!')
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(i) {
        this.active = i
        this.cateLevel2 = this.cateList[i].children
        this.scrollTop = this.scrollTop?0:1
      },
      // 点击三级分类跳转到对应商品页面
      gotoGoodsList(item3){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      // 跳转到分包中的搜索页面
      gotoSearch(){
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  // 搜索框样式
  .search-box{
    // 设置定位效果为吸顶
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .scroll-view-container {
    display: flex;
  }

  .left-scroll-view {
    width: 120px;
  }

  .left-scroll-view-item {
    line-height: 60px;
    background-color: #f7f7f7;
    text-align: center;
    font-size: 12px;

    // 激活项的样式
    &.active {
      background-color: #fff;
      position: relative;

      // 渲染激活项左侧红线
      &::before {
        content: '';
        display: block;
        width: 3px;
        height: 30px;
        background-color: #c00000;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv2-list {
    display: flex;
    flex-wrap: wrap;
    
    .cate-lv3-item{
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      image{
        width: 60px;
        height: 60px;
      }
      text{
        font-style: 12px;
      }
    }
  }
</style>
