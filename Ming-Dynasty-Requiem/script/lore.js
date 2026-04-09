// <%_

// libs/util.ts
var _chs2num = (str) => {
  const reg = /^.*?([元正一二三四五六七八九十廿卅卌冬腊]+).*?$/;
  if (!reg.test(str))
    return 0;
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
    腊: 12
  };
  const ten_map = { 十: 10, 廿: 20, 卅: 30, 卌: 40 };
  if (ch.length === 1) {
    return map[ch] || ten_map[ch] || 0;
  }
  if (ch.length === 2) {
    if (ten_map[ch.charAt(0)] && map[ch.charAt(1)]) {
      return (ten_map[ch.charAt(0)] || 0) + (map[ch.charAt(1)] || 0);
    }
    if (ch.charAt(1) === "十") {
      return (map[ch.charAt(0)] || 0) * 10;
    }
  }
  if (ch.length === 3 && ch.charAt(1) === "十") {
    return (map[ch.charAt(0)] || 0) * 10 + (map[ch.charAt(2)] || 0);
  }
  return 0;
};
async function _load_lore(name, class_name) {
  const raw = (await getwi(name)).trim();
  if (raw === "") {
    toastr.error(`[${class_name}] 世界书条目内容为空: "${name}"`);
    throw new Error(`[${class_name}] 世界书条目内容为空: "${name}"`);
  }
  let data;
  try {
    data = YAML.parse(raw);
  } catch (e) {
    toastr.error(`[${class_name}] 世界书条目解析失败: "${name}
${e.message}"`);
    throw new Error(`[${class_name}] 世界书条目解析失败: "${name}
${e.message}"`);
  }
  return data;
}
var _hash33 = (str) => {
  let hash = 5381;
  for (let i = 0;i < str.length; i++) {
    hash = hash * 33 ^ str.charCodeAt(i);
  }
  const factorA = ((hash ^ 1715004) >>> 0) % 11 - 5;
  const factorB = ((hash ^ 10325115) >>> 0) % 11 - 5;
  return [factorA, factorB];
};
var _indent = (text, indent = 2) => {
  if (indent <= 0)
    return text;
  const padding = " ".repeat(indent);
  return text.trim().replace(/^/gm, padding);
};
var _to_yaml = (data, padding = 0, defaults = {}) => {
  if (typeof data === "string" && data.startsWith("stat_data.")) {
    data = getvar(data, { defaults });
  }
  const yaml_str = YAML.stringify(data).trim();
  return `
${_indent(yaml_str, padding)}
`;
};
var _num2tag = (mapArray, value, currentText) => {
  const tags = [];
  if (mapArray.length === 0) {
    return currentText;
  }
  for (const item of mapArray) {
    const threshold = item[0];
    if (value <= threshold) {
      tags.push(...item.slice(1));
      break;
    }
  }
  if (tags.length === 0 && mapArray.slice(-1)[0]) {
    const last = mapArray.slice(-1)[0];
    if (last) {
      tags.push(...last.slice(1));
    } else {
      return currentText;
    }
  }
  if (tags.some((t) => t === currentText)) {
    return currentText;
  }
  return tags[Math.floor(Math.random() * tags.length)] || currentText;
};

// libs/singleton.ts
class SingletonBase {
  static _instances = new Map;
  static _loadPromises = new Map;
  static getInstance(...args) {
    const cls = this;
    if (!SingletonBase._instances.has(cls)) {
      SingletonBase._instances.set(cls, new cls(...args));
    }
    return SingletonBase._instances.get(cls);
  }
  constructor(...args) {}
  *[Symbol.iterator]() {
    if (Array.isArray(this.data)) {
      for (const plot of this.data)
        yield plot;
    } else if (typeof this.data === "object") {
      for (const [name, value] of Object.entries(this.data)) {
        yield [name, value];
      }
    }
  }
  async _load() {
    if (!this.LORE_NAME)
      return this;
    try {
      const loaded_raw = await _load_lore(this.LORE_NAME, this.CLASS_NAME);
      this.data = this._normalize(loaded_raw);
      console.log(`MDR_WI_LOAD: [${this.CLASS_NAME}] 世界书条目加载成功 "${this.LORE_NAME}"`);
      return this;
    } catch (e) {
      toastr.error(`MDR_WI_LOAD: [${this.CLASS_NAME}] 世界书条目加载失败: "${this.LORE_NAME}"
${e.message}`);
      throw e;
    }
  }
  async reload() {
    if (!this.LORE_NAME)
      return this;
    const cls = this.constructor;
    const existingPromise = SingletonBase._loadPromises.get(cls);
    if (existingPromise) {
      return existingPromise;
    }
    const loadTask = this._load();
    SingletonBase._loadPromises.set(cls, loadTask);
    try {
      await loadTask;
    } finally {
      SingletonBase._loadPromises.delete(cls);
    }
    return this;
  }
}

// libs/checker/checker.ts
var _delegate_call = (context, name, args, allowed, callerName) => {
  let method = name.toLowerCase().replace(/[!！]/g, "!").replace(/\s+/g, "");
  let isNot = false;
  if (method.startsWith("!")) {
    isNot = true;
    method = method.slice(1);
  }
  if (allowed.includes(method)) {
    const fn = context[method];
    if (typeof fn === "function") {
      const res = fn.apply(context, args);
      return isNot ? !res : res;
    }
  }
  console.error(`[${callerName}] 委托模式错误: ${method}`);
  toastr.error(`[${callerName}] 委托模式错误: ${method}`);
  return false;
};

class MDRChecker extends SingletonBase {
  check(name, ...args) {
    if (name === "any") {
      return args.some((rule) => this.check(rule[0], ...rule.slice(1)));
    }
    if (name === "every") {
      return args.every((rule) => this.check(rule[0], ...rule.slice(1)));
    }
    if (name.startsWith("!")) {
      const realName = name.slice(1);
      if (realName === "any" || realName === "every") {
        return !this.check(realName, ...args);
      }
    }
    return _delegate_call(this, name, args, this._allowedMethods, this._checkerName);
  }
  any(...rules) {
    return this.check("any", ...rules);
  }
  every(...rules) {
    return this.check("every", ...rules);
  }
  "!any"(...rules) {
    return this.check("!any", ...rules);
  }
  "!every"(...rules) {
    return this.check("!every", ...rules);
  }
}

// libs/checker/date.ts
class MDRDateChecker extends MDRChecker {
  static VAR_PATH = "stat_data.世界信息.农历.";
  LORE_NAME = "";
  CLASS_NAME = "MDRDate";
  _normalize(data) {
    return data;
  }
  data;
  get date() {
    const {
      年份: year,
      月: month,
      日: day
    } = getvar("stat_data.世界信息.农历", { defaults: { 年份: "崇祯二年", 月: "冬月", 日: "初四" } });
    const fix = getvar("stat_data.世界信息.年号变更.fix", { defaults: 0 });
    return [_chs2num(year) + fix, _chs2num(month), _chs2num(day)];
  }
  _check(mode, year_check, month_check, day_check) {
    const [year_value, month_value, day_value] = this.date;
    const current = year_value * 1e4 + month_value * 100 + day_value;
    const target = year_check * 1e4 + month_check * 100 + day_check;
    return mode === "after" ? current >= target : current < target;
  }
  after(year_check, month_check, day_check) {
    month_check = month_check ?? 1;
    day_check = day_check ?? 1;
    return this._check("after", year_check, month_check, day_check);
  }
  before(year_check, month_check, day_check) {
    month_check = month_check ?? 0;
    day_check = day_check ?? 0;
    return this._check("before", year_check, month_check, day_check);
  }
  equal(year, month, day) {
    let m = month != null && month < 0 ? undefined : month;
    let d = day != null && day < 0 ? undefined : day;
    m = m ?? 0;
    d = d ?? 0;
    const [year_value, month_value, day_value] = this.date;
    if (m <= 0) {
      return year_value === year;
    }
    if (d <= 0) {
      return year_value === year && month_value === m;
    }
    return year_value === year && month_value === m && day_value === d;
  }
  between(start, end) {
    let [year_start, month_start = 1, day_start = 1] = start;
    let [year_end, month_end = 1, day_end = 1] = end;
    let [year_eql, month_eql = 0, day_eql = 0] = end;
    if (year_start * 1e4 + month_start * 100 + day_start > year_end * 1e4 + month_end * 100 + day_end) {
      [year_start, month_start = 1, day_start = 1] = end;
      [year_end, month_end = 1, day_end = 1] = start;
      [year_eql, month_eql = 0, day_eql = 0] = start;
    }
    return this.after(year_start, month_start, day_start) && (this.before(year_end, month_end, day_end) || this.equal(year_eql, month_eql, day_eql));
  }
  _allowedMethods = ["after", "before", "equal", "between"];
  _checkerName = "MDRDate";
  check(name, ...args) {
    return super.check(name, ...args);
  }
}

// libs/checker/plot.ts
class MDRPlotChecker extends MDRChecker {
  static VAR_PATH = "stat_data.剧情要点.";
  LORE_NAME = "规则·剧情要点";
  CLASS_NAME = "MDRPlot";
  data;
  static DEFAULT_PASSED_VALUE = {
    状态: "已完成",
    进程: ["前事种种"],
    结果: "随风而逝",
    触发时间: "不知何时",
    完成时间: "往事如风"
  };
  _normalize(data) {
    return data;
  }
  passed(name) {
    const variable = this._getVariable(name);
    if (variable === false)
      return false;
    return variable.状态 === "已完成";
  }
  triggered(name) {
    const variable = this._getVariable(name);
    if (typeof variable === "boolean")
      return variable;
    return true;
  }
  _getVariable(key) {
    const variable = getvar(MDRPlotChecker.VAR_PATH + key, { defaults: false });
    if (variable === true)
      return MDRPlotChecker.DEFAULT_PASSED_VALUE;
    return variable;
  }
  _allowedMethods = ["passed", "triggered"];
  _checkerName = "PlotChecker";
  check(name, ...args) {
    return super.check(name, ...args);
  }
}

// libs/favor/base.ts
class MDRFavorBase extends SingletonBase {
  static TOUCH_LEVEL_MAP = [
    ["L0_禁止接触"],
    ["L1_轻度暧昧"],
    ["L1_轻度暧昧", "L2_深度亲昵"],
    ["L1_轻度暧昧", "L2_深度亲昵", "L3_实质交欢"]
  ];
  static RULE_SORTED_KEYS = new WeakMap;
  constructor(...args) {
    super(...args);
  }
  getRuleByValue(value, rules) {
    if (!MDRFavorBase.RULE_SORTED_KEYS.has(rules)) {
      MDRFavorBase.RULE_SORTED_KEYS.set(rules, Object.keys(rules).map(Number).sort((a, b) => a - b));
    }
    const sortedKeys = MDRFavorBase.RULE_SORTED_KEYS.get(rules);
    const ruleKey = sortedKeys.find((d) => value <= d);
    if (ruleKey === undefined) {
      return rules[sortedKeys[0]];
    } else {
      return rules[ruleKey];
    }
  }
  runMacros(text) {
    const regexp = /\[\[(\w+)::(.*?)\]\]/gis;
    return text.replace(regexp, (match, p1, p2) => {
      if (!p1 || !p2) {
        return match;
      }
      const args = p2.split("::").map((d) => d.trim());
      if (p1 === "mdr_ratio") {
        if (args.length < 2)
          return match;
        const ratio = parseFloat(args[0]);
        if (Number.isNaN(ratio))
          return match;
        return Math.random() < ratio ? args[1] || "" : args[2] || "";
      } else if (p1 === "mdr_plot") {
        if (args.length < 2) {
          return match;
        }
        return MDRPlotChecker.getInstance().passed(args[0]) ? args[1] || "" : args[2] || "";
      } else if (p1 === "touch") {
        const levels = args.map((d) => parseInt(d, 10)).filter((d) => d >= 0 && d <= 3);
        if (levels.length <= 0)
          return `[${MDRFavorBase.TOUCH_LEVEL_MAP[0]}]`;
        return levels.map((d) => `[${MDRFavorBase.TOUCH_LEVEL_MAP[d]?.slice(-1)}]`).join(", ") || "";
      } else {
        return match;
      }
    });
  }
}

// libs/favor/girl.ts
class MDRFavorGirl extends MDRFavorBase {
  LORE_NAME = "规则·好感度·红颜";
  CLASS_NAME = "MDRFavorGirl";
  data = {};
  static DIVORCE_RULE = [
    "行为特征: 爱而不得或心如死灰的状态，嘴硬心软",
    "剧情表现:",
    "  表面: 语言带刺、冷嘲热讽；或者表面冷若冰霜形同陌路；或行同陌路、不愿理会",
    "  内心: 却依然会对 {{user}} 的境况产生关注，对他的困境或无法视而不见。会别扭的主动给予帮助，但禁止立刻回温。"
  ].join(`
`);
  renderTouchRule(rule, isMarried) {
    const lines = [];
    let [man_level, woman_level] = rule.等级;
    if (isMarried)
      man_level = 3;
    lines.push(`【许可_男方主动】[${MDRFavorBase.TOUCH_LEVEL_MAP[man_level]?.join(", ")}]`);
    lines.push(`【许可_女方主动】[${MDRFavorBase.TOUCH_LEVEL_MAP[woman_level]?.join(", ")}]`);
    if (rule.必要补充?.trim()) {
      lines.push(rule.必要补充.trim());
    }
    if (!isMarried && rule.红颜补充?.trim()) {
      lines.push(rule.红颜补充.trim());
    }
    return lines;
  }
  renderGuideText(npc, key, favorValue) {
    const rules = this.getRules(key);
    if (!rules)
      return "";
    favorValue = Math.max(0, Math.min(100, favorValue));
    const touch_rules = this.getRuleByValue(favorValue, rules.身体接触);
    const behavior_rules = this.getRuleByValue(favorValue, rules.行为准则);
    const lines = [`好感度_演绎指导:|-
${_indent(this.runMacros(rules.前置.trim()))}`];
    if (npc.isDivorced) {
      lines.push(`  行为准则:
${_indent(this.runMacros(MDRFavorGirl.DIVORCE_RULE), 4)}`);
    } else {
      lines.push(`  行为准则:
${_indent(this.runMacros(behavior_rules), 4)}`);
    }
    lines.push(`身体接触_演绎指导: |-
${_indent(this.runMacros(this.renderTouchRule(touch_rules, npc.isMarried).join(`
`)).trim())}`);
    if (rules.身体接触补充?.trim()) {
      lines.push(`${_indent(this.runMacros(rules.身体接触补充.trim()), 2)}`);
    }
    return lines.join(`
`);
  }
  _normalize(data) {
    return data;
  }
  get keys() {
    return Object.keys(this.data);
  }
  getRules(key) {
    return this.data[key];
  }
}
await MDRFavorGirl.getInstance()._load();

// libs/favor/family.ts
class MDRFavorFamily extends MDRFavorBase {
  LORE_NAME = "规则·好感度·亲属";
  CLASS_NAME = "MDRFavorFamily";
  data = {};
  _normalize(data) {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [
      key,
      Object.fromEntries(Object.entries(value).map(([key2, value2]) => [Number(key2), value2.trim()]))
    ]));
  }
  renderGuideText(npc) {
    const tag = !npc.tag || npc.tag === "请更新" ? "远亲" : npc.tag;
    const favorValue = Math.max(0, Math.min(100, npc.favor + _hash33(npc.name)[0]));
    const text = this.getRuleByValue(favorValue, this.data[tag]);
    if (!text)
      return "";
    return `好感度_演绎指导: |-
${_indent(this.runMacros(text))}`;
  }
  get keys() {
    return Object.keys(this.data);
  }
}
await MDRFavorFamily.getInstance()._load();

// libs/favor/tag.ts
class MDRFavorTag extends MDRFavorGirl {
  LORE_NAME = "规则·好感度·标签";
  CLASS_NAME = "MDRFavorTag";
  data = {};
  renderGuideText(npc, key, favorValue) {
    favorValue += _hash33(npc.name)[0];
    return super.renderGuideText(npc, key, favorValue);
  }
}
await MDRFavorTag.getInstance()._load();

// libs/favor/underling.ts
class MDRFavorUnderling extends MDRFavorBase {
  LORE_NAME = "规则·好感度·麾下";
  CLASS_NAME = "MDRFavorUnderling";
  data = {};
  _normalize(data) {
    return {
      好感度: Object.fromEntries(Object.entries(data.好感度).map(([key, value]) => [key, value.trim()])),
      忠诚度: Object.fromEntries(Object.entries(data.忠诚度).map(([key, value]) => [key, value.trim()])),
      叛变: data.叛变.trim(),
      高忠低好感: data.高忠低好感.trim(),
      高好感低忠: data.高好感低忠.trim()
    };
  }
  renderGuideText(npc) {
    const favorValue = Math.max(-100, Math.min(100, npc.favor + _hash33(npc.name)[0]));
    const loyaltyValue = Math.max(0, Math.min(100, npc.loyalty + _hash33(npc.name)[1]));
    const favorText = this.getRuleByValue(favorValue, this.data.好感度);
    const loyaltyText = this.getRuleByValue(loyaltyValue, this.data.忠诚度);
    const parts = [
      `好感度_演绎指导: |-
  ${_indent(this.runMacros(favorText))}`,
      `忠诚度_演绎指导: |-
  ${_indent(this.runMacros(loyaltyText))}`
    ];
    if (loyaltyValue >= 75 && favorValue <= 40) {
      parts.push(`矛盾演绎: |-
  ${_indent(this.runMacros(this.data.高忠低好感))}`);
    } else if (favorValue >= 80 && loyaltyValue <= 40) {
      parts.push(`矛盾演绎: |-
  ${_indent(this.runMacros(this.data.高好感低忠))}`);
    }
    if (loyaltyValue <= 3 && Math.random() < 0.2) {
      parts.push([
        `背叛_演绎指导: |-`,
        _indent(this.runMacros(this.data.叛变)),
        _indent(this.runMacros(favorValue > 60 ? "!!!注意: 叛变时会带有满满的愧疚感与心理挣扎；" : "!!!注意: 需表现为果断的出卖与反咬一口。"))
      ].join(`
  `));
    }
    return parts.join(`
`);
  }
}
await MDRFavorUnderling.getInstance()._load();

// libs/favor/friend.ts
class MDRFavorFriend extends MDRFavorBase {
  LORE_NAME = "规则·好感度·朝野";
  CLASS_NAME = "MDRFavorFriend";
  data = {};
  _normalize(data) {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.trim()]));
  }
  renderGuideText(npc) {
    const favorValue = Math.max(-100, Math.min(100, npc.favor + _hash33(npc.name)[0]));
    const text = this.getRuleByValue(favorValue, this.data);
    if (!text)
      return "";
    return `好感度_演绎指导: |-
${_indent(this.runMacros(text))}`;
  }
}
await MDRFavorFriend.getInstance()._load();

// libs/character.ts
class MDRCharacter extends SingletonBase {
  LORE_NAME = "数据·人物";
  CLASS_NAME = "MDRCharacter";
  data = [];
  map = {};
  _normalize(data) {
    const list = data.map((d) => d.trim()).filter(Boolean);
    this.map = list.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});
    return list;
  }
  isPreset(name) {
    return this.map[name] === true;
  }
}
await MDRCharacter.getInstance()._load();

// libs/npc.ts
class MDRNpc {
  static VAR_PATH = "stat_data.人际网络.";
  static DIVORCE_RELATIONS = ["休妻", "义绝", "和离", "官断离异"];
  static DEFAULT_TAG = "明末女性/半推半就型";
  static FAVOR_GIRL = MDRFavorGirl.getInstance();
  static FAVOR_TAG = MDRFavorTag.getInstance();
  static FAVOR_UNDERLING = MDRFavorUnderling.getInstance();
  static FAVOR_FAMILY = MDRFavorFamily.getInstance();
  static FAVOR_FRIEND = MDRFavorFriend.getInstance();
  static CHARACTER = MDRCharacter.getInstance();
  data;
  name;
  constructor(name, data) {
    this.name = name;
    if (!data) {
      data = MDRNpc.query(name);
      console.log(`[MDRNpc] NPC "${name}" not found`);
    }
    this.data = data;
  }
  static get list() {
    return MDRNpc._iterList();
  }
  static *_iterList() {
    for (const name of Object.keys(getvar(`${MDRNpc.VAR_PATH.slice(0, -1)}`, { defaults: {} }))) {
      yield new MDRNpc(name);
    }
  }
  static query(name) {
    const npc = getvar(`${MDRNpc.VAR_PATH}${name}`, { defaults: false });
    if (npc === false)
      return;
    return npc;
  }
  get isDivorced() {
    if (!this.data)
      return false;
    return this.data.type === "红颜" && MDRNpc.DIVORCE_RELATIONS.some((d) => this.data?.关系?.includes(d));
  }
  get tag() {
    if (!this.data)
      return "";
    if (this.data.type !== "红颜" && this.data.type !== "内眷" && this.data.type !== "亲属")
      return "";
    const tag = this.data.人设标签;
    if (!tag || tag === "请更新")
      return MDRNpc.DEFAULT_TAG;
    return tag;
  }
  get favor() {
    if (!this.data)
      return 0;
    if (this.data.type === "死亡")
      return 0;
    return this.data.好感度;
  }
  get loyalty() {
    if (!this.data)
      return 0;
    if (this.data.type !== "麾下")
      return 0;
    return this.data.忠诚度;
  }
  get title() {
    if (!this.data)
      return "";
    return this.data.身份官职;
  }
  get status() {
    if (!this.data)
      return "";
    if (this.data.type === "死亡")
      return "";
    return this.data.当前状态;
  }
  get thought() {
    if (!this.data)
      return "";
    if (this.data.type === "死亡")
      return "";
    return this.data.对你的看法;
  }
  get relation() {
    if (!this.data)
      return "";
    return this.data.关系;
  }
  get isMarried() {
    if (!this.data)
      return false;
    return this.data.type === "内眷" && !this.isDivorced;
  }
  get isPreset() {
    return MDRCharacter.getInstance().isPreset(this.name) || MDRNpc.FAVOR_GIRL.keys.includes(this.name);
  }
  get hasFavorRules() {
    if (!this.data)
      return false;
    if (this.data.type !== "红颜" && this.data.type !== "内眷")
      return false;
    return MDRNpc.FAVOR_GIRL.keys.includes(this.name);
  }
  getFavorGuide(padding = 2) {
    if (!this.data)
      return "";
    if (this.data.type === "死亡")
      return "";
    let text = "";
    if (this.data.type === "红颜" || this.data.type === "内眷") {
      const hasFavorRules = this.hasFavorRules;
      const ruleset = hasFavorRules ? MDRNpc.FAVOR_GIRL : MDRNpc.FAVOR_TAG;
      const key = hasFavorRules ? this.name : this.tag;
      text = ruleset.renderGuideText(this, key, this.favor);
    } else if (this.data.type === "麾下") {
      text = MDRNpc.FAVOR_UNDERLING.renderGuideText(this);
    } else if (this.data.type === "朝野") {
      text = MDRNpc.FAVOR_FRIEND.renderGuideText(this);
    } else if (this.data.type === "亲属") {
      text = MDRNpc.FAVOR_FAMILY.renderGuideText(this);
    }
    return _indent(text, padding);
  }
}

// libs/checker/relation.ts
class MDRRelationChecker extends MDRChecker {
  static VAR_PATH = "stat_data.人际网络";
  LORE_NAME = "";
  CLASS_NAME = "MDRRelation";
  data;
  _normalize(data) {
    return;
  }
  met(...names) {
    let mode = "some";
    if (names[0]?.toLowerCase() === "any") {
      mode = "some";
      names = names.slice(1);
    } else if (names[0]?.toLowerCase() === "every") {
      mode = "every";
      names = names.slice(1);
    }
    return names[mode === "every" ? "every" : "some"]((name) => {
      const rel = MDRNpc.query(name);
      return rel !== undefined;
    });
  }
  favor(name, mode, favor) {
    const rel = MDRNpc.query(name);
    if (rel === undefined || rel.type === "死亡") {
      return false;
    }
    switch (mode) {
      case ">":
        return rel.好感度 > favor;
      case ">=":
        return rel.好感度 >= favor;
      case "<":
        return rel.好感度 < favor;
      case "<=":
        return rel.好感度 <= favor;
      case "=":
      case "==":
      case "===":
        return rel.好感度 === favor;
      case "!=":
      case "!==":
        return rel.好感度 !== favor;
    }
  }
  _allowedMethods = ["met", "favor"];
  _checkerName = "MDRRelation";
  check(name, ...args) {
    return super.check(name, ...args);
  }
}
var relation_default = MDRRelationChecker;

// libs/checker/combo.ts
function combo_check(rule) {
  if (!rule)
    return true;
  const results = [];
  if (rule?.人脉)
    results.push(relation_default.getInstance().check(...rule.人脉));
  if (rule?.日期)
    results.push(MDRDateChecker.getInstance().check(...rule.日期));
  if (rule?.剧情)
    results.push(MDRPlotChecker.getInstance().check(...rule.剧情));
  return results.length === 0 || (rule?.any ? results.some((r) => r) : results.every((r) => r));
}

// libs/plot.ts
class MDRPlot extends SingletonBase {
  static VAR_PATH = "stat_data.剧情要点.";
  LORE_NAME = "规则·剧情要点";
  CLASS_NAME = "MDRPlot";
  data = [];
  keys = [];
  map = {};
  static _instance = null;
  static _loadPromise = null;
  _normalize(data) {
    this.keys = data.map((d) => d.key);
    this.map = Object.fromEntries(data.map((d) => [d.key, d]));
    return data;
  }
  passed(name) {
    return MDRPlotChecker.getInstance().passed(name);
  }
  triggered(name) {
    return MDRPlotChecker.getInstance().triggered(name);
  }
  getNarrativeText(padding = 2) {
    const variables = getvar(MDRPlot.VAR_PATH.slice(0, -1), { defaults: {} });
    const lines = [];
    for (const [key, variable] of Object.entries(variables)) {
      const rule = this.query(key);
      if (!variable)
        continue;
      if (typeof variable === "boolean" || variable.状态 === "已完成") {
        lines.push(`${rule.剧情名}:`);
        lines.push(`  状态: 已完成`);
        lines.push(`  完成时间: ${variable?.完成时间 || "不知何时"}`);
        lines.push(`  剧情结果: ${variable?.结果 || "随风而逝"}`);
      } else {
        lines.push(`${rule.剧情名}:`);
        lines.push(`  状态: 进行中`);
        lines.push(`  开始时间: ${variable.触发时间}`);
        lines.push(`  剧情进展:`);
        lines.push(_indent(variable.进程.map((d) => `- ${d}`).join(`
`), 4));
      }
    }
    return _indent(lines.join(`
`), padding);
  }
  query(key) {
    const plot = this.map[key];
    if (plot === undefined) {
      toastr.error(`[MDRPlot] 找不到 Key 为 "${key}" 的配置`);
      return null;
    }
    return plot;
  }
  get varUpdate() {
    return this._iterVarUpdate();
  }
  *_iterVarUpdate() {
    for (const plot of this.data) {
      if (this.passed(plot.key))
        continue;
      if (!combo_check(plot.触发器设置?.触发前置))
        continue;
      const trigger = plot.触发器设置;
      if (trigger.触发) {
        if (this.triggered(plot.key)) {
          yield `IF "剧情进展涉及【${plot.剧情名}】": APPEND "{剧情进展，20 字内}" TO "${plot.key}.进程"`;
        } else {
          yield `IF ("${trigger.触发}"${trigger.触发负向 ? ` AND NOT ("${trigger.触发负向}")` : ""}): INSERT "${plot.key}": {"状态": "已触发", "进程": ["{剧情触发简述，20 字内}"], "触发时间": "{年份}·{月}{日}"}`;
        }
      }
      if (this.triggered(plot.key)) {
        yield `IF ("${trigger.完成}"${trigger.完成负向 ? ` AND NOT ("${trigger.完成负向}")` : ""}): UPDATE "${plot.key}" WITH {"状态": "已完成", "结果": "{剧情结果简述，30字内}", "完成时间": "{年份}·{月}{日}"}`;
      } else {
        yield `IF ("${trigger.完成}"${trigger.完成负向 ? ` AND NOT ("${trigger.完成负向}")` : ""}): INSERT "${plot.key}": {"状态": "已完成", "进程": ["{剧情触发简述，30 字内}"], "结果": "{剧情结果简述，30 字内}", "触发时间": "{年份}·{月}{日}", "完成时间": "{年份}·{月}{日}"}`;
      }
    }
  }
}
await MDRPlot.getInstance()._load();

// libs/girl-trigger.ts
class MDRGirlTrigger extends SingletonBase {
  LORE_NAME = "规则·红颜登场";
  CLASS_NAME = "MDRGirlTrigger";
  data = {};
  static VAR_PATH = "stat_data.红颜主动登场触发器.";
  static LORE_CHAR_PREFIX = "红颜·";
  date;
  relation;
  constructor() {
    super();
    this.date = MDRDateChecker.getInstance();
    this.relation = relation_default.getInstance();
  }
  _normalize(data) {
    return data;
  }
  activated(name) {
    if (this.relation.met(name))
      return true;
    if (getvar(`${MDRGirlTrigger.VAR_PATH}${name}.满足触发条件`, { defaults: false }))
      return true;
    return false;
  }
  get flatEntries() {
    return this._iterFlatEntries();
  }
  *_iterFlatEntries() {
    for (const [name, rules] of Object.entries(this.data)) {
      for (const rule of rules) {
        yield [name, rule];
      }
    }
  }
  get varUpdates() {
    return this._iterVarUpdates();
  }
  *_iterVarUpdates() {
    for (const [name, value] of Object.entries(getvar(`${MDRGirlTrigger.VAR_PATH}`, { defaults: {} }))) {
      if (!value.满足触发条件 || value.距离登场剩余回合 <= 0)
        continue;
      if (this.relation.met(name))
        continue;
      yield `DELTA \`${name}.距离登场剩余回合\` WITH -1`;
    }
    for (const [name, rules] of Object.entries(this.data)) {
      if (this.activated(name))
        continue;
      for (const rule of rules) {
        if (!rule.回合 || rule.回合 <= 0)
          continue;
        if (!combo_check(rule.前置))
          continue;
        yield `IF "${rule.条件}": INSERT ${JSON.stringify({
          [name]: {
            满足触发条件: true,
            触发条件说明: rule.说明,
            出场原因: rule.原因,
            登场方式: rule.方式,
            距离登场剩余回合: Math.floor(rule.回合)
          }
        })}`;
        break;
      }
    }
  }
  get narrateExplicit() {
    return this._iterNarrateExplicit();
  }
  *_iterNarrateExplicit() {
    for (const [name, value] of Object.entries(getvar(`${MDRGirlTrigger.VAR_PATH}`, { defaults: {} }))) {
      if (!value.满足触发条件 || value.距离登场剩余回合 !== 1)
        continue;
      if (this.relation.met(name))
        continue;
      activewi(`${MDRGirlTrigger.LORE_CHAR_PREFIX}${name}`, true);
      yield `${name}_即将登场: MUST(在本回合用强烈的五感描写预示).Reason(${value.出场原因}).Action([{{user}}所在位置（偶遇类型）] OR [寻找{{user}}所在位置（主动寻找{{user}}类型）]).NextTurn(${value.登场方式}).MustNot(本回合直接露面，点名角色身份).Require(通过五感描写传递[即将登场]，在本回合叙事结尾留下[呼之欲出]的剧作钩子)`;
    }
  }
  get narrateImplicit() {
    return this._iterNarrateImplicit();
  }
  *_iterNarrateImplicit() {
    for (const [name, value] of Object.entries(getvar(`${MDRGirlTrigger.VAR_PATH}`, { defaults: {} }))) {
      if (!value.满足触发条件 || value.距离登场剩余回合 < 2)
        continue;
      if (this.relation.met(name))
        continue;
      activewi(`${MDRGirlTrigger.LORE_CHAR_PREFIX}${name}`, true);
      yield `${name}_远景暗示: MUST(在本回合用春秋笔法侧面暗示).Reason(${value.出场原因}).Action([{{user}}所在位置（偶遇类型）] OR [寻找{{user}}所在位置（主动寻找{{user}}类型）]).NextTwoTurns(${value.登场方式}).MustNot(本回合直接露面，点名角色身份).Require(仅通过侧面描写建立【即将登场】的悬念感)`;
    }
  }
  get narrateOnStage() {
    return this._iterOnStage();
  }
  *_iterOnStage() {
    const uniq = {};
    for (const [name, value] of Object.entries(getvar(`${MDRGirlTrigger.VAR_PATH}`, { defaults: {} }))) {
      if (!value.满足触发条件 || value.距离登场剩余回合 > 0)
        continue;
      if (this.relation.met(name))
        continue;
      uniq[name] = true;
      activewi(`${MDRGirlTrigger.LORE_CHAR_PREFIX}${name}`, true);
      yield `${name}_立即插入登场: MUST(本回合主动登场).Reason(${value.出场原因}).Action(${value.登场方式}).Require(即将与{{user}}以合理方式【直接互动】)`;
    }
    const ifList = [];
    for (const [name, rules] of Object.entries(this.data)) {
      if (uniq[name])
        continue;
      if (this.relation.met(name))
        continue;
      for (const rule of rules) {
        if (rule.回合 && rule.回合 > 0)
          continue;
        if (!combo_check(rule.前置))
          continue;
        if (rule.条件 !== true) {
          ifList.push({ name, ...rule });
          continue;
        }
        uniq[name] = true;
        activewi(`${MDRGirlTrigger.LORE_CHAR_PREFIX}${name}`, true);
        yield `${name}_立即插入登场: MUST(本回合主动登场).Reason(${rule.原因}).Action(${rule.方式}).Require(即将与{{user}}以合理方式【直接互动】)`;
        break;
      }
    }
    for (const rule of ifList) {
      if (uniq[rule.name])
        continue;
      yield `${rule.name}_有条件插入登场: IF "${rule.条件}": MUST(本回合主动登场).Reason(${rule.原因}).Action(${rule.方式}).Require(即将与{{user}}以合理方式【直接互动】)`;
    }
  }
}
await MDRGirlTrigger.getInstance()._load();

// libs/personal.ts
class MDRPersonal {
  static VAR_PATH = "stat_data.个人属性.";
  static isPublicAccountEmpty() {
    const { 白银: 白_, 粮草: 粮_ } = getvar(`${MDRPersonal.VAR_PATH}府库累计`, { defaults: { 白银: 0, 粮草: 0 } });
    const incoming_silver = getvar(`${MDRPersonal.VAR_PATH}月度总结._白银.净结余`, { defaults: 0 });
    const incoming_grain = getvar(`${MDRPersonal.VAR_PATH}月度总结._粮草.净结余`, { defaults: 0 });
    const out = [];
    if (白_ <= 0 && incoming_silver < 0) {
      out.push("白银");
    }
    if (粮_ <= 0 && incoming_grain < 0) {
      out.push("白银");
    }
    return out.join("与");
  }
  static isPublicAccountWillEmpty() {
    const { 白银: 白_, 粮草: 粮_ } = getvar(`${MDRPersonal.VAR_PATH}府库累计`, { defaults: { 白银: 0, 粮草: 0 } });
    const incoming_silver = getvar(`${MDRPersonal.VAR_PATH}月度总结._白银.净结余`, { defaults: 0 });
    const incoming_grain = getvar(`${MDRPersonal.VAR_PATH}月度总结._粮草.净结余`, { defaults: 0 });
    const out = [];
    if (白_ + incoming_silver < 0) {
      out.push("白银");
    }
    if (粮_ + incoming_grain < 0) {
      out.push("粮草");
    }
    return out.join("与");
  }
}

// libs/history-event.ts
class MDRHistoryEvent extends SingletonBase {
  static VAR_PATH = "stat_data.世界信息.农历";
  LORE_NAME = "数据·历史洪流";
  CLASS_NAME = "MDRHistoryEvent";
  data = [];
  _normalize(data) {
    return data;
  }
  get recently() {
    const time = getvar(MDRHistoryEvent.VAR_PATH, { defaults: { 年份: "崇祯二年", 月: "冬月" } });
    let { 年份: year, 月: month } = time;
    if (month === "一月") {
      month = "正月";
    } else if (month === "十一月") {
      month = "冬月";
    } else if (month === "闰十一月") {
      month = "闰冬月";
    } else if (month === "十二月") {
      month = "腊月";
    }
    const key = `${year}·${month}`;
    const idx = this.data.findIndex((item) => item.month === key);
    const data = Object.fromEntries(this.data.slice(idx - 4, idx + 7).map(({ month: month2, events }) => [month2, events]));
    return _to_yaml(data);
  }
}
await MDRHistoryEvent.getInstance()._load();

// libs/lore.ts
define("mdr_chs2num", _chs2num);
define("mdr_to_yaml", _to_yaml);
define("mdr_indent", _indent);
var plotChecker = MDRPlotChecker.getInstance();
define("mdr_plot_passed", (...args) => plotChecker.passed(...args));
define("mdr_plot_triggered\b", (...args) => plotChecker.triggered(...args));
define("mdr_plot_check", (...args) => plotChecker.check(...args));
var dateChecker = MDRDateChecker.getInstance();
define("mdr_date_check", (...args) => dateChecker.check(...args));
define("mdr_date_after", (...args) => dateChecker.after(...args));
define("mdr_date_before", (...args) => dateChecker.before(...args));
define("mdr_date_equal", (...args) => dateChecker.equal(...args));
define("mdr_date_between", (...args) => dateChecker.between(...args));
var relationChecker = relation_default.getInstance();
define("mdr_rel_check", (...args) => relationChecker.check(...args));
define("mdr_rel_met", (...args) => relationChecker.met(...args));
define("mdr_rel_favor", (...args) => relationChecker.favor(...args));
var plot = MDRPlot.getInstance();
define("mdr_plot", () => plot);
var girl_trigger = MDRGirlTrigger.getInstance();
define("mdr_girl_trigger", () => girl_trigger);
define("mdr_npc", (name) => new MDRNpc(name));
define("mdr_npc_class", () => MDRNpc);
define("mdr_npc_guide", (name, padding = 2) => {
  const npc = new MDRNpc(name);
  return npc.getFavorGuide(padding);
});
define("mdr_favor_girl_keys", () => MDRFavorGirl.getInstance().keys);
define("mdr_favor_family_keys", () => MDRFavorFamily.getInstance().keys);
define("mdr_favor_tag_keys", () => MDRFavorTag.getInstance().keys);
define("mdr_public_account_empty", () => MDRPersonal.isPublicAccountEmpty());
define("mdr_public_account_will_empty", () => MDRPersonal.isPublicAccountWillEmpty());
var history_event = MDRHistoryEvent.getInstance();
define("mdr_history_event", () => history_event.recently);

//_%>
