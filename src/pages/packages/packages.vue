<template>
  <view class="page">
    <view class="header">
      <text class="title">选择套餐</text>
      <text class="subtitle">找到适合你的拍摄方案</text>
    </view>

    <view class="package-list">
      <PackageCard
        v-for="pkg in packages"
        :key="pkg.id"
        :data="pkg"
        :selected="selectedId === pkg.id"
        @select="handleSelect"
        @update="handleUpdate"
      />
    </view>

    <BottomButton
      text="下一步"
      :disabled="!selectedId"
      :info="selectedPackage ? { label: '已选套餐', value: getPriceDisplay } : null"
      @click="goNext"
    />
  </view>
</template>

<script>
import { packages } from '@/data/packages.js'
import { updateBooking } from '@/store/booking.js'
import PackageCard from '@/components/PackageCard.vue'
import BottomButton from '@/components/BottomButton.vue'

export default {
  components: {
    PackageCard,
    BottomButton
  },
  data() {
    return {
      packages,
      selectedId: null,
      selectedData: null
    }
  },
  computed: {
    selectedPackage() {
      return this.packages.find(p => p.id === this.selectedId)
    },
    getPriceDisplay() {
      if (!this.selectedData) return ''
      if (this.selectedData.needContact) return '详谈'
      return '¥' + (this.selectedData.totalPrice || this.selectedData.price || 0)
    }
  },
  methods: {
    handleSelect(data) {
      this.selectedId = data.id
      this.selectedData = data
    },
    handleUpdate(data) {
      // 陪拍套餐更新时长/人数时更新数据
      if (this.selectedId === data.id) {
        this.selectedData = data
      }
    },
    goNext() {
      if (this.selectedData) {
        // 保存套餐信息到状态
        updateBooking('packageId', this.selectedData.id)
        updateBooking('packageName', this.selectedData.name)
        updateBooking('packagePrice', this.selectedData.totalPrice || this.selectedData.price || 0)
        updateBooking('packageDuration', this.selectedData.duration)
        updateBooking('fixedDuration', this.selectedData.fixedDuration)

        // 陪拍套餐额外信息
        if (this.selectedData.id === 4) {
          updateBooking('personCount', this.selectedData.personCount)
          updateBooking('extraPersonFee', (this.selectedData.personCount - 1) * 50)
        } else {
          updateBooking('personCount', 1)
          updateBooking('extraPersonFee', 0)
        }

        uni.navigateTo({ url: '/pages/schedule/schedule' })
      }
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

.package-list {
  padding: 24rpx 32rpx;
}
</style>