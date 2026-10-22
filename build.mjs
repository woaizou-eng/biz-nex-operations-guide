import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url));
const site=path.resolve(process.argv[2]||here);
const {data:sourceData}=await import(pathToFileURL(path.join(site,'src/content.mjs')).href);
const data=JSON.parse(JSON.stringify(sourceData));
data.images={};
const images=[];
for(let i=1;i<=16;i++){
 const name=String(i).padStart(2,'0')+'.png',bytes=await fs.readFile(path.join(site,'assets',name));
 if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error(name+' is not a PNG');
 data.images[i]={src:'assets/'+name,w:bytes.readUInt32BE(16),h:bytes.readUInt32BE(20)};
 images.push({file:'assets/'+name,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
const [shell,mapSource,appSource]=await Promise.all(['shell.html','map.mjs','app.js'].map(name=>fs.readFile(path.join(site,'src',name),'utf8')));
const html=shell.replace('__DATA__',()=>JSON.stringify(data).replace(/<\//g,'<\\/')).replace('__MAP_CODE__',()=>mapSource.replace(/export /g,'')).replace('__APP_CODE__',()=>appSource);
if(/__DATA__|__MAP_CODE__|__APP_CODE__/.test(html))throw new Error('Unresolved build placeholder');
if(/data:image\/[^;]+;base64,/.test(html))throw new Error('Initial page unexpectedly embeds an image');
await fs.writeFile(path.join(site,'index.html'),html);
console.log(JSON.stringify({htmlBytes:Buffer.byteLength(html),imagesBytes:images.reduce((sum,image)=>sum+image.bytes,0),nodes:Object.keys(data.nodes).length,screenshots:images.length,images},null,2));
