<template>
  <view class="page">
    <!-- 照片展示区域 -->
    <view class="photo-display-area">
      <!-- 已推出的照片堆叠 -->
      <view
        v-if="!isExpanded && stackedPhotos.length > 0"
        class="photo-stack"
        @click="expandPhotos"
      >
        <view
          v-for="(photo, index) in stackedPhotos"
          :key="photo.id"
          class="stacked-photo"
          :style="{ '--rotate': photo.rotate + 'deg', 'z-index': index + 1 }"
        >
          <view class="photo-card">
            <image class="photo-image" :src="photo.image" mode="widthFix" />
            <view class="photo-bottom">
              <text class="photo-title">{{ photo.title }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-hint" v-if="stackedPhotos.length === 0 && !ejectingPhoto">
        <text>点击快门查看作品</text>
      </view>

      <!-- 展开状态 -->
      <view v-if="isExpanded" class="photos-expanded">
        <view class="collapse-btn" @click="collapsePhotos">
          <text>收起</text>
        </view>
        <swiper class="photos-swiper" :current="currentIndex" @change="onSwiperChange">
          <swiper-item v-for="(photo, index) in stackedPhotos" :key="photo.id">
            <view class="swiper-photo-item" @click="openPreview(index)">
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
      </view>
    </view>

    <!-- 相机区域 -->
    <view class="camera-section">
      <!-- 出片口 - 照片上边缘从这里出现 -->
      <view class="eject-slot">
        <!-- 遮罩：只显示出片口以上的部分 -->
        <view class="eject-mask">
          <!-- 正在推出的照片 -->
          <view v-if="ejectingPhoto" class="ejecting-photo">
            <view class="photo-card">
              <image class="photo-image" :src="ejectingPhoto.image" mode="widthFix" />
              <view class="photo-bottom">
                <text class="photo-title">{{ ejectingPhoto.title }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 相机图片 -->
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

      // 获取下一张照片
      const nextPhoto = this.portfolio[this.stackedPhotos.length]

      // 开始推出
      this.ejectingPhoto = nextPhoto

      // 等待推出动画完成
      await this.delay(1800)

      // 推出完成，添加到堆叠
      this.stackedPhotos.push(nextPhoto)

      // 清除推出状态
      this.ejectingPhoto = null
      this.isShooting = false
    },

    expandPhotos() {
      if (this.stackedPhotos.length > 0) {
        this.isExpanded = true
        this.currentIndex = this.stackedPhotos.length - 1
      }
    },

    collapsePhotos() {
      this.isExpanded = false
    },

    onSwiperChange(e) {
      this.currentIndex = e.detail.current
    },

    openPreview(index) {
      this.previewIndex = index
      this.showPreview = true
    },

    closePreview() {
      this.showPreview = false
    },

    onPreviewChange(e) {
      this.previewIndex = e.detail.current
    },

    delay(ms) {
      return new Promise(r => setTimeout(r, ms))
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F8F4EF;
}

/* 照片展示区域 */
.photo-display-area {
  position: fixed;
  top: 32rpx;
  left: 32rpx;
  right: 32rpx;
  bottom: 320rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20rpx;
}

.photo-stack {
  position: relative;
  width: 360rpx;
}

.stacked-photo {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: rotate(var(--rotate));
}

.photo-card {
  width: 360rpx;
  background: #FFF;
  padding: 16rpx 16rpx 48rpx;
  border-radius: 4rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);

  .photo-image { width: 100%; display: block; }
  .photo-bottom {
    padding-top: 12rpx;
    text-align: center;
    .photo-title { font-size: 26rpx; color: #333; }
  }

  &.large { width: 500rpx; }
}

.empty-hint {
  text-align: center;
  padding-top: 80rpx;
  text { font-size: 26rpx; color: #BBB; }
}

.photos-expanded {
  width: 100%;
  height: 100%;
  position: relative;

  .collapse-btn {
    position: absolute;
    top: 0; right: 0;
    padding: 8rpx 16rpx;
    background: rgba(0,0,0,0.05);
    border-radius: 16rpx;
    text { font-size: 22rpx; color: #888; }
  }
}

.photos-swiper { height: 600rpx; padding-top: 32rpx; }
.swiper-photo-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-indicator {
  display: flex;
  justify-content: center;
  gap: 8rpx;
  margin-top: 24rpx;
  .indicator-dot {
    width: 8rpx; height: 8rpx;
    background: #DDD;
    border-radius: 50%;
    &.active { width: 24rpx; background: #333; border-radius: 4rpx; }
  }
}

/* 相机区域 */
.camera-section {
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to top, #F0EBE3, transparent);
  padding-bottom: 16rpx;
}

// 出片口 - 照片上边缘从这里出现
.eject-slot {
  position: relative;
  width: 360rpx;
  height: 400rpx;  // 出片口向上延伸的高度
}

// 遮罩：隐藏相机内部的部分，只显示出片口以上的内容
.eject-mask {
  position: absolute;
  bottom: 0;  // 遮罩底部对齐出片口（相机上边缘）
  left: 0;
  width: 100%;
  height: 400rpx;
  overflow: hidden;  // 关键：隐藏超出部分
}

// 正在推出的照片
.ejecting-photo {
  position: absolute;
  // 关键：照片底部对齐遮罩底部（出片口位置）
  // 这样照片上边缘会先出现在出片口，然后整体向上
  bottom: 0;
  left: 0;
  width: 360rpx;
  // 向上推：从 translateY(0) 到 translateY(-照片高度)
  animation: pushUp 1.8s ease-out forwards;
}

// 照片从出片口向上推出的动画
// 初始：照片底部对齐出片口，上边缘刚出现
// 最终：照片整体向上移动，完全推出
@keyframes pushUp {
  0% {
    transform: translateY(0);
    // 照片上边缘刚出现在出片口
  }
  100% {
    // 照片完全推出，整体向上移动400rpx
    transform: translateY(-400rpx);
  }
}

// 相机容器
.camera-container {
  position: relative;
  width: 720rpx;
  margin-top: -10rpx;  // 紧贴出片口

  &.shooting { transform: scale(0.98); }

  .camera-image { width: 100%; display: block; }

  .shutter-indicator {
    position: absolute;
    top: 28%; left: 10%;
    width: 160rpx; height: 160rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .indicator-ring {
      position: absolute;
      width: 120rpx; height: 120rpx;
      border: 5rpx solid #FF4757;
      border-radius: 50%;
    }
    .indicator-ring.outer {
      width: 160rpx; height: 160rpx;
      border: 3rpx solid rgba(255,71,87,0.3);
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  .shutter-hint {
    position: absolute;
    top: 10%; left: -80rpx;
    background: #FF4757;
    padding: 10rpx 16rpx;
    border-radius: 8rpx;
    text { font-size: 22rpx; color: #FFF; }
    &::after {
      content: '';
      position: absolute;
      right: -10rpx; top: 50%;
      transform: translateY(-50%);
      border-left: 10rpx solid #FF4757;
      border-top: 6rpx solid transparent;
      border-bottom: 6rpx solid transparent;
    }
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.photo-counter {
  margin-top: 12rpx;
  text { font-size: 24rpx; color: #999; }
}

/* 预览 */
.preview-popup {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.95);
  z-index: 1000;
}

.preview-swiper { width: 100%; height: 70vh; margin-top: 15vh; }
.preview-item { display: flex; justify-content: center; align-items: center; }
.preview-image { width: 90%; height: 100%; }

.preview-close {
  position: absolute;
  top: 60rpx; right: 32rpx;
  width: 60rpx; height: 60rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  text { color: #FFF; font-size: 28rpx; }
}
</style>