/* ========================================
   MixMate 调酒助手 - 核心交互逻辑
   处理材料匹配、口味探索、创意配方等功能
   ======================================== */

// ========== 全局状态管理 ==========
const appState = {
    selectedMaterials: new Set(),      // 用户选择的材料
    selectedFlavors: new Set(),         // 用户选择的风味
    selectedOccasions: new Set(),       // 用户选择的场合
    tastePreferences: {                 // 用户口味偏好滑块
        sweetness: 5,
        acidity: 5,
        strength: 5
    }
};

// ========== DOM 元素引用 ==========
const dom = {
    materials: {
        baseSpiritsContainer: document.getElementById('base-spirits'),
        liqueursContainer: document.getElementById('liqueurs'),
        ingredientsContainer: document.getElementById('ingredients'),
        clearBtn: document.getElementById('clear-materials'),
        matchBtn: document.getElementById('match-materials'),
        results: document.getElementById('materials-results')
    },
    taste: {
        sweetness: document.getElementById('sweetness'),
        acidity: document.getElementById('acidity'),
        strength: document.getElementById('strength'),
        sweetnessValue: document.getElementById('sweetness-value'),
        acidityValue: document.getElementById('acidity-value'),
        strengthValue: document.getElementById('strength-value'),
        flavorTags: document.getElementById('flavor-tags'),
        occasionTags: document.getElementById('occasion-tags'),
        resetBtn: document.getElementById('reset-taste'),
        matchBtn: document.getElementById('match-taste'),
        results: document.getElementById('taste-results')
    },
    create: {
        baseSelect: document.getElementById('create-base'),
        themeSelect: document.getElementById('create-theme'),
        feelSelect: document.getElementById('create-feel'),
        generateBtn: document.getElementById('generate-creative'),
        results: document.getElementById('creative-results')
    },
    recipeModal: {
        modal: document.getElementById('recipe-modal'),
        closeBtn: document.getElementById('recipe-close'),
        detail: document.getElementById('recipe-detail')
    },
    techniqueModal: {
        modal: document.getElementById('technique-modal'),
        closeBtn: document.getElementById('modal-close'),
        detail: document.getElementById('technique-detail')
    }
};

// ========== 页面初始化 ==========
function init() {
    renderMaterialTags();       // 场景一：渲染材料选择
    initTasteSliders();         // 场景二：初始化口味滑块
    initTagClickHandlers();     // 场景二：标签点击处理
    initButtonHandlers();       // 按钮事件绑定
    initNavigation();           // 导航事件
    initTechniqueCards();       // 场景三：技巧卡片
    initModals();               // 模态框
}

// ========== 场景一：材料匹配 ==========
function renderMaterialTags() {
    // 基酒
    materialCategories.baseSpirits.forEach(mat => {
        const tag = createMaterialTag(mat, 'base-spirit');
        dom.materials.baseSpiritsContainer.appendChild(tag);
    });
    // 利口酒
    materialCategories.liqueurs.forEach(mat => {
        const tag = createMaterialTag(mat, 'liqueur');
        dom.materials.liqueursContainer.appendChild(tag);
    });
    // 辅料
    materialCategories.ingredients.forEach(mat => {
        const tag = createMaterialTag(mat, 'ingredient');
        dom.materials.ingredientsContainer.appendChild(tag);
    });
}

function createMaterialTag(mat, type) {
    const el = document.createElement('span');
    el.className = 'material-tag';
    el.textContent = mat.name;
    el.dataset.id = mat.id;
    el.dataset.type = type;
    el.addEventListener('click', () => {
        if (appState.selectedMaterials.has(mat.id)) {
            appState.selectedMaterials.delete(mat.id);
            el.classList.remove('active');
        } else {
            appState.selectedMaterials.add(mat.id);
            el.classList.add('active');
        }
    });
    return el;
}

function matchRecipesByMaterials() {
    if (appState.selectedMaterials.size === 0) {
        dom.materials.results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍸</div>
                <p>请先选择您手头可用的材料，我们将为您匹配可调制的鸡尾酒。</p>
            </div>
        `;
        return;
    }

    // 为每个配方计算匹配度
    const results = cocktailRecipes.map(recipe => {
        // 收集配方所需的材料 ID 列表
        const requiredMaterialIds = new Set();
        recipe.ingredients.forEach(ing => {
            const ids = matchMaterialToId(ing.name);
            ids.forEach(id => requiredMaterialIds.add(id));
        });
        
        // 统计已有材料数和缺少材料数
        let available = 0;
        let missing = 0;
        const missingIngredients = [];
        const availableIngredients = [];
        
        recipe.ingredients.forEach(ing => {
            const ids = matchMaterialToId(ing.name);
            const isAvailable = ids.length === 0 || ids.some(id => appState.selectedMaterials.has(id));
            // 对于冰块、盐等基础物品，视为总是可用
            const isBasic = ['冰', '冰块', '碎冰', '盐', '胡椒', '糖浆', '糖'].some(b => ing.name.includes(b));
            
            if (isAvailable || isBasic) {
                available++;
                availableIngredients.push(ing);
            } else {
                missing++;
                missingIngredients.push(ing);
            }
        });
        
        // 匹配分数（已有材料数/总材料数）
        const score = recipe.ingredients.length > 0 
            ? Math.round((available / recipe.ingredients.length) * 100) 
            : 0;
        
        return { recipe, score, available, missing, missingIngredients, availableIngredients };
    });
    
    // 按匹配度从高到低排序
    results.sort((a, b) => b.score - a.score);
    
    // 只显示匹配度 >= 40% 的配方
    const filtered = results.filter(r => r.score >= 40);
    
    if (filtered.length === 0) {
        dom.materials.results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <p>很遗憾，根据当前选择的材料没有找到合适的配方。<br>试试选择更多材料，或者选择口味探索模式来找到您喜欢的饮品。</p>
            </div>
        `;
        return;
    }
    
    // 渲染结果
    renderRecipeCards(filtered, dom.materials.results, 'materials');
}

// ========== 场景二：口味探索 ==========
function initTasteSliders() {
    [dom.taste.sweetness, dom.taste.acidity, dom.taste.strength].forEach((slider, idx) => {
        const keys = ['sweetness', 'acidity', 'strength'];
        const key = keys[idx];
        
        slider.addEventListener('input', () => {
            const val = parseInt(slider.value);
            appState.tastePreferences[key] = val;
            const valueEl = document.getElementById(`${key}-value`);
            if (valueEl) valueEl.textContent = val;
        });
    });
}

function initTagClickHandlers() {
    // 风味标签
    const flavorTags = dom.taste.flavorTags.querySelectorAll('.flavor-tag');
    flavorTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const flavor = tag.dataset.flavor;
            if (appState.selectedFlavors.has(flavor)) {
                appState.selectedFlavors.delete(flavor);
                tag.classList.remove('active');
            } else {
                appState.selectedFlavors.add(flavor);
                tag.classList.add('active');
            }
        });
    });
    
    // 场合标签
    const occasionTags = dom.taste.occasionTags.querySelectorAll('.occasion-tag');
    occasionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const occasion = tag.dataset.occasion;
            if (appState.selectedOccasions.has(occasion)) {
                appState.selectedOccasions.delete(occasion);
                tag.classList.remove('active');
            } else {
                appState.selectedOccasions.add(occasion);
                tag.classList.add('active');
            }
        });
    });
}

function matchRecipesByTaste() {
    const { sweetness, acidity, strength } = appState.tastePreferences;
    
    // 为每个配方计算口味匹配度
    const results = cocktailRecipes.map(recipe => {
        // 甜度匹配（差值越小越好）
        const sweetDiff = Math.abs(recipe.sweetness - sweetness);
        const acidDiff = Math.abs(recipe.acidity - acidity);
        const strongDiff = Math.abs(recipe.strength - strength);
        
        // 基础分数：差值越小分数越高（满分 100）
        const tasteScore = 100 - ((sweetDiff + acidDiff + strongDiff) / 3) * 10;
        
        // 风味匹配：如果用户选了风味，计算重合度
        let flavorScore = 50;
        if (appState.selectedFlavors.size > 0) {
            const matched = recipe.flavors.filter(f => 
                appState.selectedFlavors.has(f)
            ).length;
            flavorScore = (matched / appState.selectedFlavors.size) * 100;
        }
        
        // 场合匹配
        let occasionScore = 50;
        if (appState.selectedOccasions.size > 0) {
            const matched = recipe.occasion.filter(o =>
                appState.selectedOccasions.has(o)
            ).length;
            occasionScore = (matched / appState.selectedOccasions.size) * 100;
        }
        
        // 综合评分（口味 50%，风味 30%，场合 20%）
        const totalScore = Math.round(tasteScore * 0.5 + flavorScore * 0.3 + occasionScore * 0.2);
        
        return { recipe, score: totalScore, tasteScore, flavorScore, occasionScore };
    });
    
    // 按综合评分从高到低排序并取前 10
    results.sort((a, b) => b.score - a.score);
    const filtered = results.slice(0, 12);
    
    renderRecipeCards(filtered, dom.taste.results, 'taste');
}

// ========== 渲染配方卡片（通用） ==========
function renderRecipeCards(recipeList, container, mode) {
    container.innerHTML = '';
    
    const countEl = document.createElement('div');
    countEl.style.cssText = 'grid-column: 1/-1; margin-bottom: 10px; font-size: 14px; color: #b8a994;';
    countEl.textContent = `为您找到 ${recipeList.length} 款匹配的配方：`;
    container.appendChild(countEl);
    
    recipeList.forEach(({ recipe, score, missing, missingIngredients }) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const difficultyStars = '★'.repeat(recipe.difficulty) + '☆'.repeat(5 - recipe.difficulty);
        const missingHtml = missing > 0 && missingIngredients 
            ? `<div style="margin-top:10px; padding:8px 12px; background:rgba(232,116,106,0.1); border-radius:6px; font-size:12px; color:#e8746a;">
                 缺少材料：${missingIngredients.map(i => i.name).join('、')}
               </div>` 
            : '';
        
        const availableHtml = missing > 0 && missingIngredients
            ? '<span style="color: #e8746a;">部分材料</span>'
            : '<span style="color: #7cae7a;">材料齐全</span>';
        
        card.innerHTML = `
            <div class="recipe-card-header">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <h3 style="color: #c9a55c; font-size: 20px; font-weight: 700; margin: 0;">${recipe.name}</h3>
                    <span style="font-size: 12px; color: #b8a994;">${recipe.enName}</span>
                </div>
                <div class="recipe-flavor-tags">
                    <span class="flavor-badge">甜度 ${recipe.sweetness}</span>
                    <span class="flavor-badge">酸度 ${recipe.acidity}</span>
                    <span class="flavor-badge">烈度 ${recipe.strength}</span>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #b8a994;">
                    ${recipe.flavors.join(' · ')}
                </div>
            </div>
            <div class="recipe-card-body">
                <div style="font-size: 13px; color: #b8a994; margin-bottom: 8px;">
                    ${mode === 'materials' 
                        ? `匹配度：<strong style="color: #c9a55c;">${score}%</strong> · ${availableHtml}`
                        : `匹配度：<strong style="color: #c9a55c;">${score}%</strong>`
                    }
                </div>
                <div style="font-size: 13px; color: #b8a994; margin-bottom: 8px;">
                    调制：${recipe.method} · 预计 ${recipe.time} 分钟
                </div>
                <div style="font-size: 13px; color: #b8a994; margin-bottom: 8px;">
                    难度：<span style="color: #c9a55c; letter-spacing: 2px;">${difficultyStars}</span>
                </div>
                <div style="font-size: 12px; color: #b8a994;">
                    适合场合：${recipe.occasion.slice(0, 2).join('、')}
                </div>
                ${missingHtml}
                <button class="detail-btn" style="margin-top: 16px; width: 100%; padding: 10px; background: rgba(201,165,92,0.15); border: 1px solid rgba(201,165,92,0.3); color: #c9a55c; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.3s;">查看完整配方 →</button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('detail-btn') && e.target.tagName !== 'BUTTON') {
                showRecipeDetail(recipe);
            } else {
                showRecipeDetail(recipe);
            }
        });
        
        container.appendChild(card);
    });
}

// ========== 配方详情模态框 ==========
function showRecipeDetail(recipe) {
    const difficultyStars = '★'.repeat(recipe.difficulty) + '☆'.repeat(5 - recipe.difficulty);
    const allergensHtml = recipe.allergens && recipe.allergens.length > 0
        ? `<div class="safety-box" style="margin-top:16px;">⚠️ 过敏原提示：本配方含有 ${recipe.allergens.join('、')}，过敏者请谨慎饮用。</div>`
        : '';
    
    dom.recipeModal.detail.innerHTML = `
        <div class="recipe-detail" style="padding: 48px;">
            <div class="recipe-detail-header">
                <h3 class="detail-name">${recipe.name}</h3>
                <div style="font-size: 14px; color: #b8a994; letter-spacing: 2px; margin-top: 8px;">${recipe.enName}</div>
                <div class="detail-divider" style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #c9a55c, transparent); margin: 20px auto;"></div>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #b8a994;">
                    <span>类别：<strong style="color:#e8c88a;">${recipe.category}</strong></span>
                    <span>基酒：<strong style="color:#e8c88a;">${recipe.base}</strong></span>
                    <span>调制：<strong style="color:#e8c88a;">${recipe.method}</strong></span>
                </div>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #b8a994; margin-top: 10px;">
                    <span>甜度 ${recipe.sweetness}/10</span>
                    <span>酸度 ${recipe.acidity}/10</span>
                    <span>烈度 ${recipe.strength}/10</span>
                    <span>难度 ${difficultyStars}</span>
                    <span>约 ${recipe.time} 分钟</span>
                </div>
                <div style="margin-top: 16px; font-size: 13px; color: #b8a994;">
                    风味标签：${recipe.flavors.join(' · ')}
                </div>
            </div>
            
            <div class="detail-section" style="margin-top: 32px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">📋 材料清单</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    ${recipe.ingredients.map(ing => `
                        <tr style="border-bottom: 1px solid #3d3024;">
                            <td style="padding: 10px 8px; color: #e8c88a; font-size: 14px; font-weight: 500;">${ing.name}</td>
                            <td style="padding: 10px 8px; text-align: center; color: #f4ece0; font-size: 14px;">${ing.amount}</td>
                            <td style="padding: 10px 8px; text-align: right; color: #b8a994; font-size: 12px;">${ing.note || ''}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            
            <div class="detail-section" style="margin-top: 32px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">👨‍🍳 调制步骤</h4>
                <ol style="list-style: none; counter-reset: step-counter; padding: 0;">
                    ${recipe.steps.map((step, idx) => `
                        <li style="counter-increment: step-counter; position: relative; padding: 12px 0 12px 52px; font-size: 14px; color: #f4ece0; line-height: 1.8; border-bottom: 1px solid #3d231c;">
                            <span style="position: absolute; left: 0; top: 12px; width: 36px; height: 36px; background: #c9a55c; color: #1a1410; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">${idx + 1}</span>
                            ${step}
                        </li>
                    `).join('')}
                </ol>
            </div>
            
            <div class="detail-section" style="margin-top: 32px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">🍒 装饰建议</h4>
                <div style="padding: 16px 20px; background: rgba(201,165,92,0.08); border: 1px solid rgba(201,165,92,0.2); border-radius: 8px; font-size: 14px; color: #f4ece0; line-height: 1.8;">${recipe.decoration}</div>
            </div>
            
            <div class="detail-section" style="margin-top: 32px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">💡 小贴士</h4>
                <div style="padding: 16px 20px; background: rgba(201,165,92,0.08); border: 1px solid rgba(201,165,92,0.2); border-radius: 8px; font-size: 14px; color: #f4ece0; line-height: 1.8;">${recipe.tips}</div>
            </div>
            
            ${recipe.story ? `
                <div class="detail-section" style="margin-top: 32px;">
                    <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">📖 配方故事</h4>
                    <div style="padding: 16px 20px; background: rgba(212,163,115,0.08); border: 1px solid rgba(212,163,115,0.2); border-radius: 8px; font-size: 14px; color: #f4ece0; line-height: 1.8; font-style: italic;">${recipe.story}</div>
                </div>
            ` : ''}
            
            <div class="safety-box" style="margin-top: 24px; padding: 16px 20px; background: rgba(201,165,92,0.08); border: 1px solid rgba(201,165,92,0.3); border-radius: 8px; font-size: 13px; color: #e8c88a; line-height: 1.8;">
                🍸 预估酒精度：${recipe.alcohol} · 请理性饮酒，切勿酒驾！
                ${allergensHtml}
            </div>
        </div>
    `;
    
    dom.recipeModal.modal.classList.add('active');
}

// ========== 场景三：学习模式 - 技巧详情 ==========
const techniqueDetails = {
    shake: {
        title: '🍶 摇和法 (Shake)',
        description: '最基础也是最重要的调制方法，适用于含有果汁、糖浆、奶油、蛋清等成分的饮品。通过剧烈摇晃使材料充分混合，并快速降温稀释。',
        steps: [
            '将配方中的所有液体材料倒入雪克壶（Shaker）中',
            '如果配方需要蛋清或蛋黄，先进行"干摇"（不加冰摇 10-15 秒）使蛋液乳化',
            '加入冰块至雪克壶约 3/4 满（使用方形或球形大冰块最佳）',
            '盖紧雪克壶，双手紧握，用力摇晃 10-15 秒',
            '当壶身结霜、手感冰冷时停止（约 10-15 秒）',
            '用滤冰器将酒液过滤倒入杯中，根据配方加入冰块或保持纯净'
        ],
        tips: [
            '摇晃时动作要有力但不要过度摇晃，避免酒液溅出',
            '干摇（不加冰）能让蛋清产生更好的泡沫和丝滑口感',
            '摇和时间不要超过 20 秒，否则冰块会过度融化稀释饮品',
            '注意：含有碳酸饮料的配方不能摇和，会导致气压过高喷出',
            '推荐使用 Boston 摇壶（两件式）或 Cobbler 摇壶（三件式）'
        ],
        commonMistakes: '常见错误：❌ 冰块太少导致降温不足 ❌ 摇和时间过长导致过度稀释 ❌ 摇晃不充分导致材料分离 ❌ 使用碳酸饮料摇和造成危险'
    },
    stir: {
        title: '🥄 调和法 (Stir)',
        description: '优雅的调制方式，适用于纯酒类饮品（如 Martini、Manhattan、Negroni）。通过缓慢搅拌保持酒体清澈，同时达到理想的温度和稀释度。',
        steps: [
            '在调酒杯（Mixing Glass）中放入冰块至约 3/4 满',
            '倒入配方中的所有液体材料',
            '将吧勺（Bar Spoon）螺旋面贴紧杯壁插入',
            '沿着杯壁缓慢地以圆周运动搅拌 20-30 秒',
            '搅拌时保持吧勺贴壁滑动，不要搅动冰块',
            '用滤冰器（Julep Strainer）过滤倒入冰镇杯具中'
        ],
        tips: [
            '调和法的关键是"降温但不浑浊"，保持酒体清澈',
            '搅拌时间取决于环境温度，一般 20-30 秒足够降温',
            '可以用手感受调酒杯外的温度来判断是否完成',
            '预先冰镇调酒杯和目标杯能获得更好的效果',
            '专业调酒师会将吧勺绕着冰块和杯壁间滑动而非搅动冰块'
        ],
        commonMistakes: '常见错误：❌ 像摇和一样剧烈搅拌 ❌ 使用细柄勺而非专业吧勺 ❌ 忘记预先冰镇杯具 ❌ 搅拌时间不足导致温度不够低'
    },
    build: {
        title: '🧊 兑和法 (Build)',
        description: '最简单的调制方式，将材料依次加入装有冰块的杯中。适用于长饮类（Long Drink）饮品，如金汤力、自由古巴、莫斯科骡子等。',
        steps: [
            '在目标杯中放入冰块至约 3/4 满（预先用冰冷却杯身更佳）',
            '倒入烈酒和其他高浓度材料',
            '缓慢加入碳酸饮料、果汁或水',
            '用吧勺轻轻搅拌 2-3 下（碳酸饮料通常只需轻微搅动）',
            '加入装饰并插入吸管即可'
        ],
        tips: [
            '使用大冰块能减少融化速度，保持饮品口感',
            '碳酸饮料应该缓慢倒入并轻轻搅拌，避免气泡消失',
            '对于分层效果要求不高的饮品，可以一次性加入所有材料',
            '铜杯特别适合兑和法，因为它能快速降温并产生视觉效果'
        ],
        commonMistakes: '常见错误：❌ 使用太小的冰块导致过快融化 ❌ 过度搅拌导致碳酸饮料失去气泡 ❌ 材料顺序颠倒影响口感'
    },
    layer: {
        title: '🌈 分层法 (Layer)',
        description: '利用酒液的密度差异在杯中形成明显的分层效果。操作难度较高，但视觉效果极佳，是 B-52、彩虹系列等饮品的核心技术。',
        steps: [
            '研究配方中每种材料的密度（含糖量越高越重，酒精含量越高越轻）',
            '将最重（含糖最高）的材料直接倒入杯底',
            '将吧勺背面朝下轻轻靠在杯壁上，贴近杯中的液面',
            '缓慢地将下一种材料倒在吧勺背面，使液滴沿杯壁流下',
            '重复以上步骤，按密度从高到低依次加入每种材料',
            '完成后不要搅拌，保持完整的分层效果'
        ],
        tips: [
            '密度排序：糖浆 > 甜利口酒 > 干型利口酒 > 烈酒 > 奶油/蛋清类（注意：奶油类需要特殊处理）',
            '使用专业的分层勺（Layer Spoon）或吧勺效果最佳',
            '温度影响密度，材料温度要一致，建议都冷藏',
            '关键是"慢"——倒得越慢，分层越清晰',
            '如果某一层混入下层，可以尝试倒得更慢或更换材料顺序'
        ],
        commonMistakes: '常见错误：❌ 倒酒速度太快导致分层混乱 ❌ 材料顺序错误 ❌ 用错吧勺背面 ❌ 杯子太小导致液面搅动'
    },
    blend: {
        title: '🥤 搅和法 (Blend)',
        description: '使用搅拌机将材料与冰打碎成顺滑的冰沙状。适合冰冻类饮品（Frozen Drink），如 Frozen Daiquiri、Piña Colada、草莓戴克丽等。',
        steps: [
            '将配方中的液体材料（果汁、糖浆、烈酒等）倒入搅拌机',
            '根据配方加入碎冰（通常 150-250g，根据所需浓度调整）',
            '盖上盖子，先低速搅拌 3-5 秒使冰块初步碎裂',
            '然后高速搅拌 10-15 秒至完全顺滑',
            '倒入冰镇杯具中（冰冻杯最好）',
            '加入装饰和吸管立即饮用（融化后口感会变差）'
        ],
        tips: [
            '冰量决定最终口感：多冰更浓稠，少冰更顺滑',
            '如果没有搅拌机，也可以用捣棒捣碎冰块作为替代',
            '奶油类饮品建议使用稍微融化的冰，避免奶油凝固',
            '搅好的饮品应立即饮用，时间越长融化越多',
            '可以在倒出后在顶部撒一点肉桂粉或可可粉增加风味'
        ],
        commonMistakes: '常见错误：❌ 冰量不足导致过于稀薄 ❌ 搅拌过度使冰融化过快 ❌ 忘记加密封盖导致喷出 ❌ 使用热材料使冰快速融化'
    },
    muddle: {
        title: '🍃 捣压法 (Muddle)',
        description: '用捣棒（Muddler）在杯底压碎香草、水果或糖。释放芳香物质，是莫吉托（Mojito）、薄荷茱莉普、Caipirinha 等的关键步骤。',
        steps: [
            '将需要捣压的材料（薄荷叶、水果块、方糖等）放入杯底',
            '可以加入少量糖浆或苦精作为润滑剂',
            '用捣棒的平端轻轻按压和扭转（不要敲击）',
            '对于薄荷叶：只需释放香气和汁液（约 3-5 次轻压），不要捣成糊状',
            '对于水果（柠檬、青柠、草莓）：可以稍微用力捣碎果肉释放果汁',
            '对于方糖：需要压碎至溶解，可加入少量苏打水帮助溶解',
            '捣压完成后加入其他材料和冰块，进行摇和或兑和'
        ],
        tips: [
            '关键在于"轻"——过度捣压会释放植物的苦味成分（尤其是薄荷叶）',
            '捣压水果时避免捣碎果皮，因为果皮含苦油',
            '推荐使用木质捣棒，塑料材质不易控制力度',
            '可以先把糖或糖浆放在杯底，再放薄荷，这样糖能"抓住"香气',
            '莫吉托的完美状态是：闻到明显的薄荷香但看不到绿色液体'
        ],
        commonMistakes: '常见错误：❌ 过度捣压薄荷叶导致青草苦味 ❌ 捣碎柠檬皮产生涩味 ❌ 没有充分捣碎糖块 ❌ 使用错误工具（如吧勺背面）'
    }
};

function initTechniqueCards() {
    const cards = document.querySelectorAll('.technique-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 从卡片样式推断技术类型
            const title = card.querySelector('h4').textContent;
            let key = 'shake';
            if (title.includes('调和')) key = 'stir';
            else if (title.includes('兑和')) key = 'build';
            else if (title.includes('分层')) key = 'layer';
            else if (title.includes('搅和')) key = 'blend';
            else if (title.includes('捣压')) key = 'muddle';
            
            showTechniqueDetail(key);
        });
    });
}

function showTechniqueDetail(key) {
    const tech = techniqueDetails[key];
    if (!tech) return;
    
    dom.techniqueModal.detail.innerHTML = `
        <div style="padding: 48px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <h3 style="font-size: 28px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; letter-spacing: 2px;">${tech.title}</h3>
                <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #c9a55c, transparent); margin: 16px auto;"></div>
                <p style="font-size: 14px; color: #b8a994; line-height: 1.8; max-width: 600px; margin: 0 auto;">${tech.description}</p>
            </div>
            
            <div style="margin-top: 32px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">📋 操作步骤</h4>
                <ol style="list-style: none; counter-reset: step-counter; padding: 0;">
                    ${tech.steps.map((step, idx) => `
                        <li style="counter-increment: step-counter; position: relative; padding: 10px 0 10px 52px; font-size: 14px; color: #f4ece0; line-height: 1.8; border-bottom: 1px solid #3d231c;">
                            <span style="position: absolute; left: 0; top: 10px; width: 36px; height: 36px; background: #c9a55c; color: #1a1410; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">${idx + 1}</span>
                            ${step}
                        </li>
                    `).join('')}
                </ol>
            </div>
            
            <div style="margin-top: 32px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c; letter-spacing: 1px;">💡 专业建议</h4>
                <div style="padding: 20px; background: rgba(201,165,92,0.08); border: 1px solid rgba(201,165,92,0.2); border-radius: 8px;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${tech.tips.map(tip => `
                            <li style="padding: 8px 0 8px 24px; font-size: 14px; color: #f4ece0; line-height: 1.8; position: relative; border-bottom: 1px solid rgba(61,48,36,0.5);">
                                <span style="position: absolute; left: 0; color: #c9a55c;">✓</span> ${tip}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="margin-top: 24px; padding: 20px; background: rgba(232,116,106,0.1); border: 1px solid rgba(232,116,106,0.3); border-radius: 8px; font-size: 13px; color: #e8a89a; line-height: 1.8;">${tech.commonMistakes}</div>
        </div>
    `;
    
    dom.techniqueModal.modal.classList.add('active');
}

// ========== 场景四：创意调酒模式 ==========
function generateCreativeRecipe() {
    const base = dom.create.baseSelect.value;
    const theme = dom.create.themeSelect.value;
    const feel = dom.create.feelSelect.value;
    
    if (!base && !theme && !feel) {
        dom.create.results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎨</div>
                <p>请至少选择一个要素（基酒/主题/口感偏好）来生成创意配方。</p>
            </div>
        `;
        return;
    }
    
    // 根据用户选择动态生成配方
    const recipe = buildCreativeRecipe(base, theme, feel);
    
    dom.create.results.innerHTML = '';
    
    const header = document.createElement('div');
    header.style.cssText = 'grid-column: 1/-1; padding: 24px; margin-bottom: 20px; background: rgba(201,165,92,0.1); border: 1px solid rgba(201,165,92,0.3); border-radius: 12px;';
    header.innerHTML = `
        <h3 style="color: #c9a55c; font-size: 18px; margin-bottom: 12px;">✨ MixMate 为您创作</h3>
        <p style="font-size: 13px; color: #b8a994; line-height: 1.8; margin: 0;">
            根据您的偏好
            ${base ? `【${base}基酒】` : ''}
            ${theme ? `【${theme}主题】` : ''}
            ${feel ? `【${feel}口感】` : ''}
            ，为您创作了以下独特的鸡尾酒配方。
        </p>
    `;
    dom.create.results.appendChild(header);
    
    // 以卡片形式展示生成的配方
    const card = document.createElement('div');
    card.style.cssText = 'grid-column: 1/-1; background: #2d231c; border: 1px solid #3d3024; border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.3s;';
    card.innerHTML = `
        <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <h3 style="color: #c9a55c; font-size: 32px; font-weight: 700; letter-spacing: 4px; margin-bottom: 8px;">${recipe.name}</h3>
                <p style="color: #b8a994; font-size: 14px; letter-spacing: 2px;">${recipe.enName || 'Creative Cocktail'}</p>
            </div>
            <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 24px; font-size: 13px; color: #b8a994;">
                <span>调制法：<strong style="color: #e8c88a;">${recipe.method}</strong></span>
                <span>时间：<strong style="color: #e8c88a;">约 ${recipe.time} 分钟</strong></span>
                <span>难度：<strong style="color: #e8c88a;">${'★'.repeat(recipe.difficulty)}${'☆'.repeat(5-recipe.difficulty)}</strong></span>
                <span>预估酒精度：<strong style="color: #e8c88a;">${recipe.alcohol}</strong></span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 32px;">
                <div>
                    <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c;">📋 材料</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${recipe.ingredients.map(ing => `
                            <tr style="border-bottom: 1px solid #3d3024;">
                                <td style="padding: 10px 0; color: #e8c88a; font-size: 14px;">${ing.name}</td>
                                <td style="padding: 10px 0; text-align: right; color: #f4ece0; font-size: 14px;">${ing.amount}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div>
                    <h4 style="font-size: 15px; font-weight: 700; color: #c9a55c; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #c9a55c;">👨‍🍳 步骤</h4>
                    <ol style="padding: 0; margin: 0; list-style: none;">
                        ${recipe.steps.map((step, idx) => `
                            <li style="padding: 8px 0 8px 40px; font-size: 13px; color: #f4ece0; line-height: 1.6; position: relative;">
                                <span style="position: absolute; left: 0; top: 8px; width: 28px; height: 28px; background: #c9a55c; color: #1a1410; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">${idx + 1}</span>
                                ${step}
                            </li>
                        `).join('')}
                    </ol>
                </div>
            </div>
            
            <div style="margin-top: 32px; padding: 20px; background: rgba(201,165,92,0.08); border: 1px solid rgba(201,165,92,0.2); border-radius: 8px;">
                <p style="font-size: 14px; color: #f4ece0; line-height: 1.8; margin: 0;">🍒 <strong>装饰：</strong>${recipe.decoration}</p>
            </div>
            
            <div style="margin-top: 16px; padding: 20px; background: rgba(212,163,115,0.08); border: 1px solid rgba(212,163,115,0.2); border-radius: 8px;">
                <p style="font-size: 14px; color: #f4ece0; line-height: 1.8; margin: 0;">💡 <strong>创作思路：</strong>${recipe.story}</p>
            </div>
            
            <div style="margin-top: 24px; padding: 16px; background: rgba(232,116,106,0.08); border: 1px solid rgba(232,116,106,0.3); border-radius: 8px; font-size: 13px; color: #e8c88a; line-height: 1.6;">
                ⚠️ 本配方由 MixMate 根据经典鸡尾酒原理创作，请根据个人口味调整用量。请理性饮酒，切勿酒驾！
            </div>
        </div>
    `;
    
    dom.create.results.appendChild(card);
}

function buildCreativeRecipe(base, theme, feel) {
    // 基于用户选择生成个性化配方
    const baseIngredient = base || '金酒';
    const themeName = theme || '经典';
    const feelName = feel || '清爽果味';
    
    // 构建有趣的配方名
    const recipeNames = {
        '威士忌': ['夜色温柔', '烟与石', '焦糖黄昏'],
        '白兰地': ['黄金时代', '法兰西之吻', '秋日私语'],
        '金酒': ['花园之夜', '伯爵茶时光', '草本诗'],
        '朗姆酒': ['加勒比风', '海盗日记', '热带日落'],
        '伏特加': ['极地之光', '冰雪女王', '透明的心'],
        '龙舌兰': ['沙漠玫瑰', '玛雅传说', '火焰之心']
    };
    
    const name = (recipeNames[base] || ['神秘调酒师'])[0] || '创意特调';
    
    // 根据主题和口感调整配方材料
    let ingredients = [
        { name: baseIngredient, amount: '45 ml' }
    ];
    
    if (theme === '夏日清新') {
        ingredients.push(
            { name: '青柠汁', amount: '25 ml' },
            { name: '新鲜薄荷', amount: '6-8 片' },
            { name: '糖浆', amount: '10 ml' }
        );
    } else if (theme === '冬日暖语') {
        ingredients.push(
            { name: '蜂蜜糖浆', amount: '15 ml' },
            { name: '柠檬汁', amount: '20 ml' },
            { name: '肉桂粉', amount: '少量' }
        );
    } else if (theme === '东方韵味') {
        ingredients.push(
            { name: '茉莉花茶糖浆', amount: '15 ml' },
            { name: '柠檬汁', amount: '20 ml' },
            { name: '枸杞', amount: '5-8 粒' }
        );
    } else if (theme === '热带风情') {
        ingredients.push(
            { name: '菠萝汁', amount: '30 ml' },
            { name: '椰奶', amount: '20 ml' },
            { name: '青柠汁', amount: '15 ml' }
        );
    } else if (theme === '花香诗意') {
        ingredients.push(
            { name: '接骨木花糖浆', amount: '15 ml' },
            { name: '柠檬汁', amount: '20 ml' },
            { name: '玫瑰水', amount: '2-3 滴' }
        );
    } else if (theme === '夜色迷情') {
        ingredients.push(
            { name: '咖啡利口酒', amount: '20 ml' },
            { name: '糖浆', amount: '10 ml' },
            { name: '安格斯特苦精', amount: '2 滴' }
        );
    } else {
        ingredients.push(
            { name: '君度橙酒', amount: '20 ml' },
            { name: '柠檬汁', amount: '20 ml' },
            { name: '糖浆', amount: '10 ml' }
        );
    }
    
    return {
        name: `「${name}」`,
        enName: `${themeName} ${feelName} Cocktail`,
        base: baseIngredient,
        method: '摇和法',
        difficulty: 2,
        time: 5,
        alcohol: '约 18-22%',
        ingredients: ingredients,
        steps: [
            '将所有液体材料和新鲜配料放入雪克壶中',
            '加入冰块至 3/4 满，摇晃至壶身结霜',
            '用细滤网过滤倒入冰镇杯具',
            '根据配料添加适量苏打水或装饰',
            '可以根据个人口味调整甜度'
        ],
        decoration: '新鲜水果片、香草枝或花，根据主题选择合适的装饰物',
        story: `以 ${baseIngredient} 为基酒，融入 ${themeName} 的灵感和 ${feelName} 的口感追求，这是一款体现 MixMate 调酒哲学的原创配方。经典的酸甜平衡中蕴含着独特的风味层次，期待您亲自探索！`
    };
}

// ========== 按钮和模态框事件 ==========
function initButtonHandlers() {
    // 场景一按钮
    dom.materials.clearBtn.addEventListener('click', () => {
        appState.selectedMaterials.clear();
        document.querySelectorAll('.material-tag').forEach(t => t.classList.remove('active'));
        dom.materials.results.innerHTML = '';
    });
    dom.materials.matchBtn.addEventListener('click', matchRecipesByMaterials);
    
    // 场景二按钮
    dom.taste.resetBtn.addEventListener('click', () => {
        appState.tastePreferences = { sweetness: 5, acidity: 5, strength: 5 };
        appState.selectedFlavors.clear();
        appState.selectedOccasions.clear();
        [dom.taste.sweetness, dom.taste.acidity, dom.taste.strength].forEach(s => s.value = 5);
        dom.taste.sweetnessValue.textContent = '5';
        dom.taste.acidityValue.textContent = '5';
        dom.taste.strengthValue.textContent = '5';
        document.querySelectorAll('.flavor-tag, .occasion-tag').forEach(t => t.classList.remove('active'));
        dom.taste.results.innerHTML = '';
    });
    dom.taste.matchBtn.addEventListener('click', matchRecipesByTaste);
    
    // 场景四按钮
    dom.create.generateBtn.addEventListener('click', generateCreativeRecipe);
}

function initNavigation() {
    // 导航平滑滚动和高亮
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 80;
                const topPos = target.offsetTop - offset;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
            }
        });
    });
    
    // 场景卡片点击跳转
    document.querySelectorAll('.scene-card').forEach(card => {
        card.addEventListener('click', () => {
            const scene = card.dataset.scene;
            const section = document.getElementById(scene);
            if (section) {
                const offset = 80;
                const topPos = section.offsetTop - offset;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
            }
        });
    });
}

function initModals() {
    // 关闭按钮
    dom.recipeModal.closeBtn.addEventListener('click', () => {
        dom.recipeModal.modal.classList.remove('active');
    });
    dom.techniqueModal.closeBtn.addEventListener('click', () => {
        dom.techniqueModal.modal.classList.remove('active');
    });
    
    // 点击外部关闭
    [dom.recipeModal.modal, dom.techniqueModal.modal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dom.recipeModal.modal.classList.remove('active');
            dom.techniqueModal.modal.classList.remove('active');
        }
    });
}

// ========== 启动 ==========
document.addEventListener('DOMContentLoaded', init);

// 如果 DOMContentLoaded 已触发（脚本延迟加载），立即初始化
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
}
