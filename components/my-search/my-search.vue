<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchHandler">
    <view class="my-search-box" :style="{'border-radius':radius+'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    data() {
      return {
      
      };
    },
    props:{
      //自定义背景属性
      bgcolor:{
        type:String,
        default:'#c00000'
      },
      // 自定义圆角尺寸
      radius:{
        type:Number,
        default:18
      }
    },
    methods:{
      searchHandler(){
        //出发外界通过@click绑定的click事件处理函数
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    // background-color: #c00000;改由props属性控制
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;

    .my-search-box {
      height: 36px;
      background-color: #ffffff;
      // border-radius: 15px;改由props属性控制
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
