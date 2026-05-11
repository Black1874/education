// 交通工具数据配置

export const VEHICLES_DATA = [
  // 陆地交通工具
  { id: 701, name: '汽车', nameEn: 'Car', imageUrl: '/images/vehicles/car.svg', description: '汽车在路上跑', type: '陆地', subCategory: 'land' },
  { id: 702, name: '公交车', nameEn: 'Bus', imageUrl: '/images/vehicles/bus.svg', description: '公交车载很多人', type: '陆地', subCategory: 'land' },
  { id: 703, name: '自行车', nameEn: 'Bicycle', imageUrl: '/images/vehicles/bicycle.svg', description: '自行车要踩踏板', type: '陆地', subCategory: 'land' },
  { id: 704, name: '摩托车', nameEn: 'Motorcycle', imageUrl: '/images/vehicles/motorcycle.svg', description: '摩托车跑得快', type: '陆地', subCategory: 'land' },
  { id: 705, name: '火车', nameEn: 'Train', imageUrl: '/images/vehicles/train.svg', description: '火车在铁轨上跑', type: '陆地', subCategory: 'land' },
  { id: 706, name: '地铁', nameEn: 'Subway', imageUrl: '/images/vehicles/subway.svg', description: '地铁在地下跑', type: '陆地', subCategory: 'land' },
  { id: 707, name: '卡车', nameEn: 'Truck', imageUrl: '/images/vehicles/truck.svg', description: '卡车运货物', type: '陆地', subCategory: 'land' },
  { id: 708, name: '出租车', nameEn: 'Taxi', imageUrl: '/images/vehicles/taxi.svg', description: '出租车载客人', type: '陆地', subCategory: 'land' },
  { id: 709, name: '警车', nameEn: 'Police Car', imageUrl: '/images/vehicles/policecar.svg', description: '警车抓坏人', type: '陆地', subCategory: 'land' },
  { id: 710, name: '消防车', nameEn: 'Fire Truck', imageUrl: '/images/vehicles/firetruck.svg', description: '消防车灭火', type: '陆地', subCategory: 'land' },
  { id: 711, name: '救护车', nameEn: 'Ambulance', imageUrl: '/images/vehicles/ambulance.svg', description: '救护车救病人', type: '陆地', subCategory: 'land' },
  { id: 712, name: '挖掘机', nameEn: 'Excavator', imageUrl: '/images/vehicles/excavator.svg', description: '挖掘机挖土', type: '陆地', subCategory: 'land' },

  // 空中交通工具
  { id: 713, name: '飞机', nameEn: 'Airplane', imageUrl: '/images/vehicles/airplane.svg', description: '飞机在天上飞', type: '空中', subCategory: 'air' },
  { id: 714, name: '直升机', nameEn: 'Helicopter', imageUrl: '/images/vehicles/helicopter.svg', description: '直升机有螺旋桨', type: '空中', subCategory: 'air' },
  { id: 715, name: '热气球', nameEn: 'Hot Air Balloon', imageUrl: '/images/vehicles/hotairballoon.svg', description: '热气球慢慢飞', type: '空中', subCategory: 'air' },
  { id: 716, name: '火箭', nameEn: 'Rocket', imageUrl: '/images/vehicles/rocket.svg', description: '火箭飞向太空', type: '空中', subCategory: 'air' },

  // 水上交通工具
  { id: 717, name: '轮船', nameEn: 'Ship', imageUrl: '/images/vehicles/ship.svg', description: '轮船在海上航行', type: '水上', subCategory: 'water' },
  { id: 718, name: '帆船', nameEn: 'Sailboat', imageUrl: '/images/vehicles/sailboat.svg', description: '帆船靠风前进', type: '水上', subCategory: 'water' },
  { id: 719, name: '快艇', nameEn: 'Speedboat', imageUrl: '/images/vehicles/speedboat.svg', description: '快艇跑得快', type: '水上', subCategory: 'water' },
  { id: 720, name: '潜水艇', nameEn: 'Submarine', imageUrl: '/images/vehicles/submarine.svg', description: '潜水艇在水下', type: '水上', subCategory: 'water' }
]

// 交通工具分类
export const VEHICLE_CATEGORIES = {
  land: { name: '陆地交通', ids: [701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712] },
  air: { name: '空中交通', ids: [713, 714, 715, 716] },
  water: { name: '水上交通', ids: [717, 718, 719, 720] }
}
