<template>
  <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content">
      <view class="navbar-left" @click="goBack" v-if="showBack">
        <view class="back-icon"></view>
      </view>
      <view class="navbar-title">{{ title }}</view>
      <view class="navbar-right"></view>
    </view>
  </view>
  <view class="navbar-placeholder" :style="{ height: navBarHeight + 'px' }"></view>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      statusBarHeight: 0,
      navBarHeight: 44
    }
  },
  created() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 20
    this.navBarHeight = this.statusBarHeight + 44
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #FFFFFF;

  .navbar-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
  }

  .navbar-left,
  .navbar-right {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-icon {
    width: 24rpx;
    height: 24rpx;
    border-left: 4rpx solid #1A1A1A;
    border-bottom: 4rpx solid #1A1A1A;
    transform: rotate(45deg);
  }

  .navbar-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1A1A1A;
    letter-spacing: 1rpx;
  }
}

.navbar-placeholder {
  width: 100%;
}
</style>
