// 简单的状态管理
const BOOKING_KEY = 'booking_state'

// 默认状态
const defaultState = {
  packageId: null,
  packageName: '',
  packagePrice: 0,
  packageDuration: 2,
  fixedDuration: true,
  personCount: 1,
  extraPersonFee: 0,
  photographerId: null,
  photographerName: '',
  scheduleDate: '',
  scheduleTime: '',
  scheduleEndTime: '',
  slotId: null,
  props: []
}

export const getBooking = () => {
  try {
    const stored = uni.getStorageSync(BOOKING_KEY)
    return stored ? { ...defaultState, ...stored } : { ...defaultState }
  } catch (e) {
    return { ...defaultState }
  }
}

export const setBooking = (data) => {
  try {
    uni.setStorageSync(BOOKING_KEY, data)
  } catch (e) {
    console.error('保存预约状态失败', e)
  }
}

export const updateBooking = (key, value) => {
  const booking = getBooking()
  booking[key] = value
  setBooking(booking)
  return booking
}

export const clearBooking = () => {
  setBooking({ ...defaultState })
}