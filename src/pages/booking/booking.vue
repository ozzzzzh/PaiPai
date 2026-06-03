<template>
  <view class="page">
    <view class="header">
      <text class="title">确认预约</text>
      <text class="subtitle">请填写联系信息</text>
    </view>

    <view class="summary-card">
      <view class="summary-title">订单信息</view>

      <view class="summary-item" v-if="booking.packageName">
        <text class="label">套餐</text>
        <text class="value">{{ booking.packageName }}</text>
        <text class="price" v-if="booking.packagePrice">¥{{ booking.packagePrice }}</text>
        <text class="price consult" v-else>详谈</text>
      </view>

      <view class="summary-item" v-if="booking.packageDuration">
        <text class="label">时长</text>
        <text class="value">{{ booking.packageDuration }}小时</text>
      </view>

      <view class="summary-item" v-if="booking.personCount > 1">
        <text class="label">人数</text>
        <text class="value">{{ booking.personCount }}人</text>
        <text class="price">+¥{{ booking.extraPersonFee }}</text>
      </view>

      <view class="summary-item" v-if="booking.scheduleDate">
        <text class="label">日期</text>
        <text class="value">{{ formatDateLabel(booking.scheduleDate) }}</text>
      </view>

      <view class="summary-item" v-if="booking.scheduleTime">
        <text class="label">时间</text>
        <text class="value">{{ booking.scheduleTime }} - {{ booking.scheduleEndTime }}</text>
      </view>

      <view class="summary-item" v-if="booking.props && booking.props.length > 0">
        <text class="label">道具</text>
        <text class="value">{{ booking.props.map(p => p.name).join('、') }}</text>
      </view>

      <view class="total-row" v-if="booking.packagePrice">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>

    <view class="form-section">
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input
          class="form-input"
          v-model="form.name"
          placeholder="请输入姓名"
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item">
        <text class="form-label">微信号</text>
        <input
          class="form-input"
          v-model="form.wechat"
          placeholder="方便我们联系您"
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea
          class="form-textarea"
          v-model="form.message"
          placeholder="拍摄想法、特殊需求等"
          placeholder-class="placeholder"
          :maxlength="200"
        />
      </view>
    </view>

    <BottomButton
      text="提交预约"
      :disabled="!canSubmit"
      @click="submit"
    />
  </view>
</template>

<script>
import { getBooking, clearBooking } from '@/store/booking.js'
import BottomButton from '@/components/BottomButton.vue'

export default {
  components: {
    BottomButton
  },
  data() {
    return {
      booking: {},
      form: {
        name: '',
        wechat: '',
        message: ''
      }
    }
  },
  computed: {
    totalPrice() {
      let price = this.booking.packagePrice || 0
      if (this.booking.props) {
        price += this.booking.props.reduce((sum, p) => sum + (p.price || 0), 0)
      }
      return price
    },
    canSubmit() {
      return this.form.name && this.form.wechat && this.booking.packageId
    }
  },
  onLoad() {
    this.booking = getBooking()
  },
  methods: {
    formatDateLabel(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    submit() {
      if (!this.canSubmit) return

      // 这里可以提交到后端
      uni.showModal({
        title: '预约成功',
        content: `我们将尽快通过微信联系您确认档期`,
        showCancel: false,
        success: () => {
          clearBooking()
          uni.reLaunch({ url: '/pages/index/index' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F8F8F8;
  padding-bottom: 160rpx;
}

.header {
  padding: 48rpx 32rpx 32rpx;
  background: #FFFFFF;

  .title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 12rpx;
    letter-spacing: 2rpx;
  }

  .subtitle {
    display: block;
    font-size: 26rpx;
    color: #999999;
  }
}

.summary-card {
  margin: 24rpx 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;

  .summary-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid #E5E5E5;
  }

  .summary-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .label {
      width: 120rpx;
      font-size: 26rpx;
      color: #999999;
    }

    .value {
      flex: 1;
      font-size: 26rpx;
      color: #1A1A1A;
    }

    .price {
      font-size: 26rpx;
      color: #1A1A1A;
      font-weight: 600;

      &.consult {
        color: #FF4D4F;
      }
    }
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;
    margin-top: 8rpx;
    border-top: 1rpx solid #E5E5E5;

    .total-label {
      font-size: 26rpx;
      color: #999999;
    }

    .total-price {
      font-size: 40rpx;
      font-weight: 700;
      color: #1A1A1A;
    }
  }
}

.form-section {
  margin: 24rpx 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;

  .form-item {
    margin-bottom: 32rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: 26rpx;
      color: #1A1A1A;
      margin-bottom: 16rpx;
      font-weight: 500;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      height: 88rpx;
      background: #F8F8F8;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #1A1A1A;
      border: none;
    }

    .form-textarea {
      height: 160rpx;
      padding: 24rpx;
      line-height: 1.5;
    }
  }
}

.placeholder {
  color: #CCCCCC;
}
</style>