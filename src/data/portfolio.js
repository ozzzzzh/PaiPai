// 作品集数据
// 照片尺寸类型: 'large' - 大图横幅, 'normal' - 普通网格
// 布局说明：大图单独一行，小图两两一组

export const portfolio = [
  // 第1张：大图开场
  {
    id: 1,
    image: '/static/portfolio/1.jpeg',
    type: 'large',
    title: '毕业瞬间',
    desc: '定格青春最好的样子'
  },
  // 第2-3张：双列网格
  {
    id: 2,
    image: '/static/portfolio/2.jpeg',
    type: 'normal',
    title: '校园时光',
    desc: ''
  },
  {
    id: 3,
    image: '/static/portfolio/3.jpeg',
    type: 'normal',
    title: '阳光下的我们',
    desc: ''
  },
  // 第4张：大图穿插
  {
    id: 4,
    image: '/static/portfolio/4.jpeg',
    type: 'large',
    title: '美好回忆',
    desc: '每一张都是故事'
  },
  // 第5-6张：双列网格
  {
    id: 5,
    image: '/static/portfolio/5.jpeg',
    type: 'normal',
    title: '精彩瞬间',
    desc: ''
  },
  {
    id: 6,
    image: '/static/portfolio/6.jpeg',
    type: 'normal',
    title: '欢乐时光',
    desc: ''
  },
  // 第7张：大图穿插
  {
    id: 7,
    image: '/static/portfolio/7.jpeg',
    type: 'large',
    title: '青春纪念',
    desc: '记录最美的年华'
  },
  // 第8-9张：双列网格
  {
    id: 8,
    image: '/static/portfolio/8.jpeg',
    type: 'normal',
    title: '美好时刻',
    desc: ''
  },
  {
    id: 9,
    image: '/static/portfolio/9.jpeg',
    type: 'normal',
    title: '珍藏记忆',
    desc: ''
  },
  // 第10张：大图穿插
  {
    id: 10,
    image: '/static/portfolio/10.jpeg',
    type: 'large',
    title: '毕业快乐',
    desc: '未来可期'
  },
  // 第11张：最后一张
  {
    id: 11,
    image: '/static/portfolio/11.jpeg',
    type: 'normal',
    title: '再见青春',
    desc: ''
  }
]

// 统计信息
export const portfolioStats = {
  total: 11,
  category: '毕业季摄影'
}
