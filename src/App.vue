<script>
export default {
  onLaunch() {
    // 检查是否有旧的预约状态，如果没有则初始化
    const booking = uni.getStorageSync('booking_state')
    if (!booking) {
      uni.setStorageSync('booking_state', {
        packageId: null,
        packageName: '',
        packagePrice: 0,
        packageDuration: 2,
        fixedDuration: true,
        personCount: 1,
        extraPersonFee: 0,
        photographerId: null,
        photographerName: '',
        scheduleDate: '',
        scheduleTime: '',
        scheduleEndTime: '',
        slotId: null,
        props: []
      })
    }
  }
}
</script>

<style lang="scss">
@import './uni.scss';

page {
  background: $color-bg;
  font-family: $font-family;
  color: $color-text;
  font-size: $font-size-base;
  line-height: $line-height-base;
}

/* 极简按钮样式 */
.btn-primary {
  background: $color-black;
  color: $color-bg;
  border: none;
  border-radius: $radius-md;
  padding: $spacing-md $spacing-lg;
  font-size: $font-size-base;
  font-weight: 500;
  transition: $transition-base;

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.btn-secondary {
  background: $color-bg;
  color: $color-black;
  border: 2rpx solid $color-black;
  border-radius: $radius-md;
  padding: $spacing-md $spacing-lg;
  font-size: $font-size-base;
  font-weight: 500;
  transition: $transition-base;

  &:active {
    background: $color-bg-secondary;
  }
}

/* 卡片容器 */
.card {
  background: $color-bg;
  border-radius: $radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
}

/* 分割线 */
.divider {
  height: 1rpx;
  background: $color-border;
  margin: $spacing-md 0;
}

/* 安全区域 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
