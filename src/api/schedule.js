// 模拟已预约时间段数据
// 格式: 日期 -> 已预约区间列表
const mockBookedSlots = {
  '2026-06-01': [
    { start: '09:00', end: '11:00' },
    { start: '14:00', end: '16:30' },
  ],
  '2026-06-02': [
    { start: '10:00', end: '12:00' },
    { start: '15:00', end: '17:30' },
  ],
  '2026-06-03': [
    { start: '09:30', end: '11:30' },
    { start: '13:00', end: '15:00' },
    { start: '17:00', end: '19:00' },
  ],
  '2026-06-04': [
    { start: '11:00', end: '13:00' },
  ],
  '2026-06-05': [
    { start: '09:00', end: '10:30' },
    { start: '14:30', end: '17:00' },
  ],
  '2026-06-06': [
    { start: '10:00', end: '12:30' },
    { start: '15:00', end: '18:00' },
  ],
  '2026-06-07': [
    { start: '09:00', end: '11:30' },
    { start: '13:30', end: '16:00' },
  ],
}

// 接驳时间（分钟）
const BUFFER_TIME = 30

/**
 * 时间工具函数
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function addMinutes(timeStr, mins) {
  return formatTime(parseTime(timeStr) + mins)
}

function subtractMinutes(timeStr, mins) {
  return formatTime(parseTime(timeStr) - mins)
}

/**
 * 获取某天的已预约区间（含接驳时间）
 * 接驳时间自动合并到已预约区间，不单独显示给用户
 * @param {string} date - 日期 YYYY-MM-DD
 * @returns {Array} 扩展后的不可选区间
 */
export function getBookedRangesWithBuffer(date) {
  const booked = mockBookedSlots[date] || []
  // 将接驳时间合并到已预约区间，对外显示为统一的"已预约"状态
  return booked.map(b => ({
    start: subtractMinutes(b.start, BUFFER_TIME),
    end: addMinutes(b.end, BUFFER_TIME)
  }))
}

/**
 * 获取某天的原始已预约区间
 * @param {string} date - 日期 YYYY-MM-DD
 * @returns {Array} 原始已预约区间
 */
export function getBookedRanges(date) {
  return mockBookedSlots[date] || []
}

/**
 * 获取可用时间列表
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {Promise} 返回可用时间数据
 */
export function getAvailableSlots(startDate, endDate) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {}

      // 生成7天的数据
      const start = new Date(startDate)
      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(date.getDate() + i)
        const dateStr = formatDate(date)

        result[dateStr] = {
          bookedRanges: getBookedRanges(dateStr),
          bookedWithBuffer: getBookedRangesWithBuffer(dateStr)
        }
      }

      resolve({
        code: 0,
        message: 'success',
        data: result
      })
    }, 300)
  })
}

/**
 * 预约时间段
 * @param {object} booking - 预约信息
 * @returns {Promise} 返回预约结果
 */
export function bookSlot(booking) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查是否与现有预约冲突
      const bookedRanges = getBookedRangesWithBuffer(booking.date)
      const requestStart = parseTime(booking.time)
      const requestEnd = requestStart + booking.duration * 60

      for (const range of bookedRanges) {
        const rangeStart = parseTime(range.start)
        const rangeEnd = parseTime(range.end)

        // 检查是否有重叠
        if (!(requestEnd <= rangeStart || requestStart >= rangeEnd)) {
          reject({
            code: -1,
            message: '该时间段已被预约'
          })
          return
        }
      }

      // 模拟预约成功，添加到已预约列表
      const dateStr = booking.date
      if (!mockBookedSlots[dateStr]) {
        mockBookedSlots[dateStr] = []
      }
      mockBookedSlots[dateStr].push({
        start: booking.time,
        end: formatTime(requestStart + booking.duration * 60)
      })

      resolve({
        code: 0,
        message: '预约成功',
        data: {
          bookingId: 'BK' + Date.now(),
          ...booking
        }
      })
    }, 500)
  })
}

// 辅助函数
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 导出工具函数供组件使用
export const timeUtils = {
  parseTime,
  formatTime,
  addMinutes,
  subtractMinutes,
  BUFFER_TIME
}