<template>
  <view class="page">
    <view class="header">
      <text class="title">选择摄影师</text>
      <text class="subtitle">找到最懂你的拍摄者</text>
    </view>

    <scroll-view class="filter-scroll" scroll-x>
      <view class="filter-list">
        <view
          class="filter-item"
          :class="{ active: currentStyle === tag }"
          v-for="(tag, index) in styleTags"
          :key="index"
          @click="filterByStyle(tag)"
        >
          {{ tag }}
        </view>
      </view>
    </scroll-view>

    <scroll-view class="photographer-list" scroll-y>
      <PhotographerCard
        v-for="photographer in filteredPhotographers"
        :key="photographer.id"
        :data="photographer"
        :selected="selectedId === photographer.id"
        @select="handleSelect"
      />
    </scroll-view>

    <BottomButton
      text="下一步"
      :disabled="!selectedId"
      :info="selectedPhotographer ? { label: '已选摄影师', value: selectedPhotographer.name } : null"
      @click="goNext"
    />
  </view>
</template>

<script>
import { photographers, styleTags } from '@/data/photographers.js'
import { updateBooking } from '@/store/booking.js'
import PhotographerCard from '@/components/PhotographerCard.vue'
import BottomButton from '@/components/BottomButton.vue'

export default {
  components: {
    PhotographerCard,
    BottomButton
  },
  data() {
    return {
      photographers,
      styleTags,
      currentStyle: '全部',
      selectedId: null
    }
  },
  computed: {
    filteredPhotographers() {
      if (this.currentStyle === '全部') {
        return this.photographers
      }
      return this.photographers.filter(p => p.styles.includes(this.currentStyle))
    },
    selectedPhotographer() {
      return this.photographers.find(p => p.id === this.selectedId)
    }
  },
  methods: {
    filterByStyle(style) {
      this.currentStyle = style
    },
    handleSelect(photographer) {
      this.selectedId = photographer.id
    },
    goNext() {
      if (this.selectedPhotographer) {
        updateBooking('photographerId', this.selectedPhotographer.id)
        updateBooking('photographerName', this.selectedPhotographer.name)
        uni.navigateTo({ url: '/pages/props/props' })
      }
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

.filter-scroll {
  background: #FFFFFF;
  white-space: nowrap;
  border-bottom: 1rpx solid #E5E5E5;

  .filter-list {
    display: inline-flex;
    padding: 24rpx 32rpx;
    gap: 16rpx;

    .filter-item {
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

.photographer-list {
  flex: 1;
  padding: 24rpx 32rpx;
  height: calc(100vh - 400rpx);
}
</style>
