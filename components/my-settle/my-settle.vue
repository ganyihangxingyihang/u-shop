<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label for="radio">
      <radio color="#c00000" :checked="isFullCheck" @click="changeAllState"/><text>全选</text>
    </label>
    
    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">¥{{checkedGoodsAmount}}</text>
    </view>
    
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">
      结算{{checkedCount}}
    </view>
  </view>
</template>

<script>
  import {mapGetters,mapMutations,mapState} from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 跳转倒计时秒数
      seconds:2,
      //定时器id
      timer:null
      };
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      //引入addstr详细地址
      ...mapGetters('m_user',['addstr']),
      ...mapState('m_user',['token']),
      ...mapState('m_cart',['cart']),
      isFullCheck(){
        return this.total===this.checkedCount
      }
    },
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      // 更新重定向信息
      ...mapMutations('m_user',['updateRedirectInfo']),
      //改变全选状态
      changeAllState(){
        this.updateAllGoodsState(!this.isFullCheck)
      },
      //点击结算按钮
      settlement(){
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')
        if(!this.addstr) return uni.$showMsg('请选择收货地址!')
        
        //若没有登录，则调用delayNavigate()进行倒计时跳转导航
        if(!this.token) return this.delayNavigate()
        //进行微信支付
        this.payOrder()
      },
      
      // 跳转倒计时导航
      delayNavigate(){
        this.seconds = 2
        // 展示提示消息
        this.showTips(this.seconds)
        
        //创建定时器让seconds减
      this.timer=  setInterval(()=>{
          this.seconds--
          // seconds到0就清除定时器
          if(this.seconds<=0) {
            clearInterval(this.timer)
            
            // 跳转到my页面
            uni.switchTab({
              url:'../../pages/my/my',
              success:()=>{
                this.updateRedirectInfo({
                  openType:'switchTab',
                  from:'/pages/cart/cart'
                })
              }
            })        
            return
          }      
          this.showTips(this.seconds)
        },1000)
      },
      
      // 点击结算,展示提示消息并倒计时
      showTips(n){
        uni.showToast({
          icon:'icon',
          title:'请登录后再结算!'+n+'秒后自动跳转到登录页面',
          //为页面添加透明遮罩
          mask:true,
          // 1.5s后自动消失，duration持续时间
          duration:1500
        })
      },
      
      //1.创建订单
   async payOrder(){
        const orderInfo={
          // 开发期间写死价格,注释掉真实价格
          // order_price:this.checkedGoodsAmount
          order_price:0.01,
          // 收货人地址
          consignee_addr:this.addstr,
          goods:this.cart.filter(x=>x.goods_state).map(x=>({goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price}))
        }
        //发起请求创建订单
        const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        if(res.meta.status!==200) return uni.$showMsg('创建订单失败！')
        // 获得订单编号
        const orderNumber = res.message.order_number
        console.log(orderNumber)
        
        // 2.订单与支付
          // 2. 订单预支付
          // 2.1 发起请求获取订单的支付信息
          const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
          // 2.2 预付订单生成失败
          if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
          // 2.3 得到订单支付相关的必要参数
          const payInfo = res2.message.pay
          
          //发起微信支付
          // 调用uni.requestPayment()发起微信支付
          const [err,succ] = await uni.requestPayment(payInfo)
          // 未完成支付
          if(err) return uni.$showMsg('订单未支付！')
          // 完成支付,进一步查询支付结果
          const {data:res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
          // 查询支付结果
          if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
          //检测到支付完成
          uni.showToast({
            title:'支付完成',
            icon:'success'
          })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    // 底部固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    // 设置背景样式
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;
    
    .radio{
      display: flex;
      align-items: center;
    }
    
    .amount {
      color: #c00000;
    }
    
    .btn-settle{
      height: 50px;
      min-width: 100px;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
