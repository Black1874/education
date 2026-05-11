#!/bin/bash

# 儿童教育平台资源下载脚本
# 使用方法: bash download-resources.sh

echo "开始下载资源..."

# 创建资源目录
mkdir -p frontend/public/images/animals
mkdir -p frontend/public/images/fruits
mkdir -p frontend/public/images/vegetables
mkdir -p frontend/public/images/icons
mkdir -p frontend/public/sounds/animals
mkdir -p frontend/public/sounds/effects

# 免费资源网站推荐
echo "
========================================
免费资源下载网站推荐
========================================

图片资源：
1. Freepik (https://www.freepik.com/)
   - 搜索: 'cute animal cartoon', 'fruit illustration', 'vegetable cartoon'
   - 下载PNG格式，512x512px

2. Flaticon (https://www.flaticon.com/)
   - 搜索: 'animal icon', 'fruit icon'
   - 下载PNG格式，256x256px

3. unDraw (https://undraw.co/)
   - 可自定义颜色的插画

音效资源：
1. Freesound (https://freesound.org/)
   - 搜索: 'animal sound', 'success sound', 'click sound'
   - 下载MP3格式

2. Zapsplat (https://www.zapsplat.com/)
   - 免费音效库

3. Mixkit (https://mixkit.co/free-sound-effects/)
   - 免费音效

AI生成（推荐）：
1. 图片: DALL-E, Midjourney, Stable Diffusion
   提示词: 'cute cartoon [animal name] for children, simple, colorful, white background'

2. 语音: ElevenLabs, Azure TTS
   生成中文语音: '这是小猫', '这是苹果'

========================================
手动下载步骤
========================================

1. 访问上述网站
2. 搜索并下载资源
3. 重命名文件（如: cat.png, dog.png）
4. 放入对应目录：
   - 动物图片 -> frontend/public/images/animals/
   - 水果图片 -> frontend/public/images/fruits/
   - 音效 -> frontend/public/sounds/

========================================
"

# 创建占位图片（SVG格式）
echo "创建占位图片..."

# 动物占位图
cat > frontend/public/images/animals/cat.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#FFE4E1"/>
  <text x="256" y="256" font-size="48" text-anchor="middle" fill="#FF69B4">🐱</text>
  <text x="256" y="320" font-size="32" text-anchor="middle" fill="#666">小猫</text>
</svg>
EOF

cat > frontend/public/images/animals/dog.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#E6F3FF"/>
  <text x="256" y="256" font-size="48" text-anchor="middle" fill="#4A90E2">🐶</text>
  <text x="256" y="320" font-size="32" text-anchor="middle" fill="#666">小狗</text>
</svg>
EOF

# 水果占位图
cat > frontend/public/images/fruits/apple.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#FFF5E6"/>
  <text x="256" y="256" font-size="48" text-anchor="middle" fill="#FF6B6B">🍎</text>
  <text x="256" y="320" font-size="32" text-anchor="middle" fill="#666">苹果</text>
</svg>
EOF

cat > frontend/public/images/fruits/banana.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#FFFACD"/>
  <text x="256" y="256" font-size="48" text-anchor="middle" fill="#FFD700">🍌</text>
  <text x="256" y="320" font-size="32" text-anchor="middle" fill="#666">香蕉</text>
</svg>
EOF

# 图标占位图
cat > frontend/public/images/icons/animal.svg << 'EOF'
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="120" fill="#FFB6C1"/>
  <text x="128" y="148" font-size="80" text-anchor="middle" fill="white">🐾</text>
</svg>
EOF

cat > frontend/public/images/icons/fruit.svg << 'EOF'
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="120" fill="#FFD700"/>
  <text x="128" y="148" font-size="80" text-anchor="middle" fill="white">🍎</text>
</svg>
EOF

echo "占位图片创建完成！"
echo "请访问上述网站下载真实资源并替换占位图。"
