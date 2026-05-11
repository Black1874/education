# 资源与代码对应关系说明

## 📋 资源清单文件

- **完整清单**：`docs/resource_list_complete.csv` ✅ 已生成
- **包含内容**：130种资源（50动物 + 40水果 + 40蔬菜）
- **每个资源包含**：
  - 目录路径
  - 文件名
  - 中文名称
  - 尺寸规格
  - AI提示词（英文）
  - AI提示词（中文）

## 🔗 代码与资源的对应关系

### 1. 动物资源（50种）

#### 代码位置
`frontend/src/modules/block1/views/learning/LearningInteractive.vue`

#### 资源路径格式
```typescript
imageUrl: '/images/animals/cat.svg'  // 占位图
// 替换为：
imageUrl: '/images/animals/cat.png'  // AI生成的真实图片
```

#### 文件名对应
| 代码中的ID | 中文名称 | 文件名 | 路径 |
|-----------|---------|--------|------|
| 1 | 小猫 | cat.png | frontend/public/images/animals/cat.png |
| 2 | 小狗 | dog.png | frontend/public/images/animals/dog.png |
| 3 | 小鸡 | chicken.png | frontend/public/images/animals/chicken.png |
| ... | ... | ... | ... |

**完整列表**：见 `resource_list_complete.csv` 第2-51行

---

### 2. 水果资源（40种）

#### 代码位置
`frontend/src/config/fruits.ts`

#### 资源路径格式
```typescript
imageUrl: '/images/fruits/apple.svg'  // 占位图
// 替换为：
imageUrl: '/images/fruits/apple.png'  // AI生成的真实图片
```

#### 文件名对应
| 代码中的ID | 中文名称 | 文件名 | 路径 |
|-----------|---------|--------|------|
| 101 | 苹果 | apple.png | frontend/public/images/fruits/apple.png |
| 102 | 香蕉 | banana.png | frontend/public/images/fruits/banana.png |
| 103 | 橙子 | orange.png | frontend/public/images/fruits/orange.png |
| ... | ... | ... | ... |

**完整列表**：见 `resource_list_complete.csv` 第52-91行

---

### 3. 蔬菜资源（40种）

#### 代码位置
`frontend/src/config/vegetables.ts`

#### 资源路径格式
```typescript
imageUrl: '/images/vegetables/cabbage.svg'  // 占位图
// 替换为：
imageUrl: '/images/vegetables/cabbage.png'  // AI生成的真实图片
```

#### 文件名对应
| 代码中的ID | 中文名称 | 文件名 | 路径 |
|-----------|---------|--------|------|
| 201 | 白菜 | cabbage.png | frontend/public/images/vegetables/cabbage.png |
| 202 | 菠菜 | spinach.png | frontend/public/images/vegetables/spinach.png |
| 203 | 生菜 | lettuce.png | frontend/public/images/vegetables/lettuce.png |
| ... | ... | ... | ... |

**完整列表**：见 `resource_list_complete.csv` 第92-131行

---

## 🎨 如何使用资源清单

### 步骤1：打开CSV文件
```bash
# 使用Excel打开
docs/resource_list_complete.csv
```

### 步骤2：复制AI提示词
- 选择一行（如：小猫）
- 复制"AI提示词（英文）"或"AI提示词（中文）"列

### 步骤3：生成图片
1. 访问 DALL-E / Midjourney / Stable Diffusion
2. 粘贴提示词
3. 生成图片（512x512px）
4. 下载为PNG格式

### 步骤4：保存文件
- 按照"文件名"列重命名（如：cat.png）
- 保存到"目录"列指定的路径

### 步骤5：替换占位图
- 删除旧的 `.svg` 占位图
- 放入新的 `.png` 真实图片
- 刷新浏览器查看效果

---

## 📂 目录结构

```
frontend/public/images/
├── animals/          # 50种动物
│   ├── cat.png
│   ├── dog.png
│   ├── panda.png
│   └── ...
├── fruits/           # 40种水果
│   ├── apple.png
│   ├── banana.png
│   ├── orange.png
│   └── ...
└── vegetables/       # 40种蔬菜
    ├── cabbage.png
    ├── spinach.png
    ├── carrot.png
    └── ...
```

---

## ⚠️ 重要提示

### 1. 文件名必须完全匹配
代码中使用的文件名和实际文件名必须一致（区分大小写）：
```typescript
// 代码中
imageUrl: '/images/animals/cat.png'

// 文件系统中
frontend/public/images/animals/cat.png  ✅ 正确
frontend/public/images/animals/Cat.png  ❌ 错误（大小写不匹配）
frontend/public/images/animals/cat.jpg  ❌ 错误（扩展名不匹配）
```

### 2. 当前使用占位图
目前代码中使用的是 `.svg` 占位图：
```typescript
imageUrl: '/images/animals/cat.svg'  // 当前
```

替换真实图片后需要修改为：
```typescript
imageUrl: '/images/animals/cat.png'  // 替换后
```

或者直接将PNG文件命名为 `.svg` 扩展名（不推荐）。

### 3. 批量替换路径
如果要批量替换所有 `.svg` 为 `.png`，可以全局搜索替换：
```
查找：.svg
替换为：.png
```

---

## 🔄 更新代码中的路径

### 动物（已在代码中）
文件：`frontend/src/modules/block1/views/learning/LearningInteractive.vue`

需要将所有 `.svg` 改为 `.png`：
```typescript
// 之前
imageUrl: '/images/animals/cat.svg'

// 之后
imageUrl: '/images/animals/cat.png'
```

### 水果（需要集成）
文件：`frontend/src/config/fruits.ts`

已经使用 `.svg`，需要改为 `.png`。

### 蔬菜（需要集成）
文件：`frontend/src/config/vegetables.ts`

已经使用 `.svg`，需要改为 `.png`。

---

## 📊 资源统计

| 类别 | 数量 | 文件格式 | 尺寸 | 总大小估算 |
|------|------|---------|------|-----------|
| 动物 | 50种 | PNG | 512x512 | ~5MB |
| 水果 | 40种 | PNG | 512x512 | ~4MB |
| 蔬菜 | 40种 | PNG | 512x512 | ~4MB |
| **总计** | **130种** | **PNG** | **512x512** | **~13MB** |

---

## ✅ 验证清单

生成资源后，请检查：

- [ ] 所有文件名与CSV清单完全匹配
- [ ] 所有图片尺寸为512x512px
- [ ] 所有图片格式为PNG
- [ ] 所有图片背景为白色或透明
- [ ] 所有图片风格一致（卡通扁平风格）
- [ ] 代码中的路径已更新为 `.png`
- [ ] 刷新浏览器可以看到新图片

---

## 🎯 快速测试

生成前3个动物图片测试：
1. cat.png（小猫）
2. dog.png（小狗）
3. panda.png（熊猫）

放入 `frontend/public/images/animals/` 目录，刷新浏览器查看效果。

---

**资源清单已完整生成！** 🎉

现在可以按照CSV清单批量生成所有130种资源图片了。
