// import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js'
class MingMap {
/* 城市描述数据与经纬度等数据配置略 */
static CITY_DATA = {
"顺天府": { seal: "北平", title: "京师·顺天府", content: "大明北都，政治中枢。然内有党争倾轧，外有边患之忧。辽东烽火连天，流寇渐成气候，京城之中暗流涌动，人心惶惶。" },
"应天府": { seal: "金陵", title: "南都·应天府", content: "大明留都，天下财赋之源。秦淮风月，才子佳人，一派繁华景象。东林、复社议论国事，与魏忠贤遗党斗争不休，亦是舆论风暴之眼。" },
"辽东":   { seal: "辽阳", title: "辽东都司", content: "九边之首，大明抵御后金之屏障。萨尔浒大败后，明军退守关宁锦防线。袁崇焕、祖大寿等在此苦苦支撑。" },
"山海关": { seal: "天下关", title: "山海关", content: "天下第一关。连接华北与东北的咽喉要道，关宁锦防线之最终倚靠。" },
"宣府":   { seal: "宣镇", title: "宣府镇", content: "九边之一，京师西北门户，用以防御蒙古诸部。" },
"济南府": { seal: "齐鲁", title: "山东·济南府", content: "山东布政使司驻地，文风鼎盛。京杭大运河穿境而过，是南北漕运之要地。" },
"太原府": { seal: "三晋", title: "山西·太原府", content: "山西布政使司驻地。晋商纵横天下，汇通八方。然崇祯年间大旱连年，是流寇滋生之温床。" },
"开封府": { seal: "中州", title: "河南·开封府", content: "河南布政使司驻地，中原腹心。流寇与官军拉锯之主战场。" },
"西安府": { seal: "关中", title: "陕西·西安府", content: "陕西布政使司驻地。连年大旱，高迎祥、李自成、张献忠等皆起于此地。" },
"成都府": { seal: "天府", title: "四川·成都府", content: "四川布政使司驻地。蜀道艰难，自成一国。奢安之乱虽平，川地元气未复。" },
"武昌府": { seal: "湖广", title: "湖广·武昌府", content: "湖广布政使司驻地，扼长江中游。左良玉拥兵自重，名为官军，实为军阀。" },
"南昌府": { seal: "豫章", title: "江西·南昌府", content: "江西布政使司驻地。文风颇盛，商贸繁荣，朝廷财赋重要来源。" },
"杭州府": { seal: "钱塘", title: "浙江·杭州府", content: "浙江布政使司驻地，人间天堂。丝绸茶叶贸易兴盛，江南最富庶之地。" },
"福州府": { seal: "榕城", title: "福建·福州府", content: "福建布政使司驻地。郑芝龙等海上巨擘以此为基地，控制东亚海上贸易。" },
"广州府": { seal: "岭南", title: "广东·广州府", content: "广东布政使司驻地。与葡萄牙在澳门通商，帝国对外贸易重要窗口。" },
"桂林府": { seal: "八桂", title: "广西·桂林府", content: "广西布政使司驻地。山多地少，民风彪悍，土司与朝廷冲突时有发生。" },
"云南府": { seal: "滇南", title: "云南·云南府", content: "云南布政使司驻地。沐王府世代镇守，土司林立，矿产丰富。" },
"贵阳府": { seal: "黔中", title: "贵州·贵阳府", content: "贵州布政使司驻地。奢安之乱虽被平定，贵州元气大伤，百废待兴。" } }
static CITIES_GEO = {
"顺天府":[116.40,39.90],
"应天府":[118.78,32.04],
"辽东":[123.18,41.27],
"山海关":[119.77,40.00],
"宣府":[114.88,40.82],
"济南府":[117.00,36.65],
"太原府":[112.49,37.70],
"开封府":[114.35,34.79],
"西安府":[108.94,34.27],
"成都府":[104.07,30.67],
"武昌府":[114.30,30.59],
"南昌府":[115.86,28.68],
"杭州府":[120.15,30.29],
"福州府":[119.30,26.08],
"广州府":[113.26,23.13],
"桂林府":[110.16,25.35],
"云南府":[102.68,25.04],
"贵阳府":[106.71,26.57],
"大同":[113.26,40.12],
"保定":[115.47,38.87],
"延安":[109.49,36.60],
"凤阳":[117.56,32.87],
"苏州":[120.62,31.31],
"扬州":[119.42,32.39],
"镇江":[119.45,32.20],
"常州":[119.97,31.81],
"松江":[121.24,31.00],
"徐州":[117.18,34.26],
"合肥":[117.30,31.90],
"安庆":[117.05,30.53],
"荆州":[112.24,30.33],
"襄阳":[112.14,32.04],
"长沙":[112.97,28.20],
"赣州":[114.93,25.83],
"泉州":[118.68,24.87],
"潮州":[116.63,23.66],
"汉中":[107.03,33.07],
"兰州":[103.83,36.06],
"宁夏":[106.27,38.47],
"嘉峪关":[98.30,39.80],
"登州":[120.75,37.80],
"宁远":[120.73,40.91],
"锦州":[121.13,41.10],
"赫图阿拉":[124.86,41.84],
"京城":[126.98,37.57],
"京都":[135.77,35.02],
"大坂":[135.50,34.69],
"江户":[139.69,35.69],
"热兰遮城":[120.27,23.00],
"濠镜":[113.55,22.19],
"升龙":[105.85,21.02],
"阿瓦":[96.10,21.85]
}
static FACTION_COLORS = {
'大明': { color:'#4a90d9', border:'#1a1210' },
'后金': { color:'#d94a4a', border:'#1a1210' },
'流寇': { color:'#e8a84d', border:'#1a1210' },
'藩属': { color:'#a0705a', border:'#1a1210' },
'外国': { color:'#c0c0c0', border:'#1a1210' }
}
static LOC_ALIASES = {
"顺天府": ["北京","京师","顺天","北平"],
"应天府": ["南京","应天","金陵","江宁"],
"辽东": ["辽东","辽阳","广宁"],
"山海关": ["山海关"],
"宣府": ["宣府","宣化"],
"济南府": ["济南","山东"],
"太原府": ["太原","山西"],
"开封府": ["开封","河南","汴梁"],
"西安府": ["西安","陕西","长安","关中"],
"成都府": ["成都","四川","蜀"],
"武昌府": ["武昌","湖广","楚"],
"南昌府": ["南昌","江西","豫章"],
"杭州府": ["杭州","浙江","临安","钱塘"],
"福州府": ["福州","福建","闽"],
"广州府": ["广州","广东","粤"],
"桂林府": ["桂林","广西"],
"云南府": ["云南府","昆明","云南"],
"贵阳府": ["贵阳","贵州","黔中"],
"大同": ["大同"],
"保定": ["保定"],
"延安": ["延安"],
"凤阳": ["凤阳","中都"],
"苏州": ["苏州","姑苏"],
"扬州": ["扬州"],
"松江": ["松江","上海"],
"赫图阿拉": ["赫图阿拉","建州","后金"],
"京城": ["朝鲜","京城","汉城"]
}
chart = null
dom = null
allCities = {}
factionData = {}
activeD = []
bind = false
// 获取 mvu 变量值
getValue(path, defaultValue = null) {
return _.get(getAllVariables(), `stat_data.${path}`, defaultValue);
}
getCity(name) {
return this.allCities[name]
}
prepare(matchedKey, mapMarkers) {
this.allCities = mapMarkers ?
Object
.entries(mapMarkers)
.filter(([,d])=> d?.坐标?.length === 2)
.reduce((holder, [key, value]) => {
if (!holder[key]) holder[key] = value.坐标
return holder;
}, {...MingMap.CITIES_GEO}) :
{...MingMap.CITIES_GEO}
this.factionData = Object.entries(this.allCities)
.filter(([k])=>k !== matchedKey)
.reduce((holder, [n, value]) => {
const faction = mapMarkers?.[n]?.控制方 || '大明'
holder[holder[faction] ? faction : '大明']
.push({name: n, value:this.allCities[n]})
return holder
}, { '大明':[], '后金':[], '流寇':[], '藩属':[], '外国':[] })
this.activeD = [];
if (matchedKey && this.allCities[matchedKey]) this.activeD.push({ name: matchedKey, value: this.allCities[matchedKey] });
}
constructor(matchedKey){
const mapMarker = this.getValue('地图标记', {})
this.dom = document.getElementById('echarts-map');
if (!this.dom || typeof echarts === 'undefined' || typeof WORLD_1629 === 'undefined') return;
echarts.registerMap('world_1629', WORLD_1629);
this.chart = echarts.init(this.dom);
this.prepare(matchedKey, mapMarker)
const mapCenter = (matchedKey && this.allCities[matchedKey]) ? this.allCities[matchedKey] : [110,33];
const lbl = {
show:true, formatter:'{b}', position:'top', color:'#e3c193',
fontSize:10, fontFamily:'Noto Serif SC, serif', textBorderColor:'#000', textBorderWidth:2
};
const fc = MingMap.FACTION_COLORS;
this.chart.setOption({
backgroundColor: 'transparent',
geo: {
map:'world_1629', roam:true,
scaleLimit: {
min: 1.2,       // 最小缩放 (1~1.5左右是世界全图，防止缩太小导致留白)
max: 20         // 最大缩放 (20~25左右差不多是省级/府级视野)
},
center:mapCenter, zoom:18, label:{show:false},
itemStyle:{ areaColor:'rgba(42,36,32,0.85)', borderColor:'rgba(227,193,147,0.45)', borderWidth:1 },
emphasis:{ itemStyle:{ areaColor:'rgba(60,50,44,0.95)', borderColor:'rgba(227,193,147,0.8)', borderWidth:1.5 }, label:{show:true,color:'#e3c193',fontSize:12} },
select:{disabled:true}, regions:[{name:'南海诸岛',itemStyle:{opacity:0},label:{show:false}}]
},
series: [
...[
{name: '大明', label: $.extend({}, lbl, {color: '#8ab4e8'})},
{name: '后金', symbol:'diamond', label: $.extend({}, lbl, {color: '#e88a8a'})},
{name: '流寇', symbol:'triangle', label: $.extend({}, lbl, {color: '#f0c475'})},
{name: '藩属', symbolSize:8, label: $.extend({}, lbl, {color: '#b0978a',fontSize:9})},
{name: '外国', symbol:'triangle', symbolSize:8, label: $.extend({}, lbl, {color: '#d0d0d0', fontSize:9})},
].map(d=>{
return {
type: 'scatter',
coordinateSystem: 'geo',
data: this.factionData[d.name],
itemStyle: {
color:fc[d.name].color,
borderColor: fc[d.name].border,
borderWidth: 1,
},
...d,
zlevel: 2,
}
}
),
{ name:'当前位置', type:'effectScatter',coordinateSystem:'geo',data:this.activeD,symbolSize:16,showEffectOn:'render',rippleEffect:{brushType:'fill',scale:5,period:2},itemStyle:{color:'#3CFF84',borderColor:'#fff',borderWidth:1.5},label:$.extend({},lbl,{color:'#fff',fontSize:12,fontWeight:'bold'}),zlevel:3 }
]
});
if (!this.bind) {
const self = this;
this.chart.on('click','series',(params) => {
const mapMarkers = this.getValue('地图标记', {})
const cityName = params.name;
const marker = mapMarkers[cityName] || null;
const staticD = MingMap.CITY_DATA[cityName];
const desc = marker?.描述 || staticD?.content || '';
const faction = marker?.控制方 || '';
const seal = faction || (staticD?.seal || cityName);
if (!desc) desc = '此地尚无讯息传来。';
let info = '';
if (marker) {
if (marker?.城镇等级) info += '<div class="section-title">' + marker.城镇等级 + '</div>';
if (marker?.治安) info += '<div class="city-stat">治安：' + marker.治安 + '</div>';
if (marker?.经济) info += '<div class="city-stat">经济：' + marker.经济 + '</div>';
if (marker?.特色 && marker?.特色.length > 0) info += '<div class="city-feat">【' + marker.特色.join(' · ') + '】</div>';
}
info += '<div class="city-desc">' + desc + '</div>';
let route = '<div style="color:#8c6f46;font-style:italic">尚无已知路线</div>';
const cityRoutes = Object.entries(self.getValue('交通路线', {}))
.filter(([,rv]) => rv?.起点 === cityName || rv?.终点 === cityName);
if (cityRoutes.length > 0) {
router = cityRoutes.map(r=>{
return [
`<div class="route-card">`,
`<div class="route-dest">→${r.data.起点 === cityName ? r.data.终点 : r.data.起点}'</div>`,
`<div class="route-detail">${r.data.方式}</div>`,
`<div class="route-detail">${r.data.行程}</div>`,
r.data?.风险 !== '安全' ? `<div class="route-warn">⚠ ${r.data.风险}</div>` : '',
`</div>`
].join('');
}).join('');
}
$('#modal-title').text(cityName);
$('#modal-seal').text(seal);
$('#modal-panel-info').html(info);
$('#modal-panel-route').html(route);
$('.modal-tab').removeClass('active');
$('.modal-tab[data-tab="info"]').addClass('active');
$('.modal-panel').removeClass('active');
$('#modal-panel-info').addClass('active');
$('#modal-overlay').css('display','flex');
setTimeout(() => {
$('#modal-scroll').addClass('visible');
}, 10);
});
$('#modal-header').on('click','.modal-tab',(e) => {
var tab = $(e.target).attr('data-tab');
$('.modal-tab').removeClass('active');
$(e.target).addClass('active');
$('.modal-panel').removeClass('active');
$('#modal-panel-' + tab).addClass('active');
});
$('#modal-overlay').on('click',(e)=>{
if(e.target.id==='modal-overlay'){
$('#modal-scroll').removeClass('visible');
setTimeout(()=>{$('#modal-overlay').css('display','none');},600);
}
});
$(window).on('resize',()=>{self.resize();});
this.bind = true;
}
}
resize(){
this.chart.resize();
}
static matchLocation(locString) {
return Object.entries(MingMap.LOC_ALIASES).find(([,value] )=> value.some(a=>locString.includes(a)))?.[0] || null
}
}
class MingDynasty {
static ICONS = {
// 身份
identity: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3c193" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>',
// 名声
reputation: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3c193" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /><path d="m9 12 2 2 4-4" /></svg>',
// 称号
title: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>',
// 身体状态
health: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
// 人脉当前状态
status: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;vertical-align: middle"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>&nbsp;',
// 人脉对你的看法
thought: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;vertical-align: middle"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>&nbsp;',
// 关系管理
delete_relation: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/></svg>',
relink_relation: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
// 物品图标
coin: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48"/><path d="M15 6h1v4"/><path d="m6.134 14.768.866-.5 2 3.464"/><circle cx="16" cy="8" r="6"/></svg>',
food: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/></svg>',
shop: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/></svg>',
army: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>',
box: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
// 物品管理
delete_asset: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
trans_asset: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="1"/><circle cx="4" cy="20" r="1"/><path d="M4.7 19.3 19 5"/><path d="m21 3-3 1 2 2Z"/><path d="M9.26 7.68 5 12l2 5"/><path d="m10 14 5 2 3.5-3.5"/><path d="m18 12 1-1 1 1-1 1Z"/></svg>',
}
static PORTRAITS = {
'艾弥斯': 'https://files.catbox.moe/h2o8m2.jpg',
'艾弥斯·冯·施瓦茨贝格': 'https://files.catbox.moe/h2o8m2.jpg',
'朱徽媞': 'https://files.catbox.moe/1ghgof.jpg',
'爱新觉罗·雅沁': 'https://files.catbox.moe/pjt1gh.jpg',
'雅沁': 'https://files.catbox.moe/pjt1gh.jpg',
'顾眉': 'https://files.catbox.moe/pdgn2k.jpg',
'博尔济吉特·乌云娜': 'https://files.catbox.moe/m3glv8.jpg',
'乌云娜': 'https://files.catbox.moe/m3glv8.jpg',
'卓文茵': 'https://files.catbox.moe/a2tpi9.jpg',
'钱芷沅': 'https://files.catbox.moe/zhfm0e.jpg',
'田氏': 'https://files.catbox.moe/d0dwfo.jpg',
'周皇后': 'https://files.catbox.moe/38brpo.jpg',
}
constructor(){
this.drawAll();
}
// === 通用确认模态框 ===
showConfirmModal(actionText, targetName, confirmBtnText, onConfirm) {
$('#confirm-target-action').text(actionText);
$('#confirm-target-name').text(targetName);
$('#btn-confirm-delete').text(confirmBtnText);
$('#confirm-modal-overlay').css('display', 'flex');
$('#btn-confirm-delete').off('click').on('click', () => {
$('#confirm-modal-overlay').hide();
if(onConfirm) onConfirm();
});
$('#btn-cancel-delete').off('click').on('click', () => {
$('#confirm-modal-overlay').hide();
});
}
// 背景图更新
updateBackground() {
const currentTimeStr = this.getValue('世界信息.农历.时辰', '酉')
const timeMap = {
morning: ['卯', '辰', '巳'], noon: ['午'], afternoon: ['未', '申'],
evening: ['酉', '戌', '亥', '子', '丑', '寅']
}
const backgroundImages = {
morning: 'https://files.catbox.moe/a3969r.jpg',
noon: 'https://files.catbox.moe/49rnaf.jpg',
afternoon: 'https://files.catbox.moe/gxq3tc.jpg',
evening: 'https://files.catbox.moe/fug2s7.jpg'
}
let period = 'evening'
for (const p in timeMap) {
if (timeMap[p].some(t => currentTimeStr.includes(t))) period = p
}
$('#bg-layer').css('background-image', `url('${backgroundImages[period]}')`)
return this;
}
updateTimeAndLocation(){
const lunar = this.getValue('世界信息.农历')
const currentTime = `${lunar.年份 || ''}·${lunar.季节 || ''}·${lunar.月 || ''}·${lunar.日 || ''}·${lunar.时辰 || ''}`
const location = this.getValue('世界信息.当前地点', '不知所踪');
$('#time-subtitle').text(currentTime)
this.updateBackground(lunar.时辰 || '')
const mk = MingMap.matchLocation(location)
if (mk) { $('#map-subtitle').html('身处 ◈ <span style="color:#fff;">' + mk + '</span>') }
if (!this.map) {
try {
this.map = new MingMap(mk);
}catch(e){
console.error(e);
}
}
return this;
}
updateIdentity(){
const core_identity = this.getValue('个人属性.核心身份', [])
const new_identity = this.getValue('个人属性.身份', [])
const identities = core_identity.length > 0 ? core_identity : new_identity
$('#val-identity').text(identities.length > 0 ? identities.join('·') : '----')
return this;
}
updateTitle(){
const titles = this.getValue('个人属性.称号', [])
$('#val-title').text(titles.length > 0 ? titles.join('·') : '----')
return this;
}
updateReputation(){
const rep_value = this.getValue('个人属性._名声', 0)
const fame_value = this.getValue('个人属性._风评', 0)
const color = fame_value >= 0 ? 'positive' : 'negative';
$('#val-reputation').html(`名声 (<span class="${color}">${rep_value}</span>) 风评 (<span class="${color}">${fame_value}</span>)`)
return this;
}
updateHealth(){
const health = this.getValue('个人属性.身体状态', '---')
$('#val-health').text(health)
return this;
}
updateSalary(){
const salary = this.getValue('个人属性.月支俸禄', {})
$('#val-salary-silver').text(MingDynasty.num2chs(salary.白银 || 0, '两'))
$('#val-salary-grain').text(MingDynasty.num2chs(salary.粮草 || 0, '石'))
$('#val-salary-desc').text(salary.说明 || '无')
return this;
}
updatePriv(){
const priv = this.getValue('个人属性.私库累计', {})
$('#val-priv-silver').text(MingDynasty.num2chs(priv.白银 || 0, '两'))
$('#val-priv-grain').text(MingDynasty.num2chs(priv.粮草 || 0, '石'))
$('#val-priv-desc').text(priv.说明 || '无')
return this;
}
static num2chs(num, suffix = '') {
if (num === 0) return `无`;
if (Math.abs(num) < 1) {
return `${num < 0 ? '亏·' : ''}不足一${suffix}`
}
num = Math.floor(num);
const chars = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const units = ["", "十", "百", "千"];
const sections = ["", "万", "亿", "兆", "京"];
const numStr = Math.abs(num).toString();
let result = "";
let zeroPending = false;
for (let i = 0; i < numStr.length; i++) {
const digit = parseInt(numStr[i], 10);
const pos = numStr.length - 1 - i;
const unitIdx = pos % 4;
const sectionIdx = Math.floor(pos / 4);
if (digit === 0) {
zeroPending = true;
if (unitIdx === 0) {
let sectionHasNonZero = false;
const sectionStart = Math.max(0, i - 3);
for (let j = sectionStart; j <= i; j++) {
if (numStr[j] !== "0") {
sectionHasNonZero = true;
break;
}
}
if (sectionHasNonZero && sectionIdx > 0) {
result += sections[sectionIdx];
zeroPending = false;
}
}
} else {
if (zeroPending) {
result += chars[0];
zeroPending = false;
}
result += chars[digit] + units[unitIdx];
if (unitIdx === 0 && sectionIdx > 0) {
result += sections[sectionIdx];
}
}
}
if (result.startsWith("一十")) {
result = result.substring(1);
}
return num < 0 ? `亏·${result}${suffix}` : result + suffix;
}
getAssetInfo(data) {
const info = data.兑换
let parts = []
switch (info.类型){
case '杂物':
return `<div class="asset-desc">${data.说明 || '无说明'}</div>`;
case '钱粮兑换':
return `<div class="asset-desc">
${data.说明 ? `${data.说明}<br>`: ''}
总价值：${MingDynasty.num2chs((info.比例 || 1) * data.数量, info.目标类型 === '粮草' ? '石' : '两')}
</div>`;
case '产业':
parts = [
info?.详情?.产出说明 ? `产出：${info.详情.产出说明}` : '',
info?.详情?.月收入 ? `收入：${MingDynasty.num2chs((info?.详情?.月收入 || 0) * data.数量, info?.详情?.收入类型 === '粮草' ? '石' : '两')}` : '',
info?.详情?.月成本 ? `成本：${MingDynasty.num2chs((info?.详情?.月成本 || 0) * data.数量, '两')}` : '',
].filter(d=>d !== '').join('；')
return `<div class="asset-desc">
${data.说明 ? `${data.说明}<br>`: ''}${parts}
</div>`;
case '部队':
parts = [
info?.详情?.规模 ? `兵力：${info.详情.规模} ${info.详情?.训练度 ? `(${info.详情.训练度})` : ''}` : '',
info?.详情?.装备 ? `装备：${info.详情.装备}` : '',
info?.详情?.每月军饷 || info?.详情?.每月粮耗 ? '月饷：' + [
info?.详情?.每月军饷 ? `银${MingDynasty.num2chs(info.详情.每月军饷 * data.数量, '两')}` : '',
info?.详情?.每月粮耗 ? `粮${MingDynasty.num2chs(info.详情.每月粮耗 * data.数量, '石')}` : '',
].filter(d=>d !== '').join('、') : '',
].filter(d=>d !== '').join('；')
return `<div class="asset-desc">
${data.说明 ? `${data.说明}<br>`: ''}${parts}
</div>`;
default:
return '';
}
}
updateAssets(){
const assets = this.getValue('核心资产', {})
const assetEntries = Object.entries(assets);
let html = '';
const iconMap = {
杂物: MingDynasty.ICONS.box,
产业: MingDynasty.ICONS.shop,
部队: MingDynasty.ICONS.army,
}
if (assetEntries.length > 0) {
html = assetEntries.map(([name, data]) => {
const data_type = data.兑换?.类型;
const data_action = data.兑换?.动作;
const data_target_type = data.兑换?.详情?.目标类型;
const action = (data_type === '杂物' || !data_action) ? '舍弃' : data_action;
const icon = data_type !== '钱粮兑换' ? iconMap[data_type] : data_target_type === '粮草' ? MingDynasty.ICONS.food : MingDynasty.ICONS.coin;
return `<div class="asset-card" data-asset-name="${name}">
<div class="asset-name">
<div class="asset-title-group">
${icon}&nbsp;
<div class="asset-title-content">
<span>${name}</span>&nbsp;&nbsp;
<button class="asset-delete-btn" data-name="${name}" title="${action}此物">[${action}]</button>
</div>
</div>
<span class="asset-tag">x${data.数量 || 1}</span>
</div>
${data?.兑换 ? this.getAssetInfo(data) : ''}
</div>`
}).join('');
} else {
html = '<div class="faction-empty" style="grid-column: 1 / -1;">空空如也，暂无随身重器</div>';
}
$('#list-assets').html(html)
// 绑定删除事件
const self = this;
$('.asset-delete-btn').off('click').on('click', function() {
const assetName = $(this).data('name');
const action = self.getValue(`核心资产.${assetName}.兑换.动作`, '舍弃');
const $card = $(this).closest('.asset-card');
self.showConfirmModal(action, assetName, action, () => self.removeAsset(assetName, $card));
});
return this;
}
searchUnusedSerialNumber(name, search_record, suffix = '字', type = '千字文') {
let serial;
if (type === '千字文') {
serial = ['天', '地', '玄', '黄', '宇', '宙', '洪', '荒', '日', '月', '盈', '昃', '辰', '宿', '列', '张', '寒', '来', '暑', '秋', '收', '冬', '藏', '闰', '余', '成', '岁', '律', '吕', '调', '阳', '云', '腾', '致', '雨', '露', '结', '为', '霜', '金', '生','丽', '水', '玉', '出', '昆', '岗','剑', '号', '巨', '阙', '珠', '称', '夜', '光', '果', '珍', '李', '奈', '菜', '重', '芥', '姜'];
}
for (const d of serial) {
const search_name = `${name}·${d}${suffix}`;
if (!search_record[search_name]) {
return search_name;
}
}
throw new Error('千字文已满，无法再添加');
}
addSerialNumber(name, search_record, suffix = '字', type = '千字文') {
// 已有同名，添加字号
if (search_record[name]) {
// 查找第一个未被占用的字号
return this.searchUnusedSerialNumber(name, search_record, suffix, type);
} else {
return name;
}
}
async removeAsset(name, $card) {
try {
const mvu_data = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
const asset = mvu_data.stat_data.核心资产[name];
const logs = mvu_data.stat_data.本轮用户操作;
let assert_name;
if (asset) {
switch (asset.兑换?.类型) {
case '钱粮兑换':
const swap_amount = asset.数量 * (asset.兑换.比例 || 1);
if (asset.兑换.目标类型 === '粮草') {
mvu_data.stat_data.个人属性.私库累计.粮草 += swap_amount;
} else {
mvu_data.stat_data.个人属性.私库累计.白银 += swap_amount;
}
logs.push(`${asset.兑换?.动作 || '兑换'} ${asset.数量 > 1 ? `${asset.数量} 个 ${name}` : name}，兑换得 ${swap_amount} ${asset.兑换.目标类型 === '粮草' ? '石粮草' : '两白银'}`);
break;
case '产业':
assert_name = this.addSerialNumber(asset.兑换.详情.产业名, mvu_data.stat_data.势力总览.产业);
mvu_data.stat_data.势力总览.产业[assert_name] = asset.兑换.详情
delete asset.兑换.详情.产业名;
logs.push(`交接 ${name}，获得产业 ${assert_name}`);
break;
case '部队':
assert_name = this.addSerialNumber(asset.兑换.详情.部队名, mvu_data.stat_data.势力总览.部曲);
mvu_data.stat_data.势力总览.部曲[assert_name] = asset.兑换.详情
delete asset.兑换.详情.部队名;
logs.push(`交接 ${name}，获得部队 ${assert_name}`);
break;
default:
logs.push(`舍弃 ${name>1? `${asset.数量} 个 ${name}` : name}`);
}
delete mvu_data.stat_data.核心资产[name];
await Mvu.replaceMvuData(mvu_data, { type: 'message', message_id: 'latest' });
}
} catch (e) {
toastr.error('删除随身重器失败: ' + e.message);
return;
}
this.updateSummary().updatePriv().updatePubStorage().updateIndustry().updateForce();
$card.addClass('fade-out');
setTimeout(async () => {
$card.remove();
if ($('#list-assets .asset-card').length === 0) {
$('#list-assets').html('<div class="faction-empty" style="grid-column: 1 / -1;">空空如也，暂无随身重器</div>');
}
}, 500);
}
getForceItem(title, value, default_value, class_name="", root_class='') {
return `<div class="card-line ${root_class}">
<span class="card-label">${title}:</span>
<span class="card-value ${class_name}">${value || default_value}</span>
</div>`
}
updateIndustry(){
const industries = this.getValue('势力总览.产业', {})
let html = Object.entries(industries).map(([name,ind]) => `
<div class="industry-card">
<div class="card-title">${name}</div>
${this.getForceItem('产出说明', ind.产出说明, '---', '', 'card-width-100')}
${this.getForceItem('月支出', MingDynasty.num2chs(ind.月成本, '两'), 0, 'expense', 'card-width-b180')}
${this.getForceItem('月收入', MingDynasty.num2chs(ind.月收入, ind.收入类型 === '粮草' ? '石' : '两'), 0, 'income', 'card-width-b180')}
</div>`).join('')
if (html.trim() === '') html = '<div class="faction-empty">暂无产业</div>'
$('#list-industries').html(html)
return this;
}
updateForce(){
const forces = this.getValue('势力总览.部曲', {})
let html = Object.entries(forces).map(([name,f]) => `
<div class="force-card">
<div class="card-title">${name} ${f.装备?`（${f.装备}）`:''}</div>
${this.getForceItem('兵力', f.规模, '---', '', 'card-width-100')}
${this.getForceItem('训练度', f.训练度, '未知', '', 'card-width-b180')}
${this.getForceItem('月饷银', MingDynasty.num2chs(f.每月军饷, '两'), 0, 'expense', 'card-width-b180')}
${this.getForceItem('月粮耗', MingDynasty.num2chs(f.每月粮耗, '石'), 0, 'expense', 'card-width-b180')}
</div>`).join('')
if (html.trim() === '') html = '<div class="faction-empty">暂无兵马</div>'
$('#list-forces').html(html)
return this;
}
updateSummary(){
const summary = this.getValue('个人属性.月度总结', {})
const silSum = summary._白银 ? summary._白银 :(summary.白银 || {})
const grnSum = summary._粮草 ? summary._粮草 :(summary.粮草 || {})
$('#val-sil-in').text(`${MingDynasty.num2chs(silSum.总收入 || 0, '两')}`)
$('#val-sil-out').text(`${MingDynasty.num2chs(silSum.总支出 || 0, '两')}`)
const silNet = silSum.总收入 - silSum.总支出 || 0
$('#val-sil-net').text(MingDynasty.num2chs(silNet, '两')).removeClass('income expense').addClass(silNet >= 0 ? 'income' : 'expense')
$('#val-grn-in').text(`${MingDynasty.num2chs(grnSum.总收入 || 0, '石')}`)
$('#val-grn-out').text(`${MingDynasty.num2chs(grnSum.总支出 || 0, '石')}`)
const grnNet = grnSum.总收入 - grnSum.总支出 || 0
$('#val-grn-net').text(MingDynasty.num2chs(grnNet, '石')).removeClass('income expense').addClass(grnNet >= 0 ? 'income' : 'expense')
$('#val-summary-desc').text(summary.说明 || '平稳运转')
return this;
}
updatePubStorage(){
const pub = this.getValue('个人属性.府库累计', {})
$('#val-pub-silver').text(`${MingDynasty.num2chs(pub.白银 || 0, '两')}`)
$('#val-pub-grain').text(`${MingDynasty.num2chs(pub.粮草 || 0, '石')}`)
$('#val-pub-desc').text(pub.说明 || '无说明')
return this;
}
updateEvents(){
const events = this.getValue('天下暗流', [])
let html = events.length > 0 ? events.reverse().map(ev=>`
<div class="bg-event-item">
<div class="bg-event-title">${ev.地点}</div>
<div class="bg-event-text">${ev.事件}</div>
</div>`).join("\n") :  '<div class="bg-empty">四海升平</div>'
$('#list-events').html(html)
return this;
}
updateCrossroad(){
const crossroad = this.getValue('历史歧路', [])
let html = crossroad.length > 0 ? crossroad.reverse().map(cr=>`
<div class="crossroad-item">
<div class="crossroad-header">
<span class="crossroad-time">${cr.时间}</span>
<span class="crossroad-reason">【${cr.缘起}】</span>
</div>
<div class="crossroad-content">
<div class="crossroad-side crossroad-old">
<span class="crossroad-label">旧貌</span>
${cr.旧貌}
</div>
<div class="crossroad-side crossroad-new">
<span class="crossroad-label">新颜</span>
${cr.新颜}
</div>
</div>
</div>`).join("\n") : '<div class="bg-empty">史册未改，按轨而行</div>'
$('#list-crossroads').html(html)
return this;
}
getPercentageBar(title, percent, value, color) {
return `
<div class="favor-wrapper">
<span style="font-size:0.8em; color:var(--text-secondary);">${title}</span>
<div class="favor-bar-container" style="--percent: ${percent};">
<div class="favor-bar-fill ${color}" style="width: ${percent}%;"></div>
</div>
<span class="favor-text-value ${color}">${value}</span>
</div>`
}
getRelationHtml(npcs, favorNegative = false, isDeleted = false) {
let out = '';
for (const [name, data] of npcs) {
const relStr = data.关系;
const identityStr = data.身份官职;
const icon = isDeleted ? MingDynasty.ICONS.relink_relation : MingDynasty.ICONS.delete_relation;
const btnClass = isDeleted ? 'rel-action-btn restore' : 'rel-action-btn delete';
const title = isDeleted ? '恢复联络' : '断绝往来';
out += `
<div class="rel-card subordinate-card">
<div class="rel-header">
<div class="rel-title-group">
<span class="rel-name">${name}</span>
<button class="${btnClass}" data-name="${name}" title="${title}">${icon}</button>
</div>
<div class="rel-tags">
${identityStr ? `<span class="rel-tag">${identityStr}</span>` : ''}
${relStr ? `<span class="rel-tag">${relStr}</span>` : ''}
</div>
</div>
<div class="rel-attitude" style="min-height:auto;"><div>
${[
data.当前状态 ? MingDynasty.ICONS.status + data.当前状态 : '',
data.对你的看法 ? MingDynasty.ICONS.thought + data.对你的看法 : ''
].filter(d=>d).join('</div><div>')}
</div></div>
`;
if (!isDeleted && data.type === '麾下') {
const loyVal = data.忠诚度 || 0;
const loyPercent = Math.max(0, Math.min(100, loyVal));
out += this.getPercentageBar('忠诚', loyPercent, loyVal, 'positive');
}
const favorVal = data.好感度 || 0;
const favorPercent = favorNegative ? ((Math.max(-100, Math.min(100, favorVal)) + 100) / 2) : Math.max(0, Math.min(100, favorVal));
const colorClass = favorVal >= 0 ? 'positive' : 'negative';
out += this.getPercentageBar('好感', favorPercent, favorVal, colorClass);
out += '</div>';
}
return out;
}
getRelation (rel, type, favorNegative = false)  {
const npcs = Object.entries(rel).filter(([name, data]) => data.type === type).reverse();
if (npcs.length === 0) {
return `<div class="rel-empty" style="grid-column: 1 / -1; text-align: center;">暂无${type}</div>`
}
return this.getRelationHtml(npcs, favorNegative, false);
}
getDeletedRelation(rel) {
const npcs = Object.entries(rel).reverse();
if (npcs.length === 0) {
return `<div class="rel-empty" style="grid-column: 1 / -1; text-align: center;">查无此人，皆有迹可循</div>`;
}
return this.getRelationHtml(npcs, false, true);
}
updateRelation(){
const rel = this.getValue('人际网络', {})
const deletedRel = this.getValue('已删除角色', {})
$('#list-subordinates').html(this.getRelation(rel, '麾下'))
$('#list-family').html(this.getRelation(rel, '亲属'))
$('#list-lovers').html(this.getRelation(rel, '红颜'))
$('#list-acquaintances').html(this.getRelation(rel, '朝野', true))
$('#list-deleted').html(this.getDeletedRelation(deletedRel))
const self = this;
// 绑定断交事件
$('.rel-action-btn.delete').off('click').on('click', function() {
const name = $(this).data('name');
const $card = $(this).closest('.rel-card');
self.showConfirmModal('断交', name, '断交', () => self.removeRelation(name, $card));
});
// 绑定恢复联络事件
$('.rel-action-btn.restore').off('click').on('click', function() {
const name = $(this).data('name');
const $card = $(this).closest('.rel-card');
self.showConfirmModal('恢复与', name + ' 的联络', '重联', () => self.restoreRelation(name, $card));
});
return this;
}
async removeRelation(name, $card) {
try {
const old_data = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
const rels = old_data.stat_data.人际网络 || {};
const delRels = old_data.stat_data.已删除角色 || {};
if (rels[name]) {
delRels[name] = rels[name];
delete rels[name];
old_data.stat_data.人际网络 = rels;
old_data.stat_data.已删除角色 = delRels;
await Mvu.replaceMvuData(old_data, { type: 'message', message_id: 'latest' });
}
} catch (e) {
toastr.error('断绝往来失败: ' + e.message);
return;
}
$card.addClass('fade-out');
setTimeout(() => {
this.updateRelation();
}, 500);
}
async restoreRelation(name, $card) {
try {
const old_data = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
const rels = old_data.stat_data.人际网络 || {};
const delRels = old_data.stat_data.已删除角色 || {};
if (delRels[name]) {
rels[name] = delRels[name];
delete delRels[name];
old_data.stat_data.人际网络 = rels;
old_data.stat_data.已删除角色 = delRels;
await Mvu.replaceMvuData(old_data, { type: 'message', message_id: 'latest' });
}
} catch (e) {
toastr.error('恢复联络失败: ' + e.message);
return;
}
$card.addClass('fade-out');
setTimeout(() => {
this.updateRelation();
}, 500);
}
updateHousehold(){
const consorts = Object.entries(this.getValue('人际网络', {})).filter(([name, data]) => data.type === '内眷').reverse();
let consortHtml = ''
if (consorts.length > 0) {
for (const [name, data] of consorts) {
const portraitUrl = MingDynasty.PORTRAITS[name] || 'https://files.catbox.moe/o7pyrr.png'
const favorVal = data.好感度 || 0
const favorPercent = Math.max(0, Math.min(100, favorVal))
const colorClass = favorVal >= 0 ? 'positive' : 'negative'
consortHtml += `
<div class="consort-card">
<div class="card-face card-front">
<div class="consort-header">
<span class="consort-name">${name}</span>
<span class="consort-title">${data.关系 || '女眷'}</span>
</div>
<div class="consort-details">
近况：<strong>${data.当前状态 || '安居后宅'}</strong><br>
关注：<strong>${data.对你的看法 || '无'}</strong>
</div>
<div class="favor-wrapper">
<span style="font-size:0.8em; color:var(--text-secondary);">好感</span>
<div class="favor-bar-container" style="--percent: ${favorPercent};">
<div class="favor-bar-fill ${colorClass}" style="width: ${favorPercent}%;"></div>
</div>
<span class="favor-text-value ${colorClass}">${favorVal}</span>
</div>
</div>
<div class="card-face card-back" style="background-image: url('${portraitUrl}');"></div>
</div>`
}
} else {
consortHtml = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 0;"><span class="info-value">暂无女眷入住</span></div>'
}
$('#list-household').html(consortHtml)
$('.consort-card').off('click').on('click', function () { $(this).toggleClass('is-flipped') })
return this;
}
updatePlots(){
const plot_name_map = {
is_Adult: "冠礼大典",
is_Fighting_Case_Resolved: "打驸马案",
is_Married: "大婚仪轨",
is_Jin_Retreated: "后金退兵",
is_Yuan_Dead: "袁督亡故",
is_Brother_Forgiven: "兄弟释怀",
is_Sister_Forgiven: "姐妹重拾",
is_Gumei_As_Gift: "清音之礼",
is_Inheritance_Fight_Resolved: "家产纷争",
is_LinDan_Dead: "林丹汗故",
is_Jin_Civil_War: "后金内乱",
is_HuangTaiji_Dead: "皇太极故",
}
const plots = this.getValue('剧情要点', {});
// 过滤掉未触发的剧情 (值为 false 的情况)
const validPlots = Object.entries(plots).filter(([key, val]) => val !== false);
let html = '';
if (validPlots.length > 0) {
// 反转数组使最新的剧情在最前面显示
html = validPlots.reverse().map(([title, data]) => {
const isCompleted = data.状态 === '已完成';
const statusClass = isCompleted ? 'completed' : 'triggered';
// 渲染进程列表
const processHtml = (data.进程 || []).map(p => `<div class="plot-process-item">${p}</div>`).join('');
// 渲染元数据（状态与时间）
let metaHtml = `<div class="plot-tag ${statusClass}">${data.状态 === '已完成' ? '事毕' : '事起'}</div>`;
let timeHtml = []
if (data.触发时间) timeHtml.push(`起: ${data.触发时间}`);
if (isCompleted && data.完成时间) timeHtml.push(`结: ${data.完成时间}`);
metaHtml += `<div>${timeHtml.join(' | ')}</div>`;
// 渲染结果
const resultHtml = (isCompleted && data.结果) ? `<div class="plot-result">【结局】 ${data.结果}</div>` : '';
return `
<div class="plot-item ${statusClass}">
<div class="plot-header">
<div class="plot-title">${plot_name_map[title] || title}</div>
<div class="plot-meta">${metaHtml}</div>
</div>
<div class="plot-content">
${processHtml}
${resultHtml}
</div>
</div>`;
}).join('\n');
} else {
html = '<div class="bg-empty">风平浪静，暂无事端</div>';
}
$('#list-plots').html(html);
return this;
}
// 获取 mvu 变量值
getValue(path, defaultValue = null) {
return _.get(getAllVariables(), `stat_data.${path}`, defaultValue);
}
//全部绘制
drawAll() {
// 世界信息
this.updateTimeAndLocation()
// 个人属性
.updateIdentity()
.updateTitle()
.updateReputation()
.updateHealth()
// 俸禄与私库
.updateSalary()
.updatePriv()
// 随身重器卡片化
.updateAssets()
// 产业
.updateIndustry()
// 部曲
.updateForce()
// 月度总结
.updateSummary()
// 府库所存
.updatePubStorage()
// 天下暗流
.updateEvents()
// 历史歧路
.updateCrossroad()
// 剧情要点
.updatePlots()
// 人际网络
.updateRelation()
// 内眷
.updateHousehold()
return this;
}
}
async function init() {
await waitGlobalInitialized('Mvu')
const ui = new MingDynasty();
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
ui.drawAll();
})
$('.faction-header').on('click', function () {
$(this).parent().toggleClass('collapsed')
})
// 一级 Tab 切换逻辑
$('.main-tab-btn').on('click', function() {
$('.main-tab-btn').removeClass('active');
$(this).addClass('active');
const target = $(this).data('target');
$('.tab-pane').removeClass('active');
$('#' + target).addClass('active');
// 如果切换到了地图界面，重新计算并渲染 Echarts 大小，防止隐式渲染导致的尺寸错误
if (target === 'tab-map' && ui.map) {
setTimeout(() => ui.map.resize(), 10);
}
});
// 人脉网络二级 Tab 切换逻辑
$('.sub-tab-btn').on('click', function() {
$('.sub-tab-btn').removeClass('active');
$(this).addClass('active');
const target = $(this).data('target');
$('.sub-tab-pane').removeClass('active');
$('#' + target).addClass('active');
});
}
$(errorCatched(init));