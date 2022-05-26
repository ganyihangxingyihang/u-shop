<template>
    <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
            <image :src="item.goods_small_logo ||defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <view class="goods-name">
              {{item.goods_name}}
            </view>
            <view class="goods-price">
              ¥{{item.goods_price | tofixed}}
            </view>
          </view>
    </view>
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      item:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
        //定义商品列表的默认图片，在图片不存在时加载
           defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters:{
      tofixed(num) {
        return Number(num).toFixed(2) //把数字转化为字符串，结果的小数点后有指定位数的数字
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  
  .goods-item-left{
    margin-right: 5px;
    
    .goods-pic{
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  
  .goods-item-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .goods-name{
      font-size: 13px;
    }
    
    .goods-price{
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>