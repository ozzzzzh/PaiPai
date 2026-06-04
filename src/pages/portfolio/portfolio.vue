<template>
  <view class="page">
    <!-- 照片显示区域（在相机上方，只显示已完全推出的照片） -->
    <view class="photo-display-layer">
      <!-- 已推出的照片堆叠 -->
      <view
        v-for="photo in stackedPhotos"
        :key="photo.id"
        class="stacked-photo"
        :style="{ '--rotate': photo.rotate + 'deg' }"
        @click="expandPhotos"
      >
        <view class="photo-card">
          <image class="photo-image" :src="photo.image" mode="widthFix" />
          <view class="photo-bottom">
            <text class="photo-title">{{ photo.title }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 推出动画区域（被相机遮挡，只显示超过相机的部分） -->
    <view class="photo-eject-layer" v-if="ejectingPhoto">
      <view class="ejecting-photo">
        <view class="photo-card">
          <image class="photo-image" :src="ejectingPhoto.image" mode="widthFix" />
          <view class="photo-bottom">
            <text class="photo-title">{{ ejectingPhoto.title }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 相机层（z-index 最高，覆盖推出动画区域） -->
    <view class="camera-layer">
      <view class="camera-container" :class="{ shooting: isShooting }">
        <image class="camera-image" src="/static/img/camera.jpg" mode="widthFix" />

        <!-- 快门按钮 -->
        <view class="shutter-indicator" :class="{ pulsing: !hasStarted }" @click="takePhoto">
          <view class="indicator-ring"></view>
          <view class="indicator-ring outer"></view>
        </view>
        <view class="shutter-hint" v-if="!hasStarted">
          <text>点这里</text>
        </view>
      </view>

      <!-- 计数 -->
      <view class="photo-counter" v-if="hasStarted">
        <text>{{ stackedPhotos.length }} / {{ portfolio.length }}</text>
      </view>
    </view>

    <!-- 展开视图 -->
    <view v-if="isExpanded" class="expanded-view" @click="collapsePhotos">
      <view class="expanded-content" @click.stop>
        <swiper class="expanded-swiper" :current="currentIndex" @change="onSwiperChange">
          <swiper-item v-for="(photo, index) in stackedPhotos" :key="photo.id">
            <view class="swiper-item" @click="openPreview(index)">
              <view class="photo-card large">
                <image class="photo-image" :src="photo.image" mode="widthFix" />
                <view class="photo-bottom">
                  <text class="photo-title">{{ photo.title }}</text>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="swiper-indicator">
          <view v-for="(photo, index) in stackedPhotos" :key="photo.id"
            class="indicator-dot" :class="{ active: index === currentIndex }"></view>
        </view>
        <view class="collapse-btn" @click="collapsePhotos">
          <text>收起</text>
        </view>
      </view>
    </view>

    <!-- 预览 -->
    <view v-if="showPreview" class="preview-popup" @click="closePreview">
      <swiper class="preview-swiper" :current="previewIndex" @change="onPreviewChange">
        <swiper-item v-for="photo in stackedPhotos" :key="photo.id">
          <view class="preview-item">
            <image class="preview-image" :src="photo.image" mode="aspectFit" />
          </view>
        </swiper-item>
      </swiper>
      <view class="preview-close"><text>✕</text></view>
    </view>
  </view>
</template>

<script>
import { portfolio } from '@/data/portfolio.js'

export default {
  data() {
    return {
      portfolio: portfolio.map(p => ({ ...p, rotate: (Math.random() - 0.5) * 6 })),
      stackedPhotos: [],
      ejectingPhoto: null,
      isShooting: false,
      hasStarted: false,
      isExpanded: false,
      currentIndex: 0,
      showPreview: false,
      previewIndex: 0
    }
  },
  methods: {
    async takePhoto() {
      if (this.isShooting || this.stackedPhotos.length >= this.portfolio.length) return

      if (this.isExpanded) {
        this.isExpanded = false
        await this.delay(200)
      }

      this.hasStarted = true
      this.isShooting = true

      const nextPhoto = this.portfolio[this.stackedPhotos.length]
      this.ejectingPhoto = nextPhoto

      await this.delay(1000)

      this.stackedPhotos.push(nextPhoto)
      this.ejectingPhoto = null
      this.isShooting = false
    },

    expandPhotos() {
      if (this.stackedPhotos.length > 0) {
        this.isExpanded = true
        this.currentIndex = this.stackedPhotos.length - 1
      }
    },

    collapsePhotos() { this.isExpanded = false },
    onSwiperChange(e) { this.currentIndex = e.detail.current },
    openPreview(index) { this.previewIndex = index; this.showPreview = true },
    closePreview() { this.showPreview = false },
    onPreviewChange(e) { this.previewIndex = e.detail.current },
    delay(ms) { return new Promise(r => setTimeout(r, ms)) }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF9F0 0%, #F8F4EF 100%);
}

/* ═══════════ 照片显示区域（弹出照片的最终停留位置） ═══════════ */
.photo-display-layer {
  position: fixed;
  bottom: 700rpx;  /* 与动画结束位置一致：663(相机高度) + 40(间距) - 照片超出部分 ≈ 700 */
  left: 50%;
  transform: translateX(-50%);
  width: 360rpx;
  z-index: 400;  /* 最底层，被弹出动画和相机覆盖 */
}

/* 堆叠的照片 */
.stacked-photo {
  position: absolute;
  bottom: 0;
  left: 0;
}

.stacked-photo:nth-child(1) { transform: translateY(0) rotate(var(--rotate)); z-index: 1; }
.stacked-photo:nth-child(2) { transform: translateY(-10rpx) rotate(var(--rotate)); z-index: 2; }
.stacked-photo:nth-child(3) { transform: translateY(-20rpx) rotate(var(--rotate)); z-index: 3; }
.stacked-photo:nth-child(4) { transform: translateY(-30rpx) rotate(var(--rotate)); z-index: 4; }
.stacked-photo:nth-child(5) { transform: translateY(-40rpx) rotate(var(--rotate)); z-index: 5; }
.stacked-photo:nth-child(6) { transform: translateY(-50rpx) rotate(var(--rotate)); z-index: 6; }
.stacked-photo:nth-child(7) { transform: translateY(-60rpx) rotate(var(--rotate)); z-index: 7; }
.stacked-photo:nth-child(8) { transform: translateY(-70rpx) rotate(var(--rotate)); z-index: 8; }
.stacked-photo:nth-child(9) { transform: translateY(-80rpx) rotate(var(--rotate)); z-index: 9; }
.stacked-photo:nth-child(10) { transform: translateY(-90rpx) rotate(var(--rotate)); z-index: 10; }
.stacked-photo:nth-child(11) { transform: translateY(-100rpx) rotate(var(--rotate)); z-index: 11; }

/* ═══════════ 推出动画区域 ═══════════ */
.photo-eject-layer {
  position: fixed;
  top: calc(100vh - 663rpx);  /* 照片上边缘对齐相机上边缘（相机高度663rpx） */
  left: 50%;
  transform: translateX(-50%);
  width: 360rpx;
  z-index: 500;  /* 低于相机(1000)，高于堆叠照片(400) */
}

.ejecting-photo {
  animation: slideUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideUp {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(-490rpx);  /* 照片高度约450rpx + 40rpx间距，自然停下 */
  }
}

/* 照片卡片 */
.photo-card {
  width: 360rpx;
  background: #FFF;
  padding: 14rpx 14rpx 44rpx;
  border-radius: 4rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.1);

  .photo-image {
    width: 100%;
    display: block;
  }

  .photo-bottom {
    padding-top: 10rpx;
    text-align: center;

    .photo-title {
      font-size: 24rpx;
      color: #333;
    }
  }

  &.large {
    width: 520rpx;
    padding: 18rpx 18rpx 52rpx;
  }
}

/* ═══════════ 相机层（z-index 最高，遮挡弹出动画） ═══════════ */
.camera-layer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;  /* 最高层，遮挡弹出动画 */
  background: transparent;
  padding-bottom: 16rpx;
}

.camera-container {
  position: relative;
  width: 582rpx;  /* 放大150%: 388 * 1.5 = 582 */

  &.shooting {
    transform: scale(0.98);
  }

  .camera-image {
    width: 100%;
    display: block;
  }

  .shutter-indicator {
    position: absolute;
    top: 28%;
    left: 10%;
    width: 120rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .indicator-ring {
      position: absolute;
      width: 90rpx;
      height: 90rpx;
      border: 4rpx solid #FF4757;
      border-radius: 50%;
    }

    .indicator-ring.outer {
      width: 120rpx;
      height: 120rpx;
      border: 2rpx solid rgba(255,71,87,0.3);
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  .shutter-hint {
    position: absolute;
    top: 10%;
    left: -70rpx;
    background: #FF4757;
    padding: 8rpx 14rpx;
    border-radius: 6rpx;

    text {
      font-size: 20rpx;
      color: #FFF;
    }

    &::after {
      content: '';
      position: absolute;
      right: -8rpx;
      top: 50%;
      transform: translateY(-50%);
      border-left: 8rpx solid #FF4757;
      border-top: 5rpx solid transparent;
      border-bottom: 5rpx solid transparent;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.photo-counter {
  margin-top: 10rpx;

  text {
    font-size: 22rpx;
    color: #999;
  }
}

/* ═══════════ 展开视图 ═══════════ */
.expanded-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expanded-content {
  width: 92%;
  max-width: 680rpx;
}

.expanded-swiper {
  height: 720rpx;
}

.swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-indicator {
  display: flex;
  justify-content: center;
  gap: 10rpx;
  margin-top: 24rpx;

  .indicator-dot {
    width: 10rpx;
    height: 10rpx;
    background: rgba(255,255,255,0.5);
    border-radius: 50%;

    &.active {
      width: 28rpx;
      background: #FFF;
      border-radius: 4rpx;
    }
  }
}

.collapse-btn {
  display: flex;
  justify-content: center;
  margin-top: 28rpx;

  text {
    font-size: 26rpx;
    color: #FFF;
  }
}

/* ═══════════ 预览 ═══════════ */
.preview-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  z-index: 3000;
}

.preview-swiper {
  width: 100%;
  height: 70vh;
  margin-top: 15vh;
}

.preview-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  width: 90%;
  height: 100%;
}

.preview-close {
  position: absolute;
  top: 60rpx;
  right: 32rpx;
  width: 56rpx;
  height: 56rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  text {
    color: #FFF;
    font-size: 26rpx;
  }
}
</style>
