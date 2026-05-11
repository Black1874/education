#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
资源清单生成脚本
生成完整的CSV资源清单，包含所有动物、水果、蔬菜的AI提示词
"""

import csv

# 动物数据（50种）
ANIMALS = [
    # 家养动物
    ("cat.png", "小猫", "A cute cartoon cat, sitting pose, big eyes, pink and white colors"),
    ("dog.png", "小狗", "A cute cartoon dog, sitting pose with tongue out, brown and beige colors"),
    ("chicken.png", "小鸡", "A cute cartoon chicken, standing pose, yellow and orange colors"),
    ("duck.png", "鸭子", "A cute cartoon duck, swimming pose, yellow body with orange beak"),
    ("pig.png", "小猪", "A cute cartoon pig, sitting pose, pink color with curly tail"),
    ("rabbit.png", "兔子", "A cute cartoon rabbit, sitting pose with long ears, white and pink colors"),
    ("sheep.png", "小羊", "A cute cartoon sheep, standing pose, fluffy white wool"),
    ("cow.png", "奶牛", "A cute cartoon cow, standing pose, black and white spots"),
    ("horse.png", "小马", "A cute cartoon horse, standing pose, brown color with black mane"),
    ("goose.png", "鹅", "A cute cartoon goose, standing pose, white feathers with orange beak"),
    ("hamster.png", "仓鼠", "A cute cartoon hamster, sitting pose holding a seed, orange and white colors"),
    ("goldfish.png", "金鱼", "A cute cartoon goldfish, swimming pose, orange and gold colors"),

    # 野生动物
    ("panda.png", "熊猫", "A cute cartoon panda, sitting pose eating bamboo, black and white colors"),
    ("lion.png", "狮子", "A cute cartoon lion, sitting pose with fluffy mane, yellow and orange colors"),
    ("tiger.png", "老虎", "A cute cartoon tiger, sitting pose, orange with black stripes"),
    ("elephant.png", "大象", "A cute cartoon elephant, standing pose with long trunk, gray color"),
    ("giraffe.png", "长颈鹿", "A cute cartoon giraffe, standing pose with long neck, yellow with brown spots"),
    ("monkey.png", "猴子", "A cute cartoon monkey, sitting pose holding a banana, brown color"),
    ("kangaroo.png", "袋鼠", "A cute cartoon kangaroo, standing pose with baby in pouch, brown color"),
    ("zebra.png", "斑马", "A cute cartoon zebra, standing pose, black and white stripes"),
    ("hippo.png", "河马", "A cute cartoon hippo, standing pose, gray color with big mouth"),
    ("rhino.png", "犀牛", "A cute cartoon rhino, standing pose with horn, gray color"),
    ("fox.png", "狐狸", "A cute cartoon fox, sitting pose with fluffy tail, orange and white colors"),
    ("wolf.png", "狼", "A cute cartoon wolf, sitting pose, gray color"),
    ("bear.png", "熊", "A cute cartoon bear, sitting pose, brown color"),
    ("deer.png", "鹿", "A cute cartoon deer, standing pose with small antlers, brown color"),
    ("squirrel.png", "松鼠", "A cute cartoon squirrel, sitting pose holding a nut, orange and white colors"),

    # 鸟类
    ("sparrow.png", "麻雀", "A cute cartoon sparrow, standing pose, brown and white colors"),
    ("parrot.png", "鹦鹉", "A cute cartoon parrot, standing pose, colorful feathers"),
    ("eagle.png", "老鹰", "A cute cartoon eagle, flying pose, brown and white colors"),
    ("pigeon.png", "鸽子", "A cute cartoon pigeon, standing pose, gray and white colors"),
    ("peacock.png", "孔雀", "A cute cartoon peacock, standing pose with beautiful tail, blue and green colors"),
    ("penguin.png", "企鹅", "A cute cartoon penguin, standing pose, black and white colors"),
    ("ostrich.png", "鸵鸟", "A cute cartoon ostrich, standing pose with long neck, brown color"),
    ("owl.png", "猫头鹰", "A cute cartoon owl, sitting pose on branch, brown and white colors"),
    ("swan.png", "天鹅", "A cute cartoon swan, swimming pose, white color with orange beak"),

    # 海洋动物
    ("dolphin.png", "海豚", "A cute cartoon dolphin, jumping pose, gray and white colors"),
    ("whale.png", "鲸鱼", "A cute cartoon whale, swimming pose, blue and white colors"),
    ("crab.png", "螃蟹", "A cute cartoon crab, standing pose with claws, red and orange colors"),
    ("turtle.png", "海龟", "A cute cartoon sea turtle, swimming pose, green and brown colors"),
    ("octopus.png", "章鱼", "A cute cartoon octopus, swimming pose with eight tentacles, purple color"),
    ("starfish.png", "海星", "A cute cartoon starfish, star shape, orange and yellow colors"),
    ("shark.png", "鲨鱼", "A cute cartoon shark, swimming pose, gray color with white belly"),
    ("jellyfish.png", "水母", "A cute cartoon jellyfish, floating pose, pink and purple colors"),

    # 昆虫
    ("butterfly.png", "蝴蝶", "A cute cartoon butterfly, flying pose with colorful wings"),
    ("bee.png", "蜜蜂", "A cute cartoon bee, flying pose, yellow and black stripes"),
    ("ant.png", "蚂蚁", "A cute cartoon ant, walking pose, black color"),
    ("ladybug.png", "瓢虫", "A cute cartoon ladybug, standing pose, red with black spots"),
    ("dragonfly.png", "蜻蜓", "A cute cartoon dragonfly, flying pose with transparent wings"),
    ("snail.png", "蜗牛", "A cute cartoon snail, crawling pose with spiral shell, brown and beige colors"),
]

# 水果数据（40种）
FRUITS = [
    ("apple.png", "苹果", "A cute cartoon apple, red color with green leaf, smiling face"),
    ("banana.png", "香蕉", "A cute cartoon banana, yellow color, curved shape, smiling face"),
    ("orange.png", "橙子", "A cute cartoon orange, orange color with green leaf, smiling face"),
    ("grape.png", "葡萄", "A cute cartoon grape bunch, purple color, smiling face"),
    ("watermelon.png", "西瓜", "A cute cartoon watermelon, green striped outside with red inside, smiling face"),
    ("strawberry.png", "草莓", "A cute cartoon strawberry, red color with seeds and green leaves, smiling face"),
    ("cherry.png", "樱桃", "A cute cartoon cherry, two red cherries connected, smiling face"),
    ("peach.png", "桃子", "A cute cartoon peach, pink and yellow color with fuzzy texture, smiling face"),
    ("pear.png", "梨", "A cute cartoon pear, yellow-green color, smiling face"),
    ("pineapple.png", "菠萝", "A cute cartoon pineapple, yellow color with spiky leaves on top, smiling face"),
    ("mango.png", "芒果", "A cute cartoon mango, yellow-orange color, smiling face"),
    ("dragonfruit.png", "火龙果", "A cute cartoon dragon fruit, pink outside with green scales, white inside with black seeds"),
    ("durian.png", "榴莲", "A cute cartoon durian, yellow-green color with spiky shell, smiling face"),
    ("mangosteen.png", "山竹", "A cute cartoon mangosteen, purple shell, white inside, smiling face"),
    ("lychee.png", "荔枝", "A cute cartoon lychee, red bumpy shell, white inside, smiling face"),
    ("longan.png", "龙眼", "A cute cartoon longan, brown shell, white inside, smiling face"),
    ("coconut.png", "椰子", "A cute cartoon coconut, brown hairy shell, smiling face"),
    ("papaya.png", "木瓜", "A cute cartoon papaya, orange color, cut in half showing seeds, smiling face"),
    ("lemon.png", "柠檬", "A cute cartoon lemon, bright yellow color, oval shape, smiling face"),
    ("kiwi.png", "猕猴桃", "A cute cartoon kiwi, brown fuzzy outside, green inside with black seeds, smiling face"),
    ("pomelo.png", "柚子", "A cute cartoon pomelo, large yellow-green fruit, smiling face"),
    ("pomegranate.png", "石榴", "A cute cartoon pomegranate, red outside, showing red seeds inside, smiling face"),
    ("persimmon.png", "柿子", "A cute cartoon persimmon, orange color, smiling face"),
    ("blueberry.png", "蓝莓", "A cute cartoon blueberry, small blue round fruit, smiling face"),
    ("raspberry.png", "树莓", "A cute cartoon raspberry, red bumpy texture, smiling face"),
    ("blackberry.png", "黑莓", "A cute cartoon blackberry, dark purple bumpy texture, smiling face"),
    ("mulberry.png", "桑葚", "A cute cartoon mulberry, purple elongated shape, smiling face"),
    ("bayberry.png", "杨梅", "A cute cartoon bayberry, red bumpy texture, smiling face"),
    ("cantaloupe.png", "哈密瓜", "A cute cartoon cantaloupe, orange netted skin, smiling face"),
    ("fig.png", "无花果", "A cute cartoon fig, purple-green color, teardrop shape, smiling face"),
    ("jujube.png", "枣", "A cute cartoon jujube, red oval shape, smiling face"),
    ("plum.png", "李子", "A cute cartoon plum, purple-red color, round shape, smiling face"),
    ("apricot.png", "杏", "A cute cartoon apricot, orange-yellow color, round shape, smiling face"),
    ("loquat.png", "枇杷", "A cute cartoon loquat, golden yellow color, oval shape, smiling face"),
    ("starfruit.png", "杨桃", "A cute cartoon star fruit, yellow color, star shape when cut, smiling face"),
    ("passionfruit.png", "百香果", "A cute cartoon passion fruit, purple wrinkled shell, smiling face"),
    ("avocado.png", "牛油果", "A cute cartoon avocado, green outside, cut in half showing pit, smiling face"),
    ("waxapple.png", "莲雾", "A cute cartoon wax apple, pink-red bell shape, smiling face"),
    ("pepino.png", "人参果", "A cute cartoon pepino, yellow with purple stripes, smiling face"),
    ("custardapple.png", "释迦", "A cute cartoon custard apple, green bumpy texture, smiling face"),
]

# 蔬菜数据（40种）
VEGETABLES = [
    ("cabbage.png", "白菜", "A cute cartoon Chinese cabbage, green leaves, smiling face"),
    ("spinach.png", "菠菜", "A cute cartoon spinach, dark green leaves, smiling face"),
    ("lettuce.png", "生菜", "A cute cartoon lettuce, light green leaves, smiling face"),
    ("rapeseed.png", "油菜", "A cute cartoon rapeseed vegetable, green leaves with yellow flowers, smiling face"),
    ("celery.png", "芹菜", "A cute cartoon celery, green stalks, smiling face"),
    ("chive.png", "韭菜", "A cute cartoon chive, long green leaves, smiling face"),
    ("waterspinach.png", "空心菜", "A cute cartoon water spinach, green hollow stems, smiling face"),
    ("carrot.png", "胡萝卜", "A cute cartoon carrot, orange color with green top, smiling face"),
    ("radish.png", "萝卜", "A cute cartoon radish, white color with green top, smiling face"),
    ("potato.png", "土豆", "A cute cartoon potato, brown oval shape, smiling face"),
    ("sweetpotato.png", "红薯", "A cute cartoon sweet potato, purple-red color, smiling face"),
    ("onion.png", "洋葱", "A cute cartoon onion, purple-white layers, smiling face"),
    ("garlic.png", "大蒜", "A cute cartoon garlic, white bulb with cloves, smiling face"),
    ("ginger.png", "生姜", "A cute cartoon ginger, beige knobby root, smiling face"),
    ("lotus.png", "莲藕", "A cute cartoon lotus root, beige with holes, cut to show pattern, smiling face"),
    ("yam.png", "山药", "A cute cartoon yam, long brown root, smiling face"),
    ("tomato.png", "番茄", "A cute cartoon tomato, red round shape, smiling face"),
    ("cucumber.png", "黄瓜", "A cute cartoon cucumber, green long shape, smiling face"),
    ("eggplant.png", "茄子", "A cute cartoon eggplant, purple long shape, smiling face"),
    ("pepper.png", "辣椒", "A cute cartoon chili pepper, red color, smiling face"),
    ("pumpkin.png", "南瓜", "A cute cartoon pumpkin, orange color with ridges, smiling face"),
    ("wintermelon.png", "冬瓜", "A cute cartoon winter melon, large green oblong shape, smiling face"),
    ("luffa.png", "丝瓜", "A cute cartoon luffa, long green ridged shape, smiling face"),
    ("bittergourd.png", "苦瓜", "A cute cartoon bitter gourd, green bumpy texture, smiling face"),
    ("bellpepper.png", "青椒", "A cute cartoon bell pepper, green color, smiling face"),
    ("bean.png", "豆角", "A cute cartoon green bean, long green pod, smiling face"),
    ("pea.png", "豌豆", "A cute cartoon pea pod, green with round peas inside, smiling face"),
    ("edamame.png", "毛豆", "A cute cartoon edamame, green fuzzy pod, smiling face"),
    ("stringbean.png", "四季豆", "A cute cartoon string bean, green long pod, smiling face"),
    ("flatbean.png", "扁豆", "A cute cartoon flat bean, green flat pod, smiling face"),
    ("broccoli.png", "西兰花", "A cute cartoon broccoli, green tree-like shape, smiling face"),
    ("cauliflower.png", "花菜", "A cute cartoon cauliflower, white tree-like shape, smiling face"),
    ("mushroom.png", "蘑菇", "A cute cartoon mushroom, white cap with brown spots, smiling face"),
    ("shiitake.png", "香菇", "A cute cartoon shiitake mushroom, brown cap, smiling face"),
    ("fungus.png", "木耳", "A cute cartoon wood ear fungus, black wavy shape, smiling face"),
    ("enoki.png", "金针菇", "A cute cartoon enoki mushroom, white thin stems with small caps, smiling face"),
    ("corn.png", "玉米", "A cute cartoon corn, yellow kernels in rows, green husk, smiling face"),
    ("bamboo.png", "竹笋", "A cute cartoon bamboo shoot, beige cone shape, smiling face"),
    ("asparagus.png", "芦笋", "A cute cartoon asparagus, green spear shape, smiling face"),
    ("okra.png", "秋葵", "A cute cartoon okra, green ridged pod, smiling face"),
]

def generate_csv():
    """生成完整的资源清单CSV"""

    base_prompt_en = "for children's education app, simple and friendly style, big eyes, white background, flat design, vector style, kawaii aesthetic, suitable for 3-6 year old kids"
    base_prompt_cn = "儿童教育风格，简单友好，大眼睛，微笑表情，白色背景，扁平设计，矢量风格，适合3-6岁儿童"

    rows = [
        ["目录", "文件名", "中文名称", "尺寸", "AI提示词（英文）", "AI提示词（中文）"]
    ]

    # 添加动物
    for filename, name_cn, desc in ANIMALS:
        full_prompt_en = f"{desc} {base_prompt_en}"
        full_prompt_cn = f"可爱的卡通{name_cn}，{desc.split(',')[1] if ',' in desc else desc}，{base_prompt_cn}"
        rows.append([
            "frontend/public/images/animals/",
            filename,
            name_cn,
            "512x512",
            full_prompt_en,
            full_prompt_cn
        ])

    # 添加水果
    for filename, name_cn, desc in FRUITS:
        full_prompt_en = f"{desc} {base_prompt_en}"
        full_prompt_cn = f"可爱的卡通{name_cn}，{desc.split(',')[1] if ',' in desc else desc}，{base_prompt_cn}"
        rows.append([
            "frontend/public/images/fruits/",
            filename,
            name_cn,
            "512x512",
            full_prompt_en,
            full_prompt_cn
        ])

    # 添加蔬菜
    for filename, name_cn, desc in VEGETABLES:
        full_prompt_en = f"{desc} {base_prompt_en}"
        full_prompt_cn = f"可爱的卡通{name_cn}，{desc.split(',')[1] if ',' in desc else desc}，{base_prompt_cn}"
        rows.append([
            "frontend/public/images/vegetables/",
            filename,
            name_cn,
            "512x512",
            full_prompt_en,
            full_prompt_cn
        ])

    # 写入CSV
    with open('docs/resource_list_complete.csv', 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    print("资源清单已生成！")
    print(f"   - 动物：{len(ANIMALS)}种")
    print(f"   - 水果：{len(FRUITS)}种")
    print(f"   - 蔬菜：{len(VEGETABLES)}种")
    print(f"   - 总计：{len(ANIMALS) + len(FRUITS) + len(VEGETABLES)}种")
    print(f"   - 文件：docs/resource_list_complete.csv")

if __name__ == "__main__":
    generate_csv()
