-- 儿童教育平台数据库初始化脚本（简化版）
-- 创建时间: 2026-04-25
-- 说明: 游戏关卡和进度由前端管理，后端只管理核心数据

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    password_hash VARCHAR(255) COMMENT '密码哈希',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    age_group ENUM('0-3', '3-6', '6-12') DEFAULT '3-6' COMMENT '年龄段',
    wechat_openid VARCHAR(100) UNIQUE COMMENT '微信OpenID',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_wechat_openid (wechat_openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 2. 学习内容表
CREATE TABLE IF NOT EXISTS learning_contents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('animal', 'fruit', 'vegetable', 'color', 'shape', 'number', 'letter', 'vehicle') NOT NULL COMMENT '学习类别',
    sub_category VARCHAR(50) COMMENT '子分类（如动物的家养/野生）',
    name VARCHAR(100) NOT NULL COMMENT '名称',
    name_en VARCHAR(100) COMMENT '英文名称',
    image_url VARCHAR(500) COMMENT '图片URL',
    sound_url VARCHAR(500) COMMENT '声音URL（动物叫声/名称语音）',
    description TEXT COMMENT '描述/介绍',
    extra_data JSON COMMENT '额外数据（如颜色关联物品等）',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category, sub_category),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习内容表';

-- 3. 用户学习记录表
CREATE TABLE IF NOT EXISTS user_learning_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    content_id BIGINT NOT NULL COMMENT '学习内容ID',
    view_count INT DEFAULT 0 COMMENT '查看次数',
    is_favorite TINYINT DEFAULT 0 COMMENT '是否收藏：1是 0否',
    last_view_at DATETIME COMMENT '最后查看时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES learning_contents(id),
    UNIQUE KEY uk_user_content (user_id, content_id),
    INDEX idx_user (user_id),
    INDEX idx_favorite (user_id, is_favorite)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户学习记录表';

-- 4. 用户星星积分表
CREATE TABLE IF NOT EXISTS user_stars (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_stars INT DEFAULT 0 COMMENT '总星星数',
    available_stars INT DEFAULT 0 COMMENT '可用星星数',
    used_stars INT DEFAULT 0 COMMENT '已使用星星数',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户星星积分表';

-- 5. 星星交易记录表
CREATE TABLE IF NOT EXISTS star_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('earn', 'spend') NOT NULL COMMENT '类型：获得/消费',
    amount INT NOT NULL COMMENT '数量',
    source VARCHAR(50) COMMENT '来源：game/learning/achievement',
    description VARCHAR(200) COMMENT '描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星星交易记录表';

-- 6. 成就表
CREATE TABLE IF NOT EXISTS achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '成就名称',
    description TEXT COMMENT '成就描述',
    icon_url VARCHAR(500) COMMENT '图标URL',
    type ENUM('learning', 'game', 'habit', 'special') COMMENT '成就类型',
    reward_stars INT DEFAULT 0 COMMENT '奖励星星数',
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成就表';

-- 7. 用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    achievement_id INT NOT NULL COMMENT '成就ID',
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE KEY uk_user_achievement (user_id, achievement_id),
    INDEX idx_user (user_id),
    INDEX idx_earned (earned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就表';

-- 8. 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    nickname VARCHAR(50) COMMENT '昵称',
    role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor' COMMENT '角色',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 初始化成就数据
INSERT INTO achievements (name, description, icon_url, type, reward_stars, sort_order) VALUES
('动物小学徒', '学习了10种动物', '/icons/achievement_animal_1.png', 'learning', 50, 1),
('动物小专家', '学习了30种动物', '/icons/achievement_animal_2.png', 'learning', 100, 2),
('颜色大师', '学习了所有颜色', '/icons/achievement_color_1.png', 'learning', 50, 3),
('游戏新手', '完成了10个关卡', '/icons/achievement_game_1.png', 'game', 50, 4),
('游戏达人', '完成了50个关卡', '/icons/achievement_game_2.png', 'game', 100, 5),
('完美主义者', '获得了20个三星评价', '/icons/achievement_perfect.png', 'game', 150, 6),
('星星富翁', '累计获得1000颗星星', '/icons/achievement_star.png', 'special', 200, 7),
('每日学习', '连续学习7天', '/icons/achievement_daily.png', 'habit', 100, 8);

-- 创建默认管理员账号（密码: admin123，需要在应用中修改）
INSERT INTO admins (username, password_hash, nickname, role) VALUES
('admin', '$2a$10$placeholder', '超级管理员', 'super_admin');
