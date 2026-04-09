await waitGlobalInitialized("Mvu");

const chs2num = (str) => {
  const reg = /^.*?([元正一二三四五六七八九十廿卅卌冬腊]+).*?$/;
  if (!reg.test(str)) return 0;

  const ch = str.replace(reg, "$1");

  const map = {
    元: 1,
    正: 1,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    冬: 11,
    腊: 12,
  };
  const ten_map = { 十: 10, 廿: 20, 卅: 30, 卌: 40 };

  if (ch.length === 1) {
    return map[ch] || ten_map[ch] || 0;
  }
  if (ch.length === 2) {
    // 十一 -> 11， 廿四 -> 24
    if (ten_map[ch[0]] && map[ch[1]]) {
      return ten_map[ch[0]] + map[ch[1]];
    } // 二十 -> 20
    if (ch[1] === "十") {
      return map[ch[0]] * 10;
    }
  }
  if (ch.length === 3 && ch[1] === "十") {
    return map[ch[0]] * 10 + map[ch[2]]; // 二十四 -> 24
  }
  return 0;
};

// 关系映射函数，人际网络处理用
const v2t = (mapArray, value, currentText) => {
  let tags;
  for (const item of mapArray) {
    const threshold = item[0]; // 第一个元素是阈值
    if (value <= threshold) {
      tags = item.slice(1); // 剩下的元素全部作为关系标签
      break;
    }
  }

  // 兜底，数值爆表默认取最后一组
  if (!tags) {
    tags = mapArray[mapArray.length - 1].slice(1);
  }

  // 如果当前关系在映射结果中，则保持不变
  if (tags.some((t) => t === currentText)) {
    return currentText;
  }
  // 如果当前关系不在映射结果中，则随机取一个
  return tags[Math.floor(Math.random() * tags.length)];
};

//公历清理
const migrate_world = (world) => {
  if (world.公历) {
    delete world.公历;
  }
};

// 个人属性清理
const migrate_personal = (personal) => {
  if (personal?.核心身份?.length > 0) {
    // 均有值则删除核心身份
    if (personal?.身份?.length > 0 || personal?.称号?.length > 0) {
      delete personal.核心身份;
    } else {
      if (personal.身份 === undefined) {
        personal.身份 = [];
      }
      if (personal.称号 === undefined) {
        personal.称号 = [];
      }
    }
  }
};
// 月度总结清理与迁移
const migrate_month_summary = (personal) => {
  if (!personal?.月度总结?._白银 && personal?.月度总结?.白银) {
    personal.月度总结._白银 = personal.月度总结.白银;
  }
  if (personal?.月度总结?.白银) {
    delete personal.月度总结.白银;
  }
  if (!personal?.月度总结?._粮草 && personal?.月度总结?.粮草) {
    personal.月度总结._粮草 = personal.月度总结.粮草;
  }
  if (personal?.月度总结?.粮草) {
    delete personal.月度总结.粮草;
  }
};

// 声望迁移
const migrate_reputation = (personal) => {
  if (typeof personal.声望 !== "undefined" && typeof personal._名声 === "undefined") {
    personal._名声 = personal.声望;
    personal._风评 =
      Math.floor(Math.log(Math.abs(personal.声望) + 1) * 8) * // 对数平滑大数值，目标上限 100,0000
      (personal.声望 > 0 ? 1 : -1);
    delete personal.声望;
  }
};

// 迁移艾弥斯·冯·施瓦茨贝格到艾弥斯
const migrate_relationships = (relationships) => {
  // 艾弥斯·冯·施瓦茨贝格 迁移到 艾弥斯
  if (relationships.艾弥斯·冯·施瓦茨贝格) {
    relationships.艾弥斯 = relationships.艾弥斯·冯·施瓦茨贝格;
    delete relationships.艾弥斯·冯·施瓦茨贝格;
  }
};

// 新加入人物如果在已删除人物列表中，则自动重连，并合并数据
const migrate_auto_relink = (relationships, unlinked) => {
  for (const [name, data] of Object.entries(unlinked)) {
    if (relationships[name]) {
      relationships[name] = { ...data, ...relationships[name] };
      delete unlinked[name];
    }
  }
};

// 旧其它资产迁移到核心资产
const migrate_core_assets = (assets, personal) => {
  // 迁移
  if (personal?.私库累计?.其它资产 && Object.keys(personal.私库累计.其它资产).length > 0) {
    assets = {
      ...Object.fromEntries(
        Object.entries(personal.私库累计.其它资产).map(([name, { 资产说明, 资产数量 }]) => [
          name,
          { 说明: 资产说明, 数量: 资产数量 || 1, 兑换: { 类型: "杂物", 动作: "舍弃" } },
        ]),
      ),
      ...assets,
    };
    delete personal.私库累计.其它资产;
  }
  // 删除数量 <=0 的资产
  for (const [name, asset] of Object.entries(assets)) {
    if (!asset.数量 || asset.数量 <= 0) {
      delete assets[name];
    }
  }
};

// 年号变更处理
const migrate_year_change = (world) => {
  if (!world.年号变更) {
    if (world.农历.年份.slice(0, 2) === "崇祯") {
      world.年号变更 = {
        年号: "崇祯",
        fix: 0,
        公元年: 1628,
      };
    } else {
      world.年号变更 = {
        年号: world.农历.年份.slice(0, 2),
        fix: 16,
        公元年: 1644,
      };
    }
  }
};

const process_year_change = (new_data, old_data) => {
  const { 年份: new_year } = new_data.世界信息.农历;
  const { 年份: old_year } = old_data.世界信息.农历;
  const new_gen = new_year.slice(0, 2);
  const old_gen = old_year.slice(0, 2);
  // 年号变更
  if (new_gen !== old_gen) {
    // 新年号
    new_data.世界信息.年号变更.年号 = new_gen;
    // 相对崇祯元年修正数
    new_data.世界信息.年号变更.fix += chs2num(old_gen) - 1;
    // 公元年修正数
    new_data.世界信息.年号变更.公元年 += chs2num(old_gen) - 1;
  }
};

// 声望处理
const process_reputation = (personal) => {
  // 声望计算
  let fresh = personal.$声望新鲜度;
  // 新鲜度衰减因子
  const decay_factor = 0.6;
  // 名声计算
  for (const item of personal.声望变更事件) {
    // 取变量
    const { 事件风评: event_v, 事件名声: event_r, 参与度: event_p } = item;
    // 衰减系数
    fresh =
      Math.abs(event_v - personal._风评) > 1
        ? Math.min((fresh / decay_factor) * 2, 1) // 新鲜度恢复速度加快
        : Math.max(fresh * decay_factor, 0.05); // 新鲜度衰减
    // 阻尼器 防止大号刷低级任务
    const damping = event_r / (event_r + personal._名声);
    // 名声计算
    const delta_r =
      Math.max(personal._名声, event_r) * // 小号做高级任务收益大
      (1 + Math.abs(event_v - personal._风评) / 100) *
      damping * // 应用阻尼器
      event_p *
      event_p * // 参与度平方，防止蹭局
      fresh; // 应用新鲜度因素
    // 风评计算
    const delta_v =
      (event_v - personal._风评) * // 道德张力，事件风评与当前风评差值越大，道德张力越大
      event_p * // 参与度
      damping; // 应用阻尼器
    // 更新名声和风评
    personal._名声 += delta_r;
    personal._风评 += delta_v;
  }
  // 新鲜度回写
  personal.$声望新鲜度 = fresh;
  // 极值保护
  personal._名声 = Math.max(Math.round(personal._名声), 1);
  personal._风评 = Math.min(Math.max(Math.round(personal._风评), -100), 100);
  personal.声望变更事件.length = 0;
};

// 人际网络处理
const process_relationships = (relationships) => {
  for (const [, data] of Object.entries(relationships)) {
    if (data.type !== "麾下") {
      delete data.忠诚度;
    } else {
      // 麾下类型忠诚度范围限制在 0-100
      data.忠诚度 = Math.max(0, Math.min(100, data.忠诚度));
    }
    // 如果 type 不是红颜或内眷，删除人设标签
    if (data.type !== "红颜" && data.type !== "内眷" && data.type !== "亲属") {
      delete data.人设标签;
    }
    // 好感度范围保护
    data.好感度 = Math.max(data.type === "朝野" ? -100 : 0, Math.min(100, data.好感度));
    // 麾下类型好感度、忠诚度范围保护，避免出现极端值
    if (data.type === "麾下") {
      if (data.忠诚度 >= 80) {
        data.好感度 = Math.max(data.好感度, 30);
      }
      if (data.好感度 >= 80) {
        data.忠诚度 = Math.max(data.忠诚度, 30);
      }
    }

    // 关系映射
    switch (data.type) {
      case "麾下":
        data.关系 = v2t(
          [
            [15, "貌合神离", "阳奉阴违", "消极怠工"],
            [35, "见风使舵", "逐利而动"],
            [55, "听命履职", "尽职尽责"],
            [75, "心腹干将", "核心臂膀", "忠心耿耿"],
            [95, "荣辱与共", "死心塌地"],
            [100, "死忠不二", "赴汤蹈火", "同生共死"],
          ],
          data.忠诚度,
          data.关系,
        );
        break;

      case "朝野":
        // 叛徒处理，好感度 <=15 锁定关系为叛徒，且不执行后续关系映射
        if (data.好感度 <= 15 && data.关系?.includes("叛徒")) {
          data.关系 = "叛徒";
          break;
        }
        // 非叛徒处理,执行后续关系映射
        data.关系 = v2t(
          [
            [-70, "势同水火", "不共戴天", "你死我活"],
            [-10, "敌对", "竞争者"],
            [15, "中立", "点头之交", "形同陌路"],
            [35, "人脉助力", "合作", "互惠互利"],
            [75, "核心盟友", "利益绑定"],
            [95, "休戚与共", "莫逆之交", "共进退"],
            [100, "生死之交"],
          ],
          data.好感度,
          data.关系,
        );
        break;

      case "红颜":
        // 休妻 关系处理,如果关系中包含休妻,和离,官断离异,义绝,则直接设置关系为对应的值,且不执行后续关系映射
        if (
          ["休妻", "和离", "官断离异", "义绝"].find((d) => {
            if (data.关系?.includes(d)) {
              data.关系 = d;
              return true;
            }
            return false;
          })
        ) {
          break;
        }
        // 非休妻 关系处理,执行后续关系映射
        data.关系 = v2t(
          [
            [15, "初见"],
            [45, "相识"],
            [75, "暧昧"],
            [90, "芳心暗许"],
            [100, "情定终身"],
          ],
          data.好感度,
          data.关系,
        );
        break;
    }
    // 预设定角色强制设置人设标签为 "预设定角色"
    if (["艾弥斯", "顾眉", "钱芷沅", "爱新觉罗·雅沁", "博尔济吉特·乌云娜", "朱徽媞", "卓文茵"].includes(data.姓名)) {
      data.人设标签 = "预设定角色";
    }

    // 空值诱导，只有在 AI 传回完全空值时才干预
    if (!data.关系.trim()) data.关系 = "待更新";
    if (!data.身份官职.trim()) data.身份官职 = "待更新";
    // 用“请更新”诱导 AI 更积极创作
    if (!data.对你的看法.trim()) data.对你的看法 = "请更新";
    if (!data.当前状态.trim()) data.当前状态 = "请更新";
  }
};

// 剧情要点单向逻辑处理
const process_plot_oneway_update = (new_plot, old_plot) => {
  // 遍历旧剧情要点数据
  for (const plot in old_plot) {
    // 防止 ai 误删剧情数据
    if (old_plot[plot] && !new_plot[plot]) {
      new_plot[plot] = old_plot[plot];
    }
  }
  // 遍历新剧情要点数据
  for (const plot in new_plot) {
    if (!new_plot[plot]) {
      // 删除为 false 的未激活剧情
      delete new_plot[plot];
    } else if (old_plot[plot]) {
      if (old_plot[plot] === true && typeof new_plot[plot] !== "object") {
        // 迁移旧数据
        new_plot[plot] = { 状态: "已完成", 进程: ["前事种种"], 结果: "随风而逝", 触发时间: "不知何时", 完成时间: "往事如风" };
      } else if (old_plot[plot]?.状态 === "已完成") {
        //已完成数据不被更新
        new_plot[plot] = old_plot[plot];
      }
    }
  }
  // 删除打驸马案子剧情
  if (new_plot.is_Fighting_Case_Zongren) delete new_plot.is_Fighting_Case_Zongren;
  if (new_plot.is_Fighting_Case_Libu) delete new_plot.is_Fighting_Case_Libu;
  if (new_plot.is_Fighting_Case_Shuntian) delete new_plot.is_Fighting_Case_Shuntian;
};

// 红颜触发器清理
const process_cleanup_girl_trigger = (triggers, relationships) => {
  for (const name in triggers) {
    if (relationships[name]) {
      delete triggers[name];
    }
  }
};

const process_npc_dead = (tombstones, relationships) => {
  for (const [name, npc] of Object.entries(relationships)) {
    if (npc.当前状态 === "死亡") {
      tombstones[name] = {
        type: npc.type,
        身份官职: npc.身份官职,
        ...(npc.type === "亲属" ? { 关系: npc.关系 } : {}),
      };
      delete relationships[name];
    }
  }
};
// 月初结算库府累计和势力消耗
const process_month_summary = (new_data, old_data) => {
  const { 年份: new_year, 月: new_month } = new_data.世界信息.农历;
  const { 年份: old_year, 月: old_month } = old_data.世界信息.农历;
  const month_diff = (chs2num(new_year) - chs2num(old_year)) * 12 + (chs2num(new_month) - chs2num(old_month));
  new_data.个人属性.月度总结._白银.净结余 = new_data.个人属性.月度总结._白银.总收入 - new_data.个人属性.月度总结._白银.总支出;
  new_data.个人属性.月度总结._粮草.净结余 = new_data.个人属性.月度总结._粮草.总收入 - new_data.个人属性.月度总结._粮草.总支出;
  if (month_diff > 0) {
    // 公库，使用汇总势力总览的月度总结
    const silver_diff = (new_data.个人属性.月度总结._白银.净结余 || 0) * month_diff;
    const grain_diff = (new_data.个人属性.月度总结._粮草.净结余 || 0) * month_diff;
    new_data.个人属性.府库累计.白银 += silver_diff;
    new_data.个人属性.府库累计.粮草 += grain_diff;
    new_data.本轮用户操作.push(`公库结算 ${month_diff} 个月收益。白银: ${silver_diff} 两，粮草: ${grain_diff} 石`);

    // 私库，使用月支俸禄的白银和粮草
    const priv_silver_diff = (new_data.个人属性.月支俸禄.白银 || 0) * month_diff;
    const priv_grain_diff = (new_data.个人属性.月支俸禄.粮草 || 0) * month_diff;
    new_data.个人属性.私库累计.白银 += priv_silver_diff;
    new_data.个人属性.私库累计.粮草 += priv_grain_diff;

    new_data.本轮用户操作.push(`私库结算 ${month_diff} 个月俸禄。白银: ${priv_silver_diff} 两，粮草: ${priv_grain_diff} 石`);

    // 公库不足扣私库
    if (new_data.个人属性.府库累计.白银 < 0) {
      if (new_data.个人属性.私库累计.白银 >= Math.abs(new_data.个人属性.府库累计.白银)) {
        new_data.个人属性.私库累计.白银 += new_data.个人属性.府库累计.白银;
        new_data.个人属性.府库累计.白银 = 0;
        new_data.本轮用户操作.push(`公库结算时存银不足，由私库补足白银 ${Math.abs(new_data.个人属性.府库累计.白银)} 两`);
      } else {
        new_data.个人属性.私库累计.白银 = 0;
        new_data.个人属性.府库累计.白银 += new_data.个人属性.私库累计.白银;
        new_data.本轮用户操作.push(`公库结算时存银不足，由私库补充部分缺口，白银 ${new_data.个人属性.私库累计.白银} 两`);
      }
    }
    if (new_data.个人属性.府库累计.粮草 < 0) {
      if (new_data.个人属性.私库累计.粮草 >= Math.abs(new_data.个人属性.府库累计.粮草)) {
        new_data.个人属性.私库累计.粮草 += new_data.个人属性.府库累计.粮草;
        new_data.个人属性.府库累计.粮草 = 0;
        new_data.本轮用户操作.push(`公库结算时存粮不足，由私库补足 ${Math.abs(new_data.个人属性.府库累计.粮草)} 石`);
      } else {
        new_data.个人属性.私库累计.粮草 = 0;
        new_data.个人属性.府库累计.粮草 += new_data.个人属性.私库累计.粮草;
        new_data.本轮用户操作.push(`公库结算时存粮不足，由私库补充部分缺口 ${new_data.个人属性.私库累计.粮草} 石`);
      }
    }
  }
};

eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  // add props
  if (new_variables.stat_data.已删除角色 === undefined) {
    new_variables.stat_data.已删除角色 = {};
  }
  if (new_variables.stat_data.核心资产 === undefined) {
    new_variables.stat_data.核心资产 = {};
  }
  const {
    个人属性: personal,
    世界信息: world,
    人际网络: relationships,
    红颜主动登场触发器: triggers,
    亡者陵园: tombstones,
    已删除角色: unlinked,
    核心资产: assets,
  } = new_variables.stat_data;

  try {
    migrate_world(world);

    migrate_year_change(world);

    migrate_personal(personal);

    migrate_month_summary(personal);

    migrate_reputation(personal);

    migrate_relationships(relationships);

    migrate_auto_relink(relationships, unlinked);

    migrate_core_assets(assets, personal);

    // 清理本轮用户操作
    if (new_variables.stat_data?.本轮用户操作?.length > 0) {
      new_variables.stat_data.本轮用户操作 = [];
    }

    // 清理 lite_人际网络
    if (new_variables.stat_data?.lite_人际网络) {
      delete new_variables.stat_data.lite_人际网络;
    }

    process_year_change(new_variables.stat_data, old_variables.stat_data);

    process_reputation(personal);

    process_relationships(relationships);

    process_month_summary(new_variables.stat_data, old_variables.stat_data);

    process_plot_oneway_update(new_variables.stat_data?.剧情要点, old_variables.stat_data?.剧情要点);

    process_cleanup_girl_trigger(triggers, relationships);

    process_npc_dead(tombstones, relationships);

    toastr.info("变量更新后数据处理完成");
  } catch (error) {
    toastr.error(`变量更新后数据处理失败:\n ${error.message}\n ${error.stack}`);
    console.error(error);
  }
});
