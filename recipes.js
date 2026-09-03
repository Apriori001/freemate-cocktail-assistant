/* ============================================================
   MixMate 家庭版调酒助手 - 配方数据库
   - 材料选择以家庭易得、超市可购为主
   - 每种配方包含冰块建议（大冰球/碎冰/方冰等）及稀释速度
   - 提供家庭份量（2-4人份）与单人份
   - 每款配方有器材替代方案、拍照搭配指南
   ============================================================ */

// 材料名称 -> 分类 ID 的映射表（用于材料匹配逻辑）
const materialNameToIdMap = {
    // 基酒类
    '威士忌': ['whiskey'], '波本威士忌': ['whiskey'], '波本': ['whiskey'],
    '白兰地': ['brandy'],
    '金酒': ['gin'], '哥顿金酒': ['gin'], '添加利金酒': ['gin'],
    '朗姆酒': ['rum'], '白朗姆酒': ['rum'], '百加得': ['rum'], '哈瓦那俱乐部': ['rum'],
    '伏特加': ['vodka'], '绝对伏特加': ['vodka'], '斯米诺': ['vodka'], '灰雁': ['vodka'],
    '龙舌兰': ['tequila'], '奥美加': ['tequila'], '唐胡里奥': ['tequila'],
    '红酒': ['wine'], '干红葡萄酒': ['wine'], '白葡萄酒': ['wine'], '干白葡萄酒': ['wine'],

    // 利口酒
    '君度橙酒': ['cointreau'], '君度': ['cointreau'], '橙味利口酒': ['cointreau'], '白橙皮酒': ['cointreau'],
    '咖啡利口酒': ['kahlua'], 'Kahlua': ['kahlua'], '蒂亚玛利亚': ['kahlua'],
    'Aperol 阿佩罗利口酒': ['aperol'], 'Aperol 利口酒': ['aperol'], 'Aperol': ['aperol'], '阿佩罗': ['aperol'],
    '金巴利': ['campari'],
    '接骨木花糖浆': ['elderflower'],

    // 辅料/果汁
    '柠檬': ['lemon'], '柠檬角': ['lemon'], '柠檬汁': ['lemon'], '新鲜柠檬': ['lemon'], '柠檬片': ['lemon'], '柠檬螺旋卷': ['lemon'], '柠檬皮条': ['lemon'], '柠檬皮': ['lemon'],
    '青柠': ['lime'], '青柠角': ['lime'], '青柠汁': ['lime'], '青柠片': ['lime'],
    '橙子': ['orange'], '橙片': ['orange'], '橙汁': ['orange'], '橙皮': ['orange'], '橙皮条': ['orange'],
    '苹果': ['apple'], '苹果丁': ['apple'],
    '草莓': ['strawberry'], '草莓块': ['strawberry'], '草莓对切': ['strawberry'], '草莓戴克丽': ['strawberry'],
    '蓝莓': ['blueberry'],
    '桃子': ['peach'], '桃': ['peach'],
    '菠萝': ['pineapple'], '菠萝汁': ['pineapple'], '菠萝角': ['pineapple'],
    '椰奶': ['coconut'], '椰树椰汁': ['coconut'], '椰浆': ['coconut'],
    '蜂蜜': ['honey'], '蜂蜜糖浆': ['honey'], '蜂蜜水': ['honey'],
    '白糖': ['syrup'], '糖': ['syrup'], '糖浆': ['syrup'], '方糖': ['syrup'], '糖+水1:1自制': ['syrup'], '自制：糖+热水1:1溶解': ['syrup'], '白砂糖 + 温水搅拌溶解': ['syrup'],
    '可乐': ['cola'], '可口可乐经典款': ['cola'],
    '苏打水': ['soda'], '屈臣氏苏打水': ['soda'], '怡泉苏打水': ['soda'],
    '汤力水': ['tonic'], '汤力': ['tonic'],
    '浓缩咖啡': ['coffee'], '意式浓缩': ['coffee'], '速溶黑咖啡': ['coffee'], '速溶浓缩液': ['coffee'], '咖啡饮料': ['coffee'], '咖啡豆': ['coffee'],
    '蛋清': ['egg-white'], '蛋黄': ['egg-white'],
    '苦精': ['bitters'], '安格苦精': ['bitters'], '安格斯特苦精': ['bitters'], '安格苦精2滴': ['bitters'],
    '柠檬草': ['lemongrass'], '新鲜柠檬草': ['lemongrass'],
    '薄荷': ['mint'], '新鲜薄荷': ['mint'], '薄荷叶': ['mint'], '薄荷嫩枝': ['mint'],
    '迷迭香': ['rosemary'], '迷迭香嫩枝': ['rosemary'],

    // 冰块类
    '大冰球': ['ice-ball'], '冰球': ['ice-ball'], '球形大冰': ['ice-ball'],
    '方冰': ['ice-cube'], '方块冰': ['ice-cube'], '方形冰': ['ice-cube'],
    '碎冰': ['crushed-ice'], '碎冰堆山': ['crushed-ice'], '大量碎冰': ['crushed-ice'],

    // 特殊装饰/风味（不影响匹配，视为通用）
    '肉桂粉': [], '肉桂': [], '枸杞': [], '玫瑰水': [], '香草精': [], '茉莉花茶糖浆': ['syrup'], '马拉斯奇诺樱桃': [], '樱桃': [],
    '盐': [], '细盐': [], '盐边': [],
    '胡椒': [],
    '温水': [], '热水': [],
    '奶油': [], '牛奶': [],
    '小纸伞': [], '酒签': [], '装饰': []
};

// 根据材料名称反查对应 ID 的辅助函数
function matchMaterialToId(name) {
    if (!name) return [];
    const trimmed = String(name).trim();
    if (materialNameToIdMap[trimmed]) return materialNameToIdMap[trimmed];
    // 精确匹配失败时，做一次关键词匹配
    for (const key of Object.keys(materialNameToIdMap)) {
        if (trimmed.includes(key) || key.includes(trimmed)) {
            return materialNameToIdMap[key];
        }
    }
    // 再次进行碎片匹配
    for (const key of Object.keys(materialNameToIdMap)) {
        const words = key.split(/[ /]+/);
        for (const w of words) {
            if (w.length >= 2 && trimmed.includes(w)) {
                return materialNameToIdMap[key];
            }
        }
    }
    return [];
}

// 暴露到全局作用域，供 app.js 使用
window.matchMaterialToId = matchMaterialToId;

const cocktailRecipes = [

    // ==========================================
    // 1. 金酒苏打（Gin & Tonic 的家庭版）
    // ==========================================
    {
        id: 'gin-soda-lemon',
        name: '柠香金酒苏打',
        enName: 'Gin & Soda Lemon',
        category: '家庭经典',
        base: '金酒',
        sweetness: 2, acidity: 5, strength: 4,
        flavors: ['清新', '果香', '草本'],
        occasion: ['朋友聚会', '独酌放松', '餐前开胃'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 8%',
        batch: { single: '1 杯', family: '2-4 人份（可调酒器一次调好）' },

        // 关键新增：冰块形态建议
        ice: {
            type: '大冰球 / 大方冰',
            temp: '-10℃ 深度冷冻更佳',
            dilution: '慢',
            visual: '透明大冰块在汽水中缓缓旋转，极适合拍照',
            tip: '用硅胶冰球模具在家自制，提前一晚冷冻；透明冰用煮沸后的水效果更好'
        },

        ingredients: [
            { name: '金酒', amount: '45 ml', note: '家庭可用：哥顿/添加利，超市或线上均可购' },
            { name: '苏打水', amount: '120 ml', note: '屈臣氏/怡泉，冰镇使用' },
            { name: '柠檬角', amount: '2 瓣', note: '或青柠/西柚' },
            { name: '大冰球', amount: '1 颗', note: '或大方冰 2-3 块' },
            { name: '糖浆', amount: '5 ml', note: '可选，根据甜度调整' }
        ],

        steps: [
            '提前将大冰球从冰箱取出，放入冰镇过的高球杯',
            '倒入金酒和少量糖浆（如使用）',
            '轻挤柠檬角 1-2 瓣在酒面，释放精油后放入杯中',
            '沿杯壁缓慢倒入冰镇苏打水至八分满',
            '用吧勺或长匙轻提两下混合，避免气泡过多流失',
            '杯口装饰新鲜柠檬卷即可享用'
        ],

        decoration: '柠檬螺旋卷 + 迷迭香嫩枝（可选）',

        // 器材替代方案（家庭简化版）
        equipment: {
            need: ['高球杯/长饮杯'],
            optional: ['吧勺/长柄勺', '摇酒器'],
            alternatives: '没有专业工具可用普通长汤匙 + 大冰格代替'
        },

        tips: '苏打水越冰气泡越持久；家庭自制大冰球建议使用纯净水或煮沸的水，杂质少更晶莹剔透。',

        photo: {
            light: '自然光侧光最佳，窗边柔焦光让冰块晶莹剔透',
            background: '浅灰/米白色大理石纹餐垫或深色木桌',
            props: '亚麻餐巾 + 柠檬片 + 复古黄铜勺 + 一本精装书',
            composition: '45°侧拍或俯拍，杯中留1/5空间让泡沫有呼吸感',
            tip: '拍摄前几秒钟再倒入苏打水，气泡上升的瞬间最动人'
        },

        allergens: []
    },

    // ==========================================
    // 2. 自由古巴（家庭材料最易得）
    // ==========================================
    {
        id: 'rum-cola',
        name: '家庭版自由古巴',
        enName: 'Rum & Cola Home Style',
        category: '家庭经典',
        base: '朗姆酒',
        sweetness: 5, acidity: 3, strength: 4,
        flavors: ['焦糖', '果香', '温暖'],
        occasion: ['朋友聚会', '夏日解暑', '电影之夜'],
        method: '兑和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 9%',
        batch: { single: '1 杯', family: '2-4 人份（调酒杯内一次混合）' },

        ice: {
            type: '方冰',
            temp: '-5℃ 普通冰箱冷冻',
            dilution: '中',
            visual: '立方体堆叠在琥珀色液体中，经典且温暖',
            tip: '家用冰格即可，建议每格2cm方形；提前2小时冰冻确保硬度'
        },

        ingredients: [
            { name: '白朗姆酒', amount: '50 ml', note: '百加得/哈瓦那俱乐部均可' },
            { name: '可乐', amount: '150 ml', note: '可口可乐经典款最佳，冰至0-4℃' },
            { name: '青柠角', amount: '2 瓣', note: '或柠檬片均可' },
            { name: '方冰', amount: '5-6 块', note: '家用冰格2cm见方' }
        ],

        steps: [
            '在冷藏过的高球杯中放入方冰至六分满',
            '挤入青柠汁约10ml（1瓣青柠）',
            '倒入白朗姆酒',
            '沿杯壁缓慢注入冰镇可乐至八分满',
            '轻轻搅拌一下即可'
        ],

        decoration: '青柠角插杯口，可选插一根复古纸吸管',

        equipment: {
            need: ['高球杯或普通大玻璃杯'],
            optional: ['吧勺'],
            alternatives: '什么都没有？直接在杯子里加冰+酒+可乐+柠檬角，一样好喝！'
        },

        tips: '可乐冰镇到0-4℃是关键；青柠角的精油比柠檬汁更有灵魂，记得先挤再丢。',

        photo: {
            light: '傍晚暖光或餐厅暖吊灯下，琥珀色液体最诱人',
            background: '深色胡桃木餐桌或复古皮革托盘',
            props: '黄铜开瓶器 + 折叠餐巾 + 一张黑胶唱片 + 复古玻璃杯',
            composition: '略微低角度仰拍（15°），聚焦杯壁冰块让背景虚化',
            tip: '把青柠角轻压在杯缘，让几滴果汁挂在杯壁，增加视觉层次'
        },

        allergens: []
    },

    // ==========================================
    // 3. 简易版威士忌酸（蛋清可选）
    // ==========================================
    {
        id: 'whiskey-sour-home',
        name: '家庭版威士忌酸',
        enName: 'Home Style Whiskey Sour',
        category: '家庭经典',
        base: '威士忌',
        sweetness: 5, acidity: 7, strength: 6,
        flavors: ['果香', '醇厚', '平衡'],
        occasion: ['独酌放松', '浪漫约会', '餐后小酌'],
        method: '摇和法',
        difficulty: 2,
        time: 6,
        alcohol: '约 18%',
        batch: { single: '1 杯', family: '2 人份（大摇酒器一次制作）' },

        ice: {
            type: '碎冰 + 杯内方冰双层方案',
            temp: '摇和用 -10℃ 碎冰，出品用大冰球',
            dilution: '摇和时快速降温稀释，装杯后变慢',
            visual: '奶白色泡沫悬浮在金黄酒液上，古典优雅',
            tip: '家庭可用保鲜袋包冰块+擀面杖敲出碎冰；蛋清能产生天鹅绒般泡沫但需小心卫生'
        },

        ingredients: [
            { name: '波本威士忌', amount: '45 ml', note: '四玫瑰/占边都可以' },
            { name: '柠檬汁', amount: '25 ml', note: '新鲜现挤；约1/2颗柠檬' },
            { name: '糖浆', amount: '15 ml', note: '自制：糖+热水1:1溶解' },
            { name: '蛋清', amount: '1 个（可选）', note: '不喜欢或过敏可省略' },
            { name: '安格苦精', amount: '2 滴', note: '装饰用，没有也可' },
            { name: '方冰', amount: '4-5 块', note: '装杯用' }
        ],

        steps: [
            '摇酒器中倒入威士忌、柠檬汁、糖浆和蛋清',
            '先不加冰干摇10秒（让蛋清乳化产生泡沫）',
            '打开加入碎冰，再摇12秒至壶身结霜',
            '把方冰放入古典杯冰镇',
            '用细滤网把酒液过滤到冰镇杯中',
            '表面滴1-2滴苦精做装饰（可用牙签画出图案）'
        ],

        decoration: '柠檬片 + 马拉斯奇诺樱桃（或普通红樱桃）',

        equipment: {
            need: ['摇酒器（或带盖密封罐）', '古典杯/大玻璃杯', '细滤网'],
            optional: ['吧勺', '量杯'],
            alternatives: '没有摇酒器用保温杯/密封罐一样摇；没有量杯用汤匙估算（1汤匙≈15ml）'
        },

        tips: '家庭自制糖浆：50g白砂糖 + 50ml 热水搅拌溶解，装瓶冷藏可用1周。不喜欢生蛋清可省略或用等量鹰嘴豆水（aquafaba）替代，纯素且同样出泡沫。',

        photo: {
            light: '柔和自然光或3000K暖光，突出威士忌金黄的色泽',
            background: '象牙白亚麻桌布 + 木质砧板/石板',
            props: '黄铜量杯 + 老式开瓶器 + 一本皮质封面笔记本',
            composition: '45度侧拍，让苦精在泡沫表面的纹路清晰可见',
            tip: '表面的苦精滴图案是"威士忌酸"标志性画面——滴完立即拍照'
        },

        allergens: ['鸡蛋（使用蛋清时）']
    },

    // ==========================================
    // 4. 蜂蜜柠檬伏特加特调（家庭友好）
    // ==========================================
    {
        id: 'vodka-honey-lemon',
        name: '蜂蜜柠檬伏特加',
        enName: 'Honey Lemon Vodka',
        category: '家庭原创',
        base: '伏特加',
        sweetness: 6, acidity: 6, strength: 5,
        flavors: ['蜂蜜香', '柠檬清新', '顺滑'],
        occasion: ['独酌放松', '浪漫约会', '暖冬特饮'],
        method: '摇和法 / 兑和法',
        difficulty: 2,
        time: 5,
        alcohol: '约 12%',
        batch: { single: '1 杯', family: '4 人份（玻璃水壶内调好，保温持久）' },

        ice: {
            type: '大冰球（冰饮）/ 无冰（温饮）',
            temp: '-10℃ 大冰球或常温蜂蜜温水',
            dilution: '慢',
            visual: '冰饮：琥珀色液体包裹透明冰球；温饮：玻璃水壶保温杯中冒出微热气',
            tip: '冬天推荐温饮版本：用温水稀释蜂蜜，加入伏特加与柠檬汁，保温效果更好'
        },

        ingredients: [
            { name: '伏特加', amount: '45 ml', note: '绝对/斯米诺/灰雁均可' },
            { name: '蜂蜜', amount: '15 ml', note: '家庭常备；需提前与温水混合成蜂蜜水' },
            { name: '柠檬汁', amount: '20 ml', note: '新鲜现挤' },
            { name: '温水', amount: '30 ml', note: '约40℃；用来稀释蜂蜜' },
            { name: '大冰球', amount: '1 颗', note: '冰饮用' },
            { name: '柠檬片', amount: '1 片', note: '装饰用' }
        ],

        steps: [
            '取一小碗，蜂蜜 + 温水搅拌至完全溶解',
            '摇酒器中加入冰块、伏特加、蜂蜜水、柠檬汁',
            '摇晃12秒至壶身冰凉',
            '（冰饮版）杯中放大冰球，过滤酒液倒入',
            '（温饮版）直接倒入玻璃杯中，可添加少量温水调整温度',
            '放入柠檬片装饰'
        ],

        decoration: '新鲜柠檬片 + 干燥玫瑰花瓣（可选）',

        equipment: {
            need: ['古典杯/威士忌杯', '小碗', '汤匙'],
            optional: ['摇酒器', '量杯'],
            alternatives: '没有摇酒器就用保温杯摇，或直接在杯里搅拌后加冰'
        },

        tips: '蜂蜜不能直接加冷水，必须先用温水化开——这是家庭版的核心技巧。冬天可以做成温饮，是非常治愈的家庭调酒。',

        photo: {
            light: '窗边柔和暖光，冰饮适合冷光，温饮则用更暖的灯光',
            background: '浅橡木桌面 + 奶油白针织餐布',
            props: '小罐蜂蜜 + 黄铜茶匙 + 柠檬造型小碟 + 干花',
            composition: '45°侧拍 + 浅景深，让蜂蜜的金色光泽成为焦点',
            tip: '冰饮可以让杯壁起雾的瞬间按下快门；温饮可以拍到热气袅袅上升'
        },

        allergens: ['蜂蜜（1岁以下婴儿不适用）']
    },

    // ==========================================
    // 5. 家庭版玛格丽特（无需专业利口酒）
    // ==========================================
    {
        id: 'tequila-lemon-home',
        name: '家庭版玛格丽特',
        enName: 'Home Margarita',
        category: '家庭经典',
        base: '龙舌兰',
        sweetness: 5, acidity: 8, strength: 6,
        flavors: ['清爽', '柠檬香', '微咸'],
        occasion: ['朋友聚会', '夏日解暑', '电影之夜'],
        method: '摇和法',
        difficulty: 2,
        time: 5,
        alcohol: '约 15%',
        batch: { single: '1 杯', family: '4 人份（大摇酒器一次调出）' },

        ice: {
            type: '碎冰堆山（经典）或 大冰球（家庭懒人版）',
            temp: '-15℃ 深度冷冻',
            dilution: '中到快',
            visual: '碎冰堆高出杯口，柠檬盐边在光线下闪闪发光',
            tip: '家庭可用密封袋+擀面杖做碎冰；时间不够可直接用大冰球也超好喝'
        },

        ingredients: [
            { name: '龙舌兰 Blanco', amount: '45 ml', note: '奥美加/唐胡里奥等' },
            { name: '橙味利口酒', amount: '15 ml', note: '家庭可用：君度/白橙皮酒/或直接省略+10ml橙汁替代' },
            { name: '青柠汁', amount: '25 ml', note: '新鲜现挤，约1颗' },
            { name: '糖浆', amount: '10 ml', note: '糖+水1:1自制' },
            { name: '碎冰', amount: '适量', note: '堆出杯口' },
            { name: '细盐', amount: '少量', note: '杯口盐边用（可选）' }
        ],

        steps: [
            '用青柠片擦拭杯口，再倒扣在细盐盘上做盐边',
            '摇酒器中加入冰块、龙舌兰、君度、青柠汁、糖浆',
            '摇动12秒至壶身冰凉',
            '在杯中堆上碎冰至八分满',
            '过滤酒液倒入碎冰上',
            '插入青柠角装饰'
        ],

        decoration: '青柠角 + 盐边杯口',

        equipment: {
            need: ['玛格丽特杯/普通大玻璃杯', '摇酒器'],
            optional: ['盐边专用碟', '滤冰器'],
            alternatives: '没有玛格丽特杯用普通大玻璃杯；没有盐边可以省略；没有利口酒就用橙汁+多5ml糖浆替代，一样美味'
        },

        tips: '龙舌兰 + 青柠 + 盐是经典铁三角，盐边能平衡酸度让酒更柔顺。家庭简化版若没有君度，使用 15ml 橙汁 + 5ml 糖浆替代也很棒。',

        photo: {
            light: '明亮冷色调自然光，俯拍让盐边颗粒清晰可见',
            background: '白色大理石 + 蓝/绿桌布点缀',
            props: '白色粗盐小碟 + 竹制盐边工具 + 青柠切片 + 金属量杯',
            composition: '俯视或45度，让盐边颗粒和碎冰起伏都进入镜头',
            tip: '堆碎冰时让碎冰高出杯口，酒液缓缓注入后会融化一点点，动态感最美'
        },

        allergens: []
    },

    // ==========================================
    // 6. 桑格利亚（家庭派对爆款！）
    // ==========================================
    {
        id: 'sangria-family',
        name: '家庭派对桑格利亚',
        enName: 'Family Party Sangria',
        category: '家庭派对',
        base: '红酒',
        sweetness: 6, acidity: 5, strength: 3,
        flavors: ['果香', '清爽', '夏日'],
        occasion: ['朋友聚会', '节日庆祝', '家庭聚餐', '夏日解暑'],
        method: '浸泡法',
        difficulty: 2,
        time: '10分钟（可提前准备）',
        alcohol: '约 7%',
        batch: { single: '1 杯', family: '4-6 人份（用大玻璃水壶盛出）' },

        ice: {
            type: '大冰球 + 小方冰混合',
            temp: '-5℃ 普通冷冻',
            dilution: '慢（因冰量大且提前冰镇酒液）',
            visual: '水果块在红色酒液中漂浮，阳光折射下色彩斑斓',
            tip: '派对前把整壶酒冷藏；端上桌时才加入冰块，避免过快稀释'
        },

        ingredients: [
            { name: '干红葡萄酒', amount: '500 ml', note: '普通餐酒即可，不必贵' },
            { name: '白朗姆酒', amount: '100 ml', note: '增加果香层次，没有可省略' },
            { name: '苹果', amount: '1 个', note: '切丁' },
            { name: '橙子', amount: '1 个', note: '切片' },
            { name: '柠檬', amount: '1 个', note: '切片' },
            { name: '草莓', amount: '5-6 颗', note: '对切；季节水果可灵活替换' },
            { name: '橙汁', amount: '150 ml', note: '新鲜或市售100%果汁' },
            { name: '糖浆', amount: '40 ml', note: '按甜度调整' },
            { name: '苏打水', amount: '200 ml', note: '临上桌前加' }
        ],

        steps: [
            '洗净水果：苹果切丁、橙子/柠檬切片、草莓对切',
            '把水果放进大玻璃壶',
            '倒入红酒、朗姆酒、橙汁、糖浆',
            '轻搅后放入冰箱冷藏至少2小时（过夜风味更佳）',
            '上桌前加入苏打水和冰块',
            '用长柄勺分到各杯中，确保每杯都有水果块'
        ],

        decoration: '新鲜橙片 + 草莓 + 薄荷叶 + 长柄勺',

        equipment: {
            need: ['2L 大玻璃水壶', '水果刀', '砧板'],
            optional: ['搅拌长柄勺'],
            alternatives: '没有专业酒壶就用普通大汤碗分；水果种类随季节替换（夏天桃子、冬天梨）'
        },

        tips: '桑格利亚是最适合家庭派对的饮品：提前一天准备，越陈越香；适合4-6人分享；冰箱冷藏可保存3天。水果可以根据季节替换——苹果+橙子是全年组合，夏天加西瓜/水蜜桃，冬天加梨/蓝莓。',

        photo: {
            light: '正午明亮自然光穿过窗户照射，让红色酒液和水果色彩饱和',
            background: '纯白大理石 + 白色瓷碟 + 黄铜色水壶/深橡木餐桌',
            props: '亚麻餐巾 + 金属开瓶器 + 小束迷迭香 + 彩色水果小碟',
            composition: '高角度俯拍或45°侧拍，展示水壶+多杯+水果的完整画面',
            tip: '拍之前把冰块加到满，水果堆叠到瓶口，色彩层次立刻拉满'
        },

        allergens: ['硫化物（葡萄酒中天然存在）']
    },

    // ==========================================
    // 7. 意式浓缩马天尼（咖啡爱好者最爱）
    // ==========================================
    {
        id: 'espresso-martini-home',
        name: '家庭版咖啡马天尼',
        enName: 'Home Espresso Martini',
        category: '家庭原创',
        base: '伏特加',
        sweetness: 5, acidity: 2, strength: 7,
        flavors: ['咖啡香', '微苦回甘', '顺滑'],
        occasion: ['独酌放松', '餐后消化', '浪漫约会', '工作间隙'],
        method: '摇和法',
        difficulty: 2,
        time: 6,
        alcohol: '约 18%',
        batch: { single: '1 杯', family: '2 人份' },

        ice: {
            type: '摇和用碎冰 + 成品不用冰（冰镇杯）',
            temp: '-10℃ 深度冷冻',
            dilution: '中',
            visual: '深咖啡色液体带着一层细密咖啡泡沫，在冷杯壁上起雾',
            tip: '关键：酒杯提前冷冻！马天尼杯在冰箱里冰30分钟以上最佳'
        },

        ingredients: [
            { name: '伏特加', amount: '50 ml', note: '' },
            { name: '咖啡利口酒', amount: '25 ml', note: 'Kahlua/蒂亚玛利亚；没有可用25ml浓缩咖啡+5ml糖浆替代' },
            { name: '浓缩咖啡', amount: '30 ml', note: '意式浓缩1shot；没有咖啡机可用速溶黑咖啡2g+30ml热水' },
            { name: '糖浆', amount: '5-10 ml', note: '按口味调整' },
            { name: '咖啡豆', amount: '3 颗', note: '装饰用' }
        ],

        steps: [
            '马天尼杯放入冰箱冷冻（这一步是关键！）',
            '制作新鲜浓缩咖啡并冷却至室温',
            '摇酒器中加满碎冰',
            '倒入伏特加、咖啡利口酒、浓缩咖啡和糖浆',
            '用力摇动15秒至壶身结霜（咖啡饮料需要更强摇晃）',
            '取出冰镇马天尼杯，酒液经细滤网滤入杯中',
            '表面放3颗咖啡豆做装饰'
        ],

        decoration: '3 颗咖啡豆（传统造型代表：运气、健康、财富）',

        equipment: {
            need: ['马天尼杯/小酒杯', '摇酒器', '细滤网'],
            optional: ['意式咖啡机'],
            alternatives: '没有咖啡机用速溶浓缩液（Nescafe Gold 2g + 30ml 热水）替代；没有马天尼杯用小茶杯/白酒杯'
        },

        tips: '想要更专业风味可以加几滴香草精；咖啡豆要放现磨的（香气更明显）。家庭版的关键是冰镇杯身+足量冰块摇晃。',

        photo: {
            light: '低光环境+暖色侧光，让咖啡色泡沫形成高光',
            background: '深黑/墨绿石板面 + 黄铜托盘',
            props: '小型意式咖啡机 / 复古手摇磨豆机 + 咖啡豆 + 旧皮革书籍',
            composition: '低角度微仰拍，杯中泡沫细节清晰，让背景虚化',
            tip: '表面的3颗咖啡豆要整齐摆放；在表面轻微喷雾让泡沫持久'
        },

        allergens: ['咖啡因敏感者注意']
    },

    // ==========================================
    // 8. Aperol Spritz 意式餐前酒（零技巧）
    // ==========================================
    {
        id: 'aperol-spritz',
        name: '意式阿佩罗气泡',
        enName: 'Aperol Spritz',
        category: '家庭经典',
        base: '利口酒',
        sweetness: 7, acidity: 4, strength: 3,
        flavors: ['橙子香', '草本', '清爽气泡'],
        occasion: ['朋友聚会', '餐前开胃', '夏日解暑', '节日庆祝'],
        method: '兑和法',
        difficulty: 1,
        time: 2,
        alcohol: '约 7%',
        batch: { single: '1 杯', family: '4 人份（大水罐内一起调）' },

        ice: {
            type: '大冰球或大方冰（整块）',
            temp: '-5℃',
            dilution: '极慢',
            visual: '亮橙色酒液包裹透明大冰球，阳光下如宝石般闪耀',
            tip: 'Aperol Spritz 精髓在于大冰块——越慢稀释，风味越持久；家庭用硅胶冰球模具即可'
        },

        ingredients: [
            { name: 'Aperol 阿佩罗利口酒', amount: '60 ml', note: '线上/进口超市可购' },
            { name: '普罗塞克起泡酒', amount: '90 ml', note: '或任何干型起泡酒/香槟；无酒精版可用白葡萄汁+气泡水替代' },
            { name: '苏打水', amount: '15 ml', note: '少量' },
            { name: '橙片', amount: '1 片', note: '装饰' },
            { name: '大冰球', amount: '1 颗', note: '或大方冰' }
        ],

        steps: [
            '冰镇大酒杯（古典杯或大红酒杯）',
            '放入大冰球或大方冰',
            '倒入 Aperol 利口酒',
            '加入普罗塞克起泡酒',
            '加少量苏打水',
            '轻轻搅拌一下，放入橙片装饰即可'
        ],

        decoration: '新鲜橙片半浸在酒液中',

        equipment: {
            need: ['大古典杯或大红酒杯'],
            optional: ['吧勺'],
            alternatives: '没有 Aperol 可用：金巴利+多10ml糖浆；没有起泡酒可用白葡萄酒+苏打水'
        },

        tips: '经典比例是 3 份普罗塞克 + 2 份 Aperol + 1 份苏打水。这款酒因意大利 aperitivo（餐前酒）文化而爆红——夏天加冰、冬天室温微温都好喝。',

        photo: {
            light: '明亮自然光线或窗边逆光，让橙色酒液有通透发光感',
            background: '浅粉/米白/淡蓝色布艺，或白色大理石',
            props: '彩色吸管 + 橙片/血橙片 + 橄榄小碟 + 复古意式咖啡壶',
            composition: '高角度或45°侧拍，大冰球是构图的核心',
            tip: '倒入起泡酒后立即拍摄——气泡活跃的几秒钟最有生命力！'
        },

        allergens: []
    },

    // ==========================================
    // 9. 椰林飘香（夏日/派对款）
    // ==========================================
    {
        id: 'pina-colada-home',
        name: '家庭版椰林飘香',
        enName: 'Home Piña Colada',
        category: '家庭派对',
        base: '朗姆酒',
        sweetness: 8, acidity: 3, strength: 3,
        flavors: ['椰香', '菠萝甜', '奶油'],
        occasion: ['朋友聚会', '夏日解暑', '节日庆祝'],
        method: '搅和法（冰沙版）/ 摇和法（清爽版）',
        difficulty: 2,
        time: 5,
        alcohol: '约 10%',
        batch: { single: '1 杯', family: '4 人份（搅拌机一次制作）' },

        ice: {
            type: '大量碎冰（冰沙版）/ 大冰球（清爽版）',
            temp: '-15℃ 新冻冰块最适合做冰沙',
            dilution: '快（冰沙版）/ 慢（清爽版）',
            visual: '绵密奶白色冰沙高出杯口，顶部装饰的菠萝和小伞是夏日代名词',
            tip: '冰沙版要现做现喝；清爽版更耐放，适合慢慢享用'
        },

        ingredients: [
            { name: '白朗姆酒', amount: '45 ml', note: '' },
            { name: '椰奶', amount: '40 ml', note: '罐装椰树椰汁即可；更专业用 Coco Lopez 椰浆' },
            { name: '菠萝汁', amount: '60 ml', note: '新鲜或瓶装100%果汁' },
            { name: '碎冰', amount: '约 180g', note: '冰沙版用' },
            { name: '菠萝角', amount: '1 块', note: '装饰' },
            { name: '酒签/小纸伞', amount: '1 个', note: '装饰' }
        ],

        steps: [
            '（冰沙版）把朗姆酒、椰奶、菠萝汁、碎冰全部放入搅拌机',
            '高速搅拌 20 秒至完全顺滑',
            '倒入飓风杯或大玻璃杯',
            '用菠萝角和酒签装饰',
            '（清爽版：省略搅拌机，改为摇和，成品倒入装有大冰球的杯中）'
        ],

        decoration: '菠萝角 + 酒签 + 小纸伞 + 樱桃',

        equipment: {
            need: ['大玻璃杯/飓风杯', '搅拌机（冰沙版）或摇酒器（清爽版）'],
            optional: ['量杯'],
            alternatives: '没有搅拌机用手动打蛋器+冰块也能做出半冰沙版；椰奶可用普通椰汁替代'
        },

        tips: '夏日派对的必备饮品！冰沙版在派对上最出片；清爽版更适合慢慢享用。菠萝汁可用新鲜菠萝+水在搅拌机打汁过滤。',

        photo: {
            light: '明亮直射阳光，让奶白色冰沙表面产生高光',
            background: '蓝色/黄色布艺 + 白色桌面，夏日度假感',
            props: '小纸伞 + 菠萝块 + 彩色吸管 + 草编餐垫 + 太阳眼镜',
            composition: '45°侧拍或略低角度，让冰沙高出杯口的造型入镜',
            tip: '冰沙版要现拍——时间长了融化会影响造型！倒完立即拍摄'
        },

        allergens: []
    },

    // ==========================================
    // 10. 金酒柠檬草（花草香，少女最爱）
    // ==========================================
    {
        id: 'gin-lemongrass',
        name: '金酒柠檬草',
        enName: 'Gin Lemongrass',
        category: '家庭原创',
        base: '金酒',
        sweetness: 3, acidity: 5, strength: 5,
        flavors: ['花草香', '清新', '微甘'],
        occasion: ['浪漫约会', '独酌放松', '餐前开胃', '闺蜜小聚'],
        method: '浸泡 + 摇和法',
        difficulty: 2,
        time: 8,
        alcohol: '约 12%',
        batch: { single: '1 杯', family: '2-3 人份' },

        ice: {
            type: '碎冰 + 大冰球',
            temp: '-10℃',
            dilution: '中',
            visual: '透明冰球漂浮在淡绿色酒液中，表面点缀新鲜柠檬草叶',
            tip: '柠檬草叶可浸入酒液释放香气，既是装饰也是风味来源'
        },

        ingredients: [
            { name: '金酒', amount: '45 ml', note: '推荐添加利或植物型金酒' },
            { name: '新鲜柠檬草', amount: '2 根', note: '东南亚调料店/淘宝可购；没有可用柠檬皮+迷迭香替代' },
            { name: '青柠汁', amount: '15 ml', note: '' },
            { name: '糖浆', amount: '10 ml', note: '' },
            { name: '苏打水', amount: '60 ml', note: '' },
            { name: '大冰球', amount: '1 颗', note: '' }
        ],

        steps: [
            '柠檬草去外层硬皮，拍扁切段',
            '把柠檬草段放入摇酒器，用捣棒轻压几下释放香气',
            '加入金酒、青柠汁、糖浆',
            '加入冰块摇动 12 秒',
            '杯中放大冰球，过滤酒液倒入',
            '顶部加苏打水至满，轻轻搅拌',
            '放入新鲜柠檬草叶装饰'
        ],

        decoration: '新鲜柠檬草叶 + 一片青柠',

        equipment: {
            need: ['高球杯', '摇酒器', '捣棒/擀面杖'],
            optional: ['吧勺'],
            alternatives: '没有捣棒用勺子背面轻压；没有柠檬草用柠檬皮条+迷迭香+薄荷叶也能模拟类似香气'
        },

        tips: '这是一款"花园风格"的饮品，植物风味是主角。提前把柠檬草浸泡在金酒中 15 分钟会更入味（室温即可），但不要泡太久否则会发苦。',

        photo: {
            light: '柔和的晨光或窗边光，淡绿色酒液会显得很通透',
            background: '粉色/浅灰/白色调 + 大理石或水磨石纹理',
            props: '干花束 + 白色小蜡烛 + 亚麻绿餐巾 + 黄铜小托盘',
            composition: '略微俯拍或正侧面，让柠檬草叶成为视觉重心',
            tip: '可以在杯口轻抹柠檬皮油，让香气和画面都加分；倒入苏打水后等几秒再拍'
        },

        allergens: []
    },

    // ==========================================
    // 11. 古典鸡尾酒 Old Fashioned （最适合新手）
    // ==========================================
    {
        id: 'old-fashioned',
        name: '古典威士忌',
        enName: 'Old Fashioned',
        category: '家庭经典',
        base: '威士忌',
        sweetness: 5, acidity: 3, strength: 8,
        flavors: ['焦糖', '烟熏', '木质'],
        occasion: ['独酌放松', '餐后消化', '浪漫约会', '商务场合'],
        method: '调和法',
        difficulty: 1,
        time: 3,
        alcohol: '约 26%',
        batch: { single: '1 杯', family: '2 人份' },

        ice: {
            type: '超大方冰（4-5cm）或大冰球',
            temp: '-15℃ 深度冷冻 24 小时',
            dilution: '极慢（本酒精髓在慢饮）',
            visual: '整块大冰在琥珀色酒液中缓慢旋转，是这款"绅士之酒"的灵魂画面',
            tip: '用纯净水煮沸后冷冻可得到更晶莹剔透的"水晶冰";家庭可用两层不锈钢保温瓶冷冻大冰块'
        },

        ingredients: [
            { name: '波本威士忌', amount: '60 ml', note: '四玫瑰/占边/美格都行' },
            { name: '方糖', amount: '1 颗', note: '或 7.5ml 糖浆' },
            { name: '安格苦精', amount: '2 滴', note: '没有可省略但少了风味灵魂' },
            { name: '橙味苦精', amount: '1 滴', note: '可选' },
            { name: '苏打水', amount: '10 ml', note: '用来溶解方糖' },
            { name: '橙皮条', amount: '1 条', note: '装饰' },
            { name: '马拉斯奇诺樱桃', amount: '1 颗', note: '或普通红樱桃' }
        ],

        steps: [
            '古典杯中放入方糖',
            '滴入苦精',
            '加入少量苏打水（约10ml）把方糖压碎溶解',
            '在杯中加满大冰（整块大冰球最佳）',
            '倒入威士忌',
            '缓慢搅拌 20 秒',
            '橙皮条在杯口上方挤压释放精油，再放入杯中',
            '放入樱桃装饰'
        ],

        decoration: '橙皮条 + 马拉斯奇诺樱桃',

        equipment: {
            need: ['古典杯/威士忌杯'],
            optional: ['吧勺', '量杯'],
            alternatives: '没有专业苦精可用少量橙皮酒替代；没有方糖用糖浆1:1替代更方便'
        },

        tips: 'Old Fashioned 是最适合新手入门却又最耐喝的经典。精髓在"慢饮"——大块冰慢慢融化，威士忌风味层层展开。家庭版推荐用糖浆替代方糖，溶解更快捷。',

        photo: {
            light: '暖黄/琥珀色聚光灯，让威士忌与冰块的交界处产生光泽',
            background: '深棕皮革/深色胡桃木/黑色石板 + 深绿/酒红色餐巾',
            props: '黄铜开瓶器 + 皮质杯垫 + 一支雪茄/一本书/钢笔',
            composition: '45°低角度侧拍，让大冰块占据画面主体',
            tip: '表面喷一点橙皮精油或在杯边烧一下（小心！）会产生视觉效果+香气双重惊喜'
        },

        allergens: []
    },

    // ==========================================
    // 12. 夏日水果桑格利亚（无酒精版本可选）
    // ==========================================
    {
        id: 'summer-punch',
        name: '夏日水果宾治',
        enName: 'Summer Fruit Punch',
        category: '家庭派对',
        base: '白葡萄酒或无酒精',
        sweetness: 7, acidity: 5, strength: 2,
        flavors: ['果香', '清爽', '柔和'],
        occasion: ['朋友聚会', '家庭聚餐', '夏日解暑', '儿童友好'],
        method: '浸泡法',
        difficulty: 1,
        time: '10分钟',
        alcohol: '约 5%',
        batch: { single: '1 杯', family: '6-8 人份（用3L大水罐）' },

        ice: {
            type: '大量方冰 + 冷冻水果块当冰块',
            temp: '-5℃',
            dilution: '慢（冷冻水果块即做冰块又增风味）',
            visual: '色彩缤纷的水果块在淡金色酒液中漂浮，像一座小型花园',
            tip: '把切好的水果块提前冷冻，既当作冰块又提供风味'
        },

        ingredients: [
            { name: '干白葡萄酒', amount: '750 ml', note: '1瓶普通餐酒；无酒精版可用白葡萄汁替代' },
            { name: '桃子', amount: '2 个', note: '切丁' },
            { name: '草莓', amount: '10 颗', note: '对切' },
            { name: '蓝莓', amount: '50g', note: '' },
            { name: '苹果', amount: '1 个', note: '切薄片' },
            { name: '柠檬', amount: '1 个', note: '切薄片' },
            { name: '糖浆', amount: '40 ml', note: '按甜度调整' },
            { name: '接骨木花糖浆', amount: '20 ml', note: '或香草糖浆；没有可省略改加50ml橙汁' },
            { name: '苏打水', amount: '300 ml', note: '临上桌加' }
        ],

        steps: [
            '洗净所有水果，切丁/切片',
            '把水果放入3L大水罐',
            '加入糖浆和接骨木花糖浆',
            '倒入白葡萄酒（或白葡萄汁）',
            '轻搅后放入冰箱冷藏 1-2 小时（让水果出汁）',
            '上桌前加入苏打水和冰块/冷冻水果块',
            '分杯后每杯再放几颗新鲜水果'
        ],

        decoration: '新鲜薄荷叶 + 柠檬片 + 长柄勺',

        equipment: {
            need: ['大玻璃水罐 2-3L', '水果刀', '砧板'],
            optional: ['分酒器'],
            alternatives: '水果随季节替换：西瓜/葡萄/橙子/梨/树莓都行；没有葡萄酒就用100%白葡萄汁'
        },

        tips: '这是最适合家庭的"万金油饮品"——客人来了就端上一壶，酒精度低、色彩缤纷、老少皆宜（无酒精版直接替换为果汁即可）。提前2小时准备风味最佳。',

        photo: {
            light: '正午明亮自然光从高处照射，水果色彩饱和度最高',
            background: '纯白餐桌 + 蓝白条纹餐巾（地中海风情）',
            props: '亚麻餐布 + 黄铜水壶 + 陶瓷小碗盛放新鲜水果 + 藤编托盘',
            composition: '高角度俯拍，展示大水罐+所有水果+分杯的画面',
            tip: '每杯里放不同种类水果让画面更丰富；在大水罐里插一支新鲜迷迭香'
        },

        allergens: ['硫化物（葡萄酒中）']
    }
];

/* ============================================================
   材料分类系统 — 已更新为家庭友好版本
   ============================================================ */

const materialCategories = {
    // 六大基酒（家庭常见）
    baseSpirits: [
        { id: 'gin', name: '金酒' },
        { id: 'vodka', name: '伏特加' },
        { id: 'whiskey', name: '威士忌' },
        { id: 'rum', name: '朗姆酒' },
        { id: 'tequila', name: '龙舌兰' },
        { id: 'wine', name: '白/红葡萄酒' }
    ],
    // 利口酒（家庭更易获得的几种）
    liqueurs: [
        { id: 'cointreau', name: '君度橙酒' },
        { id: 'kahlua', name: '咖啡利口酒' },
        { id: 'aperol', name: 'Aperol利口酒' },
        { id: 'campari', name: '金巴利' },
        { id: 'elderflower', name: '接骨木花糖浆' }
    ],
    // 家庭常备辅料
    ingredients: [
        { id: 'lemon', name: '柠檬' },
        { id: 'lime', name: '青柠' },
        { id: 'orange', name: '橙子' },
        { id: 'apple', name: '苹果' },
        { id: 'strawberry', name: '草莓' },
        { id: 'blueberry', name: '蓝莓' },
        { id: 'peach', name: '桃子' },
        { id: 'pineapple', name: '菠萝' },
        { id: 'honey', name: '蜂蜜' },
        { id: 'syrup', name: '白糖/糖浆' },
        { id: 'cola', name: '可乐' },
        { id: 'soda', name: '苏打水' },
        { id: 'tonic', name: '汤力水' },
        { id: 'orange-juice', name: '橙汁' },
        { id: 'coconut', name: '椰奶' },
        { id: 'coffee', name: '浓缩咖啡' },
        { id: 'egg-white', name: '蛋清' },
        { id: 'bitters', name: '苦精' },
        { id: 'lemongrass', name: '柠檬草' },
        { id: 'mint', name: '薄荷' },
        { id: 'rosemary', name: '迷迭香' },
        { id: 'ice-ball', name: '大冰球' },
        { id: 'ice-cube', name: '方冰' },
        { id: 'crushed-ice', name: '碎冰' }
    ]
};

/* ============================================================
   冰块形态指南（显示在学习模式中）
   ============================================================ */

const iceGuide = {
    '大冰球': {
        bestFor: ['Old Fashioned', 'Negroni', '马天尼', '金酒苏打', '蜂蜜柠檬伏特加'],
        temp: '-10℃ ~ -15℃',
        dilution: '极慢',
        visual: '透明度极高，如宝石般',
        diy: '使用硅胶冰球模具，灌入煮沸后的纯净水。冷冻24小时以上。',
        tip: '想要完全透明的水晶冰，可以使用"定向结冰法"——使用保温箱让冰从顶部缓慢结冰。'
    },
    '大方冰': {
        bestFor: ['自由古巴', 'Aperol Spritz', '长岛冰茶'],
        temp: '-5℃ ~ -10℃',
        dilution: '慢',
        visual: '方正几何感，非常现代',
        diy: '使用 5cm 硅胶大方冰格，纯净水填充后冷冻。',
        tip: '家庭可用普通2-3cm方形冰格代替，效果相近。'
    },
    '碎冰': {
        bestFor: ['莫吉托', '椰林飘香', 'Bramble', 'Bramble', '玛格丽特'],
        temp: '-15℃',
        dilution: '中到快',
        visual: '蓬松、白色，适合夏日饮品',
        diy: '冰块装入密封保鲜袋，用擀面杖或酒瓶敲碎——这是家庭最便捷的方法！',
        tip: '碎冰要现做现用，否则容易融化成冰坨。'
    },
    '方冰（小）': {
        bestFor: ['桑格利亚', '水果宾治', '普通长饮'],
        temp: '-5℃',
        dilution: '中速',
        visual: '经典的日常冰块形态',
        diy: '普通家用冰箱附带的冰格即可。',
        tip: '想让冰块更晶莹，使用煮沸后的凉开水并静置去除气泡。'
    },
    '冷冻水果冰': {
        bestFor: ['桑格利亚', '夏日水果宾治', '起泡酒'],
        temp: '-5℃',
        dilution: '极慢',
        visual: '色彩缤纷，既是装饰也是冰块',
        diy: '把葡萄、蓝莓、草莓块、橙瓣分装在小冰格或小袋中冷冻，使用时取出。',
        tip: '也可冷冻柠檬/青柠片——不稀释酒液却能降温，非常实用。'
    }
};

/* ============================================================
   器材推荐与替代（家庭友好）
   ============================================================ */

const equipmentGuide = {
    '基础三件套': {
        items: ['大摇酒器（三段式 Cobbler Shaker 最适合家庭）', '滤冰器', '吧勺'],
        budget: '¥100-200',
        alternative: '没有专业工具：用密封保温杯摇+普通汤匙搅拌即可'
    },
    '量杯': {
        items: ['双头量杯（Jigger）', '或量酒器'],
        budget: '¥30-80',
        alternative: '用普通汤匙估算：1汤匙 ≈ 15ml，1茶匙 ≈ 5ml'
    },
    '常用杯具': {
        items: ['高球杯（长饮）', '古典杯（短饮）', '马天尼杯（清爽款）', '飓风杯（派对款）'],
        budget: '¥200-500',
        alternative: '没有专业酒杯：用普通水杯+白酒杯+红酒杯替代即可'
    },
    '进阶推荐': {
        items: ['捣棒', '柠檬压汁器', '细滤网', '冰球模具', '意式浓缩咖啡机（咖啡马天尼用）'],
        budget: '¥200-1000',
        alternative: '用擀面杖+普通手压+厨房滤勺代替'
    }
};

// 导出到全局作用域
window.cocktailRecipes = cocktailRecipes;
window.materialCategories = materialCategories;
window.iceGuide = iceGuide;
window.equipmentGuide = equipmentGuide;
