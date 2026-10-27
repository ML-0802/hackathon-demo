import {test,after,before} from 'node:test';
import assert from 'node:assert/strict';
import {server} from './server.js';
let base;
before(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(r=>server.close(r)));
test('serves dashboard and its assets',async()=>{for(const path of ['/','/app.js','/style.css']){const r=await fetch(base+path);assert.equal(r.status,200);assert.ok((await r.text()).length>100);} });
test('does not expose arbitrary files',async()=>{assert.equal((await fetch(base+'/server.js')).status,404);assert.equal((await fetch(base+'/api/unknown')).status,404);});
test('integration endpoint clearly preserves demo mode and hides credentials',async()=>{const r=await fetch(base+'/api/integrations');const data=await r.json();assert.equal(data.mode,'demo');assert.equal(data.integrations.length,2);for(const item of data.integrations){assert.ok(['not_configured','connected','error'].includes(item.status));assert.equal(item.token,undefined);}});

test('health endpoint reports service readiness without provider access',async()=>{const r=await fetch(base+'/api/health');assert.equal(r.status,200);assert.deepEqual(await r.json(),{status:'ok',mode:'demo'});});
