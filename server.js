import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./public/',import.meta.url));
export const server=http.createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/api/health'){
  res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({status:'ok',mode:'demo'}));
 }
 if(path==='/api/integrations'){
  const integrations=await Promise.all([
   ['hubspot',process.env.HUBSPOT_ACCESS_TOKEN,'https://api.hubapi.com/crm/v3/objects/contacts?limit=1',t=>({Authorization:`Bearer ${t}`})],
   ['lemlist',process.env.LEMLIST_API_KEY,'https://api.lemlist.com/api/campaigns',t=>({Authorization:`Basic ${Buffer.from(':'+t).toString('base64')}`})]
  ].map(async([id,token,url,headers])=>{
   if(!token)return {id,status:'not_configured'};
   try{const r=await fetch(url,{headers:headers(token),signal:AbortSignal.timeout(10000)});if(!r.ok)return {id,status:'error',message:`Provider returned ${r.status}`};const data=await r.json();return {id,status:'connected',...(id==='hubspot'?{total:data.total??null}:{campaigns:Array.isArray(data)?data.map(c=>({id:c._id,name:c.name})):[]})};}catch{return {id,status:'error',message:'Provider could not be reached'};}
  }));
  res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({integrations,mode:'demo',message:'Connection checks only. Dashboard metrics remain demo data until provider metric mappings are configured.'}));
 }
 if(path.startsWith('/api/')){res.writeHead(404);return res.end('Unknown endpoint');}
 const file=path==='/'?'index.html':path.slice(1);
 if(!['index.html','style.css','app.js'].includes(file)){res.writeHead(404);return res.end('Not found');}
 try{const body=await readFile(root+file);res.writeHead(200,{'Content-Type':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html'});res.end(body);}catch{res.writeHead(500);res.end('Unable to load application');}
});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log(`Relay listening on port ${process.env.PORT||3000}`));
