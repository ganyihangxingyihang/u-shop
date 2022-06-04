<template>
  <view>
    <!-- 选择收货地址区域 -->
    <view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址</button>
    </view>
    <!-- 收货信息地址 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">
            收货人：<text>{{address.userName}}</text>
          </view>
        </view>
        <view class="row1-right">
          <view class="phone">
            电话：<text>{{address.telNumber}}</text>
            <uni-icons type="arrowright" size="16"></uni-icons>
          </view>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">
          收货地址:
        </view>
        <view class="row2-right">
          {{addstr}}
        </view>
      </view>

      <!-- 底部边框线 -->
      <image src="../../static/cart_border@2x.png" class="address-border"></image>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {};
    },
    computed: {
      //收货地址
      ...mapState('m_user', ['address']),
      //详细地址
      ...mapState('m_user', ['addstr'])
    },
    methods: {
      //mutations里操作地址
      ...mapMutations('m_user', ['updateAddress']),
      // 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
      // 返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
      async chooseAddress() {
        const [err, suc] = await uni.chooseAddress().catch(err => err)

        if (err === null && suc.errMsg === 'chooseAddress:ok') {
          this.updateAddress(suc)
        }
        // 用户没有授权
        if (err && (err.errMsg === 'chooseAddress:fail auth deny'||err.errMsg === 'chooseAddress:fail authorize no response')) {
          this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
        }
      },
      //调用此方法重新发起收货地址授权
      async reAuth() {
        //弹出modal框，提示用户进行授权
        const [err2, confirmResult] = await uni.showModal({
          content: '检测到您没有打开地址权限，是否去设置打开?',
          confirmText: '确认',
          cancelText: '取消'
        })

        // 如果谈框异常,就return
        if (err2) return

        //点击取消
        if (confirmResult.cancel) return uni.$shouMsg('您取消了地址授权')

        //点击确认，调用uni.openSetting()重新进入授权页面
        if (confirmResult.confirm) return uni.openSetting({
          success: (settingResult) => {
            //地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            //地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  // 选择收货地址盒子
  .address-choose-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // 收货信息盒子
  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
  }

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap; //用来处理元素中的空白，使用wrap时连续的空白会被合并，换行无效。
    }
  }

  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }
</style>
