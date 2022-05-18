<template>
  <view>
    <view class="nav-list">
        <view class="nav-item" v-for="(item,i) in navList" :key="i">
          <image :src="item.image_src" class="nav-img"></image>
        </view>
    </view>
  </view>
</template>

<script>
  export default {
   
    data() {
      return {
        navList:[]
      }
    },
    onLoad(){
     
    },
    methods: {
    
    }
  }
</script>

<style>

</style>
