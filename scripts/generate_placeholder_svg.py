#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成占位SVG文件
为所有动物、水果、蔬菜生成占位图
"""

import os

# 动物数据（50种）- 使用emoji
ANIMALS = [
    ("cat.svg", "小猫", "🐱", "#FFE4E1"),
    ("dog.svg", "小狗", "🐶", "#E6F3FF"),
    ("chicken.svg", "小鸡", "🐤", "#FFF9E6"),
    ("duck.svg", "鸭子", "🦆", "#FFFACD"),
    ("pig.svg", "小猪", "🐷", "#FFE4E1"),
    ("rabbit.svg", "兔子", "🐰", "#FFF0F5"),
    ("sheep.svg", "小羊", "🐑", "#F5F5F5"),
    ("cow.svg", "奶牛", "🐮", "#FFFAF0"),
    ("horse.svg", "小马", "🐴", "#FFF8DC"),
    ("goose.svg", "鹅", "🦢", "#F0F8FF"),
    ("hamster.svg", "仓鼠", "🐹", "#FFE4B5"),
    ("goldfish.svg", "金鱼", "🐠", "#E0FFFF"),
    ("panda.svg", "熊猫", "🐼", "#F0F0F0"),
    ("lion.svg", "狮子", "🦁", "#FFF8DC"),
    ("tiger.svg", "老虎", "🐯", "#FFE4B5"),
    ("elephant.svg", "大象", "🐘", "#E8E8E8"),
    ("giraffe.svg", "长颈鹿", "🦒", "#FFFACD"),
    ("monkey.svg", "猴子", "🐵", "#FFE4C4"),
    ("kangaroo.svg", "袋鼠", "🦘", "#F5DEB3"),
    ("zebra.svg", "斑马", "🦓", "#F5F5F5"),
    ("hippo.svg", "河马", "🦛", "#D3D3D3"),
    ("rhino.svg", "犀牛", "🦏", "#C0C0C0"),
    ("fox.svg", "狐狸", "🦊", "#FFE4B5"),
    ("wolf.svg", "狼", "🐺", "#D3D3D3"),
    ("bear.svg", "熊", "🐻", "#D2B48C"),
    ("deer.svg", "鹿", "🦌", "#F5DEB3"),
    ("squirrel.svg", "松鼠", "🐿️", "#FFE4C4"),
    ("sparrow.svg", "麻雀", "🐦", "#F5F5DC"),
    ("parrot.svg", "鹦鹉", "🦜", "#E0FFE0"),
    ("eagle.svg", "老鹰", "🦅", "#F5F5DC"),
    ("pigeon.svg", "鸽子", "🕊️", "#F0F0F0"),
    ("peacock.svg", "孔雀", "🦚", "#E0F8F7"),
    ("penguin.svg", "企鹅", "🐧", "#F0F8FF"),
    ("ostrich.svg", "鸵鸟", "🦤", "#F5DEB3"),
    ("owl.svg", "猫头鹰", "🦉", "#F5F5DC"),
    ("swan.svg", "天鹅", "🦢", "#FFFAFA"),
    ("dolphin.svg", "海豚", "🐬", "#E0F8FF"),
    ("whale.svg", "鲸鱼", "🐋", "#E0F8FF"),
    ("crab.svg", "螃蟹", "🦀", "#FFE4E1"),
    ("turtle.svg", "海龟", "🐢", "#E0F8E0"),
    ("octopus.svg", "章鱼", "🐙", "#E6E6FA"),
    ("starfish.svg", "海星", "⭐", "#FFE4B5"),
    ("shark.svg", "鲨鱼", "🦈", "#D3D3D3"),
    ("jellyfish.svg", "水母", "🪼", "#FFE4E1"),
    ("butterfly.svg", "蝴蝶", "🦋", "#FFE4E1"),
    ("bee.svg", "蜜蜂", "🐝", "#FFF8DC"),
    ("ant.svg", "蚂蚁", "🐜", "#F5F5F5"),
    ("ladybug.svg", "瓢虫", "🐞", "#FFE4E1"),
    ("dragonfly.svg", "蜻蜓", "🦟", "#E0FFE0"),
    ("snail.svg", "蜗牛", "🐌", "#F5DEB3"),
]

# 水果数据（40种）
FRUITS = [
    ("apple.svg", "苹果", "🍎", "#FFE4E1"),
    ("banana.svg", "香蕉", "🍌", "#FFFACD"),
    ("orange.svg", "橙子", "🍊", "#FFE4B5"),
    ("grape.svg", "葡萄", "🍇", "#E6E6FA"),
    ("watermelon.svg", "西瓜", "🍉", "#FFE4E1"),
    ("strawberry.svg", "草莓", "🍓", "#FFE4E1"),
    ("cherry.svg", "樱桃", "🍒", "#FFE4E1"),
    ("peach.svg", "桃子", "🍑", "#FFE4E1"),
    ("pear.svg", "梨", "🍐", "#F0FFF0"),
    ("pineapple.svg", "菠萝", "🍍", "#FFFACD"),
    ("mango.svg", "芒果", "🥭", "#FFE4B5"),
    ("dragonfruit.svg", "火龙果", "🐉", "#FFE4E1"),
    ("durian.svg", "榴莲", "🌰", "#FFFACD"),
    ("mangosteen.svg", "山竹", "🟣", "#E6E6FA"),
    ("lychee.svg", "荔枝", "🔴", "#FFE4E1"),
    ("longan.svg", "龙眼", "🟤", "#F5DEB3"),
    ("coconut.svg", "椰子", "🥥", "#FFFAF0"),
    ("papaya.svg", "木瓜", "🟠", "#FFE4B5"),
    ("lemon.svg", "柠檬", "🍋", "#FFFACD"),
    ("kiwi.svg", "猕猴桃", "🥝", "#E0FFE0"),
    ("pomelo.svg", "柚子", "🟡", "#FFFACD"),
    ("pomegranate.svg", "石榴", "🔴", "#FFE4E1"),
    ("persimmon.svg", "柿子", "🟠", "#FFE4B5"),
    ("blueberry.svg", "蓝莓", "🫐", "#E6E6FA"),
    ("raspberry.svg", "树莓", "🔴", "#FFE4E1"),
    ("blackberry.svg", "黑莓", "⚫", "#E6E6FA"),
    ("mulberry.svg", "桑葚", "🟣", "#E6E6FA"),
    ("bayberry.svg", "杨梅", "🔴", "#FFE4E1"),
    ("cantaloupe.svg", "哈密瓜", "🍈", "#FFE4B5"),
    ("fig.svg", "无花果", "🟣", "#E6E6FA"),
    ("jujube.svg", "枣", "🔴", "#FFE4E1"),
    ("plum.svg", "李子", "🟣", "#E6E6FA"),
    ("apricot.svg", "杏", "🟠", "#FFE4B5"),
    ("loquat.svg", "枇杷", "🟡", "#FFFACD"),
    ("starfruit.svg", "杨桃", "⭐", "#FFFACD"),
    ("passionfruit.svg", "百香果", "🟣", "#E6E6FA"),
    ("avocado.svg", "牛油果", "🥑", "#E0FFE0"),
    ("waxapple.svg", "莲雾", "🔴", "#FFE4E1"),
    ("pepino.svg", "人参果", "🟡", "#FFFACD"),
    ("custardapple.svg", "释迦", "🟢", "#E0FFE0"),
]

# 蔬菜数据（40种）
VEGETABLES = [
    ("cabbage.svg", "白菜", "🥬", "#E0FFE0"),
    ("spinach.svg", "菠菜", "🥬", "#E0FFE0"),
    ("lettuce.svg", "生菜", "🥬", "#E0FFE0"),
    ("rapeseed.svg", "油菜", "🥬", "#E0FFE0"),
    ("celery.svg", "芹菜", "🥬", "#E0FFE0"),
    ("chive.svg", "韭菜", "🥬", "#E0FFE0"),
    ("waterspinach.svg", "空心菜", "🥬", "#E0FFE0"),
    ("carrot.svg", "胡萝卜", "🥕", "#FFE4B5"),
    ("radish.svg", "萝卜", "🥕", "#FFFAFA"),
    ("potato.svg", "土豆", "🥔", "#F5DEB3"),
    ("sweetpotato.svg", "红薯", "🍠", "#FFE4B5"),
    ("onion.svg", "洋葱", "🧅", "#E6E6FA"),
    ("garlic.svg", "大蒜", "🧄", "#FFFAFA"),
    ("ginger.svg", "生姜", "🫚", "#F5DEB3"),
    ("lotus.svg", "莲藕", "🪷", "#FFFAF0"),
    ("yam.svg", "山药", "🥔", "#FFFAF0"),
    ("tomato.svg", "番茄", "🍅", "#FFE4E1"),
    ("cucumber.svg", "黄瓜", "🥒", "#E0FFE0"),
    ("eggplant.svg", "茄子", "🍆", "#E6E6FA"),
    ("pepper.svg", "辣椒", "🌶️", "#FFE4E1"),
    ("pumpkin.svg", "南瓜", "🎃", "#FFE4B5"),
    ("wintermelon.svg", "冬瓜", "🟢", "#E0FFE0"),
    ("luffa.svg", "丝瓜", "🥒", "#E0FFE0"),
    ("bittergourd.svg", "苦瓜", "🥒", "#E0FFE0"),
    ("bellpepper.svg", "青椒", "🫑", "#E0FFE0"),
    ("bean.svg", "豆角", "🫘", "#E0FFE0"),
    ("pea.svg", "豌豆", "🫛", "#E0FFE0"),
    ("edamame.svg", "毛豆", "🫛", "#E0FFE0"),
    ("stringbean.svg", "四季豆", "🫘", "#E0FFE0"),
    ("flatbean.svg", "扁豆", "🫘", "#E0FFE0"),
    ("broccoli.svg", "西兰花", "🥦", "#E0FFE0"),
    ("cauliflower.svg", "花菜", "🥦", "#FFFAFA"),
    ("mushroom.svg", "蘑菇", "🍄", "#FFFAF0"),
    ("shiitake.svg", "香菇", "🍄", "#F5DEB3"),
    ("fungus.svg", "木耳", "🍄", "#2F4F4F"),
    ("enoki.svg", "金针菇", "🍄", "#FFFAF0"),
    ("corn.svg", "玉米", "🌽", "#FFFACD"),
    ("bamboo.svg", "竹笋", "🎋", "#F5DEB3"),
    ("asparagus.svg", "芦笋", "🥬", "#E0FFE0"),
    ("okra.svg", "秋葵", "🥒", "#E0FFE0"),
]

SVG_TEMPLATE = '''<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="{bg_color}" rx="32"/>
  <text x="256" y="280" font-size="120" text-anchor="middle">{emoji}</text>
  <text x="256" y="400" font-size="48" text-anchor="middle" fill="#666" font-family="Arial">{name}</text>
</svg>'''

def generate_svg_files():
    """生成所有占位SVG文件"""

    # 创建目录
    os.makedirs('frontend/public/images/animals', exist_ok=True)
    os.makedirs('frontend/public/images/fruits', exist_ok=True)
    os.makedirs('frontend/public/images/vegetables', exist_ok=True)

    # 生成动物SVG
    for filename, name, emoji, bg_color in ANIMALS:
        svg_content = SVG_TEMPLATE.format(bg_color=bg_color, emoji=emoji, name=name)
        filepath = f'frontend/public/images/animals/{filename}'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(svg_content)

    # 生成水果SVG
    for filename, name, emoji, bg_color in FRUITS:
        svg_content = SVG_TEMPLATE.format(bg_color=bg_color, emoji=emoji, name=name)
        filepath = f'frontend/public/images/fruits/{filename}'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(svg_content)

    # 生成蔬菜SVG
    for filename, name, emoji, bg_color in VEGETABLES:
        svg_content = SVG_TEMPLATE.format(bg_color=bg_color, emoji=emoji, name=name)
        filepath = f'frontend/public/images/vegetables/{filename}'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(svg_content)

    print(f"占位SVG生成完成！")
    print(f"   - 动物：{len(ANIMALS)}个文件")
    print(f"   - 水果：{len(FRUITS)}个文件")
    print(f"   - 蔬菜：{len(VEGETABLES)}个文件")
    print(f"   - 总计：{len(ANIMALS) + len(FRUITS) + len(VEGETABLES)}个文件")

if __name__ == "__main__":
    generate_svg_files()
