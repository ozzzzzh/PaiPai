<template>
  <view class="page">
    <view class="header">
      <text class="title">选择道具</text>
      <text class="subtitle">服装、道具、场景 (可多选)</text>
    </view>

    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view
          class="category-item"
          :class="{ active: currentCategory === cat }"
          v-for="(cat, index) in categories"
          :key="index"
          @click="filterByCategory(cat)"
        >
          {{ cat }}
        </view>
      </view>
    </scroll-view>

    <scroll-view class="props-grid" scroll-y :style="{ height: scrollHeight + 'px' }">
      <view class="grid-content">
        <PropItem
          v-for="prop in filteredProps"
          :key="prop.id"
          :data="prop"
          :selected="selectedIds.includes(prop.id)"
          @toggle="handleToggle"
        />
      </view>
    </scroll-view>

    <view class="bottom-placeholder"></view>

    <BottomButton
      :text="'下一步 (' + selectedIds.length + ')'"
      :info="selectedProps.length > 0 ? { label: '已选道具', value: selectedProps.length + '件' } : null"
      @click="goNext"
    />
  </view>
</template>

<script>
import { propsList, categories } from '@/data/props.js'
import { updateBooking } from '@/store/booking.js'
import PropItem from '@/components/PropItem.vue'
import BottomButton from '@/components/BottomButton.vue'

export default {
  components: {
    PropItem,
    BottomButton
  },
  data() {
    return {
      propsList,
      categories,
      currentCategory: '全部',
      selectedIds: [],
      scrollHeight: 500
    }
  },
  computed: {
    filteredProps() {
      if (this.currentCategory === '全部') {
        return this.propsList
      }
      return this.propsList.filter(p => p.category === this.currentCategory)
    },
    selectedProps() {
      return this.propsList.filter(p => this.selectedIds.includes(p.id))
    }
  },
  onLoad() {
    // 动态计算滚动区域高度
    const systemInfo = uni.getSystemInfoSync()
    // 屏幕高度 - header(约140) - category(约90) - bottomButton(约160)
    const safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
    this.scrollHeight = systemInfo.windowHeight - 140 - 90 - 160 - safeAreaBottom
  },
  methods: {
    filterByCategory(cat) {
      this.currentCategory = cat
    },
    handleToggle(prop) {
      const index = this.selectedIds.indexOf(prop.id)
      if (index > -1) {
        this.selectedIds.splice(index, 1)
      } else {
        this.selectedIds.push(prop.id)
      }
    },
    goNext() {
      updateBooking('props', this.selectedProps)
      uni.navigateTo({ url: '/pages/booking/booking' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F8F8F8;
  display: flex;
  flex-direction: column;
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

.category-scroll {
  background: #FFFFFF;
  white-space: nowrap;
  border-bottom: 1rpx solid #E5E5E5;

  .category-list {
    display: inline-flex;
    padding: 24rpx 32rpx;
    gap: 16rpx;

    .category-item {
      display: inline-flex;
      padding: 16rpx 32rpx;
      font-size: 26rpx;
      color: #666666;
      background: #F0F0F0;
      border-radius: 32rpx;
      transition: all 0.2s ease;

      &.active {
        background: #1A1A1A;
        color: #FFFFFF;
      }
    }
  }
}

.props-grid {
  flex: 1;
  padding: 24rpx;

  .grid-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
  }
}

.bottom-placeholder {
  height: 160rpx;
}
</style>
