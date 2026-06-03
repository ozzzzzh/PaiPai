<template>
  <view class="bottom-button safe-area-bottom">
    <view class="button-content">
      <view class="info" v-if="info">
        <text class="label">{{ info.label }}</text>
        <text class="value">{{ info.value }}</text>
      </view>
      <button class="btn" :disabled="disabled" @click="handleClick">
        {{ text }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BottomButton',
  props: {
    text: {
      type: String,
      default: '下一步'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1rpx solid #E5E5E5;
  z-index: 100;

  .button-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 32rpx;
    gap: 24rpx;

    .info {
      flex: 1;

      .label {
        display: block;
        font-size: 22rpx;
        color: #999999;
        margin-bottom: 4rpx;
      }

      .value {
        font-size: 32rpx;
        font-weight: 700;
        color: #1A1A1A;
      }
    }

    .btn {
      min-width: 240rpx;
      height: 88rpx;
      background: #1A1A1A;
      color: #FFFFFF;
      font-size: 28rpx;
      font-weight: 500;
      border: none;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:active:not([disabled]) {
        opacity: 0.8;
        transform: scale(0.98);
      }

      &[disabled] {
        background: #E5E5E5;
        color: #999999;
      }
    }
  }
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
