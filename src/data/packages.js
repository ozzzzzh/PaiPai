export const packages = [
  {
    id: 1,
    name: '单人毕业照',
    price: 319,
    photos: 6,
    scenes: ['校园场景', '底片全送', '精修交付'],
    desc: '记录独属于你的毕业时刻',
    duration: 2,
    fixedDuration: true
  },
  {
    id: 2,
    name: '闺蜜 / 情侣',
    price: 510,
    photos: 9,
    scenes: ['双人互动', '道具提供', '精修交付'],
    desc: '和最爱的人一起定格青春',
    popular: true,
    duration: 2,
    fixedDuration: true
  },
  {
    id: 3,
    name: '宿舍集体',
    price: null,
    priceText: '详谈',
    photos: 12,
    scenes: ['创意合影', '短视频花絮', '精修交付'],
    desc: '难忘的宿舍记忆',
    duration: 2,
    fixedDuration: true,
    needContact: true
  },
  {
    id: 4,
    name: '陪拍',
    price: 129,
    priceUnit: '/h',
    minDuration: 2,
    photos: '按需',
    scenes: ['自由拍摄', '实时修图', '原片全送'],
    desc: '两小时起约，加一人加50元',
    fixedDuration: false,
    extraPersonFee: 50
  }
]

// 联系方式配置
export const contactInfo = {
  wechat: 'PAIPAI_SERVICE',
  phone: '138-xxxx-xxxx',
  tip: '添加客服微信了解更多详情'
}