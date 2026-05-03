import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';
const htmlFiles = [];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory()) walk(p); else if(e.name.endsWith('.html')) htmlFiles.push(p);}}
walk(pagesDir);

const titleMap=new Map(), descMap=new Map(), h1Map=new Map();
const issues=[];
for(const file of htmlFiles){
 const t=fs.readFileSync(file,'utf8');
 const title=(t.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]?.trim()||'';
 const desc=(t.match(/<meta\s+name="description"\s+content="([\s\S]*?)">/i)||[])[1]?.trim()||'';
 const h1=(t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]?.replace(/<[^>]+>/g,'').trim()||'';
 const words=t.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
 if(words<120) issues.push({type:'thin_content',file,words});
 for (const [map,val,type] of [[titleMap,title,'title'],[descMap,desc,'description'],[h1Map,h1,'h1']]){
  if(!val) continue; if(!map.has(val)) map.set(val,[]); map.get(val).push(file);
 }
 for(const m of t.matchAll(/<img[^>]+src="([^"]+)"/g)){
   const ref=m[1];
   if(/^https?:|^data:|^\/\//.test(ref)) continue;
   const rel=ref.split(' ')[0];
   const full=path.resolve(path.dirname(file),rel);
   const projectRootAlias = rel.startsWith('assets/') ? path.resolve('src', rel) : null;
   if(!fs.existsSync(full) && !(projectRootAlias && fs.existsSync(projectRootAlias))) issues.push({type:'missing_local_image',file,ref:rel});
 }
}

const dup=(map,type)=>{for(const [k,v] of map){if(v.length>8) issues.push({type:`duplicate_${type}`,count:v.length,sample:k.slice(0,80),files:v.slice(0,5)});}};
dup(titleMap,'title');dup(descMap,'description');dup(h1Map,'h1');

console.log(JSON.stringify({pages:htmlFiles.length,issues},null,2));
