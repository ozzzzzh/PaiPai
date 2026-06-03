<template>
  <view class="prop-item" :class="{ selected: selected }" @click="handleToggle">
    <view class="image-wrap">
      <image class="prop-image" :src="data.image" mode="aspectFill" />
      <view class="check-mask" v-if="selected">
        <view class="check-icon"></view>
      </view>
    </view>

    <view class="prop-info">
      <text class="prop-name">{{ data.name }}</text>
      <text class="prop-price" v-if="data.price > 0">+¥{{ data.price }}</text>
      <text class="prop-price free" v-else>免费</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PropItem',
  props: {
    data: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleToggle() {
      this.$emit('toggle', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.prop-item {
  background: #FFFFFF;
  border: 2rpx solid #E5E5E5;
  border-radius: 16rpx;
  overflow: hidden;
  transition: all 0.2s ease;

  &:active {
    background: #F8F8F8;
  }

  &.selected {
    border-color: #1A1A1A;

    .image-wrap {
      .check-mask {
        opacity: 1;
      }
    }
  }

  .image-wrap {
    position: relative;
    width: 100%;
    padding-top: 100%;

    .prop-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #F0F0F0;
    }

    .check-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;

      .check-icon {
        width: 48rpx;
        height: 48rpx;
        background: #FFFFFF;
        border-radius: 50%;

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 14rpx;
          height: 24rpx;
          border: 4rpx solid #1A1A1A;
          border-top: none;
          border-left: none;
          transform: translate(-50%, -60%) rotate(45deg);
        }
      }
    }
  }

  .prop-info {
    padding: 16rpx;
    text-align: center;

    .prop-name {
      display: block;
      font-size: 24rpx;
      color: #1A1A1A;
      margin-bottom: 4rpx;
    }

    .prop-price {
      font-size: 20rpx;
      color: #999999;

      &.free {
        color: #666666;
      }
    }
  }
}
</style>
