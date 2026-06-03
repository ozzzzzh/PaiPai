<template>
  <view class="photographer-card" :class="{ selected: selected }" @click="handleSelect">
    <image class="avatar" :src="data.avatar" mode="aspectFill" />

    <view class="info">
      <view class="name-row">
        <text class="name">{{ data.name }}</text>
        <view class="rating">
          <text class="star">★</text>
          <text>{{ data.rating }}</text>
        </view>
      </view>

      <view class="styles">
        <text class="style-tag" v-for="(style, index) in data.styles" :key="index">
          {{ style }}
        </text>
      </view>

      <view class="bio">{{ data.bio }}</view>

      <view class="works">{{ data.works }} 作品</view>
    </view>

    <view class="check-icon" v-if="selected"></view>
  </view>
</template>

<script>
export default {
  name: 'PhotographerCard',
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
    handleSelect() {
      this.$emit('select', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.photographer-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  background: #FFFFFF;
  border: 2rpx solid #E5E5E5;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  transition: all 0.2s ease;

  &:active {
    background: #F8F8F8;
  }

  &.selected {
    border-color: #1A1A1A;
    background: #FAFAFA;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 24rpx;
    background: #F0F0F0;
  }

  .info {
    flex: 1;
    min-width: 0;

    .name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .name {
        font-size: 32rpx;
        font-weight: 600;
        color: #1A1A1A;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4rpx;
        font-size: 24rpx;
        color: #999999;

        .star {
          color: #1A1A1A;
        }
      }
    }

    .styles {
      display: flex;
      gap: 12rpx;
      margin-bottom: 12rpx;
      flex-wrap: wrap;

      .style-tag {
        font-size: 20rpx;
        color: #666666;
        background: #F0F0F0;
        padding: 6rpx 16rpx;
        border-radius: 8rpx;
      }
    }

    .bio {
      font-size: 24rpx;
      color: #999999;
      margin-bottom: 8rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .works {
      font-size: 22rpx;
      color: #CCCCCC;
    }
  }

  .check-icon {
    position: absolute;
    top: 32rpx;
    right: 32rpx;
    width: 40rpx;
    height: 40rpx;
    background: #1A1A1A;
    border-radius: 50%;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12rpx;
      height: 20rpx;
      border: 4rpx solid #FFFFFF;
      border-top: none;
      border-left: none;
      transform: translate(-50%, -60%) rotate(45deg);
    }
  }
}
</style>
