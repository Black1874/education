# 资源生成和替换指南

## 📋 文件说明

- **AI_RESOURCE_GUIDE.md** - 详细的AI生成指南，包含每个资源的提示词
- **resource_list.csv** - 资源清单表格，可导入Excel批量处理
- **RESOURCES.md** - 完整资源需求清单

## 🚀 快速开始（3步完成）

### 第1步：生成图片

#### 方式A：使用在线AI工具（推荐新手）

1. 访问 [DALL-E](https://openai.com/dall-e) 或 [Midjourney](https://www.midjourney.com/)
2. 打开 `AI_RESOURCE_GUIDE.md`
3. 复制对应的AI提示词
4. 生成图片并下载
5. 重命名为指定文件名（如 `cat.png`）

#### 方式B：批量生成（推荐有经验用户）

1. 打开 `resource_list.csv`
2. 使用Python脚本批量调用AI API
3. 自动保存到对应目录

### 第2步：替换文件

将生成的图片复制到对应目录：

```bash
# 动物图片
复制到: frontend/public/images/animals/

# 水果图片
复制到: frontend/public/images/fruits/

# 图标
复制到: frontend/public/images/icons/

# 虚拟宠物
复制到: frontend/public/images/pets/
```

### 第3步：查看效果

1. 刷新浏览器（Ctrl + F5 强制刷新）
2. 访问 http://localhost:5173
3. 查看新图片效果

## 📦 最小资源集（快速测试）

只需生成这9张图片即可看到完整效果：

### 必需资源（9张）

| 文件名 | 位置 | 用途 |
|--------|------|------|
| cat.png | animals/ | 学习页面 |
| dog.png | animals/ | 学习页面 |
| panda.png | animals/ | 学习页面 |
| apple.png | fruits/ | 学习页面 |
| banana.png | fruits/ | 学习页面 |
| orange.png | fruits/ | 学习页面 |
| animal.png | icons/ | 分类图标 |
| fruit.png | icons/ | 分类图标 |
| pet_panda.png | pets/ | 首页宠物 |

**提示词位置**：在 `AI_RESOURCE_GUIDE.md` 中搜索文件名即可找到

## 🎨 AI生成工具推荐

### 免费工具

1. **Bing Image Creator** (免费)
   - 网址：https://www.bing.com/create
   - 基于DALL-E 3
   - 每天免费生成

2. **Leonardo.ai** (免费额度)
   - 网址：https://leonardo.ai
   - 每天150个token
   - 适合批量生成

3. **Stable Diffusion Online** (免费)
   - 网址：https://stablediffusionweb.com
   - 完全免费
   - 速度较慢

### 付费工具（质量更好）

1. **DALL-E 3** (OpenAI)
   - 最佳质量
   - $0.04/张（标准）

2. **Midjourney**
   - 艺术风格最佳
   - $10/月起

## 📝 提示词使用技巧

### 基础模板

所有图片都遵循这个模板：

```
A cute cartoon [动物/水果名称] for children's education app, 
simple and friendly style, 
[姿势描述], 
big eyes, 
[表情描述], 
[颜色描述], 
white background, 
flat design, 
vector style, 
kawaii aesthetic, 
suitable for 3-6 year old kids
```

### 关键词说明

- **cute cartoon** - 可爱卡通风格
- **simple and friendly** - 简单友好
- **big eyes** - 大眼睛（儿童喜欢）
- **white background** - 白色背景（重要！）
- **flat design** - 扁平设计
- **vector style** - 矢量风格
- **kawaii aesthetic** - 可爱美学
- **suitable for 3-6 year old kids** - 适合3-6岁儿童

### 调整技巧

如果生成的图片不满意，可以调整：

1. **太复杂** → 添加 "minimalist, simple"
2. **不够可爱** → 添加 "very cute, adorable, chubby"
3. **颜色太深** → 添加 "pastel colors, soft colors"
4. **背景不干净** → 强调 "pure white background, no shadow"

## 🔄 批量生成脚本（Python）

```python
import csv
import openai  # 或其他AI API

# 读取CSV
with open('resource_list.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        prompt = row['AI提示词（英文）']
        filename = row['文件名']
        directory = row['目录']
        
        # 调用AI API生成图片
        # image = generate_image(prompt)
        # image.save(f"{directory}{filename}")
        
        print(f"生成: {filename}")
```

## ✅ 验证清单

生成完成后，检查：

- [ ] 所有图片都是PNG格式
- [ ] 背景是透明或纯白色
- [ ] 尺寸正确（512x512 或 256x256）
- [ ] 文件名完全匹配（区分大小写）
- [ ] 风格一致（都是卡通扁平风格）
- [ ] 颜色柔和（适合儿童）

## 🐛 常见问题

### Q: 生成的图片背景不是白色？
A: 在提示词中强调 "pure white background, no shadow, no gradient"

### Q: 图片风格不一致？
A: 确保每次都使用相同的基础模板，只修改动物/水果名称部分

### Q: 图片太复杂？
A: 添加 "simple, minimalist, clean design" 到提示词

### Q: 替换后看不到新图片？
A: 强制刷新浏览器（Ctrl + Shift + R 或 Ctrl + F5）

### Q: 文件名大小写重要吗？
A: 是的！必须完全匹配，如 `cat.png` 不能写成 `Cat.png`

## 📞 需要帮助？

如果遇到问题：

1. 检查文件名是否正确
2. 检查文件路径是否正确
3. 检查图片格式是否为PNG
4. 强制刷新浏览器
5. 查看浏览器控制台是否有错误

## 🎯 下一步

资源替换完成后，可以：

1. 继续添加更多动物、水果图片
2. 开发后端API
3. 前端接入真实数据
4. 添加音频资源

---

**祝你生成顺利！** 🎨✨
