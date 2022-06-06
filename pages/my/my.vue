<template>
  <view class="my-container">
    <!-- 用户未登录时显示 -->
    <my-login v-if="!token"></my-login>
    <!-- 用户登录时显示 -->
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import badgeMix from '@/mixin/tabbar-badge.js'
  import {mapState} from 'vuex'
  export default {
     mixins: [badgeMix],
    data() {
      return {
        
      }
    },
    methods: {
      
    },
    computed:{
      ...mapState('m_user',['token'])
    }
  }
</script>

<style>
.my-container{
  height: 100%;
}
</style>
