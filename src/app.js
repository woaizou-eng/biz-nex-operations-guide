let DATA=JSON.parse(document.getElementById('meetingData').textContent);
let current=null,shotIndex=0,focus=true,mode='overview';
const $=id=>document.getElementById(id);
function bindMap(){document.querySelectorAll('[data-node]').forEach(el=>{el.onclick=()=>showNode(el.dataset.node);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showNode(el.dataset.node)}}});}
function head(){ $('pageTitle').textContent=DATA.title;$('pageSubtitle').textContent=DATA.subtitle;document.querySelector('.top').classList.toggle('compact',mode!=='overview');}
function showOverview(){mode='overview';current=null;$('overview').hidden=false;$('detailWrap').hidden=true;$('overviewBtn').classList.add('primary');$('map').innerHTML=mapSVG(DATA.nodes)+`<div class="compact-map">${[['BIZ',['b1','b2','b3','b4','b5']],['Nex',['n1','n2','n3','n4','n5']]].map(([p,ids])=>`<div class="compact-column"><h2>${p}</h2>${ids.map((id,i)=>`${i?'<div class="down">↓</div>':''}${id==='n2'?'<button class="resource-note" data-node="r1">创建前准备：复用 / 新建算子</button>':''}<button data-node="${id}"><b>${esc(DATA.nodes[id].title)}</b><span>${esc(marks.find(m=>m.id===id)?.sub||'')}</span></button>`).join('')}${p==='Nex'?'<div class="down">↑</div><button data-node="a1">配置不变：追加数据批次</button>':''}</div>`).join('')}</div>`;head();bindMap();window.scrollTo(0,0);}
function mini(){let out='';for(const [name,ids]of[['BIZ',['b1','b2','b3','b4','b5']],['Nex',['n1','r1','n2','n3','n4','n5','a1']]]){out+=`<div class="mini-lane ${name==='Nex'?'nex':''}"><strong>${name}</strong>${ids.map((id,i)=>`${i?`<span>${id==='r1'?'+':id==='a1'?'↻':'→'}</span>`:''}<button data-node="${id}" class="${current===id?'active':''}">${esc(DATA.nodes[id].short)}</button>`).join('')}</div>`} $('mini').innerHTML=out;bindMap();}
function showNode(id){if(!DATA.nodes[id])return;mode='detail';current=id;shotIndex=0;focus=true;$('overview').hidden=true;$('detailWrap').hidden=false;$('overviewBtn').classList.remove('primary');head();renderNode();window.scrollTo(0,0);}
function renderNode(){let n=DATA.nodes[current];mini();$('stepIndex').textContent=n.platform+' · '+(DATA.order.indexOf(current)+1)+' / '+DATA.order.length;$('detailTitle').textContent=n.title;$('lead').textContent=n.lead;$('path').textContent=n.path;$('groups').innerHTML=n.groups.map((g,i)=>`<div class="group"><span class="num">${i+1}</span><div><h3>${esc(g[0])}</h3><p>${esc(g[1])}</p></div></div>`).join('');$('note').textContent=n.note;$('prevStep').disabled=DATA.order.indexOf(current)===0;$('nextStep').textContent=current===DATA.order.at(-1)?'回到全链路总览 ↗':'下一步 →';renderShot();}
function renderShot(){let n=DATA.nodes[current],s=n.shots[shotIndex];document.querySelector('.shotcontrols').hidden=!s;document.querySelector('.pager').hidden=n.shots.length<2;$('focusBtn').classList.toggle('active',focus);$('fullBtn').classList.toggle('active',!focus);if(!s){$('shotTitle').textContent='日常追加回路';$('shotFrame').innerHTML=`<div class="empty"><b>新增批次 → 沿用配置 → 继续作业</b><span>${esc(n.empty||'暂无实际截图')}</span></div>`;$('shotCaption').textContent='创建路径已核验；实际截图待补。';return;}
 let im=DATA.images[s.n];let f=focus?s.focus:[0,0,1,1];let vb=[f[0]*im.w,f[1]*im.h,f[2]*im.w,f[3]*im.h];$('shotTitle').textContent=s.label;$('shotFrame').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" aria-label="${esc(s.label)}"><image x="0" y="0" width="${im.w}" height="${im.h}" href="${im.src}"/></svg>`;$('shotFrame').onclick=openImage;$('shotCaption').textContent=`图 ${String(s.n).padStart(2,'0')} · ${focus?'当前为操作区域放大，原图保持完整':'当前显示完整页面'} · 点击图片可进一步放大`;$('shotCount').textContent=`${shotIndex+1} / ${n.shots.length}`;$('prevShot').disabled=shotIndex===0;$('nextShot').disabled=shotIndex===n.shots.length-1;}
function openImage(){let s=DATA.nodes[current]?.shots[shotIndex];if(!s)return;$('zoomImage').src=DATA.images[s.n].src;$('imageLabel').textContent=s.label;$('imageScroll').classList.remove('actual');$('fitImage').classList.add('active');$('actualImage').classList.remove('active');$('imageDialog').showModal();}
function changeStep(d){let i=current?DATA.order.indexOf(current):-1;if(i+d>=DATA.order.length){showOverview();return}showNode(DATA.order[Math.max(0,i+d)]);}
const field=(key,label,value,rows)=>`<label>${label}${rows?`<textarea name="${key}" rows="${rows}">${esc(value)}</textarea>`:`<input name="${key}" value="${esc(value)}">`}</label>`;
function openEdit(){if(current){let n=DATA.nodes[current];$('editHeading').textContent='编辑：'+n.title;$('editFields').innerHTML=field('title','详细标题',n.title)+`<div class="edit-pair">${field('short','路径导航名称',n.short)}${field('mapTitle','总览节点标题',n.mapTitle||marks.find(m=>m.id===current)?.title||n.short)}</div>`+field('mapSub','总览节点副标题',n.mapSub||marks.find(m=>m.id===current)?.sub||'')+field('lead','这一步要做什么',n.lead,2)+field('path','操作入口',n.path)+field('groups','配置层级（每行：组名 | 说明）',n.groups.map(g=>g.join(' | ')).join('\n'),6)+field('note','补充说明',n.note,3)+(n.shots.length?'<label>替换当前截图<input name="replaceImage" type="file" accept="image/*"></label>':'');}else{$('editHeading').textContent='编辑总览标题';$('editFields').innerHTML=field('title','总览标题',DATA.title)+field('subtitle','副标题',DATA.subtitle);}$('editDialog').showModal();}
$('editForm').onsubmit=async e=>{e.preventDefault();let fd=new FormData(e.target);if(current){let n=DATA.nodes[current];for(let k of['title','short','mapTitle','mapSub','lead','path','note'])n[k]=String(fd.get(k)||'');n.groups=String(fd.get('groups')).split('\n').filter(Boolean).map(l=>{let i=l.indexOf('|');return i<0?[l,'']:[l.slice(0,i).trim(),l.slice(i+1).trim()]});let f=fd.get('replaceImage');if(f&&f.size){let src=await new Promise((res,rej)=>{let r=new FileReader;r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});let im=new Image;await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src=src});let s=n.shots[shotIndex];DATA.images[s.n]={src,w:im.naturalWidth,h:im.naturalHeight};s.focus=[0,0,1,1];}renderNode();}else{DATA.title=String(fd.get('title'));DATA.subtitle=String(fd.get('subtitle'));head();} $('editDialog').close();};
let savingCopy=false;
function saveMessage(message,error=false){let status=$('saveStatus');status.hidden=false;status.textContent=message;status.classList.toggle('error',error);}
function imageAsDataURL(blob){return new Promise((resolve,reject)=>{let reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('图片打包失败'));reader.readAsDataURL(blob);});}
async function offlineSnapshot(){
 let snapshot=JSON.parse(JSON.stringify(DATA)),entries=Object.entries(snapshot.images),done=0;
 saveMessage(`正在打包原图 ${done} / ${entries.length}，请稍候…`);
 for(let [id,im] of entries){
  if(!im.src.startsWith('data:')){
   let controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
   try{
    let response=await fetch(new URL(im.src,document.baseURI),{cache:'force-cache',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    let blob=await response.blob();
    if(!blob.size||!blob.type.startsWith('image/'))throw new Error('服务器未返回有效图片');
    im.src=await imageAsDataURL(blob);
   }catch(error){throw new Error(`图 ${String(id).padStart(2,'0')} 无法读取（${error.name==='AbortError'?'读取超时':error.message}）`);}
   finally{clearTimeout(timer);}
  }
  done++;saveMessage(`正在打包原图 ${done} / ${entries.length}，请稍候…`);
 }
 return snapshot;
}
$('saveBtn').onclick=async()=>{
 if(savingCopy)return;
 savingCopy=true;let button=$('saveBtn');button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='正在打包…';
 try{
  let snapshot=await offlineSnapshot(),clone=document.documentElement.cloneNode(true);
  clone.querySelector('#meetingData').textContent=JSON.stringify(snapshot).replace(/<\//g,'<\\/');
  clone.querySelectorAll('dialog').forEach(dialog=>dialog.removeAttribute('open'));
  clone.querySelector('#shotFrame').replaceChildren();
  clone.querySelector('#zoomImage').removeAttribute('src');
  clone.querySelector('#editFields').replaceChildren();
  clone.querySelector('#detailWrap').hidden=true;clone.querySelector('#overview').hidden=false;
  let cloneButton=clone.querySelector('#saveBtn');cloneButton.disabled=false;cloneButton.removeAttribute('aria-busy');cloneButton.textContent='保存修改副本';
  let cloneStatus=clone.querySelector('#saveStatus');cloneStatus.hidden=true;cloneStatus.textContent='';cloneStatus.classList.remove('error');
  // The downloaded copy is self-contained; the separate online static viewer is not embedded.
  clone.querySelectorAll('a[href="static.html"]').forEach(link=>link.remove());
  let blob=new Blob(['<!doctype html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='BIZ-Nex全链路讲解图-修改版.html';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  saveMessage('修改副本已准备下载，包含全部截图，可离线继续使用。');
 }catch(error){saveMessage(`打包失败：${error.message}。请检查网络后重试，当前修改仍保留在页面中。`,true);}
 finally{savingCopy=false;button.disabled=false;button.removeAttribute('aria-busy');button.textContent='保存修改副本';}
};

$('overviewBtn').onclick=showOverview;$('editBtn').onclick=openEdit;$('closeEdit').onclick=()=>$('editDialog').close();$('focusBtn').onclick=()=>{focus=true;renderShot()};$('fullBtn').onclick=()=>{focus=false;renderShot()};$('zoomBtn').onclick=openImage;$('closeImage').onclick=()=>$('imageDialog').close();$('fitImage').onclick=()=>{$('imageScroll').classList.remove('actual');$('fitImage').classList.add('active');$('actualImage').classList.remove('active')};$('actualImage').onclick=()=>{$('imageScroll').classList.add('actual');$('fitImage').classList.remove('active');$('actualImage').classList.add('active')};$('prevShot').onclick=()=>{shotIndex--;renderShot()};$('nextShot').onclick=()=>{shotIndex++;renderShot()};$('prevStep').onclick=()=>changeStep(-1);$('nextStep').onclick=()=>changeStep(1);
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||['INPUT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();changeStep(1)}if(e.key==='ArrowLeft'&&current){e.preventDefault();changeStep(-1)}if(e.key==='Escape')showOverview();});showOverview();
