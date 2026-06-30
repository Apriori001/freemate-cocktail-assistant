/* ========================================
   MixMate 调酒助手 - 配方数据库
   包含 30+ 精选经典及现代鸡尾酒配方
   ======================================== */

/**
 * 鸡尾酒配方数据库
 * 每个配方对象包含：
 * - id: 唯一标识符
 * - name: 鸡尾酒中英文名称
 * - category: 类别（经典/原创）
 * - base: 主基酒
 * - sweetness/acidity/strength: 1-10 风味评分
 * - flavors: 风味维度标签
 * - occasion: 适合场合
 * - method: 调制法
 * - difficulty: 1-5 星级难度
 * - time: 预计制作时间
 * - alcohol: 预估酒精度
 * - ingredients: 材料列表（含替代品）
 * - steps: 调制步骤
 * - decoration: 装饰建议
 * - tips: 专业小贴士
 * - allergens: 过敏原
 * - story: 背景故事
 */
const cocktailRecipes = [
    // ===== 金酒类 =====
    {
        id: 'gin-tonic',
        name: '金汤力',
        enName: 'Gin Tonic',
        category: '经典',
        base: '金酒',
        sweetness: 2, acidity: 5, strength: 5,
        flavors: ['果香', '草本'],
        occasion: ['朋友聚会', '餐前开胃', '独酌放松'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 12%',
        ingredients: [
            { name: '金酒', amount: '45 ml', note: '' },
            { name: '汤力水', amount: '90 ml', note: '冰镇最佳' },
            { name: '青柠角', amount: '2 瓣', note: '或柠檬片' },
            { name: '冰块', amount: '适量', note: '大冰块更佳' }
        ],
        steps: [
            '在高球杯中放入大冰块冷却杯身',
            '倒入 45 ml 金酒',
            '缓慢注入冰镇汤力水',
            '用长吧勺轻轻搅拌一下',
            '放入青柠角轻轻挤压释放香气后放入杯中装饰'
        ],
        decoration: '青柠角或柠檬片，可根据金酒风格添加迷迭香或黄瓜片',
        tips: '金汤力的关键在于汤力水的品质和温度。优质金酒（如Tanqueray、Bombay Sapphire）可以带出更丰富的风味。黄瓜片搭配植物型金酒会带来清新惊喜。',
        allergens: [],
        story: '诞生于 19 世纪的印度，英国殖民者为了让抗疟的奎宁更易入口，将其与金酒混合，成就了这款永恒经典。'
    },
    {
        id: 'white-lady',
        name: '白色佳人',
        enName: 'White Lady',
        category: '经典',
        base: '金酒',
        sweetness: 5, acidity: 6, strength: 6,
        flavors: ['果香', '花香'],
        occasion: ['浪漫约会', '独酌放松', '朋友聚会'],
        method: '摇和法',
        difficulty: 2,
        time: 5,
        alcohol: '约 24%',
        ingredients: [
            { name: '金酒', amount: '45 ml', note: '' },
            { name: '君度橙酒', amount: '20 ml', note: '或橙味利口酒' },
            { name: '柠檬汁', amount: '20 ml', note: '新鲜榨取' },
            { name: '糖浆', amount: '10 ml', note: '可省略' },
            { name: '蛋清', amount: '1 个', note: '可选，增加泡沫' }
        ],
        steps: [
            '将所有材料倒入雪克壶中',
            '先干摇（不加冰）约 10 秒，使蛋清乳化',
            '加入冰块再次摇晃 15 秒至壶身起霜',
            '用双层滤冰器过滤倒入冰镇马天尼杯',
            '可在表面撒几滴橙味苦精增加层次感'
        ],
        decoration: '柠檬皮扭或橙皮油，在杯口上方挤压释放精油后放入',
        tips: '蛋清能带来丝滑的口感和美丽的泡沫，但需要干摇（无冰）来乳化。对生鸡蛋过敏者可省略或使用蛋清粉替代。',
        allergens: ['鸡蛋'],
        story: '20 世纪 20 年代由传奇调酒师 Harry Craddock 在伦敦 Savoy 酒店创造，以其纯净优雅的口感被誉为"鸡尾酒中的贵妇人"。'
    },
    {
        id: 'negroni',
        name: '尼格罗尼',
        enName: 'Negroni',
        category: '经典',
        base: '金酒',
        sweetness: 4, acidity: 3, strength: 7,
        flavors: ['草本', '香料'],
        occasion: ['餐前开胃', '独酌放松', '浪漫约会'],
        method: '调和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 24%',
        ingredients: [
            { name: '金酒', amount: '30 ml', note: '' },
            { name: '金巴利', amount: '30 ml', note: '或其他苦艾开胃酒' },
            { name: '甜味美思', amount: '30 ml', note: '红味美思' },
            { name: '苏打水', amount: '少量', note: '可选' },
            { name: '橙子片', amount: '1 片', note: '' }
        ],
        steps: [
            '在调酒杯中放入冰块',
            '依次倒入金酒、金巴利和甜味美思各 30 ml',
            '用吧勺缓慢搅拌约 20 秒',
            '过滤倒入装有大冰块的古典杯',
            '用橙片装饰，可滴入几滴橙皮油'
        ],
        decoration: '新鲜橙片，可用火烧橙皮增添烟熏果香',
        tips: '经典的 1:1:1 配方看似简单，但每种材料的品质直接决定成品口感。推荐使用 London Dry Gin + Campari + Carpano Punt e Mes。',
        allergens: [],
        story: '1919 年在意大利佛罗伦萨的 Caffè Casoni 诞生，据说为一位常喝美式咖啡的伯爵（Count Negroni）所创，要求调酒师让他的 Americano 更烈。'
    },
    {
        id: 'martini',
        name: '马天尼',
        enName: 'Martini',
        category: '经典',
        base: '金酒',
        sweetness: 1, acidity: 2, strength: 9,
        flavors: ['草本'],
        occasion: ['独酌放松', '浪漫约会'],
        method: '调和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 32%',
        ingredients: [
            { name: '金酒', amount: '60 ml', note: '建议 London Dry' },
            { name: '干味美思', amount: '15 ml', note: '越少越干' },
            { name: '橙味苦精', amount: '1-2 滴', note: '可选' },
            { name: '橄榄', amount: '1-2 颗', note: '或柠檬皮' }
        ],
        steps: [
            '在冰镇调酒杯中加入冰块',
            '倒入金酒和干味美思',
            '用吧勺轻柔缓慢地搅拌约 30 秒',
            '过滤倒入冰镇马天尼杯',
            '挤几滴柠檬皮精油在表面，或用橄榄串装饰'
        ],
        decoration: '柠檬皮扭或绿色橄榄串',
        tips: '马天尼的哲学在于"干"（Dry）。Extra Dry 意味着味美思极少甚至只是冲洗杯壁。搅拌是关键，切勿摇晃，否则金酒会变浑浊。',
        allergens: [],
        story: '被誉为"鸡尾酒之王"，从 007 系列电影到无数文学作品中的常客。海明威、丘吉尔都是它的忠实粉丝。'
    },

    // ===== 威士忌类 =====
    {
        id: 'old-fashioned',
        name: '古典鸡尾酒',
        enName: 'Old Fashioned',
        category: '经典',
        base: '威士忌',
        sweetness: 5, acidity: 3, strength: 8,
        flavors: ['烟熏', '香料', '果香'],
        occasion: ['独酌放松', '餐后消化', '浪漫约会'],
        method: '捣压/调和',
        difficulty: 2,
        time: 4,
        alcohol: '约 30%',
        ingredients: [
            { name: '波本威士忌', amount: '60 ml', note: '或黑麦威士忌' },
            { name: '方糖', amount: '1 块', note: '或 7.5 ml 糖浆' },
            { name: '安格斯特苦精', amount: '2-3 滴', note: '' },
            { name: '橙味苦精', amount: '1 滴', note: '可选' },
            { name: '橙皮', amount: '1 片', note: '' },
            { name: '樱桃', amount: '1 颗', note: '' }
        ],
        steps: [
            '在古典杯中放入方糖',
            '滴入苦精和少量苏打水（约 10 ml）',
            '用捣棒轻轻压碎方糖（不要捣太碎）',
            '加入冰块和威士忌',
            '缓慢搅拌至糖完全溶解',
            '挤橙皮精油在表面，用橙皮和樱桃装饰'
        ],
        decoration: '橙皮扭和马拉斯奇诺樱桃',
        tips: '使用波本会带来更甜的焦糖和香草味，黑麦则更辛辣有层次。不要过度捣压糖块，否则会产生混浊感。',
        allergens: [],
        story: '最古老的鸡尾酒配方之一，可追溯到 1880 年代的肯塔基。它定义了现代鸡尾酒"烈酒+糖+水+苦精"的基本结构。'
    },
    {
        id: 'whiskey-sour',
        name: '威士忌酸',
        enName: 'Whiskey Sour',
        category: '经典',
        base: '威士忌',
        sweetness: 6, acidity: 7, strength: 6,
        flavors: ['果香', '香料'],
        occasion: ['朋友聚会', '独酌放松'],
        method: '摇和法',
        difficulty: 2,
        time: 5,
        alcohol: '约 22%',
        ingredients: [
            { name: '波本威士忌', amount: '45 ml', note: '' },
            { name: '柠檬汁', amount: '30 ml', note: '新鲜' },
            { name: '糖浆', amount: '20 ml', note: '简单糖浆' },
            { name: '蛋清', amount: '1 个', note: '可选' },
            { name: '安格斯特苦精', amount: '1 滴', note: '' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '先干摇 10 秒乳化蛋清',
            '加入冰块摇晃 15 秒至壶身起霜',
            '过滤倒入装有冰块的古典杯或冰镇碟形杯',
            '滴一滴苦精在泡沫表面作为装饰'
        ],
        decoration: '柠檬片和马拉斯奇诺樱桃，或在泡沫上滴几滴苦精作画',
        tips: '蛋清带来丝滑泡沫和口感，是这款酒的灵魂。如果介意生鸡蛋，可以使用巴氏杀菌蛋或省略（但口感会大打折扣）。',
        allergens: ['鸡蛋'],
        story: '起源于 19 世纪 60 年代，是"Sour"（酸酒）风格的奠基之作。加蛋清的版本称为"Boston Sour"。'
    },
    {
        id: 'manhattan',
        name: '曼哈顿',
        enName: 'Manhattan',
        category: '经典',
        base: '威士忌',
        sweetness: 5, acidity: 4, strength: 8,
        flavors: ['香料', '烟熏', '草本'],
        occasion: ['独酌放松', '浪漫约会', '餐后消化'],
        method: '调和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 28%',
        ingredients: [
            { name: '黑麦威士忌', amount: '45 ml', note: '或波本' },
            { name: '甜味美思', amount: '22 ml', note: '红味美思' },
            { name: '安格斯特苦精', amount: '2 滴', note: '' },
            { name: '马拉斯奇诺樱桃', amount: '1 颗', note: '' }
        ],
        steps: [
            '在冰镇调酒杯中加入冰块',
            '倒入威士忌、甜味美思和苦精',
            '缓慢搅拌 20-30 秒',
            '过滤倒入冰镇碟形杯或马天尼杯',
            '用樱桃串装饰'
        ],
        decoration: '马拉斯奇诺樱桃串',
        tips: '传统使用黑麦威士忌带来更辛辣复杂的口感。甜味美思选择建议：Carpano Antica Formula 或 Martini & Rossi。',
        allergens: [],
        story: '传说是 1874 年在纽约曼哈顿俱乐部为温斯顿·丘吉尔的母亲 Jennie Jerome 创造。是最著名的威士忌鸡尾酒之一。'
    },
    {
        id: 'mojito',
        name: '莫吉托',
        enName: 'Mojito',
        category: '经典',
        base: '朗姆酒',
        sweetness: 5, acidity: 6, strength: 4,
        flavors: ['果香', '草本', '清新'],
        occasion: ['朋友聚会', '夏日解暑'],
        method: '捣压+兑和',
        difficulty: 2,
        time: 5,
        alcohol: '约 13%',
        ingredients: [
            { name: '白朗姆酒', amount: '45 ml', note: '' },
            { name: '新鲜薄荷', amount: '8-10 片', note: '' },
            { name: '青柠', amount: '1/2 个', note: '约 25 ml' },
            { name: '糖浆', amount: '15 ml', note: '或方糖' },
            { name: '苏打水', amount: '适量', note: '' },
            { name: '碎冰', amount: '适量', note: '' }
        ],
        steps: [
            '在高球杯中放入薄荷叶和糖浆',
            '轻轻捣压薄荷叶（只需释放香气，不要捣碎叶片）',
            '挤入青柠汁并放入青柠壳',
            '加入碎冰至杯满',
            '倒入白朗姆酒',
            '注入苏打水，用长吧勺从底部向上翻搅均匀',
            '顶部加更多碎冰'
        ],
        decoration: '新鲜薄荷枝和青柠片，插入吸管',
        tips: '关键在于"轻捣"薄荷——过度捣压会释放出苦味的叶绿素。使用碎冰而非冰块能让酒更快速降温稀释，带来清凉感。',
        allergens: [],
        story: '古巴最著名的鸡尾酒，海明威在哈瓦那 La Bodeguita 酒吧的最爱。据说他曾说："我的 mojito 在 La Bodeguita，我的 daiquiri 在 El Floridita。"'
    },

    // ===== 朗姆酒类 =====
    {
        id: 'daiquiri',
        name: '戴克丽',
        enName: 'Daiquiri',
        category: '经典',
        base: '朗姆酒',
        sweetness: 4, acidity: 8, strength: 6,
        flavors: ['果香'],
        occasion: ['夏日解暑', '餐前开胃', '朋友聚会'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 20%',
        ingredients: [
            { name: '白朗姆酒', amount: '60 ml', note: '建议 Bacardi Superior' },
            { name: '青柠汁', amount: '25 ml', note: '新鲜' },
            { name: '糖浆', amount: '15 ml', note: '简单糖浆' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '用细滤网过滤倒入冰镇碟形杯',
            '不添加装饰以保持纯净'
        ],
        decoration: '无，或用一片青柠片挂杯',
        tips: '看似最简单的配方却是最难完美的之一。完美的酸甜平衡（4:1.5:1 的黄金比例）是关键。冷冻杯子和使用新鲜青柠能提升品质。',
        allergens: [],
        story: '1896 年由美国工程师 Jennings Cox 在古巴的 Daiquirí 铁矿创造。海明威在古巴的 El Floridita 酒吧将其发展为双倍朗姆版。'
    },
    {
        id: 'pina-colada',
        name: '椰林飘香',
        enName: 'Piña Colada',
        category: '经典',
        base: '朗姆酒',
        sweetness: 8, acidity: 3, strength: 4,
        flavors: ['果香', '奶油'],
        occasion: ['朋友聚会', '夏日解暑', '浪漫约会'],
        method: '搅和法',
        difficulty: 2,
        time: 5,
        alcohol: '约 12%',
        ingredients: [
            { name: '白朗姆酒', amount: '45 ml', note: '' },
            { name: '椰奶', amount: '30 ml', note: '' },
            { name: '菠萝汁', amount: '45 ml', note: '新鲜或瓶装' },
            { name: '碎冰', amount: '约 150 g', note: '' }
        ],
        steps: [
            '将朗姆酒、椰奶和菠萝汁倒入搅拌机',
            '加入碎冰',
            '高速搅拌约 15 秒至顺滑',
            '倒入冰镇飓风杯或高球杯',
            '顶部可加少量菠萝汁创造层次'
        ],
        decoration: '菠萝楔和樱桃，插入纸伞和吸管',
        tips: '使用罐装椰奶而非椰浆（太浓稠）。如果想要更浓郁的椰子风味，可以加入一小勺椰子奶油（Coco Lopez）。',
        allergens: [],
        story: '波多黎各的国酒，1952 年由调酒师 Ramón "Monchito" Marrero 创造。名字在西班牙语中意为"过滤的菠萝"。'
    },
    {
        id: 'cuba-libre',
        name: '自由古巴',
        enName: 'Cuba Libre',
        category: '经典',
        base: '朗姆酒',
        sweetness: 5, acidity: 4, strength: 4,
        flavors: ['果香'],
        occasion: ['朋友聚会', '夏日解暑'],
        method: '兑和法',
        difficulty: 1,
        time: 2,
        alcohol: '约 12%',
        ingredients: [
            { name: '白朗姆酒', amount: '50 ml', note: '' },
            { name: '青柠汁', amount: '15 ml', note: '或 1/2 青柠角' },
            { name: '可乐', amount: '100 ml', note: '冰镇' },
            { name: '冰块', amount: '适量', note: '' }
        ],
        steps: [
            '在高球杯中放入冰块',
            '挤入青柠汁并放入青柠角',
            '倒入白朗姆酒',
            '注满冰镇可乐',
            '轻轻搅拌一下'
        ],
        decoration: '青柠角',
        tips: '可乐的品质很重要，使用普通可口可乐而非无糖或其他替代品能带来最佳的焦糖风味。',
        allergens: [],
        story: '诞生于 1900 年美西战争后的古巴，美军士兵将可乐和朗姆酒混合，高呼"自由古巴万岁"（Viva Cuba Libre!）而得名。'
    },

    // ===== 伏特加类 =====
    {
        id: 'cosmopolitan',
        name: '大都会',
        enName: 'Cosmopolitan',
        category: '经典',
        base: '伏特加',
        sweetness: 5, acidity: 7, strength: 5,
        flavors: ['果香', '花香'],
        occasion: ['浪漫约会', '朋友聚会', '餐前开胃'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 22%',
        ingredients: [
            { name: '伏特加', amount: '45 ml', note: '柑橘味更佳（Citron）' },
            { name: '君度橙酒', amount: '15 ml', note: '' },
            { name: '青柠汁', amount: '15 ml', note: '新鲜' },
            { name: '蔓越莓汁', amount: '30 ml', note: '' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入冰镇马天尼杯或碟形杯',
            '在杯面用橙皮扭释放精油'
        ],
        decoration: '橙皮扭或新鲜蔓越莓',
        tips: '粉红色泽来自蔓越莓汁。使用 Citron 伏特加（绝对 Citron）能增强柑橘风味。摇和时要充分降温。',
        allergens: [],
        story: '1980 年代末至 90 年代在美国兴起，因电视剧《欲望都市》（Sex and the City）中女主角 Carrie 的喜爱而风靡全球。'
    },
    {
        id: 'bloody-mary',
        name: '血腥玛丽',
        enName: 'Bloody Mary',
        category: '经典',
        base: '伏特加',
        sweetness: 3, acidity: 5, strength: 5,
        flavors: ['香料', '草本'],
        occasion: ['朋友聚会', '餐后消化', '独酌放松'],
        method: '兑和法',
        difficulty: 3,
        time: 6,
        alcohol: '约 15%',
        ingredients: [
            { name: '伏特加', amount: '45 ml', note: '' },
            { name: '番茄汁', amount: '90 ml', note: '' },
            { name: '柠檬汁', amount: '15 ml', note: '' },
            { name: '伍斯特酱', amount: '2-3 滴', note: '' },
            { name: '塔巴斯科辣酱', amount: '1-2 滴', note: '' },
            { name: '黑胡椒', amount: '适量', note: '' },
            { name: '盐', amount: '少量', note: '或杯口盐边' },
            { name: '芹菜苦精', amount: '1 滴', note: '可选' }
        ],
        steps: [
            '可选：用柠檬片擦拭杯口，再蘸上盐或芹菜盐做成盐边',
            '在高球杯中放入冰块',
            '倒入伏特加和番茄汁',
            '加入柠檬汁、伍斯特酱、辣酱、胡椒等调味料',
            '用长吧勺从底部向上搅拌均匀',
            '调整味道直到满意'
        ],
        decoration: '芹菜茎、柠檬角、橄榄，甚至可以放上虾、培根、小汉堡等作为奢华版装饰',
        tips: '被誉为"解酒神酒"，但实际上只是香料刺激了口腔。可以根据个人喜好调整辣度和咸度。经典装饰是芹菜茎和柠檬角。',
        allergens: [],
        story: "1921 年由法国巴黎 Harry的 New York Bar 调酒师 Fernand Petiot 创造，后于 1930 年代在纽约 St Regis 酒店改良成现在的配方。"
    },
    {
        id: 'vodka-martini',
        name: '伏特加马天尼',
        enName: 'Vodka Martini',
        category: '经典',
        base: '伏特加',
        sweetness: 1, acidity: 2, strength: 9,
        flavors: ['纯净'],
        occasion: ['独酌放松', '浪漫约会'],
        method: '调和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 32%',
        ingredients: [
            { name: '伏特加', amount: '60 ml', note: '建议 Grey Goose 或 Belvedere' },
            { name: '干味美思', amount: '15 ml', note: '或更少' },
            { name: '橄榄', amount: '1-2 颗', note: '' }
        ],
        steps: [
            '在调酒杯中加入冰块',
            '倒入伏特加和味美思',
            '轻柔搅拌 20-30 秒',
            '过滤倒入冰镇马天尼杯',
            '用橄榄串或柠檬皮装饰'
        ],
        decoration: '绿色橄榄串或柠檬皮扭',
        tips: '007 邦德常说"摇匀，不要搅拌"（shaken, not stirred），但实际上对于伏特加马天尼来说两者均可，搅拌会更清澈，摇匀有细小气泡更柔和。',
        allergens: [],
        story: '比传统金酒马天尼更现代的版本，因伏特加纯净无色的口感在 20 世纪 50-60 年代开始流行。'
    },
    {
        id: 'moscow-mule',
        name: '莫斯科骡子',
        enName: 'Moscow Mule',
        category: '经典',
        base: '伏特加',
        sweetness: 4, acidity: 6, strength: 4,
        flavors: ['香料', '果香'],
        occasion: ['朋友聚会', '夏日解暑'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 12%',
        ingredients: [
            { name: '伏特加', amount: '45 ml', note: '' },
            { name: '姜汁啤酒', amount: '120 ml', note: '' },
            { name: '青柠汁', amount: '15 ml', note: '' },
            { name: '青柠角', amount: '1 瓣', note: '' },
            { name: '冰块', amount: '适量', note: '' }
        ],
        steps: [
            '在铜杯（Mug）中放入冰块',
            '挤入青柠汁并放入青柠角',
            '倒入伏特加',
            '注入姜汁啤酒',
            '用吧勺轻轻搅拌一下'
        ],
        decoration: '青柠片和薄荷枝',
        tips: '铜杯是这款酒的标志性容器，它能让酒更快速降温并带来独特的金属质感。姜汁啤酒（Ginger Beer）比姜味汽水（Ginger Ale）更辣，效果更好。',
        allergens: [],
        story: '1941 年在洛杉矶由三个商人（伏特加经销商、姜汁啤酒厂主和铜杯制造商）联合推广，成为美国最早流行的伏特加鸡尾酒。'
    },

    // ===== 龙舌兰类 =====
    {
        id: 'margarita',
        name: '玛格丽特',
        enName: 'Margarita',
        category: '经典',
        base: '龙舌兰',
        sweetness: 4, acidity: 8, strength: 6,
        flavors: ['果香'],
        occasion: ['朋友聚会', '夏日解暑', '浪漫约会'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 22%',
        ingredients: [
            { name: '龙舌兰酒', amount: '45 ml', note: '建议 Blanco 或 Reposado' },
            { name: '君度橙酒', amount: '22 ml', note: '或 Triple Sec' },
            { name: '青柠汁', amount: '22 ml', note: '新鲜' },
            { name: '盐', amount: '适量', note: '杯口盐边（可选）' }
        ],
        steps: [
            '用青柠片擦拭玛格丽特杯边缘，蘸上盐或糖做成盐/糖边',
            '在雪克壶中加入冰块',
            '倒入龙舌兰、君度和青柠汁',
            '摇晃至壶身起霜',
            '过滤倒入冰镇玛格丽特杯或加碎冰的杯中'
        ],
        decoration: '青柠片或青柠角，可在盐边和糖边中选择',
        tips: '黄金比例是 2:1:1（龙舌兰:君度:青柠汁）。使用高品质的龙舌兰（如 Patron、Don Julio、1800）能显著提升风味。冷冻杯具能保持酒温更久。',
        allergens: [],
        story: '关于起源有多个版本，最著名的是 1938 年墨西哥调酒师 Carlos Herrera 为纪念一场交通事故中丧生的女演员 Margarita 而创造。'
    },
    {
        id: 'tequila-sunrise',
        name: '龙舌兰日出',
        enName: 'Tequila Sunrise',
        category: '经典',
        base: '龙舌兰',
        sweetness: 7, acidity: 4, strength: 4,
        flavors: ['果香'],
        occasion: ['朋友聚会', '夏日解暑'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 11%',
        ingredients: [
            { name: '龙舌兰酒', amount: '45 ml', note: '' },
            { name: '橙汁', amount: '90 ml', note: '新鲜' },
            { name: '石榴糖浆', amount: '15 ml', note: 'Grenadine' },
            { name: '冰块', amount: '适量', note: '' }
        ],
        steps: [
            '在高球杯中放入冰块',
            '倒入龙舌兰和橙汁',
            '轻轻搅拌一下',
            '将石榴糖浆缓慢倒在吧勺背面沿杯壁流入，使其沉底形成红色分层',
            '不要搅拌，保持日出般的视觉效果'
        ],
        decoration: '橙子片和樱桃，插入吸管',
        tips: '石榴糖浆（Grenadine）虽然叫这个名字但实际上是红石榴糖浆，它比糖浆更稠，是形成分层效果的关键。使用新鲜橙汁提升品质。',
        allergens: [],
        story: '1970 年代初由滚石乐队（The Rolling Stones）在巡演中推广而风靡美国，是当时最流行的龙舌兰鸡尾酒。'
    },
    {
        id: 'paloma',
        name: '帕洛玛',
        enName: 'Paloma',
        category: '经典',
        base: '龙舌兰',
        sweetness: 4, acidity: 6, strength: 4,
        flavors: ['果香', '草本'],
        occasion: ['朋友聚会', '夏日解暑', '餐前开胃'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 11%',
        ingredients: [
            { name: '龙舌兰酒', amount: '50 ml', note: 'Blanco' },
            { name: '西柚汁', amount: '100 ml', note: '新鲜或瓶装' },
            { name: '青柠汁', amount: '15 ml', note: '' },
            { name: '糖浆', amount: '10 ml', note: '可选' },
            { name: '苏打水', amount: '30 ml', note: '' },
            { name: '盐', amount: '少量', note: '杯口盐边可选' }
        ],
        steps: [
            '可选：在高球杯口做盐边',
            '放入冰块',
            '倒入龙舌兰、西柚汁和青柠汁',
            '加入苏打水',
            '轻轻搅拌一下'
        ],
        decoration: '西柚片或青柠片',
        tips: '墨西哥国民饮品，西柚的微苦和龙舌兰的草本气息完美结合。比玛格丽特更清爽易饮，是夏日的完美选择。',
        allergens: [],
        story: '墨西哥最受欢迎的鸡尾酒之一，"Paloma"在西班牙语中是鸽子的意思，象征着自由与轻盈。'
    },

    // ===== 白兰地利口酒类 =====
    {
        id: 'sidecar',
        name: '边车',
        enName: 'Sidecar',
        category: '经典',
        base: '白兰地',
        sweetness: 5, acidity: 6, strength: 7,
        flavors: ['果香'],
        occasion: ['餐后消化', '独酌放松', '浪漫约会'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 26%',
        ingredients: [
            { name: '干邑白兰地', amount: '50 ml', note: '或 Armagnac' },
            { name: '君度橙酒', amount: '20 ml', note: '' },
            { name: '柠檬汁', amount: '20 ml', note: '新鲜' },
            { name: '糖浆', amount: '5 ml', note: '可选' },
            { name: '糖', amount: '适量', note: '杯口糖边可选' }
        ],
        steps: [
            '可选：用柠檬片擦拭杯口，蘸上糖做成糖边',
            '将所有材料倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入冰镇碟形杯或马天尼杯'
        ],
        decoration: '柠檬皮扭或橙片',
        tips: '传统使用 VSOP 或更好的干邑，甜度和复杂度都更出色。酸甜平衡很重要，可以根据个人口味加减糖浆。',
        allergens: [],
        story: '第一次世界大战时期在巴黎或伦敦的军官俱乐部诞生，名字据说来自经常坐在摩托车边车（sidecar）的军官常客。'
    },
    {
        id: 'between-the-sheets',
        name: '床笫之间',
        enName: 'Between the Sheets',
        category: '经典',
        base: '白兰地',
        sweetness: 5, acidity: 6, strength: 7,
        flavors: ['果香'],
        occasion: ['浪漫约会', '独酌放松', '餐后消化'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 25%',
        ingredients: [
            { name: '干邑白兰地', amount: '30 ml', note: '' },
            { name: '白朗姆酒', amount: '30 ml', note: '' },
            { name: '君度橙酒', amount: '30 ml', note: '' },
            { name: '柠檬汁', amount: '30 ml', note: '新鲜' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入冰镇碟形杯'
        ],
        decoration: '橙皮扭',
        tips: '三种烈酒+果汁的组合，看似简单但每种材料的比例和品质决定最终口感。柠檬的酸需要刚好平衡烈酒的刺激。',
        allergens: [],
        story: '1930 年代由传奇调酒师 Harry Craddock 创造，因其中性的色泽和浪漫的名字得名，在禁酒令时期的美国非常流行。'
    },
    {
        id: 'espresso-martini',
        name: '浓缩咖啡马天尼',
        enName: 'Espresso Martini',
        category: '经典',
        base: '伏特加',
        sweetness: 6, acidity: 2, strength: 7,
        flavors: ['巧克力', '坚果', '香料'],
        occasion: ['餐后消化', '浪漫约会', '朋友聚会'],
        method: '摇和法',
        difficulty: 3,
        time: 5,
        alcohol: '约 22%',
        ingredients: [
            { name: '伏特加', amount: '50 ml', note: '' },
            { name: '咖啡利口酒', amount: '25 ml', note: 'Kahlúa 或 Tia Maria' },
            { name: '浓缩咖啡', amount: '30 ml', note: '新鲜制作并冷却' },
            { name: '糖浆', amount: '10 ml', note: '简单糖浆或焦糖糖浆' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '加入大量冰块（因为浓缩咖啡通常还有点温度）',
            '用力摇晃约 15 秒至壶身起霜',
            '用细滤网过滤倒入冰镇马天尼杯',
            '表面的咖啡泡沫是重要标志'
        ],
        decoration: '3 颗咖啡豆放在泡沫上（代表运气、健康和财富）',
        tips: '刚做的浓缩咖啡需要稍微冷却一下，否则会让冰块快速融化导致过度稀释。摇晃时要用力以产生美丽的咖啡泡沫。',
        allergens: [],
        story: '1980 年代末由伦敦调酒师 Dick Bradsell 创造，被称为"让你清醒又让你醉"的当代经典，是现在世界上最流行的鸡尾酒之一。'
    },
    {
        id: 'amaretto-sour',
        name: '阿玛蕾托酸',
        enName: 'Amaretto Sour',
        category: '经典',
        base: '利口酒',
        sweetness: 7, acidity: 6, strength: 5,
        flavors: ['坚果', '果香'],
        occasion: ['朋友聚会', '餐后消化', '浪漫约会'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 18%',
        ingredients: [
            { name: '阿玛蕾托杏仁利口酒', amount: '45 ml', note: 'Disaronno 推荐' },
            { name: '柠檬汁', amount: '30 ml', note: '新鲜' },
            { name: '糖浆', amount: '15 ml', note: '' },
            { name: '蛋清', amount: '1 个', note: '可选' },
            { name: '安格斯特苦精', amount: '1 滴', note: '' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '先干摇 10 秒乳化蛋清',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入装有冰块的古典杯'
        ],
        decoration: '柠檬片和樱桃，或在泡沫上滴苦精',
        tips: '杏仁利口酒的甜度较高，所以需要足够的柠檬汁来平衡。经典版本会使用蛋清增加丝滑口感，也可以用蛋黄做"费城酸"版本。',
        allergens: ['鸡蛋', '坚果'],
        story: '意大利经典利口酒的现代演绎，Disaronno 以其独特的杏仁和焦糖风味闻名，诞生于 1525 年的一个爱情故事中。'
    },

    // ===== 创意/现代类 =====
    {
        id: 'aperol-spritz',
        name: '阿佩罗气泡酒',
        enName: 'Aperol Spritz',
        category: '现代',
        base: '利口酒',
        sweetness: 6, acidity: 4, strength: 3,
        flavors: ['果香', '草本'],
        occasion: ['朋友聚会', '餐前开胃', '夏日解暑'],
        method: '兑和法',
        difficulty: 1,
        time: 2,
        alcohol: '约 9%',
        ingredients: [
            { name: 'Aperol 利口酒', amount: '60 ml', note: '' },
            { name: '普罗塞克起泡酒', amount: '90 ml', note: '' },
            { name: '苏打水', amount: '30 ml', note: '' },
            { name: '橙片', amount: '1 片', note: '' },
            { name: '冰块', amount: '适量', note: '' }
        ],
        steps: [
            '在大葡萄酒杯或古典杯中放入冰块',
            '倒入 Aperol',
            '加入普罗塞克起泡酒',
            '加入少量苏打水',
            '轻轻搅拌一下',
            '放入橙片装饰'
        ],
        decoration: '新鲜橙片',
        tips: '意大利国民开胃酒。Aperol 比 Campari 更甜更温和，非常适合作为餐前酒或夏日饮品。使用 Prosecco 而非香槟是传统。',
        allergens: [],
        story: '起源于 20 世纪 50 年代的意大利北部（帕多瓦地区），自 2010 年起因其低酒精度和清爽口感成为全球现象级的流行饮品。'
    },
    {
        id: 'mezcal-margarita',
        name: '梅斯卡尔玛格丽特',
        enName: 'Mezcal Margarita',
        category: '现代',
        base: '龙舌兰',
        sweetness: 4, acidity: 7, strength: 6,
        flavors: ['烟熏', '果香'],
        occasion: ['朋友聚会', '浪漫约会', '独酌放松'],
        method: '摇和法',
        difficulty: 2,
        time: 4,
        alcohol: '约 22%',
        ingredients: [
            { name: '梅斯卡尔酒', amount: '45 ml', note: '' },
            { name: '君度橙酒', amount: '20 ml', note: '' },
            { name: '青柠汁', amount: '25 ml', note: '' },
            { name: '龙舌兰糖浆', amount: '10 ml', note: '或普通糖浆' },
            { name: '盐/辣椒盐', amount: '适量', note: '杯口盐边' }
        ],
        steps: [
            '用青柠片擦拭杯口，蘸上盐或辣椒盐',
            '将所有材料倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入冰镇玛格丽特杯'
        ],
        decoration: '青柠片或烤菠萝片',
        tips: '梅斯卡尔带来独特的烟熏气息，比普通龙舌兰更有"野趣"。可以用烤菠萝搭配增添热带风味，或用辣椒盐边增加刺激感。',
        allergens: [],
        story: '近年来因梅斯卡尔的流行而兴起的现代版本，是经典玛格丽特的"烟熏升级版"。'
    },
    {
        id: 'basil-smash',
        name: '罗勒碎饮',
        enName: 'Basil Smash',
        category: '现代',
        base: '金酒',
        sweetness: 4, acidity: 7, strength: 5,
        flavors: ['草本', '果香'],
        occasion: ['朋友聚会', '夏日解暑', '餐前开胃'],
        method: '捣压+摇和',
        difficulty: 3,
        time: 5,
        alcohol: '约 20%',
        ingredients: [
            { name: '金酒', amount: '45 ml', note: '' },
            { name: '新鲜罗勒', amount: '6-8 片', note: '' },
            { name: '青柠汁', amount: '25 ml', note: '' },
            { name: '糖浆', amount: '15 ml', note: '' },
            { name: '苏打水', amount: '30 ml', note: '' }
        ],
        steps: [
            '在雪克壶中放入罗勒和糖浆',
            '轻轻捣压罗勒释放香气',
            '加入金酒、青柠汁和冰块',
            '摇晃至壶身起霜',
            '过滤倒入装有碎冰的古典杯',
            '顶部加少量苏打水'
        ],
        decoration: '新鲜罗勒枝和青柠片',
        tips: '罗勒是关键——泰国罗勒比普通罗勒更有茴香和甘草香气。不要过度捣压罗勒，否则会产生青草苦味。',
        allergens: [],
        story: '2000 年代由哥本哈根的调酒师创造，是"草本/花园风格"现代鸡尾酒的代表作，强调新鲜植物和水果的自然风味。'
    },
    {
        id: 'dark-stormy',
        name: '黑暗风暴',
        enName: 'Dark \'n\' Stormy',
        category: '经典',
        base: '朗姆酒',
        sweetness: 5, acidity: 5, strength: 5,
        flavors: ['香料', '烟熏', '果香'],
        occasion: ['独酌放松', '朋友聚会'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 14%',
        ingredients: [
            { name: '黑朗姆酒', amount: '60 ml', note: "Gosling的 Black Seal 朗姆酒是传统选择" },
            { name: '姜汁啤酒', amount: '100 ml', note: '' },
            { name: '青柠汁', amount: '15 ml', note: '' },
            { name: '青柠角', amount: '1 瓣', note: '' }
        ],
        steps: [
            '在高球杯中放入冰块',
            '倒入黑朗姆酒和青柠汁',
            '注入姜汁啤酒',
            '轻轻搅拌一下',
            '放入青柠角装饰'
        ],
        decoration: '青柠角和薄荷枝',
        tips: "百慕大的国酒。传统必须使用 Gosling的 Black Seal 朗姆酒，但任何深色朗姆酒都可以。姜汁啤酒的辛辣感是灵魂。",
        allergens: [],
        story: "20 世纪 20 年代由在百慕大 Gosling Brothers 朗姆酒厂工作的俄罗斯水手创造，Dark n Stormy 是他们的注册商标。"
    },
    {
        id: 'mai-tai',
        name: '迈泰',
        enName: 'Mai Tai',
        category: '经典',
        base: '朗姆酒',
        sweetness: 7, acidity: 5, strength: 6,
        flavors: ['果香', '热带', '坚果'],
        occasion: ['朋友聚会', '夏日解暑', '浪漫约会'],
        method: '摇和法',
        difficulty: 3,
        time: 5,
        alcohol: '约 18%',
        ingredients: [
            { name: '白朗姆酒', amount: '30 ml', note: '' },
            { name: '黑朗姆酒', amount: '30 ml', note: '' },
            { name: '君度橙酒', amount: '15 ml', note: '' },
            { name: '柠檬汁', amount: '15 ml', note: '' },
            { name: '青柠汁', amount: '15 ml', note: '' },
            { name: '杏仁糖浆', amount: '15 ml', note: 'Orgeat' },
            { name: '石榴糖浆', amount: '10 ml', note: '' }
        ],
        steps: [
            '将所有材料倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入装有碎冰的飓风杯',
            '顶部可淋少量黑朗姆酒增色'
        ],
        decoration: '薄荷枝、菠萝楔、樱桃、纸伞，极尽热带风情',
        tips: 'Orgeat（杏仁糖浆）是关键成分，它带来独特的坚果甜香。不要把它当成简单的糖浆，它是 Mai Tai 风味的核心。',
        allergens: ['坚果'],
        story: "1944 年由 Trader Vic 的 Victor Bergeron 在加州奥克兰创造，Mai Tai 在大溪地语中意为好极了。"
    },
    {
        id: 'americano',
        name: '美式咖啡鸡尾酒',
        enName: 'Americano',
        category: '经典',
        base: '利口酒',
        sweetness: 4, acidity: 4, strength: 5,
        flavors: ['草本', '香料'],
        occasion: ['餐前开胃', '独酌放松'],
        method: '兑和法',
        difficulty: 1,
        time: 2,
        alcohol: '约 12%',
        ingredients: [
            { name: '金巴利', amount: '30 ml', note: '' },
            { name: '甜味美思', amount: '30 ml', note: '' },
            { name: '苏打水', amount: '60 ml', note: '' },
            { name: '橙片', amount: '1 片', note: '' }
        ],
        steps: [
            '在古典杯中放入冰块',
            '倒入金巴利和甜味美思',
            '加入苏打水',
            '轻轻搅拌一下',
            '放入橙片装饰'
        ],
        decoration: '橙片',
        tips: '它是 Negroni 的"祖先"，更加清爽温和，适合入门者或餐前饮用。Campari 的苦味是它的灵魂。',
        allergens: [],
        story: '1900 年代初在意大利的酒吧中诞生，是 Negroni 的前身。据说 Count Negroni 觉得它太温和，要求调酒师加入金酒——于是 Negroni 诞生了。'
    },
    {
        id: 'french-75',
        name: '法式 75',
        enName: 'French 75',
        category: '经典',
        base: '金酒',
        sweetness: 4, acidity: 6, strength: 6,
        flavors: ['果香', '花香'],
        occasion: ['浪漫约会', '朋友聚会', '餐前开胃'],
        method: '摇和+兑和',
        difficulty: 2,
        time: 5,
        alcohol: '约 18%',
        ingredients: [
            { name: '金酒', amount: '30 ml', note: '' },
            { name: '柠檬汁', amount: '15 ml', note: '' },
            { name: '糖浆', amount: '15 ml', note: '' },
            { name: '香槟', amount: '60 ml', note: '或干型起泡酒' }
        ],
        steps: [
            '将金酒、柠檬汁和糖浆倒入雪克壶',
            '加入冰块摇晃至壶身起霜',
            '过滤倒入冰镇香槟杯或碟形杯',
            '缓慢倒入香槟',
            '轻轻搅拌一下'
        ],
        decoration: '柠檬皮扭或长条形柠檬皮卷',
        tips: '使用干型香槟（Brut）或 Prosecco 更清爽。倒入起泡酒后不要再剧烈摇晃，否则气泡会消失。',
        allergens: [],
        story: '1915 年在巴黎的 New York Bar 由 Harry MacElhone 创造，名字来源于法国的 75 毫米野战炮，比喻其"强劲"的酒精力量。'
    }
];

/**
 * 材料分类系统
 * 用于场景一的材料匹配页面
 */
const materialCategories = {
    // 六大基酒
    baseSpirits: [
        { id: 'gin', name: '金酒' },
        { id: 'vodka', name: '伏特加' },
        { id: 'whiskey', name: '威士忌' },
        { id: 'rum', name: '朗姆酒' },
        { id: 'tequila', name: '龙舌兰' },
        { id: 'mezcal', name: '梅斯卡尔' },
        { id: 'brandy', name: '白兰地' }
    ],
    // 利口酒
    liqueurs: [
        { id: 'cointreau', name: '君度橙酒' },
        { id: 'campari', name: '金巴利' },
        { id: 'sweet-vermouth', name: '甜味美思' },
        { id: 'dry-vermouth', name: '干味美思' },
        { id: 'coffee-liqueur', name: '咖啡利口酒' },
        { id: 'amaretto', name: '杏仁利口酒' },
        { id: 'aperol', name: 'Aperol' }
    ],
    // 辅料
    ingredients: [
        { id: 'lemon-juice', name: '柠檬汁' },
        { id: 'lime-juice', name: '青柠汁' },
        { id: 'orange-juice', name: '橙汁' },
        { id: 'grapefruit-juice', name: '西柚汁' },
        { id: 'pineapple-juice', name: '菠萝汁' },
        { id: 'cranberry-juice', name: '蔓越莓汁' },
        { id: 'tomato-juice', name: '番茄汁' },
        { id: 'syrup', name: '糖浆' },
        { id: 'grenadine', name: '石榴糖浆' },
        { id: 'ormond-syrup', name: '杏仁糖浆' },
        { id: 'tonic', name: '汤力水' },
        { id: 'soda', name: '苏打水' },
        { id: 'cola', name: '可乐' },
        { id: 'ginger-beer', name: '姜汁啤酒' },
        { id: 'coconut-milk', name: '椰奶' },
        { id: 'espresso', name: '浓缩咖啡' },
        { id: 'prosecco', name: '起泡酒' },
        { id: 'champagne', name: '香槟' },
        { id: 'egg-white', name: '蛋清' },
        { id: 'bitters', name: '苦精' },
        { id: 'mint', name: '薄荷' },
        { id: 'basil', name: '罗勒' },
        { id: 'rosemary', name: '迷迭香' },
        { id: 'lime', name: '青柠' },
        { id: 'lemon', name: '柠檬' },
        { id: 'orange', name: '橙子' },
        { id: 'olive', name: '橄榄' },
        { id: 'cherry', name: '樱桃' },
        { id: 'pineapple', name: '菠萝' },
        { id: 'cucumber', name: '黄瓜' }
    ]
};

/**
 * 将鸡尾酒配方中的材料名称映射到材料 ID
 * 简化版匹配：使用关键词包含匹配
 */
function matchMaterialToId(materialName) {
    const mapping = {
        '金酒': ['gin'],
        '伏特加': ['vodka'],
        '威士忌': ['whiskey'],
        '波本': ['whiskey'],
        '黑麦': ['whiskey'],
        '朗姆酒': ['rum'],
        '白朗姆': ['rum'],
        '黑朗姆': ['rum'],
        '龙舌兰': ['tequila'],
        '梅斯卡尔': ['mezcal'],
        '白兰地': ['brandy'],
        '干邑': ['brandy'],
        '君度': ['cointreau'],
        '橙味利口': ['cointreau'],
        '金巴利': ['campari'],
        '甜味美思': ['sweet-vermouth'],
        '干味美思': ['dry-vermouth'],
        '咖啡利口': ['coffee-liqueur'],
        '杏仁利口': ['amaretto'],
        '阿玛蕾托': ['amaretto'],
        'Aperol': ['aperol'],
        '柠檬汁': ['lemon-juice'],
        '柠檬': ['lemon-juice', 'lemon'],
        '青柠汁': ['lime-juice'],
        '青柠': ['lime-juice', 'lime'],
        '橙汁': ['orange-juice'],
        '橙子': ['orange-juice', 'orange'],
        '西柚汁': ['grapefruit-juice'],
        '西柚': ['grapefruit-juice'],
        '菠萝汁': ['pineapple-juice'],
        '菠萝': ['pineapple-juice', 'pineapple'],
        '蔓越莓': ['cranberry-juice'],
        '番茄汁': ['tomato-juice'],
        '糖浆': ['syrup'],
        '方糖': ['syrup'],
        '糖': ['syrup'],
        '石榴糖浆': ['grenadine'],
        '杏仁糖浆': ['ormond-syrup'],
        '椰奶': ['coconut-milk'],
        '汤力水': ['tonic'],
        '苏打水': ['soda'],
        '可乐': ['cola'],
        '姜汁啤酒': ['ginger-beer'],
        '浓缩咖啡': ['espresso'],
        '起泡酒': ['prosecco'],
        '普罗塞克': ['prosecco'],
        '香槟': ['champagne'],
        '蛋清': ['egg-white'],
        '苦精': ['bitters'],
        '薄荷': ['mint'],
        '罗勒': ['basil'],
        '迷迭香': ['rosemary'],
        '橄榄': ['olive'],
        '樱桃': ['cherry'],
        '黄瓜': ['cucumber'],
        '橙皮': ['orange'],
        '柠檬皮': ['lemon'],
        '冰': [],
        '冰块': [],
        '碎冰': [],
        '苏打': ['soda'],
        '伍斯特': [],
        '辣酱': [],
        '胡椒': [],
        '盐': [],
        '芹菜': []
    };
    
    for (const [keyword, ids] of Object.entries(mapping)) {
        if (materialName.includes(keyword)) {
            return ids;
        }
    }
    return [];
}

// 将配方数据库导出到全局作用域
window.cocktailRecipes = cocktailRecipes;
window.materialCategories = materialCategories;
window.matchMaterialToId = matchMaterialToId;
