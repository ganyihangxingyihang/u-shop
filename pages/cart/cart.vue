<template>
  <view>
    <!-- 地址 -->
    <my-address></my-address>
    <view class="cart-conatiner" v-if="cart.length!==0">
      <!-- 购物车商品列表标题区域 -->
      <view class="cart-title">
        <!-- 左侧图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 描述文本 -->
        <text class="cart-title-text">购物车</text>>
      </view>
      <!-- 商品列表区域 -->
      <uni-swipe-action>
        <block v-for="(good,i) in cart" :key="i">
          <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(good)">
            <my-goods :goods="good" :showRadio="true" @radio-change="radioChangeHandler" :showNum="true"
              @num-change="numberChangeHandler"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>

      <!-- 结算区域 -->
      <my-settle></my-settle>
    </view>

    <!-- 空购物车区域 -->
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也</text>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import badgeMix from '@/mixin/tabbar-badge.js'
  import mySettle from '../../components/my-settle/my-settle.vue'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        // swipe-action-item配置项
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      }
    },
    components: {
      mySettle
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      radioChangeHandler(e) {
        this.updateGoodsState(e)
      },
      //swipe-action点击事件
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods.goods_id)
      },
      //商品数量变化
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      }
    }
  }
</script>

<style lang="scss">
  .cart-conatiner {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }
  }


  //空购物车样式
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
