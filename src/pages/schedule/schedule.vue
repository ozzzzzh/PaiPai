<template>
  <view class="page">
    <view class="header">
      <text class="title">选择拍摄时间</text>
      <text class="subtitle">{{ packageName }} · {{ packageDuration }}小时</text>
    </view>

    <!-- 日期选择 -->
    <scroll-view class="date-scroll" scroll-x>
      <view class="date-list">
        <view
          class="date-item"
          :class="{ active: selectedDate === date.value, full: date.isFull }"
          v-for="(date, index) in dateList"
          :key="index"
          @click="selectDate(date)"
        >
          <text class="weekday">{{ date.weekday }}</text>
          <text class="day">{{ date.day }}</text>
        </view>
        <!-- 更多卡片 -->
        <view class="date-item more-card" @click="showCalendar = true">
          <text class="more-text">更多</text>
        </view>
      </view>
    </scroll-view>

    <!-- 日历弹窗 -->
    <view class="calendar-modal" v-if="showCalendar" @click="showCalendar = false">
      <view class="calendar-container" @click.stop>
        <view class="calendar-header">
          <view class="calendar-nav" @click="prevMonth">
            <text class="nav-arrow">‹</text>
          </view>
          <text class="calendar-title">{{ currentYear }}年{{ currentMonth }}月</text>
          <view class="calendar-nav" @click="nextMonth">
            <text class="nav-arrow">›</text>
          </view>
        </view>
        <view class="calendar-weekdays">
          <text class="weekday-item" v-for="day in weekDays" :key="day">{{ day }}</text>
        </view>
        <view class="calendar-days">
          <view
            class="day-item"
            :class="{
              empty: !day.day,
              disabled: day.disabled,
              full: day.isFull,
              today: day.isToday,
              selected: day.value === selectedCalendarDate
            }"
            v-for="(day, index) in calendarDays"
            :key="index"
            @click="selectCalendarDate(day)"
          >
            <text class="day-num" v-if="day.day">{{ day.day }}</text>
            <text class="day-full" v-if="day.isFull">约满</text>
          </view>
        </view>
        <view class="calendar-footer">
          <view class="calendar-legend">
            <view class="legend-item">
              <view class="legend-dot available"></view>
              <text>可选</text>
            </view>
            <view class="legend-item">
              <view class="legend-dot full"></view>
              <text>约满</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 镜头时间选择器 -->
    <view class="lens-container">
      <view class="lens-frame">
        <!-- ═══════════ 银色金属外环 ═══════════ -->
        <view class="metal-outer">
          <view class="metal-base"></view>
          <view class="metal-brushed"></view>
          <view class="metal-highlight"></view>
          <view class="metal-edge"></view>
        </view>

        <!-- ═══════════ 调焦环（带刻度，可旋转） ═══════════ -->
        <view class="dial-ring" :style="{ transform: `rotate(${ringRotation}deg)` }">
          <view class="dial-base"></view>
          <view class="dial-grip">
            <view class="grip-line" v-for="i in 96" :key="i"></view>
          </view>
          <view class="dial-scale">
            <view
              class="scale-item"
              v-for="(mark, idx) in timeMarks"
              :key="idx"
              :class="{ booked: mark.booked, lunch: mark.lunch, half: mark.isHalf }"
              :style="{ transform: `rotate(${mark.angle}deg)` }"
            >
              <text
                class="scale-num"
                v-if="!mark.isHalf"
                :class="{ outer: mark.isStart, inner: mark.isEnd }"
              >{{ mark.label }}</text>
              <view class="scale-tick"></view>
            </view>
          </view>
        </view>

        <!-- ═══════════ 固定时间区间弧形带（起点在12点钟方向） ═══════════ -->
        <view class="time-sector" :style="{ '--sector-angle': sectorAngle }">
          <view class="arc-band"></view>
          <view class="arc-endpoints">
            <view class="endpoint start"></view>
            <view class="endpoint end"></view>
          </view>
        </view>

        <!-- ═══════════ 镜头玻璃 ═══════════ -->
        <view class="lens-glass">
          <view class="glass-frame"></view>
          <view class="glass-surface"></view>
          <view class="glass-info">
            <text class="info-time" v-if="selectedStartTime !== null">
              {{ selectedStartTimeLabel }}
            </text>
            <text class="info-time placeholder" v-else>转动选择</text>
            <text class="info-duration" v-if="selectedStartTime !== null">
              {{ packageDuration }}小时
            </text>
          </view>
        </view>
      </view>

      <!-- 触摸层 -->
      <view
        class="touch-layer"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></view>
    </view>

    <!-- 时间预览 -->
    <view class="preview-card" v-if="selectedStartTime !== null">
      <view class="preview-main">
        <text class="preview-label">拍摄时间</text>
        <text class="preview-time">{{ selectedStartTimeLabel }} - {{ selectedEndTimeLabel }}</text>
      </view>
      <view class="preview-badge">
        <text>{{ packageDuration }}小时</text>
      </view>
    </view>

    <!-- 图例 -->
    <view class="legend">
      <view class="legend-item">
        <view class="legend-line available"></view>
        <text>可选</text>
      </view>
      <view class="legend-item">
        <view class="legend-line booked"></view>
        <text>已约</text>
      </view>
      <view class="legend-item">
        <view class="legend-line lunch"></view>
        <text>午休</text>
      </view>
    </view>

    <view class="bottom-placeholder"></view>

    <BottomButton
      text="确认时间"
      :disabled="selectedStartTime === null"
      @click="confirmSchedule"
    />
  </view>
</template>

<script>
import { getAvailableSlots, bookSlot, timeUtils } from '@/api/schedule.js'
import { getBooking, updateBooking } from '@/store/booking.js'
import BottomButton from '@/components/BottomButton.vue'

export default {
  components: { BottomButton },
  data() {
    return {
      packageName: '',
      packageDuration: 2,

      dateList: [],
      selectedDate: '',

      startHour: 9,
      endHour: 21,
      lunchStart: 12,
      lunchEnd: 13.5,

      bookedRanges: [],

      ringRotation: 0,
      selectedStartTime: null,

      isDragging: false,
      lastAngle: 0,
      centerX: 0,
      centerY: 0,

      scheduleData: {},

      // 音频上下文
      audioContext: null,
      lastClickAngle: 0,

      // 日历相关
      showCalendar: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      selectedCalendarDate: '',
      weekDays: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  computed: {
    timeMarks() {
      const marks = []
      const totalSlots = (this.endHour - this.startHour) * 2

      for (let i = 0; i <= totalSlots; i++) {
        const hour = this.startHour + i * 0.5
        const progress = i / totalSlots
        const angle = progress * 360

        const minutes = hour * 60
        let booked = false
        let lunch = false

        if (hour >= this.lunchStart && hour < this.lunchEnd) {
          lunch = true
        }

        if (!lunch) {
          for (const range of this.bookedRanges) {
            const rangeStart = timeUtils.parseTime(range.start)
            const rangeEnd = timeUtils.parseTime(range.end)
            if (minutes >= rangeStart && minutes < rangeEnd) {
              booked = true
              break
            }
          }
        }

        const isHalf = hour % 1 !== 0
        const isStart = Math.abs(angle) < 1 || Math.abs(angle - 360) < 1  // 顶部位置（起始时间）
        const isEnd = Math.abs(angle - 360) < 1 // 结束位置
        const label = isHalf ? '' : `${Math.floor(hour)}`

        marks.push({ hour, angle, label, booked, lunch, isHalf, isStart, isEnd })
      }

      return marks
    },
    // 扇形角度（基于套餐时长）
    sectorAngle() {
      const totalHours = this.endHour - this.startHour
      return (this.packageDuration / totalHours) * 360
    },
    selectedStartTimeLabel() {
      if (this.selectedStartTime === null) return ''
      return timeUtils.formatTime(this.selectedStartTime)
    },
    selectedEndTimeLabel() {
      if (this.selectedStartTime === null) return ''
      return timeUtils.formatTime(this.selectedStartTime + this.packageDuration * 60)
    },
    // 日历天数计算
    calendarDays() {
      const days = []
      const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth, 0)
      const totalDays = lastDay.getDate()
      const startWeekday = firstDay.getDay()

      // 前面的空白
      for (let i = 0; i < startWeekday; i++) {
        days.push({ day: null })
      }

      // 日期
      const today = new Date()
      const todayStr = this.formatDate(today)

      for (let d = 1; d <= totalDays; d++) {
        const date = new Date(this.currentYear, this.currentMonth - 1, d)
        const dateStr = this.formatDate(date)
        const isToday = dateStr === todayStr
        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const isFull = this.checkDateAvailable(dateStr) === false

        days.push({
          day: d,
          value: dateStr,
          isToday,
          disabled: isPast,
          isFull
        })
      }

      return days
    }
  },
  onLoad() {
    const booking = getBooking()
    this.packageName = booking.packageName || '未选择'
    this.packageDuration = booking.packageDuration || 2

    this.initDateList()
    this.loadScheduleData()
    this.initAudio()
  },
  onReady() {
    this.$nextTick(() => {
      setTimeout(() => this.updateCenter(), 300)
    })
  },
  methods: {
    // 初始化音频
    initAudio() {
      // #ifdef H5
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      } catch (e) {
        console.log('音频初始化失败', e)
      }
      // #endif
    },

    // 播放咔哒音效
    playClickSound() {
      // #ifdef H5
      if (!this.audioContext) return

      try {
        // 创建振荡器
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        // 连接节点
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        // 设置音色 - 金属敲击声
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.02)

        // 设置音量包络
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03)

        // 播放
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.03)
      } catch (e) {
        // 静默失败
      }
      // #endif

      // #ifndef H5
      // 小程序端使用振动反馈
      uni.vibrateShort({ type: 'light' })
      // #endif
    },

    initDateList() {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const today = new Date()

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)

        this.dateList.push({
          value: this.formatDate(date),
          weekday: i === 0 ? '今天' : i === 1 ? '明天' : weekdays[date.getDay()],
          day: date.getDate()
        })
      }

      this.selectedDate = this.dateList[0].value
    },

    async loadScheduleData() {
      try {
        const startDate = this.formatDate(new Date())
        const endDate = this.formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

        const res = await getAvailableSlots(startDate, endDate)
        this.scheduleData = res.data

        // 标记每个日期是否可用（是否有足够时间预约）
        this.dateList.forEach(date => {
          date.isFull = !this.checkDateAvailable(date.value)
        })

        this.loadBookedRanges(this.selectedDate)
      } catch (e) {
        console.error('加载失败', e)
      }
    },

    // 检查某日期是否有足够的可用时间（套餐时长 + 前后各30分钟接驳）
    checkDateAvailable(dateStr) {
      const data = this.scheduleData[dateStr] || { bookedWithBuffer: [] }
      const bookedRanges = data.bookedWithBuffer || []

      // 所需总时间 = 套餐时长 + 接驳时间(前后各30分钟) = packageDuration + 1小时
      const totalNeededMinutes = this.packageDuration * 60 + 60
      const startMinutes = this.startHour * 60
      const endMinutes = this.endHour * 60

      // 遍历每个可能的开始时间（每半小时检查一次）
      for (let minutes = startMinutes; minutes <= endMinutes - totalNeededMinutes; minutes += 30) {
        const endTime = minutes + this.packageDuration * 60

        // 检查是否在午休时间
        if (minutes < this.lunchEnd * 60 && endTime > this.lunchStart * 60) {
          continue
        }

        // 检查是否与已预约时间冲突（接驳时间已在bookedRanges中）
        let hasConflict = false
        for (const range of bookedRanges) {
          const rangeStart = timeUtils.parseTime(range.start)
          const rangeEnd = timeUtils.parseTime(range.end)

          // 检查是否有重叠
          if (minutes < rangeEnd && endTime > rangeStart) {
            hasConflict = true
            break
          }
        }

        if (!hasConflict) {
          return true // 找到一个可用时间段
        }
      }

      return false // 没有可用时间段
    },

    loadBookedRanges(date) {
      const data = this.scheduleData[date] || { bookedWithBuffer: [] }
      this.bookedRanges = data.bookedWithBuffer || []
      this.selectedStartTime = null
      this.ringRotation = 0
    },

    selectDate(date) {
      // 如果该日期已约满，不允许选择
      if (date.isFull) {
        uni.showToast({
          title: '该日期已约满',
          icon: 'none'
        })
        return
      }

      this.selectedDate = date.value
      this.loadBookedRanges(date.value)
    },

    updateCenter() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.lens-container').boundingClientRect(res => {
        if (res) {
          this.centerX = res.left + res.width / 2
          this.centerY = res.top + res.height / 2
        }
      }).exec()
    },

    handleTouchStart(e) {
      this.isDragging = true
      this.updateCenter()
      this.lastAngle = this.getAngle(e.touches[0].clientX, e.touches[0].clientY)
      this.lastClickAngle = this.ringRotation
      uni.vibrateShort({ type: 'light' })
    },

    handleTouchMove(e) {
      if (!this.isDragging) return

      const currentAngle = this.getAngle(e.touches[0].clientX, e.touches[0].clientY)
      let delta = currentAngle - this.lastAngle

      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360

      const oldRotation = this.ringRotation
      this.ringRotation += delta
      this.lastAngle = currentAngle

      // 检测是否需要播放咔哒音效（每15度一次）
      const oldStep = Math.floor(oldRotation / 15)
      const newStep = Math.floor(this.ringRotation / 15)
      if (oldStep !== newStep) {
        this.playClickSound()
      }

      this.updateTimeFromRotation()
    },

    handleTouchEnd() {
      this.isDragging = false
      this.snapToNearestSlot()
    },

    getAngle(x, y) {
      const dx = x - this.centerX
      const dy = y - this.centerY
      return Math.atan2(dy, dx) * (180 / Math.PI)
    },

    updateTimeFromRotation() {
      const totalHours = this.endHour - this.startHour
      // 标准化旋转角度到0-360
      let normalizedRotation = this.ringRotation % 360
      if (normalizedRotation < 0) normalizedRotation += 360

      // 弧形带起始点在12点钟方向（CSS角度270deg或-90deg）
      // 刻度盘旋转后，原本在角度A位置的刻度现在移动到了角度(A + rotation)位置
      // 我们要找：哪个刻度现在位于弧形带起始位置（12点钟）？
      // 答案：原本在角度(270 - rotation)位置的刻度
      // 但因为我们用progress从0开始（12点=0），所以：
      // 刻度角度 = progress * 360，当progress=0时在12点
      // 旋转后，刻度角度变成了(刻度角度 + rotation)
      // 我们要刻度角度 + rotation = 0（12点位置）
      // 所以刻度角度 = -rotation
      // 转换为progress: progress = (360 - rotation) / 360

      const progress = (360 - normalizedRotation) / 360
      const hourOffset = progress * totalHours
      const minutes = Math.round((this.startHour + hourOffset) * 60 / 30) * 30

      this.trySetTime(minutes)
    },

    trySetTime(minutes) {
      const endTime = minutes + this.packageDuration * 60

      if (minutes < this.startHour * 60) return
      if (endTime > this.endHour * 60) return

      if (minutes < this.lunchEnd * 60 && endTime > this.lunchStart * 60) return

      for (const range of this.bookedRanges) {
        const rs = timeUtils.parseTime(range.start)
        const re = timeUtils.parseTime(range.end)
        if (minutes < re && endTime > rs) return
      }

      this.selectedStartTime = minutes
    },

    snapToNearestSlot() {
      if (this.selectedStartTime === null) return

      // 吸附到最近的半小时
      const snapped = Math.round(this.selectedStartTime / 30) * 30
      this.trySetTime(snapped)

      // 重新计算旋转角度，与updateTimeFromRotation保持一致的反向映射
      const totalHours = this.endHour - this.startHour
      const progress = (this.selectedStartTime / 60 - this.startHour) / totalHours
      // 反向映射：rotation = 360 - progress * 360
      this.ringRotation = 360 - progress * 360
    },

    async confirmSchedule() {
      if (this.selectedStartTime === null) return

      uni.showLoading({ title: '预约中...' })

      try {
        const res = await bookSlot({
          date: this.selectedDate,
          time: timeUtils.formatTime(this.selectedStartTime),
          duration: this.packageDuration,
          packageId: getBooking().packageId
        })

        uni.hideLoading()

        updateBooking('scheduleDate', this.selectedDate)
        updateBooking('scheduleTime', timeUtils.formatTime(this.selectedStartTime))
        updateBooking('scheduleEndTime', this.selectedEndTimeLabel)
        updateBooking('slotId', res.data.bookingId)

        uni.navigateTo({ url: '/pages/props/props' })
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: e.message || '预约失败', icon: 'none' })
      }
    },

    formatDate(date) {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },

    // 日历导航
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },

    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },

    // 从日历选择日期
    selectCalendarDate(day) {
      if (!day.day || day.disabled) return

      // 如果约满，提示
      if (day.isFull) {
        uni.showToast({
          title: '该日期已约满',
          icon: 'none'
        })
        return
      }

      this.selectedCalendarDate = day.value
      this.showCalendar = false

      // 更新日期列表，将选中的日期放到第一位
      const selectedDateInfo = {
        value: day.value,
        weekday: this.getWeekday(day.value),
        day: new Date(day.value).getDate(),
        isFull: false
      }

      // 重新生成日期列表
      this.dateList = [selectedDateInfo]
      const startDate = new Date(day.value)
      for (let i = 1; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const dateStr = this.formatDate(date)
        this.dateList.push({
          value: dateStr,
          weekday: this.getWeekday(dateStr),
          day: date.getDate(),
          isFull: this.checkDateAvailable(dateStr) === false
        })
      }

      this.selectedDate = day.value
      this.loadBookedRanges(day.value)
    },

    // 获取星期几
    getWeekday(dateStr) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const date = new Date(dateStr)
      const today = new Date()
      const todayStr = this.formatDate(today)

      if (dateStr === todayStr) return '今天'
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      if (dateStr === this.formatDate(tomorrow)) return '明天'

      return weekdays[date.getDay()]
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F0F0F0;
}

.header {
  padding: 48rpx 32rpx 24rpx;
  text-align: center;
  background: #FFFFFF;

  .title {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 8rpx;
    letter-spacing: 2rpx;
  }

  .subtitle {
    font-size: 24rpx;
    color: #999999;
  }
}

.date-scroll {
  white-space: nowrap;
  padding: 16rpx 0;
  background: #FFFFFF;
  border-bottom: 1rpx solid #E5E5E5;

  .date-list {
    display: inline-flex;
    padding: 0 32rpx;
    gap: 16rpx;

    .date-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 12rpx 14rpx;
      background: #F5F5F5;
      border-radius: 12rpx;
      transition: all 0.2s ease;
      position: relative;
      min-width: 54rpx;

      &.active {
        background: #1A1A1A;
        .weekday, .day { color: #FFFFFF; }
        .full-label { background: rgba(255, 77, 79, 0.95); }
      }

      &.full {
        opacity: 0.6;
        pointer-events: auto;
        background: #F0F0F0;

        .weekday, .day { color: #FF4D4F; }
      }

      .weekday {
        font-size: 20rpx;
        color: #999999;
        margin-bottom: 8rpx;
      }

      .day {
        font-size: 28rpx;
        font-weight: 600;
        color: #1A1A1A;
        margin-bottom: 8rpx;
      }

      .full-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 16rpx;
        font-weight: 600;
        color: #FFFFFF;
        background: #FF4D4F;
        padding: 6rpx 18rpx;
        border-radius: 4rpx;
        white-space: nowrap;
        box-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.4);
        z-index: 10;
      }
    }
  }
}

.lens-container {
  position: relative;
  width: 600rpx;
  height: 600rpx;
  margin: 48rpx auto;

  .lens-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
  }

  // ═══════════ 银色金属外环 ═══════════
  .metal-outer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    overflow: hidden;

    .metal-base {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        160deg,
        #F5F5F5 0%,
        #D4D4D4 10%,
        #B0B0B0 20%,
        #8A8A8A 35%,
        #A5A5A5 45%,
        #C8C8C8 55%,
        #9A9A9A 65%,
        #BEBEBE 75%,
        #E0E0E0 85%,
        #C5C5C5 100%
      );
    }

    .metal-brushed {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2rpx,
        #D8D8D8 2rpx,
        #D8D8D8 3rpx,
        transparent 3rpx,
        transparent 6rpx,
        #A8A8A8 6rpx,
        #A8A8A8 7rpx,
        transparent 7rpx
      );
    }

    .metal-highlight {
      position: absolute;
      top: -10%;
      left: 5%;
      width: 90%;
      height: 45%;
      background: radial-gradient(
        ellipse 80% 100% at 50% 0%,
        #FFFFFF 0%,
        #FFFFFF 5%,
        #F0F0F0 15%,
        #E8E8E8 25%,
        transparent 50%
      );
      border-radius: 50%;
    }

    .metal-edge {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      box-shadow:
        inset 0 8rpx 20rpx #FFFFFF,
        inset 0 -12rpx 24rpx #707070,
        inset 6rpx 0 12rpx #B0B0B0,
        inset -6rpx 0 12rpx #B0B0B0;
    }
  }

  // ═══════════ 调焦环（带刻度，可旋转） ═══════════
  .dial-ring {
    position: absolute;
    top: 32rpx;
    left: 32rpx;
    right: 32rpx;
    bottom: 32rpx;
    border-radius: 50%;
    transition: transform 0.05s ease-out;

    .dial-base {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: linear-gradient(145deg, #1F1F1F 0%, #0A0A0A 100%);
      box-shadow:
        inset 0 6rpx 16rpx #333333,
        inset 0 -6rpx 16rpx #000000,
        0 8rpx 24rpx #505050;
    }

    .dial-grip {
      position: absolute;
      top: 12rpx;
      left: 12rpx;
      right: 12rpx;
      bottom: 12rpx;
      border-radius: 50%;

      .grip-line {
        position: absolute;
        // 从外边缘开始
        top: 0;
        left: 50%;
        margin-left: -1.5rpx;
        width: 3rpx;
        // 固定高度，约为原来长度的1/4
        // 圆环半径约 260rpx，原来高度约 520rpx，1/4 约 130rpx
        height: 26rpx;
        background: linear-gradient(
          180deg,
          #555555 0%,
          #444444 50%,
          #333333 100%
        );
        transform-origin: 50% 260rpx;

        @for $i from 1 through 96 {
          &:nth-child(#{$i}) {
            transform: rotate($i * 3.75deg);
          }
        }
      }
    }

    .dial-scale {
      position: absolute;
      top: 40rpx;
      left: 40rpx;
      right: 40rpx;
      bottom: 40rpx;
      border-radius: 50%;

      .scale-item {
        position: absolute;
        top: 0;
        left: 50%;
        width: 4rpx;
        height: 50%;
        margin-left: -2rpx;
        transform-origin: bottom center;

        .scale-num {
          position: absolute;
          top: 20rpx;  // 数字位置（内侧）
          left: 50%;
          transform: translateX(-50%);
          font-size: 26rpx;
          font-weight: 700;
          color: #FFFFFF;

          // 起点数字（外圈）
          &.outer {
            top: 12rpx;
            font-size: 24rpx;
          }

          // 终点数字（内圈）
          &.inner {
            top: 28rpx;
            font-size: 20rpx;
            color: #AAAAAA;
          }
        }

        .scale-tick {
          position: absolute;
          top: 4rpx;  // 外侧位置
          left: 50%;
          transform: translateX(-50%);
          width: 3rpx;
          height: 16rpx;  // 恢复原长度
          background: rgba(255, 255, 255, 0.6);
          border-radius: 2rpx;
        }

        &.half {
          .scale-tick {
            top: 4rpx;
            width: 2rpx;
            height: 6rpx;  // 半小时装饰线缩短
            background: rgba(255, 255, 255, 0.35);
          }
        }

        &.booked {
          .scale-num { color: #FF6B6B; }
          .scale-tick { background: #FF4D4F; }
        }

        &.lunch {
          .scale-num { color: #777777; }
          .scale-tick { background: #555555; }
        }
      }
    }
  }

  // ═══════════ 固定时间区间弧形带（起点在12点钟方向） ═══════════
  .time-sector {
    position: absolute;
    top: 50rpx;
    left: 50rpx;
    right: 50rpx;
    bottom: 50rpx;
    border-radius: 50%;
    pointer-events: none;
    z-index: 25;

    .arc-band {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      // CSS角度系统：0deg=3点钟（右），90deg=6点钟（下），180deg=9点钟（左），270deg=12点钟（上）
      // 不使用from，直接用绝对角度：从270deg（12点）开始渲染
      background: conic-gradient(
        // 0-270度透明
        transparent 0deg,
        transparent 270deg,
        // 从270deg（12点钟）开始渲染弧形段
        rgba(200, 200, 200, 0.12) 270deg,
        rgba(255, 255, 255, 0.18) calc(270deg + var(--sector-angle) * 1deg * 0.25),
        rgba(255, 255, 255, 0.22) calc(270deg + var(--sector-angle) * 1deg * 0.5),
        rgba(255, 255, 255, 0.18) calc(270deg + var(--sector-angle) * 1deg * 0.75),
        rgba(200, 200, 200, 0.12) calc(270deg + var(--sector-angle) * 1deg),
        // 弧形段结束，之后透明
        transparent calc(270deg + var(--sector-angle) * 1deg)
      );
      // 用mask只保留弧形带区域（环形）
      -webkit-mask: radial-gradient(
        circle at center,
        transparent 48%,
        black 50%,
        black 64%,
        transparent 66%
      );
      mask: radial-gradient(
        circle at center,
        transparent 48%,
        black 50%,
        black 64%,
        transparent 66%
      );
    }

    // 起止端点
    .arc-endpoints {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .endpoint {
        position: absolute;
        top: 0;
        left: 50%;
        width: 4rpx;
        height: 50%;
        transform-origin: bottom center;

        &::before {
          content: '';
          position: absolute;
          top: 2rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 14rpx;
          height: 14rpx;
          background: #FFD700;
          border-radius: 50%;
          box-shadow: 0 0 12rpx rgba(255, 215, 0, 0.8);
        }

        // 起点固定在正上方（12点钟方向）
        &.start {
          transform: translateX(-50%) rotate(0deg);
        }

        // 终点在弧形段末端（加deg单位）
        &.end {
          transform: translateX(-50%) rotate(calc(var(--sector-angle) * 1deg));
        }
      }
    }
  }

  // ═══════════ 镜头玻璃 ═══════════
  .lens-glass {
    position: absolute;
    top: 140rpx;
    left: 140rpx;
    right: 140rpx;
    bottom: 140rpx;
    border-radius: 50%;
    overflow: hidden;

    .glass-frame {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: #0A0A0A;
      box-shadow: inset 0 4rpx 16rpx #000000;
    }

    .glass-surface {
      position: absolute;
      top: 8%;
      left: 8%;
      right: 8%;
      bottom: 8%;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%,
        #3A3A3A 0%,
        #1F1F1F 40%,
        #0A0A0A 100%
      );
      box-shadow:
        inset 0 2rpx 6rpx #555555,
        0 2rpx 8rpx #000000;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 10%;
        left: 15%;
        width: 40%;
        height: 25%;
        background: linear-gradient(180deg, #666666, transparent);
        border-radius: 50%;
        transform: rotate(-25deg);
      }
    }

    .glass-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .info-time {
        display: block;
        font-size: 44rpx;
        font-weight: 700;
        color: #FFFFFF;
        letter-spacing: 2rpx;

        &.placeholder {
          font-size: 26rpx;
          color: #777777;
        }
      }

      .info-duration {
        display: block;
        font-size: 20rpx;
        color: #AAAAAA;
        margin-top: 8rpx;
      }
    }
  }

  .touch-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: 100;
  }
}

.preview-card {
  margin: 0 32rpx;
  padding: 24rpx 32rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .preview-main {
    .preview-label {
      display: block;
      font-size: 22rpx;
      color: #999999;
      margin-bottom: 4rpx;
    }

    .preview-time {
      font-size: 32rpx;
      font-weight: 600;
      color: #1A1A1A;
    }
  }

  .preview-badge {
    background: #1A1A1A;
    padding: 10rpx 24rpx;
    border-radius: 20rpx;

    text {
      font-size: 24rpx;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}

.legend {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-top: 32rpx;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .legend-line {
      width: 32rpx;
      height: 6rpx;
      border-radius: 3rpx;

      &.available { background: #FFFFFF; }
      &.booked { background: #FF4D4F; }
      &.lunch { background: #555555; }
    }

    text {
      font-size: 22rpx;
      color: #666666;
    }
  }
}

.bottom-placeholder {
  height: 160rpx;
}

// ═══════════ 更多卡片样式 ═══════════
.more-card {
  background: transparent !important;
  border: 2rpx dashed #CCCCCC !important;

  .more-text {
    font-size: 24rpx;
    color: #999999;
    font-weight: 500;
  }
}

// ═══════════ 日历弹窗样式 ═══════════
.calendar-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-container {
  width: 600rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    background: #1A1A1A;

    .calendar-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #FFFFFF;
    }

    .calendar-nav {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;

      .nav-arrow {
        font-size: 32rpx;
        color: #FFFFFF;
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .calendar-weekdays {
    display: flex;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #E5E5E5;

    .weekday-item {
      flex: 1;
      text-align: center;
      font-size: 22rpx;
      color: #999999;
    }
  }

  .calendar-days {
    display: flex;
    flex-wrap: wrap;
    padding: 16rpx;

    .day-item {
      width: calc(100% / 7);
      height: 64rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      &.empty {
        pointer-events: none;
      }

      &.disabled {
        .day-num {
          color: #CCCCCC;
        }
      }

      &.today {
        .day-num {
          color: #1A1A1A;
          font-weight: 700;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 4rpx;
          width: 6rpx;
          height: 6rpx;
          background: #1A1A1A;
          border-radius: 50%;
        }
      }

      &.full {
        .day-num {
          color: #FF4D4F;
        }

        .day-full {
          font-size: 16rpx;
          color: #FF4D4F;
        }
      }

      &.selected {
        background: #1A1A1A;
        border-radius: 8rpx;

        .day-num {
          color: #FFFFFF;
        }
      }

      .day-num {
        font-size: 26rpx;
        color: #1A1A1A;
      }

      .day-full {
        font-size: 14rpx;
        color: #FF4D4F;
      }
    }
  }

  .calendar-footer {
    padding: 16rpx 32rpx 24rpx;
    border-top: 1rpx solid #E5E5E5;

    .calendar-legend {
      display: flex;
      justify-content: center;
      gap: 32rpx;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .legend-dot {
          width: 16rpx;
          height: 16rpx;
          border-radius: 4rpx;

          &.available {
            background: #1A1A1A;
          }

          &.full {
            background: #FF4D4F;
          }
        }

        text {
          font-size: 22rpx;
          color: #666666;
        }
      }
    }
  }
}
</style>