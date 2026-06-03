<template>
  <view class="package-card" :class="{ selected: selected }" @click="handleSelect">
    <view class="card-header">
      <view class="name">{{ data.name }}</view>
      <view class="price" v-if="data.price">
        <text class="symbol">¥</text>
        <text class="amount">{{ data.price }}</text>
        <text class="unit" v-if="data.priceUnit">{{ data.priceUnit }}</text>
      </view>
      <view class="price-btn" v-else @click.stop="showContact">
        <text>{{ data.priceText || '详谈' }}</text>
      </view>
    </view>

    <view class="card-desc">{{ data.desc }}</view>

    <view class="card-features">
      <view class="feature" v-for="(item, index) in data.scenes" :key="index">
        <view class="dot"></view>
        <text>{{ item }}</text>
      </view>
    </view>

    <view class="card-footer">
      <text class="photos">{{ data.photos }}张精修</text>
    </view>

    <!-- 陪拍套餐的时长和人数选择 -->
    <view class="extra-options" v-if="data.id === 4 && selected">
      <view class="option-row">
        <text class="option-label">时长</text>
        <view class="option-counter">
          <view class="counter-btn" @click.stop="decreaseDuration">-</view>
          <text class="counter-value">{{ duration }}小时</text>
          <view class="counter-btn" @click.stop="increaseDuration">+</view>
        </view>
      </view>
      <view class="option-row">
        <text class="option-label">人数</text>
        <view class="option-counter">
          <view class="counter-btn" @click.stop="decreasePerson">-</view>
          <text class="counter-value">{{ personCount }}人</text>
          <view class="counter-btn" @click.stop="increasePerson">+</view>
        </view>
        <text class="extra-fee" v-if="personCount > 1">+¥{{ (personCount - 1) * 50 }}</text>
      </view>
      <view class="subtotal">
        <text class="subtotal-label">小计</text>
        <text class="subtotal-price">¥{{ calculatePrice }}</text>
      </view>
    </view>

    <view class="popular-tag" v-if="data.popular">热门</view>
    <view class="check-icon" v-if="selected && data.id !== 4"></view>
  </view>
</template>

<script>
import { contactInfo } from '@/data/packages.js'

export default {
  name: 'PackageCard',
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
  data() {
    return {
      duration: 2,
      personCount: 1
    }
  },
  computed: {
    calculatePrice() {
      if (this.data.id === 4) {
        // 陪拍: 129 * 时长 + (人数-1) * 50
        return this.data.price * this.duration + (this.personCount - 1) * 50
      }
      return this.data.price || 0
    }
  },
  methods: {
    handleSelect() {
      // 宿舍集体套餐点击详谈按钮时不触发选择
      if (this.data.needContact && !this.data.price) {
        return
      }

      this.$emit('select', {
        ...this.data,
        duration: this.data.id === 4 ? this.duration : this.data.duration,
        personCount: this.personCount,
        totalPrice: this.calculatePrice
      })
    },
    showContact() {
      uni.showModal({
        title: '联系客服',
        content: `微信号: ${contactInfo.wechat}\n${contactInfo.tip}`,
        confirmText: '复制微信',
        success: (res) => {
          if (res.confirm) {
            uni.setClipboardData({
              data: contactInfo.wechat,
              success: () => {
                uni.showToast({
                  title: '已复制',
                  icon: 'success'
                })
              }
            })
          }
        }
      })
    },
    decreaseDuration() {
      if (this.duration > this.data.minDuration) {
        this.duration--
        this.emitUpdate()
      }
    },
    increaseDuration() {
      if (this.duration < 8) {
        this.duration++
        this.emitUpdate()
      }
    },
    decreasePerson() {
      if (this.personCount > 1) {
        this.personCount--
        this.emitUpdate()
      }
    },
    increasePerson() {
      if (this.personCount < 10) {
        this.personCount++
        this.emitUpdate()
      }
    },
    emitUpdate() {
      this.$emit('update', {
        ...this.data,
        duration: this.duration,
        personCount: this.personCount,
        totalPrice: this.calculatePrice
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.package-card {
  position: relative;
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

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16rpx;

    .name {
      font-size: 32rpx;
      font-weight: 600;
      color: #1A1A1A;
    }

    .price {
      color: #1A1A1A;

      .symbol {
        font-size: 24rpx;
        font-weight: 500;
      }

      .amount {
        font-size: 40rpx;
        font-weight: 700;
      }

      .unit {
        font-size: 24rpx;
        color: #999999;
        margin-left: 4rpx;
      }
    }

    .price-btn {
      background: #1A1A1A;
      color: #FFFFFF;
      font-size: 26rpx;
      padding: 12rpx 24rpx;
      border-radius: 8rpx;
    }
  }

  .card-desc {
    font-size: 24rpx;
    color: #999999;
    margin-bottom: 24rpx;
  }

  .card-features {
    margin-bottom: 24rpx;

    .feature {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .dot {
        width: 8rpx;
        height: 8rpx;
        background: #1A1A1A;
        border-radius: 50%;
        margin-right: 12rpx;
      }

      text {
        font-size: 24rpx;
        color: #666666;
      }
    }
  }

  .card-footer {
    display: flex;
    gap: 32rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #E5E5E5;

    text {
      font-size: 24rpx;
      color: #999999;
    }
  }

  .extra-options {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #E5E5E5;

    .option-row {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .option-label {
        width: 80rpx;
        font-size: 26rpx;
        color: #1A1A1A;
      }

      .option-counter {
        display: flex;
        align-items: center;
        background: #F8F8F8;
        border-radius: 12rpx;
        padding: 8rpx 16rpx;

        .counter-btn {
          width: 48rpx;
          height: 48rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          color: #1A1A1A;
          font-weight: 500;

          &:active {
            opacity: 0.6;
          }
        }

        .counter-value {
          min-width: 80rpx;
          text-align: center;
          font-size: 26rpx;
          color: #1A1A1A;
          font-weight: 600;
        }
      }

      .extra-fee {
        font-size: 24rpx;
        color: #FF4D4F;
        margin-left: 16rpx;
      }
    }

    .subtotal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16rpx;
      margin-top: 8rpx;
      border-top: 1rpx solid #E5E5E5;

      .subtotal-label {
        font-size: 26rpx;
        color: #666666;
      }

      .subtotal-price {
        font-size: 36rpx;
        font-weight: 700;
        color: #1A1A1A;
      }
    }
  }

  .popular-tag {
    position: absolute;
    top: 0;
    right: 24rpx;
    background: #1A1A1A;
    color: #FFFFFF;
    font-size: 20rpx;
    padding: 8rpx 16rpx;
    border-radius: 0 0 8rpx 8rpx;
  }

  .check-icon {
    position: absolute;
    bottom: 32rpx;
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