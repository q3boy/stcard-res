import { registerMvuSchema } from "https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js";

export const Schema = z
  .object({
    世界信息: z
      .object({
        农历: z
          .object({
            年份: z
              .string()
              .regex(/^.+?[元一二三四五六七八九十百]+年$/)
              .prefault("崇祯二年"),
            季节: z.enum(["春", "夏", "秋", "冬"]).prefault("冬"),
            月: z
              .string()
              .regex(/^闰?[正一二三四五六七八九十冬腊][一二]?月$/)
              .prefault("冬月"),
            日: z
              .string()
              .regex(/^(?:初[一二三四五六七八九十]|[一二]?[十廿][一二三四五六七八九]?|三十)$/)
              .prefault("初四"),
            时辰: z
              .string()
              .regex(/^[子丑寅卯辰巳午未申酉戌亥][时初正](?:[初一二三]刻)?(\s*[(（]\d\d?:\d\d?[)）])?$/)
              .prefault("酉初三刻（17:45）"),
          })
          .prefault({}),
        公历: z.any().optional(),
        年号变更: z
          .object({
            年号: z.string().prefault("崇祯"),
            fix: z.coerce.number().prefault(0),
            公元年: z.coerce.number().prefault(1628),
          })
          .prefault({ 最近年号: "崇祯", 开始年数: 0, 公元年: 1628 }),
        当前地点: z.string().prefault("顺天府·外城宣南坊·朱宅"),
      })
      .prefault({}),
    天下暗流: z
      .array(z.object({ 地点: z.string(), 事件: z.string() }))
      .prefault([])
      .transform((data) => _(data).takeRight(12).value()),
    个人属性: z
      .object({
        核心身份: z.any().optional(),
        身份: z.array(z.string()).prefault([]),
        称号: z.array(z.string()).prefault([]),
        声望: z.any().optional().describe("已废弃"),
        身体状态: z.string().prefault("请更新"),
        _名声: z.coerce.number().prefault(30),
        _风评: z.coerce.number().min(-100).max(100).prefault(-10),
        $声望新鲜度: z.coerce.number().prefault(1),
        声望变更事件: z
          .array(
            z
              .object({
                事件风评: z.coerce.number().describe("事件风评"),
                事件名声: z.coerce.number().describe("事件名声"),
                参与度: z.coerce.number().describe("参与度"),
              })
              .prefault({}),
          )
          .prefault([]),
        月支俸禄: z
          .object({
            白银: z.coerce.number().prefault(5),
            粮草: z.coerce.number().prefault(3),
            说明: z.string().describe("俸禄组成与变化说明").prefault(""),
          })
          .prefault({}),
        府库累计: z
          .object({
            白银: z.coerce.number().prefault(0),
            粮草: z.coerce.number().prefault(0),
            说明: z.string().describe("府库变化说明").prefault(""),
          })
          .prefault({}),
        私库累计: z
          .object({
            白银: z.coerce.number().prefault(0),
            粮草: z.coerce.number().prefault(0),
            其它资产: z.any().optional(),
            说明: z.string().describe("私库变化说明").prefault(""),
          })
          .describe("私人所持的钱粮和资产")
          .prefault({}),
        月度总结: z
          .object({
            白银: z.any().optional(),
            粮草: z.any().optional(),
            _白银: z
              .object({
                总收入: z.coerce.number().prefault(0),
                总支出: z.coerce.number().prefault(0),
                净结余: z.coerce.number().optional(),
              })
              .prefault({})
              .transform((data) => {
                return {
                  ...data,
                  净结余: data.总收入 - data.总支出,
                };
              }),
            _粮草: z
              .object({
                总收入: z.coerce.number().prefault(0),
                总支出: z.coerce.number().prefault(0),
                净结余: z.coerce.number().optional(),
              })
              .prefault({})
              .transform((data) => {
                return {
                  ...data,
                  净结余: data.总收入 - data.总支出,
                };
              }),
            说明: z.string().describe("月度总结说明").prefault(""),
          })
          .prefault({}),
      })
      .prefault({}),
    核心资产: z
      .record(
        z.string().describe("资产名称（如：京城当铺、扬州瘦马、戚家军残部、祖传玉佩）"),
        z.object({
          说明: z.string().prefault(""),
          数量: z.coerce
            .number()
            .prefault(1)
            .transform((data) => Math.max(Math.ceil(data), 0)),
          兑换: z.discriminatedUnion("类型", [
            // 分支 1：纯杂物（无价值，只能扔）
            z.object({
              类型: z.literal("杂物"),
              动作: z.literal("舍弃"),
            }),
            // 分支 2：可兑换硬通货的珍宝/物资
            z.object({
              类型: z.literal("钱粮兑换"),
              目标类型: z.enum(["白银", "粮草"]),
              动作: z.string().describe("具体的兑换动作，如：当铺死当、黑市变现"),
              比例: z.coerce.number().describe("每 1 单位该资产，可兑换多少目标物（粮食：x石，白银：白银x两）"),
            }),
            // 分支 3：产业（会持续产出或亏损）
            z.object({
              类型: z.literal("产业"),
              动作: z.literal("交接"),
              详情: z.object({
                产业名: z.string().describe("产业名称"),
                产出说明: z.string(),
                收入类型: z.enum(["白银", "粮草"]),
                月成本: z.coerce.number().describe("每月的固定开销"),
                月收入: z.coerce.number().describe("每月的毛利润"),
              }),
            }),
            // 分支 4：暴力机器（只吞钱和粮）
            z.object({
              类型: z.literal("部队"),
              动作: z.literal("交接"),
              详情: z.object({
                部队名: z.string().describe("部队名称"),
                规模: z.string().describe("如：三百人、一卫"),
                装备: z.string(),
                训练度: z.enum(["新募", "尚可", "熟练", "精锐", "百战"]),
                每月军饷: z.coerce.number().describe("需要消耗的白银"),
                每月粮耗: z.coerce.number().describe("需要消耗的粮草"),
              }),
            }),
          ]),
        }),
      )
      .describe("主角名下拥有的高价值实体资产、私兵与产业网络")
      .prefault({}),
    势力总览: z
      .object({
        产业: z
          .record(
            z.string().describe("产业名称"),
            z
              .object({
                产出说明: z.string(),
                收入类型: z.enum(["白银", "粮草", "物资"]),
                月成本: z.coerce.number(),
                月收入: z.coerce.number(),
                月结余: z.coerce.number().optional(),
              })
              .transform((data) => {
                if (data.月结余) {
                  delete data.月结余;
                }
                return data;
              }),
          )
          .prefault({}),
        部曲: z
          .record(
            z.string().describe("部队名称"),
            z.object({
              规模: z.string(),
              装备: z.string(),
              训练度: z.enum(["新募", "尚可", "熟练", "精锐", "百战"]),
              每月军饷: z.coerce.number(),
              每月粮耗: z.coerce.number(),
            }),
          )
          .prefault({}),
      })
      .prefault({}),
    剧情要点: z
      .record(
        z.string().describe("剧情要点key"),
        z
          .union([
            z.boolean().prefault(false).describe("未触发"),
            z.discriminatedUnion("状态", [
              z.object({
                状态: z.literal("已触发"),
                进程: z.array(z.string()).prefault([]),
                触发时间: z.string().prefault(""),
              }),
              z.object({
                状态: z.literal("已完成"),
                进程: z.array(z.string()).prefault([]),
                结果: z.string().prefault(""),
                触发时间: z.string().prefault(""),
                完成时间: z.string().prefault(""),
              }),
            ]),
          ])
          .prefault(false)
          .transform((val) => {
            if (val === true) {
              return {
                状态: "已完成",
                进程: ["前事种种"],
                结果: "随风而逝",
                触发时间: "不知何时",
                完成时间: "往事如风",
              };
            } else if (typeof val === "object") {
              return val;
            }
            return false; // false 保持不变
          }),
      )
      .prefault({}),
    已删除角色: z
      .record(
        z.string().describe("姓名"),
        z.object({
          type: z.enum(["麾下", "朝野", "亲属", "红颜", "内眷"]).describe("关系类型").prefault("朝野"),
          好感度: z.coerce.number().prefault(0),
          忠诚度: z.coerce.number().prefault(50).describe("仅麾下有效"),
          身份官职: z.string().prefault("待更新"),
          关系: z.string().prefault("待更新"),
          对你的看法: z.string().prefault("请更新"),
          当前状态: z.string().prefault("请更新"),
          人设标签: z
            .enum([
              "商品/附庸型",
              "利益谋求/商贾型",
              "异族/热情型",
              "温婉/体贴型",
              "军旅/侠客/豪迈型",
              "怀春少女/纯情型",
              "贵族/礼教型",
              "风尘/放荡型",
              "深闺/柔弱型",
              "欢喜冤家/傲娇型",
              "邻家小妹/活泼型",
              "疏离/清冷型",
              "成熟魅惑/美艳型",
              "人妻/克制型",
              "明末女性/半推半就型",
              "血亲",
              "姻亲",
              "远亲",
              "请更新",
              "预设定角色",
            ])
            .optional(),
        }),
      )
      .prefault({}),
    人际网络: z
      .record(
        z.string().describe("姓名"),
        z.object({
          type: z.enum(["麾下", "朝野", "亲属", "红颜", "内眷"]).describe("关系类型").prefault("朝野"),
          好感度: z.coerce.number().prefault(0),
          忠诚度: z.coerce.number().prefault(50).describe("仅麾下有效"),
          身份官职: z.string().prefault("待更新"),
          关系: z.string().prefault("待更新"),
          对你的看法: z.string().prefault("请更新"),
          当前状态: z.string().prefault("请更新"),
          人设标签: z
            .enum([
              "商品/附庸型",
              "利益谋求/商贾型",
              "异族/热情型",
              "温婉/体贴型",
              "军旅/侠客/豪迈型",
              "怀春少女/纯情型",
              "贵族/礼教型",
              "风尘/放荡型",
              "深闺/柔弱型",
              "欢喜冤家/傲娇型",
              "邻家小妹/活泼型",
              "疏离/清冷型",
              "成熟魅惑/美艳型",
              "人妻/克制型",
              "明末女性/半推半就型",
              "血亲",
              "姻亲",
              "远亲",
              "请更新",
              "预设定角色",
            ])
            .optional()
            .transform((data) => {
              return Array.isArray(data) ? data.flat().join("/") : data || "请更新";
            }),
        }),
      )
      .prefault({}),
    红颜主动登场触发器: z
      .record(
        z.enum(["艾弥斯", "朱徽媞", "顾眉", "卓文茵", "钱芷沅", "爱新觉罗·雅沁", "博尔济吉特·乌云娜"]).describe("红颜名称"),
        z
          .object({
            满足触发条件: z.boolean().prefault(false),
            触发条件说明: z.string().prefault(""),
            登场方式: z.string().prefault(""),
            出场原因: z.string().prefault(""),
            距离登场剩余回合: z.coerce.number().min(0).prefault(3),
          })
          .prefault({}),
      )
      .prefault({})
      .transform((data) => Object.fromEntries(Object.entries(data).filter(([, v]) => v.满足触发条件))),
    历史歧路: z
      .array(
        z
          .object({
            旧貌: z.string().describe("原历史"),
            新颜: z.string().describe("新历史"),
            缘起: z.string().describe("偏移原因"),
            时间: z
              .string()
              .regex(/^崇祯[元一二三四五六七八九十]+年.+月$/)
              .describe("偏移时间"),
          })
          .prefault({}),
      )
      .prefault([]),
    地图标记: z
      .record(
        z.string().describe("地名，例如 '顺天府'、'辽东' 或自定义新地点"),
        z.object({
          坐标: z.tuple([z.number(), z.number()]).optional().describe("经纬度 [经度, 纬度]，若为内置城市可不填"),
          控制方: z.string().prefault("大明").describe("决定地图上散点的颜色和形状"),
          描述: z.string().prefault("请更新").describe("弹窗内的文本描述，会覆盖内置的默认描述"),
          城镇等级: z.string().prefault("请更新").describe("例如：京师、州府、军镇、卫所等"),
          治安: z.string().prefault("请更新").describe("弹窗内显示的治安数值或评价"),
          经济: z.string().prefault("请更新").describe("弹窗内显示的经济数值或评价"),
          特色: z
            .array(z.string())
            .optional()
            .prefault("请更新")
            .describe("例如：['坚城', '商贸繁荣']，在弹窗中以【标签 · 标签】显示"),
        }),
      )
      .prefault({}),
    交通路线: z
      .record(
        z.string().describe("路线名称或标识，例如 '京杭漕运_顺天至济南'、'辽东驿道'"),
        z.object({
          起点: z.string().describe("起点地名，需与地图上的节点名称一致，如 '顺天府'"),
          终点: z.string().describe("终点地名，需与地图上的节点名称一致，如 '济南府'"),
          方式: z.string().prefault("请更新").describe("出行方式，例如 '水路漕运'、'快马驿递'、'步行'"),
          行程: z.string().prefault("请更新").describe("耗时或路程描述，例如 '约十日'、'半月有余'"),
          风险: z
            .string()
            .prefault("安全")
            .describe("路途风险，例如 '安全'、'流寇劫掠'、'风浪'。若为'安全'或不填则不显示红字警告"),
        }),
      )
      .prefault({}),
    亡者陵园: z
      .record(
        z.string().describe("姓名"),
        z
          .object({
            type: z.enum(["麾下", "朝野", "亲属", "红颜", "内眷"]).describe("关系类型").prefault("朝野"),
            身份官职: z.string().prefault(""),
            关系: z.string().prefault(""),
          })
          .prefault({}),
      )
      .prefault({}),
    本轮用户操作: z.array(z.string().describe("用户操作记录")).prefault([]),
  })
  .transform((data) => {
    const { 产业: industries, 部曲: troops } = data.势力总览;

    // 月度总结处理
    const totalSilver = {
      总收入: 0,
      总支出: 0,
      净结余: 0,
    };
    const totalGrain = {
      总收入: 0,
      总支出: 0,
      净结余: 0,
    };
    for (const value of Object.values(industries)) {
      // 只处理类型为白银或粮草的产业
      if (value.收入类型 === "白银") {
        totalSilver.总收入 += value.月收入;
        totalSilver.总支出 += value.月成本;
      } else if (value.收入类型 === "粮草") {
        totalGrain.总收入 += value.月收入; // 粮草产业收入为粮草
        totalSilver.总支出 += value.月成本; // 粮草产业支出为白银
      }
    }
    // 自动汇总势力总览中部曲的每月军饷和每月粮耗
    for (const value of Object.values(troops)) {
      totalGrain.总支出 += value.每月粮耗;
      totalSilver.总支出 += value.每月军饷;
    }
    // 计算净结余
    totalGrain.净结余 = totalGrain.总收入 - totalGrain.总支出;
    totalSilver.净结余 = totalSilver.总收入 - totalSilver.总支出;
    // 更新个人属性.月度总结._白银和._粮草
    data.个人属性.月度总结._白银 = totalSilver;
    data.个人属性.月度总结._粮草 = totalGrain;
    return data;
  })
  .prefault({});

$(() => {
  registerMvuSchema(Schema);
});
