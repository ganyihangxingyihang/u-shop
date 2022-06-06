<template>
  <view class="login-container">
    <!-- 提示登录图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <!-- open-type属性表示当点击按钮时，可以获取用户的基本信息，可以从getuserinfo事件的处理函数的形参中获得用户的基本信息 -->
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">
      登录后尽享更多权益
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed:{
      ...mapState('m_user',['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo','updateToken','updateRedirectInfo']),
      // 获取微信用户基本信息
      getUserInfo(e) {
        // 判断是否获取用户信息
        if (!e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权!')

        // 获取用户信息成功就进行下一步操作,存储信息到vuex
        this.updateUserInfo(e.detail.userInfo)
        //获取登录成功之后的Token字符串
        this.getToken(e.detail)
      },
      //登录接口调用，获取永久token
      async getToken(info) {
        //调用微信d登陆接口
        const [err, res] = await uni.login().catch(err => err)

        //判断uni.login()是否调用成功
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败!')

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        // 换取token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        //这里因为没有授权所以会返回400，可以模拟一个token
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败!')
        // 更新vuex中的token,这是一个可用的token
        this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
        // 登录后返回登录前的页面
        this.navigateBack()
      },
      //返回登录前的页面
      navigateBack(){
        if(this.redirectInfo&&this.redirectInfo.openType==='switchTab'){
          // 进行页面导航,返回到之前的页面地址
          uni.switchTab({
            url:this.redirectInfo.from,
            // 导航成功后将对象重置为null
            complete:()=>{
              uni.$showMsg('登录成功')
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40px;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    //登录按钮样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    //按钮下方消息提示样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
