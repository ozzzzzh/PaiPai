<template>
  <view class="page">
    <!-- 照片堆叠区域 -->
    <view class="photo-display-layer">
      <view
        v-for="(photo, index) in stackedPhotos"
        :key="photo.id"
        class="stacked-photo"
        :style="{
          transform: 'translateY(' + photo.ty + 'rpx) rotate(' + photo.rotate + 'deg)',
          opacity: photo.opacity,
          transition: photo.transition,
          zIndex: index + 1
        }"
        @click="expandPhotos"
      >
        <view class="photo-card">
          <image class="photo-image" :src="photo.image" mode="widthFix" />
        </view>
      </view>
    </view>

    <!-- 相机层 -->
    <view class="camera-layer">
      <view class="camera-container" :class="{ shooting: isShooting }">
        <image class="camera-image" src="/static/img/camera.jpg" mode="widthFix" />

        <!-- 快门按钮 -->
        <view class="shutter-indicator" :class="{ pulsing: !hasStarted }" @click="takePhoto">
          <view class="indicator-ring"></view>
          <view class="indicator-ring outer"></view>
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
            <view class="swiper-item">
              <view class="photo-card large">
                <image class="photo-image" :src="photo.image" mode="widthFix" />
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
  </view>
</template>

<script>
import { portfolio } from '@/data/portfolio.js'

export default {
  data() {
    return {
      portfolio: portfolio.map(p => ({ ...p, rotate: (Math.random() - 0.5) * 6 })),
      stackedPhotos: [],
      isShooting: false,
      hasStarted: false,
      isExpanded: false,
      currentIndex: 0
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
      const stackOffset = -this.stackedPhotos.length * 10

      // 步骤1: 添加照片在相机后面位置，无动画
      this.stackedPhotos.push({
        ...nextPhoto,
        ty: 600,        // 从相机后面开始（相机高度663rpx）
        opacity: 0,
        transition: 'none'
      })

      // 步骤2: 等待DOM渲染完成
      await this.$nextTick()
      await this.delay(100)

      // 步骤3: 触发滑动动画
      const idx = this.stackedPhotos.length - 1
      this.$set(this.stackedPhotos[idx], 'ty', stackOffset)
      this.$set(this.stackedPhotos[idx], 'opacity', 1)
      this.$set(this.stackedPhotos[idx], 'transition', 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s')

      await this.delay(1100)
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
    delay(ms) { return new Promise(r => setTimeout(r, ms)) }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF9F0 0%, #F8F4EF 100%);
}

/* ═══════════ 照片显示区域 ═══════════ */
.photo-display-layer {
  position: fixed;
  bottom: 700rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 360rpx;
  z-index: 400;
}

/* 堆叠的照片 */
.stacked-photo {
  position: absolute;
  bottom: 0;
  left: 0;
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

  &.large {
    width: 624rpx;  /* 520 × 1.2 = 624 */
    padding: 20rpx;
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
    top: 39.6%;         /* 40% - 0.4% */
    left: 14.6%;        /* 14.4% + 0.2% */
    width: 120rpx;
    height: 120rpx;
    transform: translate(-50%, -50%);  /* 让中心点对准目标位置 */

    .indicator-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);  /* 居中于父元素 */
      width: 90rpx;
      height: 90rpx;
      border: 4rpx solid #87CEEB;  /* 天空蓝 */
      border-radius: 50%;
    }

    .indicator-ring.outer {
      width: 120rpx;
      height: 120rpx;
      border: 2rpx solid rgba(135, 206, 235, 0.5);  /* 天空蓝半透明 */
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
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
  height: 864rpx;  /* 720 × 1.2 = 864 */
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
</style>
