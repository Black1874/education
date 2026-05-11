// 字母数据配置

export const LETTERS_DATA = [
  // A-M
  { id: 601, name: 'A', nameLower: 'a', imageUrl: '/images/letters/a.svg', description: 'A是第一个字母', pronunciation: 'ei', subCategory: 'first' },
  { id: 602, name: 'B', nameLower: 'b', imageUrl: '/images/letters/b.svg', description: 'B像两个肚子', pronunciation: 'bi:', subCategory: 'first' },
  { id: 603, name: 'C', nameLower: 'c', imageUrl: '/images/letters/c.svg', description: 'C像月亮', pronunciation: 'si:', subCategory: 'first' },
  { id: 604, name: 'D', nameLower: 'd', imageUrl: '/images/letters/d.svg', description: 'D像半圆', pronunciation: 'di:', subCategory: 'first' },
  { id: 605, name: 'E', nameLower: 'e', imageUrl: '/images/letters/e.svg', description: 'E像梳子', pronunciation: 'i:', subCategory: 'first' },
  { id: 606, name: 'F', nameLower: 'f', imageUrl: '/images/letters/f.svg', description: 'F像旗子', pronunciation: 'ef', subCategory: 'first' },
  { id: 607, name: 'G', nameLower: 'g', imageUrl: '/images/letters/g.svg', description: 'G像钩子', pronunciation: 'dʒi:', subCategory: 'first' },
  { id: 608, name: 'H', nameLower: 'h', imageUrl: '/images/letters/h.svg', description: 'H像梯子', pronunciation: 'eitʃ', subCategory: 'first' },
  { id: 609, name: 'I', nameLower: 'i', imageUrl: '/images/letters/i.svg', description: 'I像蜡烛', pronunciation: 'ai', subCategory: 'first' },
  { id: 610, name: 'J', nameLower: 'j', imageUrl: '/images/letters/j.svg', description: 'J像钩子', pronunciation: 'dʒei', subCategory: 'first' },
  { id: 611, name: 'K', nameLower: 'k', imageUrl: '/images/letters/k.svg', description: 'K像踢腿', pronunciation: 'kei', subCategory: 'first' },
  { id: 612, name: 'L', nameLower: 'l', imageUrl: '/images/letters/l.svg', description: 'L像直角', pronunciation: 'el', subCategory: 'first' },
  { id: 613, name: 'M', nameLower: 'm', imageUrl: '/images/letters/m.svg', description: 'M像山峰', pronunciation: 'em', subCategory: 'first' },

  // N-Z
  { id: 614, name: 'N', nameLower: 'n', imageUrl: '/images/letters/n.svg', description: 'N像门', pronunciation: 'en', subCategory: 'second' },
  { id: 615, name: 'O', nameLower: 'o', imageUrl: '/images/letters/o.svg', description: 'O像圆圈', pronunciation: 'əu', subCategory: 'second' },
  { id: 616, name: 'P', nameLower: 'p', imageUrl: '/images/letters/p.svg', description: 'P像旗子', pronunciation: 'pi:', subCategory: 'second' },
  { id: 617, name: 'Q', nameLower: 'q', imageUrl: '/images/letters/q.svg', description: 'Q像气球', pronunciation: 'kju:', subCategory: 'second' },
  { id: 618, name: 'R', nameLower: 'r', imageUrl: '/images/letters/r.svg', description: 'R像人走路', pronunciation: 'ɑ:', subCategory: 'second' },
  { id: 619, name: 'S', nameLower: 's', imageUrl: '/images/letters/s.svg', description: 'S像蛇', pronunciation: 'es', subCategory: 'second' },
  { id: 620, name: 'T', nameLower: 't', imageUrl: '/images/letters/t.svg', description: 'T像伞', pronunciation: 'ti:', subCategory: 'second' },
  { id: 621, name: 'U', nameLower: 'u', imageUrl: '/images/letters/u.svg', description: 'U像杯子', pronunciation: 'ju:', subCategory: 'second' },
  { id: 622, name: 'V', nameLower: 'v', imageUrl: '/images/letters/v.svg', description: 'V像胜利', pronunciation: 'vi:', subCategory: 'second' },
  { id: 623, name: 'W', nameLower: 'w', imageUrl: '/images/letters/w.svg', description: 'W像波浪', pronunciation: 'dʌblju:', subCategory: 'second' },
  { id: 624, name: 'X', nameLower: 'x', imageUrl: '/images/letters/x.svg', description: 'X像叉叉', pronunciation: 'eks', subCategory: 'second' },
  { id: 625, name: 'Y', nameLower: 'y', imageUrl: '/images/letters/y.svg', description: 'Y像树杈', pronunciation: 'wai', subCategory: 'second' },
  { id: 626, name: 'Z', nameLower: 'z', imageUrl: '/images/letters/z.svg', description: 'Z像闪电', pronunciation: 'zi:', subCategory: 'second' }
]

// 字母分类
export const LETTER_CATEGORIES = {
  first: { name: 'A-M', ids: [601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613] },
  second: { name: 'N-Z', ids: [614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626] }
}
