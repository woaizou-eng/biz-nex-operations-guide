export const C={navy:'#1e3a5f',blue:'#1e40af',bl:'#dbeafe',green:'#047857',gl:'#a7f3d0',purple:'#6d28d9',pl:'#ddd6fe',muted:'#64748b',text:'#374151',white:'#ffffff'};
export const marks=[];
const add=(type,p)=>marks.push({type,...p});
const text=(x,y,s,size=24,color=C.text,bold=false)=>add('text',{x,y,s,size,color,bold});
const rect=(x,y,w,h,fill,stroke='none',r=16)=>add('rect',{x,y,w,h,fill,stroke,r});
const path=(points,color=C.navy,dash=false,arrow=false)=>add('path',{points,color,dash,arrow});
const node=(id,x,y,w,title,sub,color)=>{add('node',{id,x,y,w,h:100,title,sub,color});};

// BIZ: the flow is the scope within which individual tasks are configured.
text(22,175,'BIZ',42,C.blue,true);text(22,210,'熟悉的操作',18,C.muted);
rect(372,78,838,238,C.white,C.blue,20);
text(402,115,'审核流程',24,C.blue,true);text(552,115,'在流程内，分别建设机审、人审任务',20,C.muted);
node('b1',175,160,170,'准备数据','接入 · 来源',C.blue);
node('b2',402,160,200,'新建审核流程','对象 · 模板 · 节点',C.blue);
node('b3',653,160,222,'建设机审任务','分配 → 规则 → 模板',C.blue);
node('b4',925,160,255,'建设人审任务','分配 → 选模板 → 配置',C.blue);
node('b5',1285,160,285,'运行与后链路','审核 → 质检 → 纠错',C.blue);
for(const[a,b]of[[345,402],[602,653],[875,925],[1180,1285]])path([[a+5,210],[b-10,210]],C.blue,false,true);
text(1305,292,'驾驶舱查看流转与质量',20,C.muted);
text(402,292,'新流程创建后，再关联数据集',18,C.muted);

// Nex: data and operators are parallel prerequisites, before task creation.
text(22,535,'Nex',42,C.green,true);text(22,570,'新的操作',18,C.muted);
rect(372,420,838,230,C.white,C.green,20);
text(402,457,'同一次「创建完整任务」',24,C.green,true);
rect(155,368,210,312,C.white,'#ddd6fe',16);
text(175,404,'创建前准备',22,C.navy,true);
node('n1',175,430,170,'接入数据集','字段 · 检索',C.green);
node('r1',175,555,170,'算子准备','复用 / 新建',C.purple);
node('n2',402,505,200,'信息与数据','数据 · 分组 · 模板',C.green);
node('n3',653,505,222,'模板搭建','展示字段 · 操作题',C.green);
node('n4',925,505,255,'任务流程','机审 + 标注 + 质检',C.green);
node('n5',1285,505,285,'作业与质量闭环','审核 → 质检 → 纠错',C.green);
for(const[a,b]of[[602,653],[875,925],[1180,1285]])path([[a+5,555],[b-10,555]],C.green,false,true);
path([[347,480],[365,480],[365,555],[392,555]],C.green,false,true);
path([[347,605],[365,605],[365,555]],C.purple,true,false);
text(1305,637,'查看状态、导出作业结果',20,C.muted);
add('append',{id:'a1',x:402,y:693,w:778,h:54,title:'创建后追加数据：沿用配置 → 继续作业',color:C.green});
path([[1181,720],[1428,720],[1428,657]],C.green,false,true);

export const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function mapSVG(nodes={},selected='',showGuide=false,animateGuide=false){
 let bits=marks.map(e=>{
  if(e.type==='text')return `<text x="${e.x}" y="${e.y}" font-size="${e.size}" font-weight="${e.bold?650:400}" fill="${e.color}">${esc(e.s)}</text>`;
  if(e.type==='rect')return `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="${e.r}" fill="${e.fill}" stroke="${e.stroke}" stroke-width="1.6"/>`;
  if(e.type==='path'){let pts=e.points,ab=pts.at(-2),b=pts.at(-1),ang=Math.atan2(b[1]-ab[1],b[0]-ab[0]),l=12;return `<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${e.color}" stroke-width="2.5" ${e.dash?'stroke-dasharray="7 6"':''}/>`+(e.arrow?`<path d="M${b[0]-l*Math.cos(ang-.45)},${b[1]-l*Math.sin(ang-.45)} L${b.join(',')} L${b[0]-l*Math.cos(ang+.45)},${b[1]-l*Math.sin(ang+.45)}" fill="none" stroke="${e.color}" stroke-width="2.5"/>`:'');}
  if(e.type==='node')return `<g class="map-node ${selected===e.id?'selected':''}" role="button" tabindex="0" data-node="${e.id}" aria-label="${esc(nodes[e.id]?.title||e.title)}"><title>点击查看操作说明与完整截图</title><rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="12" fill="${selected===e.id?e.color:C.white}" stroke="${e.color}" stroke-width="2.4"/><text x="${e.x+16}" y="${e.y+38}" font-size="25" font-weight="650" fill="${selected===e.id?C.white:C.navy}">${esc(nodes[e.id]?.mapTitle||e.title)}</text><text x="${e.x+16}" y="${e.y+74}" font-size="19" fill="${selected===e.id?C.white:C.muted}">${esc(nodes[e.id]?.mapSub||e.sub)}</text></g>`;
  return `<g class="map-node" role="button" tabindex="0" data-node="${e.id}" aria-label="${esc(nodes[e.id]?.title||e.title)}"><title>点击查看操作说明与完整截图</title><rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="10" fill="${C.white}" stroke="${e.color}" stroke-width="1.8" ${e.type==='resource'?'stroke-dasharray="6 4"':''}/><text x="${e.x+18}" y="${e.y+e.h/2+8}" font-size="${e.type==='resource'?21:24}" font-weight="550" fill="${e.color}">${esc(e.title)}</text></g>`;
 }).join('');
 const guide=showGuide?`<g class="click-guide ${animateGuide?'guide-motion':''}" role="button" tabindex="0" data-node="b1" aria-label="点任一步，看操作与截图；从第一步开始"><rect x="175" y="12" width="408" height="54" rx="14" fill="#fff1f2" stroke="#fecdd3" stroke-width="2"/><text x="195" y="47" font-size="27" font-weight="600" fill="#b42332">点任一步，看操作与截图</text><path d="M260 73 V145 M251 134 L260 145 L269 134" fill="none" stroke="#b42332" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 775" width="1600" height="775" role="img" aria-label="BIZ 与 Nex 完整操作路径" font-family="Heiti SC,PingFang SC,Arial,sans-serif">${bits}${guide}</svg>`;
}
