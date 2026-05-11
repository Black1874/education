// 形状数据配置

export const SHAPES_DATA = [
  // 基础形状
  { id: 401, name: '圆形', nameEn: 'Circle', imageUrl: '/images/shapes/circle.svg', description: '圆形像太阳', sides: 0, subCategory: 'basic' },
  { id: 402, name: '正方形', nameEn: 'Square', imageUrl: '/images/shapes/square.svg', description: '正方形有4条边', sides: 4, subCategory: 'basic' },
  { id: 403, name: '三角形', nameEn: 'Triangle', imageUrl: '/images/shapes/triangle.svg', description: '三角形有3条边', sides: 3, subCategory: 'basic' },
  { id: 404, name: '长方形', nameEn: 'Rectangle', imageUrl: '/images/shapes/rectangle.svg', description: '长方形像门', sides: 4, subCategory: 'basic' },
  { id: 405, name: '椭圆形', nameEn: 'Oval', imageUrl: '/images/shapes/oval.svg', description: '椭圆形像鸡蛋', sides: 0, subCategory: 'basic' },
  { id: 406, name: '五角星', nameEn: 'Star', imageUrl: '/images/shapes/star.svg', description: '五角星有5个角', sides: 5, subCategory: 'basic' },
  { id: 407, name: '心形', nameEn: 'Heart', imageUrl: '/images/shapes/heart.svg', description: '心形表示爱', sides: 0, subCategory: 'basic' },
  { id: 408, name: '菱形', nameEn: 'Diamond', imageUrl: '/images/shapes/diamond.svg', description: '菱形有4条边', sides: 4, subCategory: 'basic' },
  { id: 409, name: '五边形', nameEn: 'Pentagon', imageUrl: '/images/shapes/pentagon.svg', description: '五边形有5条边', sides: 5, subCategory: 'basic' },
  { id: 410, name: '六边形', nameEn: 'Hexagon', imageUrl: '/images/shapes/hexagon.svg', description: '六边形有6条边', sides: 6, subCategory: 'basic' }
]

// 形状分类
export const SHAPE_CATEGORIES = {
  basic: { name: '基础形状', ids: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410] }
}
