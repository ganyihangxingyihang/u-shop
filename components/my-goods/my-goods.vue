<template>
    <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
            <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"></radio>
            <image :src="goods.goods_small_logo ||defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <view class="goods-name">
              {{goods.goods_name}}
            </view>
            <view class="goods-info-box">
              <view class="goods-price">
                ¥{{goods.goods_price | tofixed}}
              </view>
              <!-- 商品数量 -->
              <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numberChangeHandler"></uni-number-box>
            </view>
          </view>
    </view>
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      goods:{
        type:Object,
        default:{}
      },
      //是否展示图片左边的radio
      showRadio:{
        type:Boolean,
        default:false
      },
      //是否展示数量组件
      showNum:{
        type:Boolean,
        default:false
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
    },
    methods:{
      // radio组件点击事件函数
      radioClickHandler(){
          this.$emit('radio-change',{
            // 通过this.$emit触发外界@绑定的自定义事件
            //同时把id和state传给自定义事件处理函数
            goods_id:this.goods.goods_id,
            goods_state:!this.goods.goods_state
          })
      },
      // num-box点击事件
      numberChangeHandler(val){
        this.$emit('num-change',{
          // 商品的 Id
                goods_id: this.goods.goods_id,
                // 商品的最新数量
                goods_count: +val
        })
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  display: flex;
  box-sizing: border-box;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  
  .goods-item-left{
    display: flex;
    margin-right: 5px;
    justify-content: space-between;
    align-items: center;
    
    .goods-pic{
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  
  .goods-item-right{
    display: flex;
    flex: 1;//flex由三个属性构成，flex:1为简写
    flex-direction: column;
    justify-content: space-between;
    
    .goods-name{
      font-size: 13px;
    }
    
    .goods-info-box{
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .goods-price{
        font-size: 16px;
        color: #c00000;
      }
    }
    
    .goods-price{
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>