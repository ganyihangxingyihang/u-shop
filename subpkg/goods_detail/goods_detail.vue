<template>
  <!-- //数据请求回来才显示页面 -->
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- //商品详情轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">
        {{goods_info.goods_price}}
      </view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">
          {{goods_info.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">
        快递：免运费
      </view>
    </view>


    <!-- 商品导航组件 -->
    <view class="goods-nav">
      <!-- fill配置按钮是否平铺 -->
      <!-- options配置左侧按钮，buttonGroup配置右侧按钮 -->
      <!-- click配置左侧按钮点击事件，buttonClick配置右侧按钮点击事件 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
    </view>
    <!-- 商品详情 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  import {mapMutations} from 'vuex'
  import {mapGetters} from 'vuex'
  
  export default {
    onLoad(options) {
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 左侧按钮配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 2
        }],
        // 右侧按钮配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    computed:{
      //调用mapState方法，把m_cart模块的cart数组映射到当前页面中，作为计算属性使用
      //...mapState('模块的名称',[‘要映射的数据名称1’,'要映射的数据名称2'])
      ...mapState('m_cart',['cart']),
      ...mapGetters('m_cart',['total'])
    },
    //侦听器
    watch:{
      total:{
        // 监听total值变化
        handler(newval) {
          const findResult = this.options.find(x=>x.text==='购物车')
          if(findResult) {
            // 为购物车数量图标赋新值
            findResult.info = newval
          }
        },
        //声明本侦听器在页面初次加载完毕后立即调用
        immediate:true
      }
      
    },
    methods: {
      //获取商品详情数据
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg('数据获取失败!')
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题  正则替换。再将图片格式替换为jpg
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
          .replace(/webp/g, 'jpg')
        this.goods_info = res.message
      },
      // 点击轮播图图片进行图片预览
      preview(i) {
        uni.previewImage({
          // 预览时,默认显示图片的索引
          current: i,
          //利用数组的映射方法获得所有图片的url地址数组
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      
      // 商品导航栏左侧按钮点击事件
      onClick(e){
        if(e.content.text==='购物车'){
         uni.switchTab({
           url:'/pages/cart/cart'
         })
        }
      },
      
      //通过mapmutations把m_cart模块中的addToCart映射到当前页面使用
      ...mapMutations('m_cart',['addToCart']),
      
      //右侧按钮的点击事件处理函数
      buttonClick(e){
        if(e.content.text==='加入购物车'){
          // 组织一个商品的信息对象
                const goods = {
                   goods_id: this.goods_info.goods_id,       // 商品的Id
                   goods_name: this.goods_info.goods_name,   // 商品的名称
                   goods_price: this.goods_info.goods_price, // 商品的价格
                   goods_count: 1,                           // 商品的数量
                   goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
                   goods_state: true                         // 商品的勾选状态
                }
          
                // 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
                this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  .goods-detail-container{
    // 防止拉到最底部商品导航栏覆盖部分内容
    padding-bottom: 50px;
  }
  
  //轮播图样式
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  //商品信息样式
  .goods-info-box {
    padding: 10px 0 10px 0;
    
    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding: 10px;
      }

      // 收藏
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #efefef;
        color: gray;
      }
    }

    //运费
    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }
  
  .goods-nav{
    position: fixed;  
    index:999;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
