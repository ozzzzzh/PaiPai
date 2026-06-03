<template>
  <view class="page">
    <view class="hero">
      <swiper
        class="hero-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#FFFFFF"
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image class="hero-image" :src="banner.image" mode="aspectFill" />
        </swiper-item>
      </swiper>
      <view class="hero-overlay"></view>
      <view class="hero-content">
        <text class="hero-year">2026</text>
        <text class="hero-title">毕业季</text>
        <text class="hero-subtitle">青春不散场 · 定格最好时光</text>
      </view>
    </view>

    <view class="entrance-section">
      <view class="section-title">开始你的预约</view>

      <view class="entrance-list">
        <view class="entrance-item" v-for="(item, index) in entrances" :key="index" @click="navigateTo(item.path)">
          <view class="entrance-icon">
            <text>{{ item.icon }}</text>
          </view>
          <view class="entrance-info">
            <text class="entrance-name">{{ item.name }}</text>
            <text class="entrance-desc">{{ item.desc }}</text>
          </view>
          <view class="entrance-arrow"></view>
        </view>
      </view>
    </view>

    <view class="bottom-section safe-area-bottom">
      <button class="book-btn" @click="startBooking">立即预约</button>
      <text class="tip">已有 328 位同学预约</text>
    </view>
  </view>
</template>

<script>
import { getBooking } from '@/store/booking.js'

export default {
  data() {
    return {
      banners: [
        { image: 'https://picsum.photos/id/429/750/1000', title: '校园风光' },
        { image: 'https://picsum.photos/id/1015/750/1000', title: '学士服' },
        { image: 'https://picsum.photos/id/1043/750/1000', title: '操场欢笑' },
        { image: 'https://picsum.photos/id/177/750/1000', title: '天台夕阳' },
      ],
      entrances: [
        { name: '选择套餐', desc: '单人照、情侣照、集体照', icon: '✦', path: '/pages/packages/packages' },
        { name: '选择时间', desc: '预约拍摄时间段', icon: '⏰', path: '/pages/schedule/schedule' },
        { name: '选择摄影师', desc: '找到最懂你的拍摄者', icon: '◈', path: '/pages/photographer/list' },
        { name: '选择道具', desc: '服装、道具、场景', icon: '◇', path: '/pages/props/props' }
      ]
    }
  },
  onShow() {
    const booking = getBooking()
    if (booking.packageId) {
      // 如果已有预约信息,可以显示进度
    }
  },
  methods: {
    navigateTo(path) {
      uni.navigateTo({ url: path })
    },
    startBooking() {
      uni.navigateTo({ url: '/pages/packages/packages' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #FFFFFF;
}

.hero {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;

  .hero-swiper {
    width: 100%;
    height: 100%;
  }

  .hero-image {
    width: 100%;
    height: 100%;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
    z-index: 1;
  }

  .hero-content {
    position: absolute;
    bottom: 80rpx;
    left: 48rpx;
    right: 48rpx;
    color: #FFFFFF;
    z-index: 2;

    .hero-year {
      display: block;
      font-size: 28rpx;
      font-weight: 500;
      letter-spacing: 8rpx;
      opacity: 0.8;
      margin-bottom: 16rpx;
    }

    .hero-title {
      display: block;
      font-size: 88rpx;
      font-weight: 700;
      letter-spacing: 16rpx;
      margin-bottom: 16rpx;
    }

    .hero-subtitle {
      display: block;
      font-size: 28rpx;
      letter-spacing: 4rpx;
      opacity: 0.9;
    }
  }
}

.entrance-section {
  padding: 48rpx 32rpx;
  padding-bottom: 240rpx;  // 留出底部按钮空间

  .section-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 32rpx;
    letter-spacing: 2rpx;
  }

  .entrance-list {
    .entrance-item {
      display: flex;
      align-items: center;
      padding: 32rpx 24rpx;
      background: #FFFFFF;
      border: 2rpx solid #E5E5E5;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      transition: all 0.2s ease;

      &:active {
        background: #F8F8F8;
      }

      .entrance-icon {
        width: 80rpx;
        height: 80rpx;
        background: #F0F0F0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;

        text {
          font-size: 32rpx;
          color: #1A1A1A;
        }
      }

      .entrance-info {
        flex: 1;

        .entrance-name {
          display: block;
          font-size: 30rpx;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 8rpx;
        }

        .entrance-desc {
          display: block;
          font-size: 24rpx;
          color: #999999;
        }
      }

      .entrance-arrow {
        width: 24rpx;
        height: 24rpx;
        border-right: 4rpx solid #CCCCCC;
        border-bottom: 4rpx solid #CCCCCC;
        transform: rotate(-45deg);
      }
    }
  }
}

.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background: #FFFFFF;
  border-top: 1rpx solid #E5E5E5;

  .book-btn {
    width: 100%;
    height: 96rpx;
    background: #1A1A1A;
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 600;
    border: none;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }
  }

  .tip {
    display: block;
    text-align: center;
    font-size: 22rpx;
    color: #999999;
    margin-top: 16rpx;
  }
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
